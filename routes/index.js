var express = require('express');
var router = express.Router();
let fs = require('fs');

let plays = JSON.parse(fs.readFileSync('./public/config/plays.json').toString());
let config = JSON.parse(fs.readFileSync('./public/config/main.json').toString());

// Fisher-Yates shuffle
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const generateGameRounds = (plays) => {
  let rounds = [];
  let deepCopyPlays = JSON.parse(JSON.stringify(plays));
  
  shuffleArray(deepCopyPlays);
  
  let selectedPlays = deepCopyPlays.splice(0,config.numRounds);

  for(let i=0; i< selectedPlays.length; i++) {
    rounds[i] = [selectedPlays[i].concat(true)].concat(deepCopyPlays.splice(0,config.numOptions-1));
  }

  return rounds;
};

let leaderboards = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'NBA TopShot Clock'
  });
});

router.get('/new', (req, res, next) => {
  res.send({
    config,
    rounds: generateGameRounds(plays)
  });
});


module.exports = router;