require('dotenv').config()
const aws = require('aws-sdk')

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
    const arquivo = await s3.upload({
      Bucket: process.env.BUCKET,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise()

    console.log(arquivo);

    return res.json(arquivo)
  } catch (error) {
    return res.json(error)
  }
}



module.exports = {
  uploadFile,
  loadFile
}