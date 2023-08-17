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
  const { user_name, user_email, user_password } = req.body;

  if (!user_name || !user_password || !user_email) {
    return res.status(400).json({ mensagem: "todos os campos são obrigatorios" })
  }

  try {
    const emailExist = await knex("users").where("user_email", user_email).first()

    if (emailExist) {
      return res.status(400).json({ mensagem: "não pode usar esse email" })
    }

    const criptoPassword = await bcrypt.hash(user_password, 10);

    const response = await knex("users").insert({
      user_name,
      user_email,
      user_password: criptoPassword
    })

    return res.status(201).json({ mensagem: "usuario cadastrado" });
  } catch (error) {
    return res.status(500).json(error)
  }
}

async function loginUser(req, res) {
  const { user_email, user_password } = req.body;

  try {
    const user = await knex('users').where('user_email', user_email).first()

    if (!user) {
      return res.status(404).json({ mensagem: "email ou senha invalidos" });
    }

    const validPassword = await bcrypt.compare(user_password, user.user_password);

    if (!validPassword) {
      console.log(validPassword);
      return res.status(400).json({ mensagem: "email ou senha invalidos" });

    }

    const token = jwt.sign({ id: user.id }, "UmaSenhaSegura", {
      expiresIn: "1h",
    });

    const { user_password: _, ...userLoged } = user;

    return res.json({ usuario: userLoged, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

module.exports = {
  listAllUsers,
  registerUser,
  loginUser
}