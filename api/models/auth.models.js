const connection = require("../db/psql/connection");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    return connection("users")
        .insert({
            username: req.body.username,
            password: hash,
            name: req.body.name,
        })
        .returning("*");
};
