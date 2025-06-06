const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const User=require("../models/user.js");

module.exports.signupGet=(req,res)=>{
    res.render("./users/signup.ejs");
};


module.exports.signupPost=async(req,res)=>{
    try{
let{email,username,password}=req.body;
const newuser=new User({email,username});
 let registereduser=await User.register(newuser,password);
 req.login(registereduser,(err)=>{
        if(err)
        {
       return next(err);
        }
        req.flash("success","WElCOME");
 res.redirect("/listings");
    })
 }
 catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
 }
};
module.exports.loginGet=(req,res)=>{
  res.render("./users/login.ejs");
};
module.exports.loginPost=(req, res) => {
    req.flash("success", "WELCOME");
    const anotherurl="/listings";
    const directUrl = res.locals.redirectUrl || anotherurl; // ✅ fallback here
    res.redirect(directUrl);
  };
  module.exports.out=(req,res)=>{
    req.logout((err)=>{
        if(err)
        {
       return next(err);  
        }
    })
    req.flash("success","Logged Out ");
    res.redirect("/listings");

};