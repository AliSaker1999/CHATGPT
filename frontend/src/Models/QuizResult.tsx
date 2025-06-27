export interface QuizResultDto {
  id: number;
  username: string;
  email: string; // ✅ Add this
  score: number;
  submittedAt: string;
}
