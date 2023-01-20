const jwt = require('jsonwebtoken');

const config = require('../../config/config')[process.env.NODE_ENV || 'development'];

const unauthorizedResponse = (res) => {
    res.status(401).json({ msg: 'You must be authenticated to access this resource' });
}

module.exports. verifyAuth = async (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, config.access_token_secret, (err, user) => {
            if(err){
                return res.status(403).json("Token is not valid");
            }
            req.user = user;
            next()
        })
    }else{
        unauthorizedResponse(res);
    } 
}