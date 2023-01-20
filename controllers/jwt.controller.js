const db = require( '../database/models' );
const AccessToken =  db['accessToken'];
const jwt = require('jsonwebtoken');

const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const expiration = '70s';

exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, config.access_token_secret, {
        expiresIn: expiration
    });
}

exports.generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.refresh_token_secret);
}

exports.refreshToken = async ( req, res ) => 
{
    const refreshToken  = req.body.token;
    if(!refreshToken){
        return res.status(401).json('You are not authenticated!');
    }

    await AccessToken.findOne({where: {token: refreshToken}, raw: true}).then(dataToken => {
        if(!dataToken){
            return res.status(403).json('Refresh token is not valid!')
        }

        jwt.verify(refreshToken, config.refresh_token_secret, async(err, user) => {
            err && console.log(err) 
            await AccessToken.destroy({ where: {token: refreshToken}}).then(async dataToken => {
                const newAccessToken = this.generateAccessToken({
                    userId: user.userId, 
                    address: user.address, 
                    status: user.status, 
                    email: user.email, 
                    name: user.name, 
                    profileImage: user.profileImage 
                });
                const newRefreshToken = this.generateRefreshToken(
                    {
                        userId: user.userId, 
                        address: user.address, 
                        status: user.status, 
                        email: user.email, 
                        name: user.name, 
                        profileImage: user.profileImage 
                    }
                );
                await AccessToken.create({token: newRefreshToken}).then(data => {
                    res.status(200).json({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken
                    })
                })              
            })      
        })

    })
}








