const express = require("express");
const app = express();
const router = express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utilities/wrapasync");
const passport=require("passport");
const userController=require("../controller/usercontroller.js");
const {saveurl}=require("../middleware.js");

router.route("/signup")
.get(userController.signupGet)
.post(wrapasync(userController.signupPost));
router.route("/login")
.get(userController.loginGet)
.post(
  saveurl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginPost
);

router.get("/logout",userController.out)
module.exports=router;