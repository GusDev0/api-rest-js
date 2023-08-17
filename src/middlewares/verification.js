const jwt = require("jsonwebtoken");
const pool = require("../conection");
const knex = require("../connection");

async function verifyrUserLoged(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "não autorizado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, "UmaSenhaSegura");

    const user = await knex('users').where('id', id).first();

    if (!user) {
      return res.status(404).json({ mensagem: "não encontrado" });
    }

    req.usuario = user;

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "não autorizado" });
  }
}

module.exports = verifyrUserLoged;