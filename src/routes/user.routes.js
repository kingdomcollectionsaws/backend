const express=require("express");

const router=express.Router();
const userController=require("../controllers/user.controller.js");
const authenticate = require("../middleware/authenticat.js");

router.get("/",userController.getAllUsers)
router.get("/profile",userController.getUserProfile)
router.put('/profile/update',authenticate,userController.updateUserDetails)
router.put('/profile/updatepassword',authenticate,userController.updatePassword)

module.exports=router;