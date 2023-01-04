const express = require('express');
const upload = require('./upload');

const auth = require('../utils/auth');
const {requireAuth, requireAdmin} = require('./route_middleware');


const imagesUpload = upload.fields([
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
  const project = require("../../controllers/project.controller");

  var router = express.Router();

  // Create a new Project
  router.post("/create" ,imagesUpload, project.create);
// Edit  Project
  router.post("/edit" ,imagesUpload, project.update);

// get all Project list
   router.get("/", project.findAll);

   router.get("/project", project.findOne);

   router.get("/is-admin", project.isProjectAdmin);

   router.post("/set-project-status", project.setProjectStatus);
   
  
  
   app.use('/api/projects', router);
}