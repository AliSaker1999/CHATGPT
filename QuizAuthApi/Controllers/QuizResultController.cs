using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAuthApi.Data;
using QuizAuthApi.Dtos.QuizResult;
using QuizAuthApi.Models;
using System.Security.Claims;

namespace QuizAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizResultController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public QuizResultController(ApplicationDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // POST: api/quizresult
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> SubmitResult(AddQuizResultDto dto)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = new QuizResult
            {
                AppUserId = userId,
                Score = dto.Score,
                SubmittedAt = DateTime.UtcNow
            };

            _context.QuizResults.Add(result);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // GET: api/quizresult/user/{id}
        [HttpGet("user/username/{username}")]
        [Authorize]
        public async Task<ActionResult<List<QuizResultDto>>> GetByUsername(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound("User not found");

            var requesterId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var requester = await _userManager.FindByIdAsync(requesterId);
            var requesterRoles = await _userManager.GetRolesAsync(requester);

            if (user.Id != requesterId && !requesterRoles.Contains("Admin"))
                return Forbid();

            var results = await _context.QuizResults
                .Where(r => r.AppUserId == user.Id)
                .Include(r => r.AppUser)
                .Select(r => new QuizResultDto
                {
                    Id = r.Id,
                    Username = r.AppUser.UserName,
                    Email = r.AppUser.Email, // ✅ Add this line
                    Score = r.Score,
                    SubmittedAt = r.SubmittedAt
                })

                .ToListAsync();

            return results;
        }


        // GET: api/quizresult
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<QuizResultDto>>> GetAll()
        {
            return await _context.QuizResults
                .Include(r => r.AppUser)
                .Select(r => new QuizResultDto
            {
                Id = r.Id,
                Username = r.AppUser.UserName,
                Email = r.AppUser.Email, // ✅ Add this line
                Score = r.Score,
                SubmittedAt = r.SubmittedAt
            })
            .ToListAsync();
        }

        [HttpGet("has-submitted")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> HasSubmitted()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var hasResult = await _context.QuizResults.AnyAsync(r => r.AppUserId == userId);
            return Ok(hasResult);
        }
        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteResult(int id)
        {
            var result = await _context.QuizResults.FindAsync(id);
            if (result == null) return NotFound();

            _context.QuizResults.Remove(result);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
