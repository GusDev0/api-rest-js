require('dotenv').config()
const knex = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function listAllUsers(req, res) {
  try {
    const users = await knex('users').select('name', 'email');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ mensagem: "erro interno do servidor" })
  }
}

async function registerUser(req, res) {

  const { name, email, password, idade, url_image } = req.body;

  try {

    const emailExist = await knex("users").where("email", email).first()
    if (emailExist) {
      return res.status(400).json({ mensagem: "E-mail inválido." })
    }

    const criptoPassword = await bcrypt.hash(password, 10);
    const subscribe_date = new Date()

    const newUser = await knex("users").insert({
      name,
      email,
      password: criptoPassword,
      idade,
      url_image,
      subscribe_date
    })

    return res.status(201).json({ mensagem: "Usuário cadastrado." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await knex('users').where('email', email).first()

    if (!user) {
      return res.status(404).json({ mensagem: "E-mail inválido." });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ mensagem: "Senha invalida." });
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
  let { name, email, password, idade } = req.body;

  if (!name && !email && !password && !idade) {
    return res.status(400).json({ mensagem: "Ao menos um campo deve ser informado!" })
  }

  const { userLoged } = req

  try {

    if (email && email !== userLoged.email) {
      const userExist = await knex('users').where('email', email).first()
      if (userExist) {
        return res.status(400).json({ mensagem: "E-mail inválido." });
      }
    }

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await knex('users').where('id', userLoged.id).update({
      name,
      email,
      password,
      idade
    })

    return res.status(200).json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

function getUser(req, res) {
  return res.status(200).json(req.userLoged);
}

async function deleteUser(req, res) {
  const { userLoged } = req
  try {
    const userDeleted = await knex('users').where('id', userLoged.id).delete()
    return res.status(204).json({ mensagem: 'Usuário deletado com sucesso!' })
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

module.exports = {
  listAllUsers,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser
}