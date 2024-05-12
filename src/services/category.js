const Category = require("../models/category.model")

const getcategories = async (req,res)=>{
    try {
        const categories = await Category.find();
        res.status(200).send(categories)
    } catch (error) {
        res.send(error)
    }
}
const addcategories = async (req,res)=>{
    const {name,image,slug} =req.body
    try {
        const category = await Category.create({
            name:name,
            image:image,
            slug:slug

        })
        res.status(200).send({success:true})
    } catch (error) {
        res.send(error)
    }
}
const deletecategories = async (req,res)=>{
 const id = req.params.id
    try {
         await Category.findByIdAndDelete(id);
        
        res.status(200).send({success:true})
    } catch (error) {
        res.send(error)
    }
}
module.exports = {getcategories,addcategories,deletecategories}

