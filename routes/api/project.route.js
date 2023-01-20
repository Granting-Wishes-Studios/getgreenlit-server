const express = require('express');
const upload = require('./upload');

const auth = require('../utils/auth');


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
  router.post("/create", auth.verifyAuth, imagesUpload, project.create);
// Edit  Project
  router.post("/edit" ,auth.verifyAuth, imagesUpload, project.update);

// get all Project list
   router.get("/", project.findAll);

   router.get("/project", project.findOne);

   router.get("/is-admin", project.isProjectAdmin);

   router.post("/set-project-status", auth.verifyAuth, project.setProjectStatus);


   app.use('/api/projects', router);
}