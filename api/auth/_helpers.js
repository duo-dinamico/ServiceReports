const bcrypt = require("bcryptjs");

function comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
}

function loginRequired(req, res, next) {
    if (!req.user) return res.status(401).json({status: "Please log in"});
    return next();
}

module.exports = {
    comparePass,
    loginRequired,
};
