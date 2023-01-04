const db = require( '../database/models' );
const User =  db['user'];

const Op = db.Sequelize.Op;

exports.login = ( req, res ) => 
{
   req.session.userId = 22;
   res.send({sess: req.session})
}


exports.getUser = async ( req, res ) => 
{
    const address = req.query.address;
    const condition = {address: address};
    await User.findOne({where: condition, raw: true})
   .then(data => {
    if(data != null){
        res.send({...data, status: true});   
    }else{
        res.send({status: false}); 
    }
 }).catch(err => {
    res.status(500).send({status: false})}
    )   
}

exports.create = async ( req, res ) => 
{
    const address = req.body.address;
    const email = req.body.email;
    const name = req.body.name;
    const profileImage = req.body.profileImage;
    // Create a new user
    const user = {
        address: address,
        email: email,
        userToken: "dfhdjjhdfjkdjkfjkdf",
        name: name,
        profileImage: profileImage
    }
     await User.create(user)
    .then( data => { 
        const newUser = {
            userId: data.id,
            userToken: data.userToken,
            status: true,
            address: data.address,
            email: data.email,
            name: data.name,
            profileImage: data.profileImage

        } 
        res.send( newUser ) 
    })
    .catch( err =>{ res.status(400).send({message: err.message || "Some error occurred while creating the space"})})
}

exports.findAll = (req, res) => 
{
    const title = req.query.title;
    const condition = title ? {title: {[Op.like] : `%${title}%`}} : null;

    Tutorial.findAll({where: condition})
    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message || "Some error occurred while retrieving tutorials"})})

}

exports.findOne = (req, res) => {
    const id = req.params.id;
    Tutorial.findByPk(id).then(data => {
        if(data){
            res.send(data)
        }else{
            res.status(404).send({
                message: `Can not find tutorial with id = ${id}.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error retrieving tutorial with id " + id
        })
    })

}

exports.update = (req, res) => {
    const id = req.params.id;
    Tutorial.update(req.body, {
        where:{ id: id}
    }).then(num => {
        if(num == 1){
            res.send({
                message: "Tutorial was updated succcessfully."
            });
        }else{
            res.send({
               message: `Can not update tutorial with id = ${id}. Maybe tutorial was not found or req.body is empty` 
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error retrieving tutorial with id " + id
        })
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Tutorial.destroy({
        where:{ id: id }
    }).then(num => {
        if(num == 1){
            res.send({
                message: "Tutorial was deleted successfully"
            });
        }else{
            res.send({
                message: `Can not delete tutorial with id = ${id}. Maybe tutorial was not found.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could delete tutorial with id " + id
        })
    })
}

exports.deleteAll = (req, res) => {
    Tutorial.destroy({
        where: {},
        truncate: false
    }).then(num => {
       res.send({
           message: `${num} tutorials were deleted successfully.`
       })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while removing tutorials"
        })
    })
}

exports.findAllPublished = (req, res) => {
    Tutorial.findAll({
        where: {published: true}
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrievng tutorials."
        })
    })
}