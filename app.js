if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const express = require("express");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));
const expresserror=require("./utilities/expresserror.js");
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
const methodoverride = require('method-override');

app.use(express.static('public'));

app.use(methodoverride('_method'));
const ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localstrategy=require("passport-local");
const User=require("./models/user.js");
let port = 3000;
const listingsrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");
//const multer=require("multer");
//const upload = multer({ dest: 'uploads/' });
const atlasUrl=process.env.ATLAS_URL;
async function main() {
  await mongoose.connect(atlasUrl);
}
main().then((res) => {
  console.log("connected to db");
})
  .catch((err) => {
    console.log(err);
  });
  
 const store= MongoStore.create(
  {
    mongoUrl:atlasUrl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  },
  
 );
 store.on("error",()=>{
  console.log("error in mongo store",err);
 })
const sessionoptions={
  store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentuser=req.user;
  next();
});





app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",userrouter);

app.listen(port, () => {
  console.log("Server is listening on port", port);
});
// reviews route


app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  console.log(err.message);
  console.log(err.stack);
  res.render("error.ejs", { message });
  //res.status(status).send(message);
});