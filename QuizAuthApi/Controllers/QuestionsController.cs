using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAuthApi.Data;
using QuizAuthApi.Dtos.Question;
using QuizAuthApi.Models;
using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;

namespace QuizAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        // --- Simple per-user rate limit in-memory ---
        private static Dictionary<string, DateTime> _lastRequest = new();

        public QuestionsController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddQuestion(AddQuestionDto dto)
        {
            var question = new Question
            {
                QuestionText = dto.QuestionText,
                OptionA = dto.OptionA,
                OptionB = dto.OptionB,
                OptionC = dto.OptionC,
                OptionD = dto.OptionD,
                CorrectAnswer = dto.CorrectAnswer
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("random/10")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<List<QuestionDto>>> GetRandomTen()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var questions = await _context.Questions
                .OrderBy(q => Guid.NewGuid())
                .Take(10)
                .Select(q => new QuestionDto
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    OptionA = q.OptionA,
                    OptionB = q.OptionB,
                    OptionC = q.OptionC,
                    OptionD = q.OptionD,
                    CorrectAnswer = q.CorrectAnswer
                })
                .ToListAsync();

            return questions;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<QuestionDto>>> GetAll()
        {
            return await _context.Questions
                .Select(q => new QuestionDto
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    OptionA = q.OptionA,
                    OptionB = q.OptionB,
                    OptionC = q.OptionC,
                    OptionD = q.OptionD,
                    CorrectAnswer = q.CorrectAnswer
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<QuestionDto>> GetById(int id)
        {
            var q = await _context.Questions.FindAsync(id);
            if (q == null) return NotFound();

            return new QuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                OptionA = q.OptionA,
                OptionB = q.OptionB,
                OptionC = q.OptionC,
                OptionD = q.OptionD,
                CorrectAnswer = q.CorrectAnswer
            };
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var q = await _context.Questions.FindAsync(id);
            if (q == null) return NotFound();

            _context.Questions.Remove(q);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("ai-questions")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<List<QuestionDto>>> GetAIQuestions()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // --- Simple rate limit: 1 request every 30 seconds per user ---
            if (_lastRequest.TryGetValue(userId, out var lastTime))
            {
                if ((DateTime.UtcNow - lastTime).TotalSeconds < 30)
                    return StatusCode(429, "Please wait 30 seconds before requesting AI questions again.");
            }
            _lastRequest[userId] = DateTime.UtcNow;

            // 1. Get user info
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return Unauthorized("User not found");

            // 2. Get all questions in DB
            var allQuestions = await _context.Questions.ToListAsync();

            // 3. Prepare prompt for Groq
            var prompt = $@"
You are an expert quiz generator. Based on the user profile below, choose the most suitable 15 questions from the provided pool. Return your answer as a JSON array of objects (each object has: Id, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectAnswer).
User Profile:
FullName: {user.FullName}
EducationLevel: {user.EducationLevel}
YearsOfExperience: {user.YearsOfExperience}
Specialty: {user.Specialty}
CurrentRole: {user.CurrentRole}
Age: {user.Age}
Country: {user.Country}
PreferredLanguage: {user.PreferredLanguage}
TechnologiesKnown: {user.TechnologiesKnown}
Certifications: {user.Certifications}
LearningGoals: {user.LearningGoals}

Questions Pool:
{JsonSerializer.Serialize(allQuestions)}

Pick the best 20 for this user and return them as JSON array as described.";

            // 4. Call Groq API
            var apiKey = _config["Groq:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return StatusCode(500, "Groq API key not configured.");

            var requestBody = new
            {
                model = "llama3-70b-8192", // or your chosen Groq model
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                max_tokens = 4096, // allow long JSON output
                temperature = 0.4
            };

            using var http = new HttpClient();
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            var response = await http.PostAsync(
                "https://api.groq.com/openai/v1/chat/completions",
                new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
            );
            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Failed to call Groq API");

            var respJson = await response.Content.ReadAsStringAsync();

            // 5. Extract model's reply
            using var doc = JsonDocument.Parse(respJson);
            var answer = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            // --- Log Groq response for debugging (remove in production) ---
            System.IO.File.WriteAllText("groq_raw_output.txt", answer ?? "");
            System.IO.File.WriteAllText("groq_api_response.json", respJson);

            // 6. Parse answer as List<QuestionDto>
            try
            {
                var cleaned = CleanJsonFromModel(answer ?? "[]");
                var quiz = JsonSerializer.Deserialize<List<QuestionDto>>(cleaned, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                if (quiz == null || quiz.Count == 0)
                    return StatusCode(502, "Groq did not return any questions.");

                return Ok(quiz);
            }
            catch (Exception ex)
            {
                // --- Log error for debugging ---
                System.IO.File.WriteAllText("groq_parse_error.txt", ex.ToString());
                return StatusCode(502, "Could not parse Groq response. Check 'groq_raw_output.txt' for details.");
            }
        }

        // --- Clean markdown code block from Groq output, robust version ---
        private static string CleanJsonFromModel(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return "[]";
            input = input.Trim();

            // Try to extract the first JSON array from anywhere in the string!
            int start = input.IndexOf('[');
            int end = input.LastIndexOf(']');
            if (start >= 0 && end > start)
                return input.Substring(start, end - start + 1);

            // fallback: remove markdown if present
            if (input.StartsWith("```"))
                return input.Replace("```json", "").Replace("```", "").Trim();

            return input;
        }

    }
}
