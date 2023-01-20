const express = require('express');

module.exports = (app) => {
  const jwt = require("../../controllers/jwt.controller");

  var router = express.Router();


  // create a new refresh token
  router.post("/refresh-token", jwt.refreshToken);

 
  app.use('/api/jwt', router);
  
}