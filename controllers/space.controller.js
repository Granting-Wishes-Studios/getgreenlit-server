const db = require( '../database/models' );

const PinataUtils = require('./../routes/utils/pinata')
const Space =  db['space'];
const Membership =  db['membership'];
const Role =  db['role'];

exports.create = async  ( req, res ) => 
{
    // Validate content
    if(!req.body.title){
        res.status(400).send({
            message: 'Content can not be empty'
        })
        return;
    }
    const userId = req.body.userId;

    const logoIpfsUrl = await PinataUtils.saveImagePinata(req.files['logoImg'][0], 'logoImg')
    
    const bannerIpfsUrl = await PinataUtils.saveImagePinata(req.files['bannerImg'][0], 'bannerImg')

    const featuredIpfsUrl = await PinataUtils.saveImagePinata(req.files['featuredImg'][0], 'featuredImg')

    const logoImg = logoIpfsUrl;
    const bannerImg = bannerIpfsUrl;
    const featuredImg = featuredIpfsUrl;
   

     const space = {
        userId: userId,
        address: req.body.address,
        title: req.body.title,
        legalCustodian: req.body.legalCustodian,
        ipDescription: req.body.ipDescription,
        officialWebsite: req.body.officialWebsite,
        twitter: req.body.twitter,
        discord: req.body.discord,
        hideFromHomepage: req.body.hideFromHomepage,
        logoImg: logoImg,
        bannerImg: bannerImg,
        featuredImg: featuredImg,
        resources: req.body.resources
     };
      
      // Save Space in the database
     try{
      await Space.create(space)
        .then(data => {
        const role = {
            creator: 'owner',
            role: 'SPACE_ADMIN',
            mid: data.id,
            address: data.address,
            status: true
        }
         Role.create(role);
        
         const membership = {
            userId: userId,
            spaceId: data.id
        }
    
        Membership.create(membership);
         
        res.send({
            data,
            status: true
         });
      })
      .catch(err => {
        res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Space."
        });
      });
    }catch(e){
        throw e
    }
}

exports.findAll = async(req, res) => 
{
    const userId = req.query.userId?req.query.userId:null;

        await Space.findAll({ include: ["members"],
        order: [
            ["id", "DESC"],
          ] })
        .then(data => {
         const spaces = JSON.parse(JSON.stringify(data));
            spaces.forEach(space => {               
               // for space members
               //space.isMember = false  
              const members = space.members
              members.map(member => {
                if(member.userId == userId){
                    space.isMember = true 
                }
              })
                     
            });         
          return res.json(spaces);
        })
        .catch(err => console.log(err)) 
}

exports.findOne = async(req, res) => 
{  
        const spaceId = req.query.spaceId;
        await Space.findOne({ where: {id: spaceId}, include: ['tiers', 'licenseIntro']})
        .then(async data => {
            const space = JSON.parse(JSON.stringify(data));   
           await  Role.findAll({where: {mid: spaceId}}).then(data => {
                if(data){
                    space.roles = JSON.parse(JSON.stringify(data));
                }
            })

            return res.json(space);
         })
        .catch(err => console.log(err)) 
}

exports.role = async(req, res) => 
{  
        const spaceId = req.query.spaceId;
        const address = req.query.address?req.query.address:null;
        await Space.findOne({ where: {id: spaceId}})
        .then(async data => {
            const space = JSON.parse(JSON.stringify(data));          
                await Role.findOne({where: {mid: spaceId, address: address, role: 'SPACE_ADMIN', status: true}}).then(res => {           
                    if(res){
                        space.role = res.role
                    }else{
                        space.role = '' 
                    }
                  })
             
            return res.json(space);
         })
        .catch(err => console.log(err)) 
}


exports.removeRole = async(req, res) => 
{  
        const roleId = req.query.roleId;
        await Role.destroy({
           where:{'id': roleId }
       })
        .then(data => {
         res.send({
            status: true
         });
      })
      .catch(err => {
        res.status(500).send({
        message:
          err.message || "Some error occurred while leaving the Space."
        });
      });
}



exports.join = async(req, res) => {
 
    const spaceId = req.query.spaceId;
    const userId = req.query.userId;

    let spaceData;
    await Space.findOne({ where: {id: spaceId}})
        .then(async data => {
            if(data){
                spaceData = JSON.parse(JSON.stringify(data)); 
            }
        }).catch(err => console.log(err)) 

    const membership = {
        userId: userId,
        spaceId: spaceId
    }

    // check if user already joined
    let isJoined = false;
     await Membership.findOne({
        where: {'spaceId': spaceId, 'userId': userId},
        raw: true
     }).then(data => {
        if(data != null){
            isJoined = true;
            res.send({
                status: true,
                space: spaceData
             });
        }
     })

     if(!isJoined){
        await Membership.create(membership)
        .then(data => {
         res.send({
            status: true,
            space: spaceData
         });
      })
      .catch(err => {
        res.status(500).send({
        message:
          err.message || "Some error occurred while joining the Space."
        });
      });
     }
     
}

