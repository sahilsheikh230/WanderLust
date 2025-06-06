const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.post=async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body.Review;  // <-- Notice the Review here

  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new Error("Listing not found"));
  }

  const newReview = new Review({ rating, comment });
  newReview.author=req.user._id;
  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
req.flash("success","Review Added");
  res.redirect(`/listings/${listing._id}`);
};
module.exports.destroy=async(req,res,next)=>{
  let{id,reviewid}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
await Review.findByIdAndDelete(reviewid);

req.flash("success","Review Deleted");
res.redirect(`/listings/${id}`);
};