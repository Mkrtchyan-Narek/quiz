
let count;
let numQuestions = questions.length;
let questionIds = questions.map(question => question.questionId);
let currentQuestion;
let gameStop = true;
let gameScore;
let timerInterval;
let userAnswers = [];

let time = document.getElementById("timer");
let score = document.getElementById("user-score");

let startBtn = document.getElementById("start");
startBtn.addEventListener("click", newGame);

let welcomeDiv = document.querySelector(".welcome-container");
let questionDiv = document.querySelector(".questions-container");
let formDiv = document.querySelector(".form-container");
let highScoreModal = document.querySelector(".modal-container");
let leaderboard = document.querySelector(".user-scores");
let leaderLink = document.querySelector(".leaderText");
leaderLink.addEventListener("click", showLeader)

let qTitle = document.getElementById("question-title");
let qChoices = document.getElementById("question-choices");

let username = document.getElementById("username");

let userSubmit = document.getElementById("userSubmit");
userSubmit.addEventListener("click", saveUser);

let closeModal = document.querySelector(".close")
closeModal.addEventListener("click", clearModal);
window.addEventListener("click", outsideModal);

let exit = document.querySelector(".exit");
exit.addEventListener("click", clearModal);

let clearScores = document.querySelector(".clear");
clearScores.addEventListener("click", clearLeaderBoard);

function initialize() {

    if (localStorage.length === 0) {
        highScoreArray = [
        ];

        localStorage.setItem("userScores", JSON.stringify(highScoreArray));
    }

    let findTopScore = localStorage.getItem("userScores");

    let parsedScore = JSON.parse(findTopScore) || [];

    let max = 0;
    let user;
    for (let i = 0; i < parsedScore.length; i++) {
        if (max < parsedScore[i].score) {
            max = parsedScore[i].score;
            user = parsedScore[i].username;
        }
    }

    questionDiv.classList.add("hide");    
    formDiv.classList.add("hide");
    highScoreModal.classList.add("hide");

}

initialize();

function newGame() {
    gameStop = false;
    gameScore = 0;
    currentQuestion = questionIds[Math.floor(Math.random() * questionIds.length)];
    questionIds = questionIds.filter(Id => Id != currentQuestion);
    

    userAnswers = [];

    count =120;
    timer();
    time.textContent = count;

    welcomeDiv.classList.add("hide");
    questionDiv.classList.remove("hide");

    check();
}

function timer() {
    timerInterval = setInterval(function() {
        count--;
        time.textContent = count;

        if (count === 0) {
            gameOver();
        }
    }, 1000)
}


function check() {
    if (questionIds.length == 0) {
        gameOver();
    } else {
        loadQuestion();
    }
} 


function loadQuestion() {
    qTitle.textContent = '';
    qChoices.textContent = '';

    for (let i = 0; i < questions[currentQuestion].choices.length; i++) {
        qTitle.textContent = questions[currentQuestion].title;

        let ansChoice = document.createElement("li");
        ansChoice.setAttribute("id", i);
        ansChoice.setAttribute("data-name", `data-choice-${i}`);
        ansChoice.setAttribute("value", questions[currentQuestion].choices[i]);
        ansChoice.classList.add("ans-choice");


        ansChoice.addEventListener("click", next)
        ansChoice.textContent = questions[currentQuestion].choices[i];

        qChoices.appendChild(ansChoice);
    }

}

function next(event) {

    if(event.target.innerText === questions[currentQuestion].answer) {
        gameScore += 10;
    }

    currentQuestion = questionIds[Math.floor(Math.random() * questionIds.length)];
    questionIds = questionIds.filter(Id => Id != currentQuestion);

    check();
}

function gameOver() {
    gameStop = true;

    clearInterval(timerInterval);
    time.textContent = "- -";

    gameScore += count;

    questionDiv.classList.add("hide");

    score.textContent = gameScore;
    formDiv.classList.remove("hide");
    username.value = '';
}

function saveUser(event) {
    event.preventDefault();
    if (username.value == '') {
        return;
    }

    let tempArray = localStorage.getItem("userScores");
    let parsedTempArray = JSON.parse(tempArray);
    if (parsedTempArray !== null) {
        parsedTempArray.push(
            {
                username: username.value,
                score: gameScore
            }
        );

        sortScores(parsedTempArray);

        localStorage.setItem('userScores', JSON.stringify(parsedTempArray));
    } else {  
        let highScoreArray = [];
        highScoreArray.push(
            {
                username: username.value,
                score: gameScore
            }
        );
        localStorage.setItem('userScores', JSON.stringify(highScoreArray));
    }
    username.value = '';
    showLeader();
}

function showLeader() {
    formDiv.classList.add("hide");
    questionDiv.classList.add("hide");
    welcomeDiv.classList.add("hide");

    highScoreModal.classList.remove("hide");

    leaderboard.innerHTML = "";

    let highScoreBoard = localStorage.getItem('userScores');
    let parsedScoreBoard = JSON.parse(highScoreBoard);

    for (let i = 0; i < parsedScoreBoard.length; i++) {
        let newScore = document.createElement("li");
        newScore.textContent = parsedScoreBoard[i].username + " : " + parsedScoreBoard[i].score;
        newScore.classList.add("score-item");
        leaderboard.appendChild(newScore);
    }
}

function sortScores(scoreObj) {
    scoreObj.sort( function(a, b) {
        return b.score - a.score;
    });
}

function clearLeaderBoard() {
    localStorage.removeItem("userScores");

    console.log("Scores Cleared");
    console.log(localStorage);
    leaderboard.innerHTML = "";
}

function clearModal() {
    highScoreModal.classList.add("hide");
    welcomeDiv.classList.remove("hide");
}

function outsideModal(event) {
    if (event.target == highScoreModal) {
        highScoreModal.classList.add("hide");
        welcomeDiv.classList.remove("hide");
    }
} 


