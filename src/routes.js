const express = require('express');
const validarDados = require('./middlewares/validarDados');
const verificarLogin = require('./middlewares/verificarLogin');
const { listAllUsers, registerUser, loginUser, getUser } = require('./controlls/users');
const userSchema = require('./schemas/userSchema');


const routes = express();

routes.get('/', listAllUsers);
routes.post('/user', validarDados(userSchema), registerUser);
routes.post('/login', loginUser);

routes.use(verificarLogin)
routes.get('/user', getUser);

module.exports = { routes };