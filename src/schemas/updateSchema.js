const joi = require('joi')

const updateSchema = joi.object({
  name: joi.string().regex(/^(?=.*[a-zA-Z]).+$/).messages({
    'string.pattern.base': "O campo nome não pode conter numeros",
  }),
  email: joi.string().email().messages({
    'string.email': "O campo e-mail, deve ter um formato e-mail"
  }),
  password: joi.string().min(8).messages({
    'string.min' : "O campo senha deve ter no minimo 8 caracteres"
  }),
  idade: joi.number().messages({
    'number.base':"O campo idade deve ser um número"
  })
})

module.exports = updateSchema;