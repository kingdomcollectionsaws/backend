const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  review: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image:{
    type:String
  },
  name:{
    type:String
  },
  ratings:{
    type:Number
  }
});

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;
