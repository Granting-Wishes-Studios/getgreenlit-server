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
  router.post("/create",imagesUpload, users.create);

  
  // Create a new User
  router.get("/get-user", users.getUser);
  
  
  app.use('/api/users', router);
  
}