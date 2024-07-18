var express = require('express');
var router = express.Router();

let scores = [];

// Post new score
router.post('/', (req, res, next) => {
    scores.push(req.body);
    scores = scores.sort();

    res.sendStatus(200);
});

router.get('/', (req, res, next) => {
    res.send({ scores });
});

module.exports = router;