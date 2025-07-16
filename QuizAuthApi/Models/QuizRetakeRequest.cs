using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizAuthApi.Models
{
    public class QuizRetakeRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string AppUserId { get; set; }

        [ForeignKey("AppUserId")]
        public AppUser AppUser { get; set; }

        [Required]
        public string Message { get; set; } // User's reason/request

        [Required]
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

        public bool? IsApproved { get; set; } // null=pending, true=approved, false=denied

        public DateTime? DecisionAt { get; set; } // When admin took action
    }
}
