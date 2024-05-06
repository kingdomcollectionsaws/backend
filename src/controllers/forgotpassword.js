const User = require("../models/user.model");
const jwt = require('jsonwebtoken')
 const sendpasswordchangelink = async(req,res)=>{
    const {email} = req.body
    try {

        const user = await User.findOne({email:email})
        if(!user){
          res.send({msg:'user not found'})
        }else{
            const token = jwt.sign({email:email},process.env.SECERET_KEY,{ expiresIn: '5m' })
            const link = `http://localhost:5454/reset-password/${user._id}/${token}`
            res.send(link)}     
        
    } catch (error) {
        res.status(500).send(error)
    }
 }
 const resetpassword = async(req,res)=>{
    const {id,token} = req.params;
    try {
        
        const verify = jwt.verify(token,process.env.SECERET_KEY);
        // if(!verify){
        //     res.send("not")
        // }
        res.send("verify");
    } catch (error) {
        
    }
 }
 module.exports = {sendpasswordchangelink,resetpassword }