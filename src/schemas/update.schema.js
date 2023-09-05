const joi = require('joi')

const updateSchema = joi.object({
  name: joi.string().regex(/^(?=.*[a-zA-Z]).+$/),
  email: joi.string().email(),
  password: joi.string().min(8),
  idade: joi.number(),
  cargo: joi.string().min(10)
})

module.exports = updateSchema;