const express = require('express');
const auth = require('../utils/auth');

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
  router.post("/add-token",auth.verifyAuth, imagesUpload, licenses.addToken);
   // Edit token
  router.post("/edit-token",auth.verifyAuth, imagesUpload, licenses.editToken);
   // Delete token
   router.put("/delete-token",auth.verifyAuth, licenses.deleteToken);

  // Get all tokens
  router.get("/get-tokens-licenses", auth.verifyAuth, licenses.getTokensAndLicenses);

  // Add a new license
  router.post("/add-license",auth.verifyAuth, imagesUpload, licenses.addLicense);
   // Update license
   router.post("/edit-license",auth.verifyAuth, imagesUpload, licenses.editLicense);
  // Delete license
  router.put("/delete-license",auth.verifyAuth, licenses.deleteLicense);


  router.post("/add-license-info", auth.verifyAuth, imagesUpload, licenses.addLicenseInfo);

  router.get("/get-license", auth.verifyAuth, licenses.getLicense);

  router.post("/add-staking-tier", auth.verifyAuth, imagesUpload, licenses.addStakingTier);

  router.post("/edit-staking-tier", auth.verifyAuth, imagesUpload, licenses.editStakingTier);

  // Delete staking tier
  router.put("/delete-staking-tier",auth.verifyAuth, licenses.deleteStakingTier);

  router.get("/get-staking-tier", auth.verifyAuth, licenses.getStakingTier);

  router.put("/set-staking-tier-status", auth.verifyAuth, licenses.setStakingTierStatus);

  router.post("/stake-tokens", auth.verifyAuth, licenses.stakeTokens);

  router.post("/unstake-tokens", auth.verifyAuth, licenses.unStakeTokens);

  router.post("/sign-license", auth.verifyAuth, licenses.signLicense);
  
  
  app.use('/api/license', router);
  
}