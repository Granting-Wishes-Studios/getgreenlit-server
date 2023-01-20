const db = require( '../database/models' );

const PinataUtils = require('./../routes/utils/pinata');
const Project =  db['project'];
const Role =  db['role'];
const License =  db['license'];
const Token =  db['token'];

exports.create = async  ( req, res ) => 
{
    // Validate content
    if(!req.body.projectTitle){
        res.status(400).send({
            message: 'Content can not be empty'
        })
        return;
    }
    const userId = req.body.userId;

    const bannerIpfsUrl = await PinataUtils.saveImagePinata(req.files['bannerImg'][0], 'bannerImg')

    const featuredIpfsUrl = await PinataUtils.saveImagePinata(req.files['featuredImg'][0], 'featuredImg')

    const bannerImg = bannerIpfsUrl;
    const featuredImg = featuredIpfsUrl;

     const project = {
        userId: userId,
        spaceId: req.body.spaceId,
        stakingTierId: req.body.tid,
        address: req.body.address,
        projectTitle: req.body.projectTitle,
        projectDescription: req.body.projectDescription,
        projectEmail: req.body.projectEmail,
        projectCategory: req.body.projectCategory,
        projectAnticipatedRelease: req.body.projectAnticipatedRelease,
        twitter: req.body.twitter,
        discord: req.body.discord,
        bannerImg: bannerImg,
        featuredImg: featuredImg,
        status: req.body.adminApproval == 'true'?'pending':'approved'
     };
      
      // Save Project in the database
     try{
      await Project.create(project)
        .then(data => {
            const role = {
                creator: 'owner',
                role: 'PROJECT_ADMIN',
                mid: data.id,
                address: data.address,
                status: true
            }
             Role.create(role);
        res.send({
            data,
            status: true
         });
      })
      .catch(err => {
        res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Project."
        });
      });
    }catch(e){
        throw e
    }
}

exports.update = async  ( req, res ) => 
{
    let bannerIpfsUrl, featuredIpfsUrl
   
    const pid = req.body.pid;

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

    const bannerImg = bannerIpfsUrl;
    const featuredImg = featuredIpfsUrl;
    const status = req.body.status;
    let project = req.body;

     if(status == 'released'){
         project = {
            projectTitle: req.body.projectTitle,
            projectDescription: req.body.projectDescription,
            projectEmail: req.body.projectEmail,
            projectRelease: req.body.projectRelease,
            projectAction: req.body.projectAction,
            projectActionLink: req.body.projectActionLink,
            twitter: req.body.twitter,
            discord: req.body.discord,
            bannerImg: bannerImg,
            featuredImg: featuredImg,
         };
     }else{
         project = {
            projectTitle: req.body.projectTitle,
            projectDescription: req.body.projectDescription,
            projectEmail: req.body.projectEmail,
            projectAnticipatedRelease: req.body.projectAnticipatedRelease,
            projectCategory: req.body.projectCategory,
            twitter: req.body.twitter,
            discord: req.body.discord,
            bannerImg: bannerImg,
            featuredImg: featuredImg,
         };
     }   
      // Update Project in the database
     try{
      await Project.update(project, {
        where:{ id: pid}
    }).then( num => {
        if(num == 1){
            res.send({
                message: "Project was updated succcessfully.",
                status: true
            });
        }else{
            res.send({
                message: `Can not update Project with id = ${pid}. Maybe project was not found or req.body is empty`,
                status: false
            });
        }   
    }).catch(err => {
        res.status(500).send({
        message:
          err.message || "Some errors occurred while updating the Project."
        });
      });
 }catch(e){
        throw e
    }
}

exports.findAll = async(req, res) => 
{
    const spaceId = req.query.spaceId;

        await Project.findAll({ where: {spaceId: spaceId},
        order: [
            ["id", "DESC"],
          ] })
        .then(data => {
         const projects = JSON.parse(JSON.stringify(data));      
          return res.json(projects);
        })
        .catch(err => console.log(err)) 
}

exports.findOne = async(req, res) => 
{
    const spaceId = req.query.spaceId;
    const projectId = req.query.projectId;
        await Project.findOne({ where: {id: projectId, spaceId: spaceId}, include: ['stakedtokens', 'tier']})
        .then(async data => {
         const project = JSON.parse(JSON.stringify(data));  
         await License.findByPk(project.tier.licenseId).then( async data => {
               project.license = data;
               await Token.findByPk(project.tier.tokenId).then(data => {
                 project.token = data;
               })
         });
          return res.json(project);
        })
        .catch(err => console.log(err)) 
}

exports.isProjectAdmin = async(req, res) => 
{
        
        const address = req.query.address ? req.query.address : null;
        const projectId = req.query.projectId;   
            await Role.findOne({where: {address: address, mid: projectId, role: 'PROJECT_ADMIN'}})
            .then(data => {   
                console.log(data)       
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

exports.setProjectStatus = async (req, res) => { 
    const sid = req.body.sid;
    const pid = req.body.pid;
    const statusNote = req.body.statusNote ? req.body.statusNote : null;
    const status = req.body.status;
    const authored = req.body.authored;
    const project = 
     {
        status: status,
        authored: authored,
        statusNote: statusNote,
        updatedAt: new Date()
     };
     
     if(status == 'delete'){
        try{
       
            Project.destroy({
               where:{ id: pid, spaceId: sid}
           }).then( num => {
               if(num == 1){
                   res.send({
                       status: true
                   });
               }else{
                   res.send({
                       status: false
                   });   
               }
           }).catch(err => {
               res.status(500).send({
                   message: "Error deleting project with id " + pid
               })
           });
         }catch(err){
          
         }
     }else{
        try{
       
            Project.update(project, {
               where:{ id: pid, spaceId: sid}
           }).then( num => {
               if(num == 1){
                   res.send({
                       status: true
                   });
               }else{
                   res.send({
                       status: false
                   });   
               }
           }).catch(err => {
               res.status(500).send({
                   message: "Error updating project with id " + pid
               })
           });
         }catch(err){
          
         } 
     }
    
}