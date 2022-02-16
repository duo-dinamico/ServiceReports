const authRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {postUser, loginUser, logoutUser} = require("../controllers/auth.controllers");
const {methodNotAllowed} = require("../errors");
const {loginRequired} = require("../auth/_helpers");

authRouter.route("/").all(methodNotAllowed);
authRouter.route("/register").post(postUser).all(methodNotAllowed);
authRouter.route("/login").post(loginUser).all(methodNotAllowed);
authRouter.route("/logout").get(loginRequired, logoutUser).all(methodNotAllowed);

module.exports = authRouter;
