
  module.exports.requireAuth = (req, res, next) => {
        const { user } = req.session;
        if(!user){
        return res.status(401).json({message: 'Unauthorized'})
        }
        next();
  }
 
  module.exports.requireAdmin = (req, res, next) => {
    const { user } = req.session;
        if(user.role !== 'admin'){
        return res.status(401).json({message: 'Insufficient role'})
        }
        next();
    }

 