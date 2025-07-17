using Microsoft.AspNetCore.Authorization;
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
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                EducationLevel = registerDto.EducationLevel,
                YearsOfExperience = registerDto.YearsOfExperience,
                Specialty = registerDto.Specialty,
                CurrentRole = registerDto.CurrentRole,
                Age = registerDto.Age,
                Country = registerDto.Country,
                PreferredLanguage = registerDto.PreferredLanguage,
                TechnologiesKnown = registerDto.TechnologiesKnown,
                Certifications = registerDto.Certifications,
                LearningGoals = registerDto.LearningGoals
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "User");

            return new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Role = "User",
                Token = await _tokenService.CreateToken(user),
                FullName = user.FullName,
                EducationLevel = user.EducationLevel,
                YearsOfExperience = user.YearsOfExperience,
                Specialty = user.Specialty,
                CurrentRole = user.CurrentRole,
                Age = user.Age,
                Country = user.Country,
                PreferredLanguage = user.PreferredLanguage,
                TechnologiesKnown = user.TechnologiesKnown,
                Certifications = user.Certifications,
                LearningGoals = user.LearningGoals,
                isTaken = false
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
                isTaken = hasCompletedQuiz,
                FullName = user.FullName,
                EducationLevel = user.EducationLevel,
                YearsOfExperience = user.YearsOfExperience,
                Specialty = user.Specialty,
                CurrentRole = user.CurrentRole,
                Age = user.Age,
                Country = user.Country,
                PreferredLanguage = user.PreferredLanguage,
                TechnologiesKnown = user.TechnologiesKnown,
                Certifications = user.Certifications,
                LearningGoals = user.LearningGoals
            };
        }


        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _userManager.Users
                .Where(u => u.UserName != "admin")
                .ToListAsync();

            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = roles.FirstOrDefault(),
                    FullName = user.FullName,
                    EducationLevel = user.EducationLevel,
                    YearsOfExperience = user.YearsOfExperience,
                    Specialty = user.Specialty,
                    CurrentRole = user.CurrentRole,
                    Age = user.Age,
                    Country = user.Country,
                    PreferredLanguage = user.PreferredLanguage,
                    TechnologiesKnown = user.TechnologiesKnown,
                    Certifications = user.Certifications,
                    LearningGoals = user.LearningGoals
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
        [HttpPut("update-profile")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var username = User.Identity.Name;
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound("User not found");

            // Update fields
            user.FullName = dto.FullName;
            user.EducationLevel = dto.EducationLevel;
            user.YearsOfExperience = dto.YearsOfExperience;
            user.Specialty = dto.Specialty;
            user.CurrentRole = dto.CurrentRole;
            user.Age = dto.Age;
            user.Country = dto.Country;
            user.PreferredLanguage = dto.PreferredLanguage;
            user.TechnologiesKnown = dto.TechnologiesKnown;
            user.Certifications = dto.Certifications;
            user.LearningGoals = dto.LearningGoals;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("Failed to update profile");

            // Return updated profile (no new token needed)
            var roles = await _userManager.GetRolesAsync(user);
            return new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Role = roles.FirstOrDefault(),
                FullName = user.FullName,
                EducationLevel = user.EducationLevel,
                YearsOfExperience = user.YearsOfExperience,
                Specialty = user.Specialty,
                CurrentRole = user.CurrentRole,
                Age = user.Age,
                Country = user.Country,
                PreferredLanguage = user.PreferredLanguage,
                TechnologiesKnown = user.TechnologiesKnown,
                Certifications = user.Certifications,
                LearningGoals = user.LearningGoals
            };
        }

        [HttpGet("profile")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            var username = User.Identity.Name;
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            return new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Role = roles.FirstOrDefault(),
                FullName = user.FullName,
                EducationLevel = user.EducationLevel,
                YearsOfExperience = user.YearsOfExperience,
                Specialty = user.Specialty,
                CurrentRole = user.CurrentRole,
                Age = user.Age,
                Country = user.Country,
                PreferredLanguage = user.PreferredLanguage,
                TechnologiesKnown = user.TechnologiesKnown,
                Certifications = user.Certifications,
                LearningGoals = user.LearningGoals
            };
        }




    }
}