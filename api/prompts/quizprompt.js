import { Type } from "@google/genai";

export const QuizPrompt = (topic) =>  
`
Generate quiz questions in JSON about ${topic} format exactly like this:

{
  "response_code": 0,
  "results": [
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "History",
      "question": "What Russian automatic gas-operated assault rifle was developed in the Soviet Union in 1947, and is still popularly used today?",
      "correct_answer": ["AK-47"],
      "incorrect_answers": ["RPK", "M16", "MG 42"]
    },
    {
      "type": "boolean",
      "difficulty": "medium",
      "category": "History",
      "question": "Sir Isaac Newton served as a Member of Parliament, but the only recorded time he spoke was to complain about a draft in the chambers.",
      "correct_answer": ["True"],
      "incorrect_answers": ["False"]
    }
  ]
}

Rules:
1. The output must be valid JSON.
2. The "results" property must be an array containing one or more question objects.
3. Each question object must have the following fields:
   - "type": either "multiple" (for multiple-choice or multi-select) or "boolean" (for true/false).
   - "difficulty": one of "easy", "medium", or "hard".
   - "category": a string describing the category.
   - "question": the quiz question text.
   - "correct_answer": for multiple-choice or multi-select, always an array of strings (even if only one answer). For boolean, also an array with "True" or "False".
   - "incorrect_answers": an array of strings.
4. Return "response_code" as 0 for success or 1 if there is any error.
5. Do not include any extra fields or text outside of the JSON structure.
6. Generate at least one multiple-choice/multi-select question and one boolean question in the results array.
7. Ensure that for multiple-choice questions, there is exactly one correct answer and three incorrect answers. For multi-select questions, provide all correct and incorrect options.
`;

export const QuizPrompt2 = (topic) =>
`
Generate a JSON quiz about ${topic} with this structure:

{"response_code": 0,"results": [{"type": "multiple","difficulty": "medium","category": "History","question": "...","correct_answer": ["..."],"incorrect_answers": ["...", "...", "..."]},{"type": "boolean","difficulty": "medium","category": "History","question": "...","correct_answer": ["True"],"incorrect_answers": ["False"]}]}

Rules:
1. "results" is an array of question objects.
2. "type" is "multiple" or "boolean".
3. "correct_answer" is always an array.
4. "incorrect_answers" is an array of strings.
5. "response_code": 0 if success, 1 if error.
6. Generate at least one multiple-choice/multi-select and one boolean question.
7. Output must be valid JSON with no extra text.
8. For multiple-choice, provide 1 correct and 3 incorrect answers. For multi-select, provide all correct and incorrect options.
9. Return everything as is, no spaces and linebreaks, follow the format given
` 