const express = require('express');
const validarDados = require('./middlewares/validarDados');
const verificarLogin = require('./middlewares/verificarLogin');
const { listAllUsers, registerUser, loginUser, getUser, updateUser, deleteUser } = require('./controlls/users');
const userSchema = require('./schemas/userSchema');
const updateSchema = require('./schemas/update.schema');
const { uploadFile } = require('./controlls/files');
const multer = require('./multer');


const routes = express();

routes.post('/upload', multer.single('arquivo'), uploadFile)


routes.get('/', listAllUsers);
routes.post('/user', validarDados(userSchema), registerUser);
routes.post('/login', loginUser);

routes.use(verificarLogin)
routes.get('/user', getUser);
routes.put('/user', validarDados(updateSchema), updateUser);
routes.delete('/user', deleteUser);

module.exports = { routes };