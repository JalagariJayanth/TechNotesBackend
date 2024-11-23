const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController")



userRouter.route("/")
.get(userController.getAllUsers)
.post(userController.createNewUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports = userRouter;
