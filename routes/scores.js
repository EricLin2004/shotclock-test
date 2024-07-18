var express = require('express');
var router = express.Router();

let scores = [];

// Post new score
router.post('/', (req, res, next) => {
    scores.push(req.body);
    scores = scores.sort((a,b) => {
        return b.score - a.score;
    });

    res.sendStatus(200);
});

router.get('/', (req, res, next) => {
    console.log('scores: ', scores);
    res.send({ scores: scores.slice(0, 20) });
});

module.exports = router;