const db = require( '../database/models' );
const Token =  db['token'];
const License =  db['license'];
const LicenseIntro =  db['licenseIntro'];
const StakedToken =  db['stakedToken'];
const SignedLicense =  db['signedLicense'];
const StakingTier =  db['stakingTier'];
const Project =  db['project'];
const PinataUtils = require('./../routes/utils/pinata')
const uuidParse = require('uuid-parse');

exports.addToken = async ( req, res ) => 
{
    const spaceId = req.body.spaceId;
    const tokenId = req.body.tokenId;
    const tokenName = req.body.tokenName;
    const network = req.body.network;
    const contractAddress = req.body.contractAddress;
    const description = req.body.description;
    // Add a new token
    const token = {
        spaceId: spaceId,
        tid: tokenId,
        tokenName: tokenName,
        network: network,
        tokenContractAddress: contractAddress,
        tokenDescription: description,
    }
     await Token.create(token)
    .then( data => { 
        res.send({
            data,
            status: true
         }); 
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while adding the token"})})
}

exports.editToken = async ( req, res ) => 
{
    const id = req.body.id;
    const tokenId = req.body.tokenId;
    const tokenName = req.body.tokenName;
    const network = req.body.network;
    const contractAddress = req.body.contractAddress;
    const description = req.body.description;
    // update the token
    const token = {
        tokenId: tokenId,
        tokenName: tokenName,
        network: network,
        tokenContractAddress: contractAddress,
        tokenDescription: description,
    }
    await Token.update(token, {where: {id: id}}).then(num=>{
        if(num == 1){
          res.send({
            status: true
          }); 
        }else{
            res.send({
                status: false
              });   
        }
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while updating the token"})})
}

exports.deleteToken = async ( req, res ) => 
{
    const id = req.body.params.id;
    const spaceId = req.body.params.spaceId;
    const condition = 
    {
       id: id,
       spaceId: spaceId
    };
    await Token.destroy({where: condition})
    .then(num=>{
        if(num == 1){
          res.send({
            status: true
          }); 
        }else{
            res.send({
                status: false
              });   
        }
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while deleting the token"})})
}

exports.getTokensAndLicenses = async(req, res) => 
{
       let tokensLicenses = {}
        const spaceId = req.query.spaceId;
        await Token.findAll({where: {spaceId: spaceId}, order: [
            ["id", "DESC"]
          ], include: ['tokentiers']})
        .then(async data => {
         const tokensData = JSON.parse(JSON.stringify(data)); 
         tokensLicenses.tokens = tokensData;
           await License.findAll({where: {spaceId: spaceId}, order: [
            ["id", "DESC"],
          ], include: ['licensetiers']})
          .then(data => {
           const licenseData = JSON.parse(JSON.stringify(data)); 
            tokensLicenses.licenses = licenseData;
          })
          .catch(err => console.log(err)) 
          
          await LicenseIntro.findOne({where: {spaceId: spaceId}})
          .then(data => {
           const licenseIntro = JSON.parse(JSON.stringify(data)); 
            tokensLicenses.licenseIntro = licenseIntro;
          })
          .catch(err => console.log(err)) 


           return res.send(tokensLicenses);
        })
        .catch(err => console.log(err))
}

exports.addLicense = async ( req, res ) => 
{
    const licenseFileUrl = await PinataUtils.saveImagePinata(req.files['licenseFile'][0], 'licenseFile')
    
    const spaceId = req.body.spaceId;
    const licenseName = req.body.licenseName;
    const licenseSummary = req.body.licenseSummary;
    const licenseFile = licenseFileUrl;
    const licenseFileName = req.body.licenseFileName;
    // Add a new license
    const license = {
        spaceId: spaceId,
        licenseName: licenseName,
        licenseSummary: licenseSummary,
        licenseFile: licenseFile,
        licenseFileName: licenseFileName
    }
     await License.create(license)
    .then( data => { 
        res.send({
            data,
            status: true
         }); 
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while adding the license"})})
}

exports.editLicense = async ( req, res ) => 
{

    let licenseFileUrl;
    if(req.files['licenseFile']){
        licenseFileUrl = await PinataUtils.saveImagePinata(req.files['licenseFile'][0], 'licenseFile')
    }
    const id = req.body.id;
    const licenseName = req.body.licenseName;
    const licenseSummary = req.body.licenseSummary;
    const licenseFile = licenseFileUrl;
    const licenseFileName = req.body.licenseFileName;
   
    let license;
    if(!req.files['licenseFile']){
        license  = {
            licenseName: licenseName,
            licenseSummary: licenseSummary,
        }
    }else{
        license  = {
            licenseName: licenseName,
            licenseSummary: licenseSummary,
            licenseFile: licenseFile,
            licenseFileName: licenseFileName
        }  
    }
     await License.update(license, {
        where:{ id: id}
    })
    .then( num => { 
        if(num == 1){
            res.send({
              status: true
            }); 
          }else{
              res.send({
                  status: false
                });   
          }
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while updating the license"})})
}

exports.deleteLicense = async ( req, res ) => 
{
    const id = req.body.params.id;
    const spaceId = req.body.params.spaceId;
    const condition = 
    {
       id: id,
       spaceId: spaceId
    };
    await License.destroy({where: condition})
    .then(num=>{
        if(num == 1){
          res.send({
            status: true
          }); 
        }else{
            res.send({
                status: false
              });   
        }
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while deleting the license"})})
}



exports.getLicense = async(req, res) => 
{
    const licenseId = req.query.licenseId;
        await License.findByPk(licenseId)
        .then(data => {
         const license = JSON.parse(JSON.stringify(data));     
          return res.json(license);
        })
        .catch(err => console.log(err)) 
}

exports.addLicenseInfo = async ( req, res ) => 
{
    const spaceId = req.body.spaceId;
    const licenseIntro = req.body.licenseIntro;

    const licenseIntroData = {
        spaceId: spaceId,
        intro: licenseIntro,
    }
      await LicenseIntro.findOne({where: {spaceId: spaceId}}).then(async data => {
        if(data){
            const licenseIntroData = {
                intro: licenseIntro,
            }
            await LicenseIntro.update(licenseIntroData, {where: {spaceId: spaceId}}).then(num=>{
                if(num == 1){
                  res.send({
                    status: true
                  }); 
                }else{
                    res.send({
                        status: false
                      });   
                }
            })
        }else{
            await LicenseIntro.create(licenseIntroData)
            .then( data => { 
                res.send({
                    data,
                    status: true
                 }); 
            })
            .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while saving the license intro"})})
        }
      }) 
    
}


exports.addStakingTier  = async ( req, res ) =>  {
    const spaceId = req.body.spaceId;
    const requiredToken = req.body.requiredToken
    const licenseId = req.body.licenseId
    const tierName= req.body.tierName;
    const tid = req.body.tokenId;
    const tierSummary= req.body.tierSummary
    const requiredStake= parseInt(req.body.requiredStake)
    const projectCategory= req.body.projectCategory
    const projectBudgetRange= req.body.projectBudgetRange
    const royalty= req.body.royalty;
    const adminApproval= req.body.adminApproval==='true'?true:false;
    // Add a new staking tier
    const stakingTier = {
        spaceId: spaceId,
        tierName: tierName,
        tid: tid,
        tierSummary: tierSummary,
        tokenId: requiredToken,
        licenseId: licenseId,
        requiredStake: requiredStake,
        projectCategory: projectCategory,
        projectBudgetRange: projectBudgetRange,
        royalty: royalty,
        adminApproval: adminApproval
    }
     await StakingTier.create(stakingTier)
    .then( data => { 
        res.send({
            data,
            status: true
         }); 
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while adding the staking tier"})})
}

exports.editStakingTier  = async ( req, res ) =>  {
    const id = req.body.id;
    const requiredToken = req.body.requiredToken
    const licenseId = req.body.licenseId
    const tierName= req.body.tierName;
    const tid= req.body.tokenId;
    const tierSummary= req.body.tierSummary
    const requiredStake= parseInt(req.body.requiredStake)
    const projectCategory= req.body.projectCategory
    const projectBudgetRange= req.body.projectBudgetRange
    const royalty= req.body.royalty;
    const adminApproval= req.body.adminApproval==='true'?true:false;
    // edit staking tier
    const stakingTier = {
        tierName: tierName,
        tid: tid,
        tierSummary: tierSummary,
        tokenId: requiredToken,
        licenseId: licenseId,
        requiredStake: requiredStake,
        projectCategory: projectCategory,
        projectBudgetRange: projectBudgetRange,
        royalty: royalty,
        adminApproval: adminApproval
    }
     await StakingTier.update(stakingTier, {where: {id: id}})
    .then( num => { 
        if(num == 1){
            res.send({
              status: true
            }); 
          }else{
              res.send({
                  status: false
                });   
          }
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while updating the staking tier"})})
}

exports.deleteStakingTier = async ( req, res ) => 
{
    const id = req.body.params.id;
    const spaceId = req.body.params.spaceId;
    const condition = 
    {
       id: id,
       spaceId: spaceId
    };
    await StakingTier.destroy({where: condition})
    .then(num=>{
        if(num == 1){
          res.send({
            status: true
          }); 
        }else{
            res.send({
                status: false
              });   
        }
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while deleting the staking tier"})})
}


exports.getStakingTier = async(req, res) => 
{
        const spaceId = req.query.spaceId;
        await StakingTier.findAll({where: {spaceId: spaceId}, order: [
            ["id", "DESC"],
          ], include: ['token', 'license', 'projects']})
        .then(data => {
         const stakingTier = JSON.parse(JSON.stringify(data)); 
           return res.json(stakingTier);
        })
        .catch(err => console.log(err))
}

exports.setStakingTierStatus = async(req, res) => 
{
        console.log(req.body.params.id)
        const id = req.body.params.id;
        const spaceId = req.body.params.spaceId;
        const status = req.body.params.status;
        const statusData = {status: status}
        await StakingTier.update(statusData, {where: {id: id, spaceId: spaceId}})
        .then(num => {
            if(num == 1){
               return res.json({status: true})
            }else{
                return res.json({status: false})
            }
        })
        .catch(err => console.log(err))
}

exports.signLicense = async (req, res) => { 

    const pid = req.body.pid;
    const address = req.body.address;
    const sign = req.body.sign;
    const signee = req.body.signee;
    const licenseFile = req.body.licenseFile;
    
    const signedlicense = 
     {
        pid: pid,
        address: address,
        sign: sign,
        signee: signee,
        licenseFile: licenseFile,
     };
     
     try{
        await SignedLicense.create(signedlicense)
        .then( async data =>  { 
            await Project.update({status: 'in-progress',signed: true}, {where: {id: pid}})
            res.send({
                status: true
             }); 
        })
        .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while saving the signed license"})})
     }catch(err){
        console.log('Error occured!')
     }
    
}

exports.stakeTokens = async (req, res) => { 
    
    const pid = req.body.pid;
    const address = req.body.address;
    const tokens = req.body.tokens;
    
    const stakedTokens = 
     {
        pid: pid,
        address: address,
        tokens: tokens,
     };
     
     try{
        await StakedToken.create(stakedTokens)
        .then( async data =>  { 
            await Project.update({staked: true}, {where: {id: pid}})
            res.send({
                status: true
             }); 
        })
        .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while saving the staked tokens"})})
     }catch(err){
        console.log('Error occured!')
     }
    
}


exports.unStakeTokens = async (req, res) => { 
    
    const pid = req.body.pid;
    const stakedTokens = 
     {
        pid: pid,
     };
     
     try{
        await StakedToken.destroy({
            where: stakedTokens
        })
        .then(
            async num => {
                if(num == 1){
                    await Project.update({staked: false}, {where: {id: pid}})
                    res.send({
                        status: true
                     }); 
                }else{
                    res.send({
                        status: false
                    });   
                }
            })
        .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while unstaking the staked tokens"})})
     }catch(err){
        console.log('Error occured!')
     }
    
}




