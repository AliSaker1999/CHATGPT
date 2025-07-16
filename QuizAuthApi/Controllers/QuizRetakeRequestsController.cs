using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAuthApi.Data;
using QuizAuthApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizRetakeRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public QuizRetakeRequestsController(ApplicationDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // User: Submit request to retake quiz
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateRequest([FromBody] CreateQuizRetakeRequestDto dto)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier"))?.Value;
            if (userId == null) return Unauthorized();

            // Check if user already has a pending request
            if (await _context.QuizRetakeRequests.AnyAsync(r => r.AppUserId == userId && r.IsApproved == null))
                return BadRequest("You already have a pending request.");

            var request = new QuizRetakeRequest
            {
                AppUserId = userId,
                Message = dto.Message,
                RequestedAt = DateTime.UtcNow
            };

            _context.QuizRetakeRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Admin: Get all retake requests
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<QuizRetakeRequestDto>>> GetAllRequests()
        {
            var requests = await _context.QuizRetakeRequests
                .Include(r => r.AppUser)
                .OrderByDescending(r => r.RequestedAt)
                .ToListAsync();

            var dtos = requests.Select(r => new QuizRetakeRequestDto
            {
                Id = r.Id,
                UserName = r.AppUser.UserName,
                Email = r.AppUser.Email,
                Message = r.Message,
                RequestedAt = r.RequestedAt,
                IsApproved = r.IsApproved,
                DecisionAt = r.DecisionAt
            }).ToList();

            return Ok(dtos);
        }

        // Admin: Approve a request (delete quiz result)
        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveRequest(int id)
        {
            var request = await _context.QuizRetakeRequests.Include(r => r.AppUser).FirstOrDefaultAsync(r => r.Id == id);
            if (request == null) return NotFound();

            // Find and remove the quiz result
            var quizResult = await _context.QuizResults.FirstOrDefaultAsync(q => q.AppUserId == request.AppUserId);
            if (quizResult != null)
                _context.QuizResults.Remove(quizResult);

            request.IsApproved = true;
            request.DecisionAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // Admin: Deny a request
        [HttpPost("{id}/deny")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DenyRequest(int id)
        {
            var request = await _context.QuizRetakeRequests.FirstOrDefaultAsync(r => r.Id == id);
            if (request == null) return NotFound();

            request.IsApproved = false;
            request.DecisionAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
