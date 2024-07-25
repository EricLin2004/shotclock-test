const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    host: process.env.PG_HOSTNAME,
    port: 5432,
    database: process.env.PG_DBNAME,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
};