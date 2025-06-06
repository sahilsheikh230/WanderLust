const Review=require("./models/review.js");
const Listing=require("./models/listing.js");
const owner=require("./models/user.js");
module.exports.isloggedin=((req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
    req.flash("error","Log in First");
   return res.redirect("/login");
  }
  next();
})
module.exports.saveurl=((req,res,next)=>{
  if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl;
      delete req.session.redirectUrl;
  }
  next();
});
module.exports.isowner=(async(req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  
  if( !listing.owner.equals(res.locals.currentuser._id)){
req.flash("error","You are not the Admin");
return res.redirect(`/listings/${id}`);
  }
next();
});
module.exports.isauthor=(async(req,res,next)=>{
let{id,reviewid}=req.params;
let review=await Review.findById(reviewid);


  if(!review.author.equals(res.locals.currentuser._id)){
    req.flash("error","You are not Author");
    return res.redirect(`/listings/${id}`);
  }
  next();
})