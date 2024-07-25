let {
    getScores,
    postScore,
} = require('../db');

var express = require('express');
var router = express.Router();

// Post new score
router.post('/', async (req, res, next) => {
    let newScoreRoundID = await postScore(req.body)

    res.send(newScoreRoundID);
});

router.get('/', async (req, res, next) => {
    let scoreRes = await getScores();

    res.send(scoreRes);
});

module.exports = router;