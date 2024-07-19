var express = require('express');
var router = express.Router();

let scores = [];
let totalGamesPlayed = 0;

// Post new score
router.post('/', (req, res, next) => {
    scores.push(req.body);
    scores = scores.sort((a,b) => {
        return b.score - a.score;
    });

    totalGamesPlayed++;

    res.sendStatus(200);
});

router.get('/', (req, res, next) => {
    console.log('scores: ', scores);
    res.send({ 
        scores: scores.slice(0, 20),
        totalGamesPlayed
    });
});

module.exports = router;