using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAuthApi.Data;
using QuizAuthApi.Dtos.Question;
using QuizAuthApi.Models;

namespace QuizAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
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
            // var hasTakenQuiz = await _context.QuizResults.AnyAsync(r => r.AppUserId == userId);

            // if (hasTakenQuiz)
            //     return Forbid("You have already taken the quiz.");

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
                    CorrectAnswer=q.CorrectAnswer
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
                CorrectAnswer=q.CorrectAnswer
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
    }
}
