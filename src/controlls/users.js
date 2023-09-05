require('dotenv').config()
const knex = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function listAllUsers(req, res) {
  try {
    const response = await knex.select('name', 'email').from('users')

    return res.status(200).json(response)
  } catch (error) {
    console.log(error);

    return res.status(500).json({ mensagem: "erro interno do servidor" })
  }
}

async function registerUser(req, res) {
  const { name, email, password, idade, url_image, cargo } = req.body;

  if (!name || !password || !email || !cargo) {
    return res.status(400).json({ mensagem: "Os campos Nome, E-mail, Senha e Cargo são obrigatórios" })
  }

  try {
    const emailExist = await knex("users").where("email", email).first()

    if (emailExist) {
      return res.status(400).json({ mensagem: "não pode usar esse email" })
    }

    if (password) {
      const criptoPassword = await bcrypt.hash(password, 10);
    }
    const admission_date = new Date()

    const response = await knex("users").insert({
      name,
      email,
      password: criptoPassword,
      idade,
      url_image,
      admission_date,
      cargo
    })

    return res.status(201).json({ mensagem: "usuario cadastrado" });
  } catch (error) {
    return res.status(500).json({ mensagem: "erro interno do servidor" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await knex('users').where('email', email).first()

    if (!user) {
      return res.status(404).json({ mensagem: "email ou senha invalidos" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ mensagem: "senha invalida" });
    }

    const token = jwt.sign({ id: user.id }, process.env.HASH, {
      expiresIn: "1h",
    });

    const { password: _, ...userLoged } = user;

    return res.json({ usuario: userLoged, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

async function updateUser(req, res) {
  let { name, email, password, idade, cargo } = req.body;
  const { userLoged } = req

  try {

    if (email) {
      const userExist = await knex('users').where('email', email).first()
      if (userExist.email) {
        return res.status(400).json({ mensagem: "E-mail não válido para atualização" });
      }
    }

    if (password) {
       password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await knex('users').where('id', userLoged.id).update({
      name,
      email,
      password,
      idade,
      cargo
    })

    return res.status(200).json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

function getUser(req, res) {
  return res.status(200).json(req.userLoged);
}

module.exports = {
  listAllUsers,
  registerUser,
  loginUser,
  getUser,
  updateUser
}