const express = require("express");
const authRouter = express.Router();
const loginLimiter = require("../middleware/loginLimiter")
const authController = require("../controllers/authController")



authRouter.route("/")
    .post(loginLimiter,authController.login);


module.exports = authRouter;
