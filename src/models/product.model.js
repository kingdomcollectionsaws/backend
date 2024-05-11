// productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },

  quantity: {
    type: Number,
    // required: true,
  },
 slug: {
    type: String,
  },
  variations:[
    {images:[{
    type:String
  }],
  price:{
    type: Number,

  },
  discountedPrice: {
    type: Number,
  },
  style: {
    type: String,
  },
}],
  imageUrl:[{
    type: String,
  }],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ratings',
    },
  ], 
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
    },
  ], 
  numRatings: {
    type: Number,
    default: 0,
  },
  materials:{
    type: String,
  },
  width:{
    type: String,
  },
  height:{
    type:String
  },

  category: {
    type:String,
    require:true
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'categories',
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
