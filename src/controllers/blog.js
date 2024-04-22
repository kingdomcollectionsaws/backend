const Blog = require("../models/blog");

const createblog = async(req, res)=>{
    try {
        const {title,description,image,slug} =req.body;
        const blog =  new Blog({
            title:title,
            description:description,
            image:image,
            slug:slug
        })
        await blog.save()
        res.status(200).json({blog})
    } catch (error) {
        console.log(error.message);
    }
}
const getblog = async(req, res)=>{
    try {
        
        const blogs =  await Blog.find()
        res.status(200).json(blogs)
    } catch (error) {
        console.log(error.message);
    }
}
const deleteblog = async(req, res)=>{
    try {
        const {id} =req.body;
    const blog = await Blog.findByIdAndRemove(id)
      
        res.status(200).json({msg:"blog deleted successfully"})
    } catch (error) {
        console.log(error.message);
    }
}
const updateblog = async(req, res)=>{
    try {
        const {title,description,image,id,slug} =req.body;
        const blog =  await Blog.findById(id);
        blog.title = title ||blog.title,
        blog.description = description||blog.description,
        blog.image = image||blog.image,
        blog.slug = slug || blog.slug
        await blog.save()
        res.status(200).json({msg:'blog update successfully'})
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={createblog,getblog,deleteblog,updateblog}