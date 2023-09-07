require('dotenv').config()
const aws = require('aws-sdk');
const knex = require('../connection');

const endpoint = new aws.Endpoint(process.env.ENDPOINT)

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

async function uploadFile(req, res) {
  const { file } = req;

  try {
    const { max } = await knex('users').max('id').first()

    const arquivo = await s3.upload({
      Bucket: process.env.BUCKET,
      Key: `users/${max + 1}/profile-picture.png`,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise()

    return res.json(arquivo.Location)
  } catch (error) {
    return res.json(error)
  }
}

module.exports = {
  uploadFile
}