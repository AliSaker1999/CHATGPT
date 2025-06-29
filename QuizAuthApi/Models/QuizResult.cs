using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizAuthApi.Models
{
    public class QuizResult
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string AppUserId { get; set; }

        [ForeignKey("AppUserId")]
        public AppUser AppUser { get; set; }

        [Required]
        public int Score { get; set; }

        [Required]
        public DateTime SubmittedAt { get; set; }
    }
}
