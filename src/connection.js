require('dotenv').config()

const knex = require('knex')({
  client: 'postgres',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATA_BASE
  }
});

module.exports = knex;