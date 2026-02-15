// https://node-postgres.com/
var pg = require("pg");

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

module.exports = {
  getPool: () => pool,
  init: async () => {
    try {
      await pool.query('SELECT 1 FROM "Users" LIMIT 1');
      console.log("Connection to Database successful");
    } catch (err) {
      if (err.code === "ECONNREFUSED") {
        console.error(
          `Could not connect to database. DBName: ${process.env.DB_NAME}, DBHost: ${process.env.DB_HOST}, Port: ${process.env.DB_PORT}`,
        );
      } else {
        console.error(err);
      }

      process.exit(1);
    }
  },
  end: async () => {
    await pool.end();
  },
};
