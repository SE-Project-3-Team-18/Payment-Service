/* eslint-disable max-len */
require('dotenv')
  .config()

const PORT = process.env.PORT
const SERVICE_NAME = process.env.SERVICE_NAME
const SERVICE_HOST = process.env.SERVICE_HOST

const MONGODB_URI = process.env.ATLAS_URI

const SERVICE_REGISTRY_BASE_URI = 'http://localhost:3001'
const SECRET_KEY = process.env.SECRET_KEY
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
const SUCCESS_URL = process.env.SUCCESS_URL
const CANCEL_URL = process.env.CANCEL_URL
const NATS_SUBJECT = process.env.NATS_SUBJECT

module.exports = {
  PORT,
  SERVICE_NAME,
  SERVICE_HOST,
  MONGODB_URI,
  SERVICE_REGISTRY_BASE_URI,
  SECRET_KEY,
  PUBLISHABLE_KEY,
  WEBHOOK_SECRET,
  SUCCESS_URL,
  CANCEL_URL,
  NATS_SUBJECT,
}
