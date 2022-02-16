const passport = require("../auth/local");
const {createUser} = require("../models/auth.models");

exports.postUser = (req, res, next) => {
    return createUser(req, res)
        .then(() => {
            passport.authenticate("local", (err, user, info) => {
                if (user) {
                    handleResponse(res, 201, "success");
                }
            })(req, res, next);
        })
        .catch(err => {
            console.log(err);
            handleResponse(res, 500, "error");
        });
};

function handleResponse(res, code, statusMsg) {
    res.status(code).json({status: statusMsg});
}

exports.loginUser = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            handleResponse(res, 500, "error");
        }
        if (!user) {
            handleResponse(res, 404, "User not found");
        }
        if (user) {
            req.logIn(user, function (err) {
                if (err) {
                    handleResponse(res, 500, "error");
                }
                handleResponse(res, 200, "success");
            });
        }
    })(req, res, next);
};

exports.logoutUser = (req, res, next) => {
    req.logout();
    handleResponse(res, 200, "success");
};
