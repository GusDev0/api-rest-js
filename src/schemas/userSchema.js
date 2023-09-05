const joi = require('joi')

const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  idade: joi.number(),
  cargo: joi.string().min(10).required()
})

module.exports = userSchema;