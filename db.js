const postgres = require('postgres');

const {
    host,
    port,
    database,
    username,
    password,
} = require('./config');

const sql = postgres({
    host,
    port,
    database,
    username,
    password,
    ssl: true,
});
  
async function getScores() {
  const scores = await sql`
    SELECT *
    FROM results
    ORDER BY score DESC
    LIMIT 20;
  `;

  const totalGames = await sql`
    SELECT count(*) as count
    FROM results;
  `;

  return {
    scores,
    totalGamesPlayed: totalGames[0].count,
  };
}

async function postScore(body) {
  const newScoreRoundID = await sql`
    INSERT INTO results
      (score, username, round_id, questions)
    VALUES
      (${ body.score }, ${ body.username }, ${ body.roundID }, ${ JSON.stringify(body.questions) })
    RETURNING round_id;
  `

  return newScoreRoundID;
}

module.exports = {
  getScores,
  postScore,
};