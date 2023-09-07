const joi = require('joi')

const postagemSchema = joi.object({
  conteudo: joi.string().max(50).required().messages({
    'any.required' : "O campo conteudo não é obrigatório",
    'string.max' : "O maximo de caracteres é 50"
  })
})

module.exports = postagemSchema