const express = require('express');

const upload = require('./upload');

const imagesUpload = upload.fields([{
        name: 'licenseFile',
        maxCount: 1
    }
])

module.exports = (app) => {
  const licenses = require("../../controllers/license.controller");

  var router = express.Router();


  // Add a new token
  router.post("/add-token",imagesUpload, licenses.addToken);

  // Get all tokens
  router.get("/get-tokens-licenses", licenses.getTokensAndLicenses);

  // Add a new license
  router.post("/add-license",imagesUpload, licenses.addLicense);


  router.post("/add-license-info", imagesUpload, licenses.addLicenseInfo);


  router.post("/add-staking-tier", imagesUpload, licenses.addStakingTier);

  router.get("/get-staking-tier", licenses.getStakingTier);

  router.put("/set-staking-tier-status", licenses.setStakingTierStatus);

  router.post("/stake-tokens", licenses.stakeTokens);

  router.post("/unstake-tokens", licenses.unStakeTokens);

  router.post("/sign-license", licenses.signLicense);
  
  
  

  app.use('/api/license', router);
  
}