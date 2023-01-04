const express = require('express');
const upload = require('./upload');

const auth = require('../utils/auth');
const {requireAuth, requireAdmin} = require('./route_middleware');


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
  const spaces = require("../../controllers/space.controller");

  var router = express.Router();

  // Create a new Space
  router.post("/create" ,imagesUpload, spaces.create);
  // Create a new Space
  router.post("/update" ,imagesUpload, spaces.update);

  // get all Space list
  router.get("/", imagesUpload, spaces.findAll);
  // get a single space
  router.get("/space", spaces.findOne);
  // get a single space role for a user
  router.get("/role", spaces.role);
   // remove a space admin role
   router.get("/remove-role", spaces.removeRole);
  
  // Join a new Space
  router.get("/join" , spaces.join);
  
  // Leave a new Space
  router.get("/leave" , spaces.leave);

  // Get Spaces  for a member
  router.get("/get-members" , spaces.getMember);

  router.get("/is-member" , spaces.isMember);

  router.get("/is-admin" , spaces.isSpaceAdmin);


  // Get Spaces  intro text
  router.get("/get-intro" , spaces.getSpaceIntro);
  
 
  app.use('/api/spaces', router);
  
}