const express = require('express');

const routes = express();

routes.get('/', (req, res) => {
  return res.status(200).json("tudo ok!")
})

module.exports = { routes };