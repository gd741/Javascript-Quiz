
//card div by id and assigned to variables
const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

//hide all cards
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

//hide result div
function hideResultText() {
  resultDiv.style.display = "none";
}

//these variables are required globally
var intervalID;
var time;
var currentQuestion;

document.querySelector("#start-button").addEventListener("click", startQuiz);

function startQuiz() {
  //hide any visible cards, show the question card
  hideCards();
  questionCard.removeAttribute("hidden");

  //assign 0 to currentQuestion when start button is clicked, then display the current question on the page
  currentQuestion = 0;
  displayQuestion();

  //set total time depending on number of questions
  time = questions.length * 10;

  //executes function "countdown" every 1000ms to update time and display on page
  intervalID = setInterval(countdown, 1000);

  //invoke displayTime here to ensure time appears on the page as soon as the start button is clicked, not after 1 second
  displayTime();
}

//reduce time by 1 and display new value, if time runs out then end quiz
function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}

//display time on page
const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

//display the question and answer options for the current question
function displayQuestion() {
  let question = questions[currentQuestion];
  let options = question.options;

  let h2QuestionElement = document.querySelector("#question-text");
  h2QuestionElement.textContent = question.questionText;

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    let optionButton = document.querySelector("#option" + i);
    optionButton.textContent = option;
  }
}

//behaviour when an answer button is clicked: click event bubbles up to div with id "quiz-options"
//eventObject.target identifies the specific button element that was clicked on
document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

//compare the text content of the option button with the answer to the current question
function optionIsCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}

//if answer is incorrect, penalise time
function checkAnswer(eventObject) {
  let optionButton = eventObject.target;
  resultDiv.style.display = "block";
  if (optionIsCorrect(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResultText, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResultText, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      //if time is less than 10, display time as 0 and end quiz
      //time is set to zero in this case to avoid displaying a negative number in cases where a wrong answer is submitted with < 10 seconds left on the timer
      time = 0;
      displayTime();
      endQuiz();
    }
  }

  //increment current question by 1
  currentQuestion++;
  //if we have not run out of questions then display next question, else end quiz
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

//display scorecard and hide other divs
const score = document.querySelector("#score");

//quiz end, clears timer, hides visible cards, displays scorecard, displays score as remaining time
function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");

//store user initials and score when submit button is clicked
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  //prevent default behaviour of form submission
  event.preventDefault();

  //check for input
  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit!");
    return;
  }

  //store score and initials in an object
  let leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateStoredLeaderboard(leaderboardItem);

  //hide the question card, display the leaderboardCard
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  renderLeaderboard();
}

//updates the leaderboard stored in local storage
function updateStoredLeaderboard(leaderboardItem) {
  let leaderboardArray = getLeaderboard();
  //append new leaderboard item to leaderboard array
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

//"leaderboardarray" from local storage - parse into JS obj via JSON.parse.
function getLeaderboard() {
  let storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}

//display leaderboard on leaderboard card
function renderLeaderboard() {
  let sortedLeaderboardArray = sortLeaderboard();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLeaderboardArray.length; i++) {
    let leaderboardEntry = sortedLeaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

//array - leaderboard ordered highest to lowest
function sortLeaderboard() {
  let leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }

  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

//empties local storage + leaderboard
function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

//hide leaderboard card show start card
function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}

//link to view highscores anytime
const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  //stops countdown
  clearInterval(intervalID);

  //assign undefined to time and display that, so that time does not appear on page
  time = undefined;
  displayTime();

  //display leaderboard on leaderboard card
  renderLeaderboard();
}
//array - Questions, options and answers
const questions = [
  {
    questionText: "Q1. The 'function' and  'var' are known as:",
    options: ["1. Keywords", "2. Data types", "3. Declaration statements", "4. Prototypes"],
    answer: "3. Declaration statements",
  },
  {
    questionText: "Q2. Which one of the following is the correct way for calling the JavaScript code?",
    options: [
      "1. Preprocessor",
      "2. Trigerring Event",
      "3. RMI",
      "4. Function/Method",
    ],
    answer: "4. Function/Method",
  },
  {
    questionText:
      "Q3. In JavaScript the x===y statement implies that:",
    options: ["1. Both x and y are equal in value, type and reference address as well.", "2. Both are x and y are equal in value only.", "3. Both are equal in the value and data type.", "4. Both are not same at all."],
    answer: "3. Both are equal in the value and data type.",
  },
  {
    questionText:
      "Q4. Which one of the following is known as the Equality operator, which is used to check whether the two values are equal or not:",
    options: [
      "1. =",
      "2. ===",
      "3. ==",
      "4. &&",
    ],
    answer: "3. ==",
  },
  {
    questionText:
      "Q5. Upon encountering empty statements, what does the Javascript Interpreter do?",
    options: ["1. Throws and error", "2. Ignores the statements", "3. Gives a warning", "4. None of the above"],
    answer: "2. Ignores the statements",
  },
];
