const express = require('express');
const { listAllUsers, registerUser, loginUser } = require('./controlls/users');

const routes = express();

routes.get('/', listAllUsers)
routes.post('/user', registerUser)
routes.post('/login', loginUser)

module.exports = { routes };