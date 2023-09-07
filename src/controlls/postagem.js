const knex = require("./../connection")

async function postar(req, res) {
  const { id } = req.userLoged
  const { conteudo } = req.body

  try {
    const postagem = await knex('posts').insert({
      id_user: id,
      conteudo
    })

    return res.status(201).json({ mensagem: "Postagem enviada!" });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor!" })
  }
}

async function allPosts(req, res) {

  try {
    const { id } = req.params
    const { page } = req.query

    const userExist = await knex('users').where('id', id).first()
    if (!userExist) {
      return res.status(404).json({ mensagem: "Usuáio não econtrado!" })
    }

    const postagens = await knex('posts').where('id_user', id).limit(5).offset(page ? page * 5 : 0)

    return res.status(200).json(postagens)
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor!" })
  }
}

module.exports = {
  postar,
  allPosts
}