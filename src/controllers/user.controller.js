const userService=require("../services/user.service")

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
const getAllUsers=async(req,res)=>{
    try {
        const users=await userService.getAllUsers()
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports={getUserProfile,getAllUsers,updateUserDetails}