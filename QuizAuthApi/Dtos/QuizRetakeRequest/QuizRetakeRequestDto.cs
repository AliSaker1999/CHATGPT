public class QuizRetakeRequestDto
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Message { get; set; }
    public DateTime RequestedAt { get; set; }
    public bool? IsApproved { get; set; }
    public DateTime? DecisionAt { get; set; }
}
