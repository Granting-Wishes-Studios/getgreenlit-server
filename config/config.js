require('dotenv').config()

module.exports = {
  development: {
    cor_origin: process.env.DEV_CORS,
  },
  test: {
    cor_origin: process.env.DEV_CORS,
  },
  production: {
    cor_origin: process.env.CORS,
  },
}