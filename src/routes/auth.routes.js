const express=require("express");

const router=express.Router();
const authController=require("../controllers/auth.controller.js");
const { sendpasswordchangelink, resetpassword } = require("../controllers/forgotpassword.js");


router.post("/signin",authController.login)
router.post("/signup",authController.register)
router.post("/forgotpassword",sendpasswordchangelink)
router.put("/reset-password/:id/:token",resetpassword)

module.exports=router;