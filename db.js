import postgres from 'postgres'

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
});

export default sql