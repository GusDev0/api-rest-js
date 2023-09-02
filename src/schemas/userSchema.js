const joi = require('joi')

const userSchema = joi.object({
  user_name: joi.string().required(),
  user_email: joi.string().email().required(),
  user_password: joi.string().min(8).required(),
  user_cargo: joi.string().min(10).required()
})

module.exports = userSchema;