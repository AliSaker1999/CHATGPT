using System.ComponentModel.DataAnnotations;

namespace QuizAuthApi.Dtos
{
    public class RegisterDto
    {
        [EmailAddress]
        [Required]
        public string Email { get; set; }
        [Required]

        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
