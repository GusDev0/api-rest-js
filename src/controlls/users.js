require('dotenv').config()
const knex = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function listAllUsers(req, res) {
  try {
    const response = await knex.select('user_name', 'user_email').from('users')

    return res.status(200).json(response)
  } catch (error) {
    console.log(error);

    return res.status(500).json({ mensagem: "erro interno do servidor" })
  }
}

async function registerUser(req, res) {
  const { user_name, user_email, user_password, user_idade, user_url_image, user_cargo } = req.body;

  if (!user_name || !user_password || !user_email || !user_cargo) {
    return res.status(400).json({ mensagem: "Os campos Nome, E-mail, Senha e Cargo são obrigatórios" })
  }

  try {
    const emailExist = await knex("users").where("user_email", user_email).first()

    if (emailExist) {
      return res.status(400).json({ mensagem: "não pode usar esse email" })
    }

    const criptoPassword = await bcrypt.hash(user_password, 10);
    const user_admission_date = new Date()

    const response = await knex("users").insert({
      user_name,
      user_email,
      user_password: criptoPassword,
      user_idade,
      user_url_image,
      user_admission_date,
      user_cargo
    })

    return res.status(201).json({ mensagem: "usuario cadastrado" });
  } catch (error) {
    return res.status(500).json({ mensagem: "erro interno do servidor" });
  }
}

async function loginUser(req, res) {
  const { user_email, user_password } = req.body;

  try {
    const user = await knex('users').where('user_email', user_email).first()

    if (!user) {
      return res.status(404).json({ mensagem: "email ou senha invalidos" });
    }

    if (!(await bcrypt.compare(user_password, user.user_password))) {
      return res.status(400).json({ mensagem: "senha invalida" });
    }

    const token = jwt.sign({ id: user.id }, process.env.HASH, {
      expiresIn: "1h",
    });

    const { user_password: _, ...userLoged } = user;

    return res.json({ usuario: userLoged, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

function getUser(req, res) {
  return res.status(200).json(req.usuario);
}

module.exports = {
  listAllUsers,
  registerUser,
  loginUser,
  getUser
}