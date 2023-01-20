const express = require('express');

const upload = require('./upload');

const auth = require('../utils/auth');


const imagesUpload = upload.fields([{
        name: 'logoImg',
        maxCount: 1
    },
    {
        name: 'bannerImg',
        maxCount: 1
    },
    {
        name: 'featuredImg',
        maxCount: 1
    }
])

module.exports = (app) => {
  const users = require("../../controllers/user.controller");

  var router = express.Router();


  // Create a new User
  router.post("/create-login-user", imagesUpload, users.createAndLoginUser);

  // delete user access token
  router.post("/delete-user-accessToken",imagesUpload, users.deleteUserAccessToken);
  

  
  app.use('/api/users', router);
  
}