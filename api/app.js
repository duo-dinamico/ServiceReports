const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Boom = require("@hapi/boom");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const {errorHandler} = require("./errors");
const apiRouter = require("./routes/api.router");
const docsRouter = require("./routes/docs.router");
const authRouter = require("./routes/auth.router");

const app = express();
app.options("*", cors());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use(
    session({
        secret: "x02xf3xf7rtx9fxeexbbuxb1xe1x90xfexabxa6L6xddx8d[xccOxfe",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);
app.use("/api-docs", docsRouter);
app.use("/auth", authRouter);

app.all("/*", (_req, _res, next) => next(Boom.notFound("Route Not Found.")));
app.use(errorHandler);

module.exports = app;
