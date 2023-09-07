const express = require('express');
const validarDados = require('./middlewares/validarDados');
const verificarLogin = require('./middlewares/verificarLogin');
const { listAllUsers, registerUser, loginUser, getUser, updateUser, deleteUser } = require('./controlls/users');
const { uploadFile } = require('./controlls/files');
const { allPosts, postar } = require('./controlls/postagem');
const userSchema = require('./schemas/userSchema');
const updateSchema = require('./schemas/updateSchema');
const multer = require('./multer');
const postagemSchema = require('./schemas/postagemSchema');
const loginSchema = require('./schemas/loginSchema');

const routes = express();

routes.post('/user', validarDados(userSchema), registerUser);
routes.post('/login', validarDados(loginSchema), loginUser);
routes.post('/upload', multer.single('arquivo'), uploadFile);
routes.get('/user/:id', allPosts)
routes.get('/', listAllUsers);

routes.use(verificarLogin)

routes.get('/user', getUser);
routes.put('/user', validarDados(updateSchema), updateUser);
routes.post('/postagem', validarDados(postagemSchema), postar)
routes.delete('/user', deleteUser);

module.exports = { routes };