const simpleQuizTitle = document.getElementById("simple-quiz-title");
const greeting = document.getElementById("greeting");
const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let currentQuestion;
let weight;
let playerName = "";

async function startQuiz() {
  while (!playerName) {
    // make loop until put name correct
    playerName = prompt(
      "Hello, Please insert your name before the game begins: "
    );

    if (!playerName) {
      alert("Please insert a valid name.");
    }
  }

  console.log("Quiz started"); // Console log messages for start Quiz
  simpleQuizTitle.textContent = "Simple Quiz";
  greeting.textContent = `Hello ${playerName}`; //Hello [name]
  greeting.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  //fetch data from JSON
  const response = await fetch("data.json");
  const data = await response.json();
  questions = data;

  showQuestion();
}

function showQuestion() {
  resetState();
  currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  weight = difficultyWeights[currentQuestion.difficulty];
  questionElement.innerHTML = `Question ${questionNo} (${weight}pts) : ${currentQuestion.question}`;

  currentQuestion.answers.forEach((answer, index) => {
    // Create radio button for each answer of the question
    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "answer";
    radioButton.value = answer.text; // Set value of radio button to answer text

    // Create label for radio button
    const label = document.createElement("label");
    label.textContent = answer.text;

    // Append radio button and label to answer buttons container
    answerButton.appendChild(radioButton);
    answerButton.appendChild(label);
    answerButton.appendChild(document.createElement("br"));

    // Mark the correct answer using data attribute
    if (answer.correct) {
      radioButton.dataset.correct = true;
    }

    // Add event listener to radio button
    radioButton.addEventListener("click", selectAnswer);
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
  //make points base on difficulty
  easy: 1,
  medium: 2,
  hard: 3,
  veryhard: 5,
};

function selectAnswer(e) {
  console.log("Answer selected");

  const selectedRadio = e.target;
  const selectedLabel = selectedRadio.nextElementSibling;
  const isCorrect = selectedRadio.dataset.correct === "true";
  weight = difficultyWeights[currentQuestion.difficulty];

  // If right, get point
  if (isCorrect) {
    score += weight;
    selectedLabel.classList.add("correct");
  } else {
    selectedLabel.classList.add("incorrect");
  }

  // Disable all button in order to pick more
  Array.from(answerButton.children).forEach((radio) => {
    radio.disabled = true;
  });

  // Display "next"
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
