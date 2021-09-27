const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = {
   name: {
      type: String,
      required: true,
   },
   image: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true,
      default: 0,
   },
   brand: {
      type: String,
      required: true,
   },
   rating: {
      type: Number,
      required: true,
      default: 0,
   },
   numReview: {
      type: Number,
      required: true,
      default: 0,
   },
   category: {
      type: String,
      required: true,
   },
   countInStock: {
      type: Number,
      required: true,
      default: 0,
   },
};

module.exports = Product = mongoose.model('product', ProductSchema);
