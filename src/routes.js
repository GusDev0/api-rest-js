const express = require('express');
const verificarLogin = require('./middlewares/verification');
const { listAllUsers, registerUser, loginUser, getUser } = require('./controlls/users');

const routes = express();

routes.get('/', listAllUsers);
routes.post('/user', registerUser);
routes.post('/login', loginUser);

routes.use(verificarLogin);

routes.get('/user', getUser);

module.exports = { routes };