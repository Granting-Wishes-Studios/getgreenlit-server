require('dotenv').config()

//set to production to locally migrate to live server
//process.env.NODE_ENV = 'production'; 

module.exports = {
  development: {
    cor_origin: process.env.DEV_CORS,
    secret: process.env.SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
  },
  test: {
    cor_origin: process.env.DEV_CORS,
    secret: process.env.SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
  },
  production: {
    cor_origin: process.env.CORS,
    secret: process.env.SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
  },
}