const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: maptoken });
module.exports.index=async (req, res) => {
  const listings = await Listing.find();
  res.render("show.ejs", { listings });
}
module.exports.newlisting=(req, res) => {
 
  res.render("new.ejs");
};
module.exports.show=async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
  .populate({path:"review",populate:{path:"author",},
  })
  .populate("owner");
  
  if(!listing){
    req.flash("error","Listing not found");
    return res.redirect("/listings");
  }
  
  res.render("read.ejs", { listing});
};
module.exports.post = async (req, res, next) => {
  const response = await geocodingClient.forwardGeocode({
    query: req.body.Listing.location,
    limit: 1
  }).send();

  const url = req.file.path;
  const filename = req.file.filename;
  

  const { title, description, price, location, country } = req.body.Listing;

  // Create the listing without saving yet
  const newListing = new Listing({
    title,
    description,
    image: { url, filename },
    price,
    location,
    country
  });

  // Add geometry and owner before saving
   newListing.owner = req.user._id;
  newListing.geometry = response.body.features[0].geometry;
 

  // Now save
  await newListing.save();

  req.flash("success", "New Listing Added");
  res.redirect("/listings");
};

module.exports.getedit=async (req, res) => {
  let{id}=req.params;
  let listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Not Found");
    return res.redirect("/listings");
  }
  res.render("edit.ejs", { listing });
};
module.exports.update = async (req, res) => {
  let {id}=req.params;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.Listing},{new:true});
  if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  req.flash("success","Edited the Listing");
  res.redirect("/listings");
};

module.exports.destroy=async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted");
  res.redirect("/listings");
};