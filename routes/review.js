const express = require("express");
const app = express();
const Review = require("../models/review.js");
const router = express.Router({ mergeParams: true });
const {isloggedin,isauthor}=require("../middleware.js");
const wrapasync = require("../utilities/wrapasync.js");
const { listingSchema, reviewschema } = require("../schema.js");


const Listing = require("../models/listing.js");

const reviewController=require("../controller/reviewController.js");


const validatereview = (req, res, next) => {
  let { error } = reviewschema.validate(req.body.review);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new expresserror(404, msg);
  }
  else {
    next();
  }
};

router.post("/", isloggedin,validatereview, wrapasync(reviewController.post));
router.delete("/:reviewid",isloggedin,isauthor,reviewController.destroy);
module.exports=router;