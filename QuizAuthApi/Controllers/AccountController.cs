using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAuthApi.Data;
using QuizAuthApi.Dtos;
using QuizAuthApi.Interfaces;
using QuizAuthApi.Models;

namespace QuizAuthApi.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly ApplicationDbContext _context;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            // Check username uniqueness
            var userExists = await _userManager.FindByNameAsync(registerDto.Username);
            if (userExists != null) return BadRequest("Username already taken");

            // Check email uniqueness
            var emailExists = await _userManager.FindByEmailAsync(registerDto.Email);
            if (emailExists != null) return BadRequest("Email already taken");

            var user = new AppUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "User");

            return new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Role = "User",
                Token = await _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // Use FirstOrDefaultAsync to avoid duplicate error!
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username);
            if (user == null) return Unauthorized("Invalid username");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid password");

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            bool hasCompletedQuiz = await _context.QuizResults.AnyAsync(r => r.AppUserId == user.Id);

            return new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Role = role,
                Token = await _tokenService.CreateToken(user),
                isTaken = hasCompletedQuiz
            };
        }
        [HttpGet("all")]

        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto
                {
                    
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = roles.FirstOrDefault(), // or String.Join(",", roles) for multi-role support
                    // Optionally, you could include Id or other fields
                });
            }
            return Ok(userDtos);
        }
        

        [HttpDelete("delete/{username}")]
        public async Task<IActionResult> DeleteUser(string username)
{
    var user = await _userManager.FindByNameAsync(username);
    if (user == null) return NotFound("User not found");

    var result = await _userManager.DeleteAsync(user);
    if (!result.Succeeded)
        return BadRequest("Failed to delete user");

    return Ok("User deleted successfully");
}



    }
}