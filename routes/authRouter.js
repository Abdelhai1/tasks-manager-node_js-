const express = require("express");
const authRouter = express.Router();
const userController = require("../controllers/userController.js")
module.exports = authRouter;

//sign up
authRouter.post('/signup',userController.addUser)

module.exports = authRouter;