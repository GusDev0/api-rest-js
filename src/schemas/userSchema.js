const joi = require('joi')

const userSchema = joi.object({
  name: joi.string().regex(/^(?=.*[a-zA-Z]).+$/).required().messages({
    'string.pattern.base': "O campo nome não pode conter numeros",
    'any.required': "O campo nome é obrigatorio"
  }),
  email: joi.string().email().required().messages({
    'any.required': "O campo e-mail é obrigatorio",
    'string.email': "O campo e-mail, deve ter um formato e-mail"
  }),
  password: joi.string().min(8).required().messages({
    'any.required': "O campo senha é obrigatorio",
    'string.min' : "O campo senha deve ter no minimo 8 caracteres"
  }),
  idade: joi.number().messages({
    'number.base':"O campo idade deve ser um número"
  })
})

module.exports = userSchema;