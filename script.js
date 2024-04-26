const questions = [
  // create 5 questions with 4 answer, In the answer will have the difficulty to enhance score
  {
    question: "Which is largest animal in the world ?",
    answers: [
      { text: "Shark", correct: false },
      { text: "Blue Whale", correct: true },
      { text: "Elephant", correct: false },
      { text: "Giraffe", correct: false },
    ],
    difficulty: 1,
  },
  {
    question: "Which is smallest country in the world ?",
    answers: [
      { text: "Vatican City", correct: true },
      { text: "Bhutan", correct: false },
      { text: "Nepal", correct: false },
      { text: "Shri Lanka", correct: false },
    ],
    difficulty: 1,
  },
  {
    question: "Which is largest desert in the world ?",
    answers: [
      { text: "Kalahari", correct: false },
      { text: "Gobi", correct: false },
      { text: "Sahara", correct: false },
      { text: "Antarctica", correct: true },
    ],
    difficulty: 2,
  },
  {
    question: "Which is smallest continent in the world ?",
    answers: [
      { text: "Asia", correct: false },
      { text: "Australia", correct: true },
      { text: "Arctic", correct: false },
      { text: "Africa", correct: false },
    ],
    difficulty: 3,
  },
  {
    question: "What is the capital city of Canada ?",
    answers: [
      { text: "Toronto", correct: false },
      { text: "Ottawa", correct: true },
      { text: "Vancouver", correct: false },
      { text: "Montreal", correct: false },
    ],
    difficulty: 3,
  },
];

const playerName = prompt(
  // insert name
  "Hello, Please insert your name before the game begins: "
);

const simpleQuizTitle = document.getElementById("simple-quiz-title");
const greeting = document.getElementById("greeting");

simpleQuizTitle.textContent = "Simple Quiz";
greeting.textContent = `Hello ${playerName}`; //Hello [name]
greeting.classList.remove("hidden");

const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let currentQuestion;
let weight;

function startQuiz() {
  console.log("Quiz started"); // Console log messages for start Quiz
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  weight = difficultyWeights[currentQuestion.difficulty];
  questionElement.innerHTML = `Question ${questionNo} (${weight}pts) : ${currentQuestion.question}`;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");

    // Create answer buttons for each answer of the question
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButton.appendChild(button);

    if (answer.correct) {
      // Mark the correct answer using data attribute
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none"; // Hide the next button

  // Remove all child elements from the answer button container
  while (answerButton.firstChild) {
    answerButton.removeChild(answerButton.firstChild);
  }
}

const difficultyWeights = {
  // Make point base on difficulty
  1: 1,
  2: 2,
  3: 3,
};

function selectAnswer(e) {
  console.log("Answer selected"); // Console log messages for selectAnswer

  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  weight = difficultyWeights[currentQuestion.difficulty];

  // If the answer is correct, add the weight to the score and mark the button as correct
  if (isCorrect) {
    score += weight;
    selectedBtn.classList.add("correct");
  } else {
    selectedBtn.classList.add("incorrect");
  }

  // Disable all answer buttons to prevent further selection
  Array.from(answerButton.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  // Display the next button to proceed to the next question
  nextButton.style.display = "block";
}

function showScore() {
  console.log("Quiz ended"); // Console log messages for end Quiz
  resetState();
  questionElement.innerHTML = `You score ${score} out of ${calculateMaxPossibleScore()}!`; // show score / total score
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

function calculateMaxPossibleScore() {
  // calculate total score
  let maxScore = 0;
  questions.forEach((question) => {
    maxScore += difficultyWeights[question.difficulty];
  });
  return maxScore;
}

function handleNextButton() {
  currentQuestionIndex++; // Move to the next question
  if (currentQuestionIndex < questions.length) {
    // If there are more questions remaining, show the next question
    showQuestion();
  } else {
    // If all questions have been answered, show the final score
    showScore();
  }
}
// Add event listener for the next button click
nextButton.addEventListener("click", () => {
  // Check if there are more questions remaining
  if (currentQuestionIndex < questions.length) {
    // If yes, handle the next button click
    handleNextButton();
  } else {
    // If all questions have been answered, start the quiz again
    startQuiz();
  }
});

startQuiz();
