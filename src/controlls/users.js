const knex = require('../connection');

async function listAllUsers(req, res) {
  try {
    const response = await knex("users")

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

    const response = await knex("users").insert({
      user_name,
      user_email,
      user_password
    }).returning("*")

    return res.status(201).json(response[0])
  } catch (error) {
    return res.status(500).json(error)
  }
}

module.exports = {
  listAllUsers,
  registerUser
}