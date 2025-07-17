namespace QuizAuthApi.Dtos
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public bool isTaken { get; set; } = false;
        public string FullName { get; set; }
        public string EducationLevel { get; set; }
        public int YearsOfExperience { get; set; }
        public string Specialty { get; set; }
        public string CurrentRole { get; set; }
        public int Age { get; set; }
        public string Country { get; set; }
        public string PreferredLanguage { get; set; }
        public string TechnologiesKnown { get; set; }
        public string Certifications { get; set; }
        public string LearningGoals { get; set; }
    }
}
