const knex = require('knex')({
  client: 'postgres',
  connection: {
    host : 'localhost',
    port : 5432,
    user : 'postgres',
    password : 'postgres',
    database : 'api_rest_js'
  }
});

module.exports = knex;