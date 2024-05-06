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
    // Create checkbox for each answer of the question
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "answer";
    checkbox.value = answer.text; // Set value of checkbox to answer text

    // Create label for checkbox
    const label = document.createElement("label");
    label.textContent = answer.text;

    // Append checkbox and label to answer buttons container
    answerButton.appendChild(checkbox);
    answerButton.appendChild(label);
    answerButton.appendChild(document.createElement("br")); // Add line break

    // Mark the correct answer using data attribute
    if (answer.correct) {
      checkbox.dataset.correct = true;
    }

    // Add event listener to checkbox
    checkbox.addEventListener("change", selectAnswer);
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

  const selectedCheckbox = e.target;
  const selectedLabel = selectedCheckbox.nextElementSibling;
  const isCorrect = selectedCheckbox.dataset.correct === "true";
  weight = difficultyWeights[currentQuestion.difficulty];

  if (selectedCheckbox.checked) {
    if (isCorrect) {
      selectedLabel.classList.add("correct");
    } else {
      selectedLabel.classList.add("incorrect");
    }
  } else {
    selectedLabel.classList.remove("correct", "incorrect");
  }

  const checkedCheckboxes = Array.from(
    answerButton.querySelectorAll("input[type='checkbox']:checked")
  );
  nextButton.style.display = checkedCheckboxes.length > 0 ? "block" : "none";
}

function calculateMaxPossibleScore() {
  let maxScore = 0;
  questions.forEach((question) => {
    let correctAnswersCount = question.answers.filter(
      (answer) => answer.correct
    ).length;
    maxScore += correctAnswersCount * difficultyWeights[question.difficulty]; // Multiply by difficulty weight
  });
  return maxScore;
}

function handleNextButton() {
  // Initialize a variable to store total score for this question
  let questionScore = 0;

  // Check if all checked answers are correct
  const checkedCheckboxes = Array.from(
    answerButton.querySelectorAll("input[type='checkbox']:checked")
  );

  // Calculate score for this question based on checked answers
  checkedCheckboxes.forEach((checkbox) => {
    if (checkbox.dataset.correct === "true") {
      // Add weight to score for each correct answer selected
      questionScore += weight;
    } else {
      // Deduct weight from score for each incorrect answer selected
      questionScore -= weight;
    }
  });

  // Add question score to total score
  score += Math.max(questionScore, 0); // Ensure question score is non-negative
  console.log(score);
  // Move to the next question
  currentQuestionIndex++;

  // If there are more questions remaining, show the next question
  if (currentQuestionIndex < questions.length) {
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

function showCorrectAnswersFromFile(file) {
  fetch(file)
    .then((response) => response.json())
    .then((data) => {
      const reviewDiv = document.createElement("div");
      reviewDiv.classList.add("review-container");

      const correctAnswersTitle = document.createElement("h2");
      correctAnswersTitle.textContent = "Correct Answers:";
      reviewDiv.appendChild(correctAnswersTitle);

      data.forEach((answerObject) => {
        for (const key in answerObject) {
          if (Object.hasOwnProperty.call(answerObject, key)) {
            const answerElement = document.createElement("p");
            answerElement.textContent = `${key}: ${answerObject[key]}`;
            answerElement.classList.add("correct-answer");
            reviewDiv.appendChild(answerElement);
          }
        }
      });

      questionElement.appendChild(reviewDiv);
    })
    .catch((error) => console.error("Error:", error));
}

function showCorrectAnswers() {
  showCorrectAnswersFromFile("correctAnswer.json");
}

function showScore() {
  console.log("Quiz ended"); // Console log messages for end Quiz
  resetState();
  showCorrectAnswers();
  questionElement.innerHTML = `You score ${score} out of ${calculateMaxPossibleScore()}!`; // show score / total score
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

startQuiz();
