const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
 
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  sizes:[ {
    type: String,
  }],
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
},{timestamps:true});

const OrderItem = mongoose.model('orderItems', orderItemSchema);

module.exports = OrderItem;
