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
  price: {
    type: Number,
    // required: true,
  },
  discountedPrice: {
    type: Number,
  },
  discountPersent: {
    type: Number,
  },
  quantity: {
    type: Number,
    // required: true,
  },
  brand: {
    type: String,
  },
  color: {
    type: String,
  },
  sizes: [{
    type:String

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
