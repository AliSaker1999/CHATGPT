namespace QuizAuthApi.Dtos.QuizResult
{
    public class QuizResultDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; } // ✅ Add this
    public int Score { get; set; }
    public DateTime SubmittedAt { get; set; }
}

}