exports.leave = async(req, res) => {
 
    const spaceId = req.query.spaceId;
    const userId = req.query.userId;
    const condition = {'userId': userId, 'spaceId': spaceId };
     await Membership.destroy({
        where:{ userId: userId, spaceId: spaceId}
    })
     .then(data => {
      res.send({
         status: true
      });
   })
   .catch(err => {
     res.status(500).send({
     message:
       err.message || "Some error occurred while leaving the Space."
     });
   });
}


exports.getMember = async(req, res) => 
{
        const userId = req.query.userId?req.query.userId:null;
        let membersList = [];
        await Space.findAll({ include: ["members"] })
        .then(data => {
         const spaces = JSON.parse(JSON.stringify(data));
            spaces.forEach(space => {               
               // for space members
               //space.isMember = false  
              const members = space.members
              if(userId){
                members.map(member => {
                    if(member.userId == userId){
                        const item = {
                            linkTo: space.id,
                            linkTitle: space.title,
                            img: space.logoImg
                        }
                        membersList.push(item)
                    }
                  })
              }
                     
            });         
            res.json(membersList);
        })
        .catch(err => console.log(err)) 
}


exports.isMember = async(req, res) => 
{
        
        const userId = req.query.userId?req.query.userId:null;
        const spaceId = req.query.spaceId;
            await Membership.findOne({where: {userId: userId, spaceId: spaceId}})
            .then(data => {         
             if(data){
                res.json(
                    {
                        status: true
                    }
                );
            } else{
                res.json(
                    {
                        status: false
                    }
                );
            } 
                
            })
            .catch(err => console.log(err)) 
       
}

exports.isSpaceAdmin = async(req, res) => 
{
        
        const address = req.query.address?req.query.address:null;
        const spaceId = req.query.spaceId;
        await Role.findOne({where: {address: address, mid: spaceId, role: 'SPACE_ADMIN'}})
        .then(data => {         
         if(data){
            res.json(
                {
                    status: true
                }
            );
        } else{
            res.json(
                {
                    status: false
                }
            );
        } 
            
        })
        .catch(err => console.log(err)) 
}



exports.update = async (req, res) => {

    let logoIpfsUrl, bannerIpfsUrl, featuredIpfsUrl
    const spaceId = req.body.spaceId;
   
    if(req.files['logoImg']){
        logoIpfsUrl = await PinataUtils.saveImagePinata(req.files['logoImg'][0], 'logoImg')
    }else{
        logoIpfsUrl = req.body.logoUrl 
    }

    if(req.files['bannerImg']){
         bannerIpfsUrl = await PinataUtils.saveImagePinata(req.files['bannerImg'][0], 'bannerImg')
     }else{
        bannerIpfsUrl = req.body.bannerUrl
    }
      
    if(req.files['featuredImg']){
         featuredIpfsUrl = await PinataUtils.saveImagePinata(req.files['featuredImg'][0], 'featuredImg')
     }else{
        featuredIpfsUrl = req.body.featuredUrl 
     }
    
    const logoImg = logoIpfsUrl;
    const bannerImg = bannerIpfsUrl;
    const featuredImg = featuredIpfsUrl;
 
    const space = 
     {
        title: req.body.title,
        legalCustodian: req.body.legalCustodian,
        ipDescription: req.body.ipDescription,
        officialWebsite: req.body.officialWebsite,
        twitter: req.body.twitter,
        discord: req.body.discord,
        hideFromHomepage: req.body.hideFromHomepage,
        logoImg: logoImg,
        bannerImg: bannerImg,
        featuredImg: featuredImg,
        resources: req.body.resources,
        updatedAt: new Date()
     };
     
     try{
     Space.update(space, {
        where:{ id: spaceId}
    }).then( num => {
        if(num == 1){

            const adminsData = JSON.parse(req.body.admins);
             if(adminsData.length > 0){
                adminsData.map(item => {
                    Role.findOne({where: {address: item.address}}).then(async data => {
                        if(!data){
                            const role = {
                                creator: null,
                                role: 'SPACE_ADMIN',
                                mid: spaceId,
                                address: item.address,
                                status: true
                            }
                             await Role.create(role);
                        }
                    })
                  
                })
             }

            res.send({
                id: spaceId,
                title: space.title,
                logoImg: space.logoImg,
                bannerImg: space.bannerImg,
                message: "Space was updated succcessfully.",
                status: true
            });
        }else{
            res.send({
               message: `Can not update Space with id = ${spaceId}. Maybe space was not found or req.body is empty` 
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating space with id " + spaceId
        })
    });
  }catch(err){
   
  }
}

exports.getSpaceIntro = async(req, res) => 
{
        const spaceId = req.query.spaceId;
        await Space.findOne({ where: {id: spaceId}})
        .then(data => {
         const space = JSON.parse(JSON.stringify(data));                  
            res.json(space);
        })
        .catch(err => console.log(err)) 
}