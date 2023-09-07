const joi = require('joi')

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    'any.required': "O campo e-mail é obrigatorio",
    'string.email': "O campo e-mail, deve ter um formato e-mail"
  }),
  password: joi.string().min(8).required().messages({
    'any.required': "O campo senha é obrigatorio",
    'string.min': "O campo senha deve ter no minimo 8 caracteres"
  })
})

module.exports = loginSchema