const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapAsync = require("../views/Utils/wrapAsync");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware");

const listingController = require("../controllers/user");

router.get("/signup", listingController.signupForm);

//Post 
router.post("/signup", wrapAsync(listingController.singup));

router.get("/login", listingController.loginForm);

router.post("/login", saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    listingController.login
);

router.get("/logout", listingController.logout);
module.exports = router;