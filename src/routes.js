const express = require('express');
const { listAllUsers, registerUser } = require('./controlls/users');

const routes = express();

routes.get('/', listAllUsers)
routes.post('/user', registerUser)

module.exports = { routes };