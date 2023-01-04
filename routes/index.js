module.exports = (app) => {
    require('./api/user.route')(app);
    require('./api/space.route')(app);
    require('./api/license.route')(app);
    require('./api/project.route')(app);
 }