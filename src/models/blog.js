const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
   type:String
  },
  slug: {
   type:String
  },
 description: {
    type:String
  },
 image:{
    type:String
 }
},{timestamps:true});

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;
