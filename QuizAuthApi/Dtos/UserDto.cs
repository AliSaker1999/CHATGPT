namespace QuizAuthApi.Dtos
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public bool isTaken { get; set; } = false;
    }
}
