const db = require( '../database/models' );
const project = require('../database/models/project');
const LicenseToken =  db['licenseToken'];
const License =  db['license'];
const SpaceLicense =  db['spaceLicense'];
const StakedToken =  db['stakedToken'];
const SignedLicense =  db['signedLicense'];
const StakingTier =  db['stakingTier'];
const Project =  db['project'];
const PinataUtils = require('./../routes/utils/pinata')

const Op = db.Sequelize.Op;

exports.addToken = async ( req, res ) => 
{
    const spaceId = req.body.spaceId;
    const tokenName = req.body.tokenName;
    const network = req.body.network;
    const contractAddress = req.body.contractAddress;
    const description = req.body.description;
    // Add a new token
    const token = {
        spaceId: spaceId,
        tokenName: tokenName,
        network: network,
        tokenContractAddress: contractAddress,
        tokenDescription: description,
    }
     await LicenseToken.create(token)
    .then( data => { 
        res.send({
            data,
            status: true
         }); 
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while adding the token"})})
}

exports.getTokensAndLicenses = async(req, res) => 
{
       let tokensLicenses = {}
        const spaceId = req.query.spaceId;
        await LicenseToken.findAll({where: {spaceId: spaceId}, order: [
            ["id", "DESC"],
          ]})
        .then(async data => {
         const tokensData = JSON.parse(JSON.stringify(data)); 
         tokensLicenses.tokens = tokensData;
           await License.findAll({where: {spaceId: spaceId}, order: [
            ["id", "DESC"],
          ]})
          .then(data => {
           const licenseData = JSON.parse(JSON.stringify(data)); 
            tokensLicenses.licenses = licenseData;
          })
          .catch(err => console.log(err)) 
          
          await SpaceLicense.findOne({where: {spaceId: spaceId}})
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

exports.addLicenseInfo = async ( req, res ) => 
{
    const spaceId = req.body.spaceId;
    const licenseIntro = req.body.licenseIntro;

    const licenseIntroData = {
        spaceId: spaceId,
        intro: licenseIntro,
    }
      await SpaceLicense.findOne({where: {spaceId: spaceId}}).then(async data => {
        if(data){
            const licenseIntroData = {
                intro: licenseIntro,
            }
            await SpaceLicense.update(licenseIntroData, {where: {spaceId: spaceId}}).then(num=>{
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
            await SpaceLicense.create(licenseIntroData)
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
    const tierName= req.body.tierName;
    const tierSummary= req.body.tierSummary
    const requiredToken= req.body.requiredToken
    const requiredStake= parseInt(req.body.requiredStake)
    const tokenId= req.body.tokenId
    const licenseToBeGranted= req.body.licenseToBeGranted
    const projectCategory= req.body.projectCategory
    const projectBudgetRange= req.body.projectBudgetRange
    const royalty= req.body.royalty;
    const adminApproval= req.body.adminApproval;
    // Add a new staking tier
    const stakingTier = {
        spaceId: spaceId,
        tierName: tierName,
        tierSummary: tierSummary,
        requiredToken: requiredToken,
        requiredStake: requiredStake,
        tokenId: tokenId,
        licenseToBeGranted: licenseToBeGranted,
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

exports.getStakingTier = async(req, res) => 
{
        const spaceId = req.query.spaceId;
        await StakingTier.findAll({where: {spaceId: spaceId}, order: [
            ["id", "DESC"],
          ]})
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




