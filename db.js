import postgres from 'postgres'

const sql = postgres({
    host: process.env.PG_HOSTNAME,
    port: 5432,
    database: process.env.PG_DBNAME,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
});

export default sql