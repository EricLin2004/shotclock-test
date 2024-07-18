let gameConfig;
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let questions;
let streakBonus = 0;
let pickedAnswer;

// Fisher-Yates shuffle
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function resetScreens() {
  document.querySelector('.loading-screen').style.display = 'none';
  document.querySelector('.quiz-screen').style.display = 'none';
  document.querySelector('.high-scores').style.display = 'none';
  document.querySelector('.result-screen').style.display = 'none';
  document.querySelector('.start-screen').style.display = 'none';
}

function resetGameState() {
  currentQuestionIndex = 0;
  score = 0;
  streakBonus = 0;
  questions = generateRandomQuestions(gameConfig.numRounds)
}

function resetVideoContainer() {
  var vc = document.querySelector('.videos-container');

  while (vc.firstChild) {
    vc.removeChild(vc.firstChild);
  }

  // console.log('questions: ', questions);

  for(let i=0; i < questions.length; i++) {
    var vidEl = document.createElement('video');
    var srcEl = document.createElement('source');
    srcEl.setAttribute('src', questions[i].videoUrl);
    srcEl.setAttribute('type', 'video/mp4');
    vidEl.appendChild(srcEl);
    vidEl.className = 'hidden';

    vc.appendChild(vidEl);
  }

  vc.firstChild.load();
}

async function startLoading() {
  resetScreens();
  document.querySelector('.loading-screen').style.display = 'block';
  
  const response = await fetch('/new');
  let roundsRes = await response.json();
  // console.log('roundsRes: ', roundsRes);
  questions = roundsRes.rounds;
  gameConfig = roundsRes.config;

  resetGameState();
  resetVideoContainer();

  let progressBar = document.getElementById('progress-bar');
  let width = 0;
  let interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      loadQuestions();
    } else {
      width++;
      progressBar.style.width = width + '%';
    }
  }, 50);
}

function loadQuestions() {
  setTimeout(() => {
    resetScreens();
    document.querySelector('.quiz-screen').style.display = 'block';
    startQuiz();
  }, 3000);
}

async function showHighScores() {
  resetScreens();
  document.querySelector('.high-scores').style.display = 'block';
  var listScores = document.querySelector('.list-scores');

  // Clear board
  while (listScores.firstChild) {
    listScores.removeChild(listScores.firstChild);
  }

  let scoresRes = await fetch('/scores');
  let scoresBody = await scoresRes.json();

  for(let i=0; i < scoresBody.scores.length; i++) {
    let newEl = document.createElement('p');
    newEl.textContent = scoresBody.scores[i].username + ': ' + scoresBody.scores[i].score;

    listScores.appendChild(newEl);
  }
}

function backToMenu() {
  resetScreens();
  document.querySelector('.start-screen').style.display = 'block';
}

function startQuiz() {
  addEventListener('keyup', (event) => {
    if (
      event.code == 'Digit1' ||
      event.code == 'Digit2' ||
      event.code == 'Digit3' ||
      event.code == 'Digit4'
    ) {
      selectOption(parseInt(event.code[event.code.length-1])-1);
    }
  });

  loadQuestion();
  startTimer();
}

function loadQuestion() {
  if (currentQuestionIndex < gameConfig.numRounds) {
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = 'Round ' + (currentQuestionIndex+1);
    document.getElementById('live-score').textContent = 'Score: ' + score;
    document.getElementById('streak-bonus').textContent = ' |  Streak Bonus: ' + streakBonus;

    // console.log(question);

    var video = document.getElementById('moment-player');

    // Clear video
    if (document.querySelector('video.active')) {
      document.querySelector('video.active').className = 'hidden';
    }

    var vidEl = document.querySelector('.videos-container').children[currentQuestionIndex];
    vidEl.className = 'active';
    
    // Auto play
    vidEl.play();

    // Pre load next video
    var nextVidEl = document.querySelector('.videos-container').children[currentQuestionIndex+1];
    if (nextVidEl) {
      nextVidEl.load();
    }

    const options = document.querySelectorAll('.options button');
    options.forEach((button, index) => {
      button.textContent = (index+1) + '. ' + question.options[index];
    });
    document.getElementById('current-question').textContent = currentQuestionIndex;
    document.getElementById('total-questions').textContent = gameConfig.numRounds;
  } else {
    endQuiz();
  }
}

function startTimer() {
  // reset timer
  timeLeft = gameConfig.timeInRound;
  document.getElementById('time-left').textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('time-left').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  startTimer();
}

function selectOption(option) {
  submitAnswer(option);
}

function submitAnswer(pickedOption) {
  // Check answer, update score, and load next question
  const question = questions[currentQuestionIndex];
  if (question.correctOption === pickedOption) {
    score += 3 + streakBonus;
    streakBonus += 0.5;
  } else {
    streakBonus = 0;
  }

  currentQuestionIndex++;
  loadQuestion();
}

function endQuiz() {
  clearInterval(timerInterval);
  resetScreens();

  document.getElementById('score').textContent = score;
  document.querySelector('.result-screen').style.display = 'block';
}

async function submitScore() {
  let username = document.querySelector('.username').value;

  if (score > 0) {
    // Post score
    const response = await fetch('/scores', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ 
        score,
        username
      })
    }); 
  }

  backToMenu();
}

function playAgain() {
  startLoading();
}

function generateRandomQuestions(count) {
  let randomQuestions = [];

  for (let i=0; i<count; i++) {
    let options = [];
    let correctOptionIndex;
    let question = questions[i];

    shuffleArray(question);

    for(let j=0; j<4; j++) {
      options.push(question[j][3] + ' ' + question[j][4] + ' -- ' + question[j][2]);

      if (question[j].length === 6) {
        correctOptionIndex = j;
      }
    }

    randomQuestions.push({
      text: `Round ${i + 1}`,
      options,
      videoUrl: question[correctOptionIndex][0],
      correctOption: correctOptionIndex
    })
  }

  return randomQuestions;
}