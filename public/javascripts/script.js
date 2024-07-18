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

async function startLoading() {
  document.querySelector('.start-screen').style.display = 'none';
  document.querySelector('.loading-screen').style.display = 'block';
  
  const response = await fetch('/new');
  let roundsRes = await response.json();
  console.log('roundsRes: ', roundsRes);
  questions = roundsRes.rounds;
  gameConfig = roundsRes.config;

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
  }, 20);
}

function loadQuestions() {
  setTimeout(() => {
    questions = generateRandomQuestions(gameConfig.numRounds);
    document.querySelector('.loading-screen').style.display = 'none';
    document.querySelector('.quiz-screen').style.display = 'block';
    startQuiz();
  }, 500); // Simulate a 15-second delay in total
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

  currentQuestionIndex = 0;
  score = 0;
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
    while (video.firstChild) {
      video.removeChild(video.firstChild);
    }

    // Set video source
    var source = document.createElement('source');
    source.setAttribute('src', question.videoUrl);
    source.setAttribute('type', 'video/mp4');
    video.appendChild(source);

    // Auto play
    video.load();
    video.play();

    const options = document.querySelectorAll('.options button');
    options.forEach((button, index) => {
      button.textContent = (index+1) + '. ' + question.options[index];
    });
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
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
  // resetTimer();
}

function endQuiz() {
  clearInterval(timerInterval);

  document.querySelector('.quiz-screen').style.display = 'none';
  document.querySelector('.result-screen').style.display = 'block';
  document.getElementById('score').textContent = score;
}

function playAgain() {
  document.querySelector('.result-screen').style.display = 'none';
  document.querySelector('.quiz-screen').style.display = 'block';
  questions = generateRandomQuestions(gameConfig.numRounds);
  startQuiz();
}

function generateRandomQuestions(count) {
  // Generate or fetch `count` random questions
  // This is a placeholder function
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

function calculateScore() {

}