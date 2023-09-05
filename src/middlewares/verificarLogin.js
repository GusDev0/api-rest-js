require('dotenv').config();
const jwt = require("jsonwebtoken");
const knex = require("../connection");

async function verificarLogin(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }

  try {
    const token = authorization.replace('Bearer ', '').trim();

    const { id } = jwt.verify(token, process.env.HASH);

    const usuarioExiste = await knex('users').where({ id }).first();

    if (!usuarioExiste) {
      return res.status(404).json('Usuario não encontrado');
    }

    const { password, ...usuario } = usuarioExiste;

    req.userLoged = usuario;

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = verificarLogin;