require('dotenv').config()

//set to production to locally migrate to live server
//process.env.NODE_ENV = 'production'; 

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    cor_origin: process.env.DEV_CORS,
    secret: process.env.SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    cor_origin: process.env.DEV_CORS,
    secret: process.env.SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    pool: {
      max: 3,
      min: 1,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        // Ref.: https://github.com/brianc/node-postgres/issues/2009
        rejectUnauthorized: false,
      },
      keepAlive: true,        
    },      
    ssl: true,
    define: {
      timestamps: false,
    },
    cor_origin: process.env.CORS,
    secret: process.env.SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
  },
}