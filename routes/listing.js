const express = require("express");
const app = express();
const router=express.Router();
const expresserror = require("../utilities/expresserror.js");
const {listingSchema,reviewschema}=require("../schema.js");
const Listing = require("../models/listing.js");
const wrapasync = require("../utilities/wrapasync.js");
app.use(express.urlencoded({ extended: true }));
const{isloggedin,isowner}=require("../middleware.js");
const multer = require("multer");
const{storage}=require("../cloudConfig.js")
const upload = multer({storage });
const validatelisting=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  
  if(error){
     const msg = error.details.map(el => el.message).join(',');
    throw new expresserror(404,msg);
  }
  else{
    next();
  }
};
const listingController=require("../controller/listingcontroller.js");
router.route("/")
  .get(wrapasync(listingController.index))
  .post(isloggedin, validatelisting,upload.single('Listing[image]'), wrapasync(listingController.post));




// creating new listing
router.get("/new",isloggedin, listingController.newlisting);
router.route("/:id")
  .get(wrapasync(listingController.show))
  .put(isloggedin, isowner,upload.single('Listing[image]'), validatelisting, wrapasync(listingController.update))
  .delete(isloggedin, isowner, wrapasync(listingController.destroy));

// EDITING ROUTE
router.get("/:id/edit" ,isloggedin,isowner, validatelisting,wrapasync(listingController.getedit));


module.exports=router;