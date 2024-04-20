const User = require("../models/user.model");
const userService=require("../services/user.service")
const bcrypt = require('bcrypt');
const getUserProfile=async (req,res)=>{
    try {
        const jwt= req.headers.token;

        if(!jwt){
            return res.status(404).send({error:"token not found"})
        }
        const user=await userService.getUserProfileByToken(jwt)

        return res.status(200).send(user)

    
    } catch (error) {
        console.log("error from controller - ",error)
        return res.status(500).send({error:error.message})
    }
}
const updateUserDetails = async(req,res)=>{
    try {
        const user = req.user;
        const data = req.body;
        const updatedUser = await userService.updateUser(data,user);
        res.status(200).send(updatedUser)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}
const updatePassword = async(req,res)=>{
    try {
        const userId = req.user;
        let {password , currentPassword} = req.body;
        let user = await User.findById(userId);
        if(!user){
            return {msg:"no user found",success:true}
        }
        
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        console.log(passwordMatch);
       if(passwordMatch){
        password = await bcrypt.hash(password,8);
        user.password =  password ||  user.password ;
        user.save()
        return res.status(200).json({msg:"password updated successfully",success:true})
       }else{
        return res.status(505).json({msg:"password not updated",success:false})
       }

    } catch (error) {
        throw new Error(error.message)
    }
}
const getAllUsers=async(req,res)=>{
    try {
        const users=await userService.getAllUsers()
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports={getUserProfile,getAllUsers,updateUserDetails,updatePassword }