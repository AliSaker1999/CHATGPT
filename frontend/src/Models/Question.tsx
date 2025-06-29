export interface AddQuestionDto {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}

export interface QuestionDto extends AddQuestionDto {
  id: number;
}
