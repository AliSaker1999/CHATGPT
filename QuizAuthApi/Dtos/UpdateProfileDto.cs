namespace QuizAuthApi.Dtos
{
    public class UpdateProfileDto
    {
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
