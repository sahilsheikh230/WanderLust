const mongoose = require("mongoose");
const User=require("./user.js");
const Schema = mongoose.Schema;
const reviewschema = new mongoose.Schema({  // use `new mongoose.Schema(...)`
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,  // assumed 5, your original had min:1, max:1 which doesn't make sense
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author:{
   type:Schema.Types.ObjectId,
    ref:"User",
  }
});

const Review = mongoose.model("Review", reviewschema);  // pass the actual schema
module.exports = Review;
