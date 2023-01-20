const db = require( '../database/models' );
const User =  db['user'];
const AccessToken =  db['accessToken'];

const jwt = require("../controllers/jwt.controller");

exports.createAndLoginUser = async ( req, res ) => 
{
    const address = req.body.address;
    const email = req.body.email;
    const name = req.body.name;
    const profileImage = req.body.profileImage;

    // check if user exist
    const condition = {address: address};
   
    await User.findOne({where: condition, raw: true})
    .then(async data => {
        
        if(data != null){
            // user exist  
            // Generate an access token
            const userObj = {
                userId: data.id, 
                address: data.address, 
                status: true, 
                email: data.email, 
                name: data.name, 
                profileImage: data.profileImage 
            }
            const accessToken = jwt.generateAccessToken(userObj);
            const refreshToken = jwt.generateRefreshToken(userObj);

            await AccessToken.create({
               token:  refreshToken
            })
            res.json({
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        }else{
            // user does not exist 
            // Create a new user
            const user = {
                address: address,
                email: email,
                userToken: "",
                name: name,
                profileImage: profileImage
            }
                await User.create(user)
                .then( async data => { 
                              
                const userObj = {
                    userId: data.id, 
                    address: data.address, 
                    status: true, 
                    email: data.email, 
                    name: data.name, 
                    profileImage: data.profileImage 
                }
                const accessToken = jwt.generateAccessToken(userObj);
                const refreshToken = jwt.generateRefreshToken(userObj)

                await AccessToken.create({
                    token:  refreshToken
                 })
                res.json({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }) 
                })
                .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while creating the user"})})
        }
     }).catch(err => {
        res.status(500).send('Unable to complete request.')
    })  
}

exports.deleteUserAccessToken = async ( req, res ) => 
{
    const token = req.body.token;
    const condition = {token: token};
    await AccessToken.destroy({where: condition})
   .then(rs => {
    if(rs == 1){
        res.send({
            status: true
        });
    }else{
        res.send({
            status: false
        }); 
    }
   }).catch(err => {
      res.status(500).send({status: false})}
    )   
}
