const Moralis = require("moralis/node");

const unauthorizedResponse = (res) => {
    res.status(401).json({ msg: 'You must be authenticated to access this resource' });
}

const verifyAuth = async (req) => {
    const providedSessionToken = req.header('Authorization');
    const providedUserId = req.header('userId');

    if(!providedSessionToken || !providedUserId) {
        return null;
    } 

    const sessionQuery = new Moralis.Query("_Session");
    sessionQuery.include("sessionToken");
    sessionQuery.equalTo("sessionToken", providedSessionToken);

    const sessionQueryResult = await await sessionQuery.find({ useMasterKey:true }).catch((error) => {
        // TODO add proper error handling
        console.log(`error from _session query: ${JSON.stringify(error)}`);
        return null;
    });

    const parsedSessionQueryResult = JSON.parse(JSON.stringify(sessionQueryResult));

    if(parsedSessionQueryResult.length === 0) {
        return null;
    }

    const userQuery = new Moralis.Query("_User");
    userQuery.equalTo("objectId", parsedSessionQueryResult[0].user.objectId);
    const userQueryResult = await userQuery.find({ useMasterKey:true }).catch((error) => {
        // TODO add proper error handling
        console.log(`error from _user query: ${JSON.stringify(error)}`);
        return null;
    });

    const parsedUserQueryResult = JSON.parse(JSON.stringify(userQueryResult));

    if(parsedUserQueryResult.length === 0 || parsedUserQueryResult[0].username !== providedUserId) {
        return null;
    }
    
    return parsedUserQueryResult[0].username;
}

module.exports.verifyAuthIfProvided = async function(req, res, next) {
    const verifiedUserId = await verifyAuth(req);
    res.locals.verifiedUserId = verifiedUserId;
    return next();
}

module.exports.requireAuth = async function(req, res, next) {
    const verifiedUserId = await verifyAuth(req);
    if(!verifiedUserId) {
        unauthorizedResponse(res);
        return;
    }
    res.locals.verifiedUserId = verifiedUserId;
    return next();
}