var express = require('express');
var router = express.Router();

let scores = [];

// Post new score
router.post('/', (req, res, next) => {
    console.log('body: ', req.body);
    scores.push(req.body.score);

    scores = scores.sort();

    console.log('newScores: ', scores);

    res.sendStatus(200);
});

router.get('/', (req, res, next) => {
    res.send({ scores });
});

module.exports = router;