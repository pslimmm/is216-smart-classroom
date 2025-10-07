const { GoogleGenAI } = require("@google/genai");
const { QuizPrompt, QuizPrompt2 } =  require("./prompts/quizprompts.js");


const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

class QuizGenerator {
    #api_key;

    constructor(api_key, topic) {
        this.#api_key = api_key;
        this.topic = topic;
        this.ai = new GoogleGenAI({ apiKey: this.#api_key });
    }

    async getQuiz() {
        // use QuizPrompt if tokens are not a concern, otherwise use QuizPrompt2 for a more token-efficient prompt
        // const response = await ai.models.generateContent({
        //     model: "gemini-2.5-flash-lite",
        //     contents: QuizPrompt2(this.topic),
        //     config: {
        //         thinkingConfig: {
        //             thinkingBudget: 0, // Disables thinking
        //         }
        //     }
        // });

        // replaces any ```json ... ``` code block markers that may be added by the model
        // then returns a object containing all the quiz questions
        // const objectResponse = JSON.parse(response.text.replace(/^```json/, '').replace(/```$/, ''));

        // tmp response while building the UI 
        const objectResponse =
        {
            response_code: 0,
            results: [
                {
                    type: 'multiple',
                    difficulty: 'medium',
                    category: 'Basic Trigonometry',
                    question: 'Which trigonometric function is defined as the ratio of the opposite side to the hypotenuse in a right-angled triangle?',
                    correct_answer: [Array],
                    incorrect_answers: [Array]
                },
                {
                    type: 'boolean',
                    difficulty: 'medium',
                    category: 'Basic Trigonometry',
                    question: 'In a right-angled triangle, the Pythagorean theorem states that the square of the hypotenuse is equal to the sum of the squares of the other two sides.',
                    correct_answer: [Array],
                    incorrect_answers: [Array]
                },
                {
                    type: 'multiple',
                    difficulty: 'medium',
                    category: 'Basic Trigonometry',
                    question: 'What is the value of cos(0°)?',
                    correct_answer: [Array],
                    incorrect_answers: [Array]
                },
                {
                    type: 'boolean',
                    difficulty: 'medium',
                    category: 'Basic Trigonometry',
                    question: 'The tangent of 90 degrees is undefined.',
                    correct_answer: [Array],
                    incorrect_answers: [Array]
                },
                {
                    type: 'multiple',
                    difficulty: 'medium',
                    category: 'Basic Trigonometry',
                    question: 'Which of the following is an identity for the reciprocal of the tangent function?',
                    correct_answer: [Array],
                    incorrect_answers: [Array]
                }
            ]
        }

        // if (objectResponse.response_code !== 0) {
        //     throw new Error("Error generating quiz questions");
        // }

        return objectResponse;
    }



}

try {
    const quiz = await getQuiz();
    console.log(quiz);

} catch (err) {
    console.error(err);
}    

module.exports = QuizGenerator;