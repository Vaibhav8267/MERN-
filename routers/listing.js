const express = require("express");
const router = express.Router();
const wrapAsync = require("../views/Utils/wrapAsync.js")
const ExpressError = require("../views/Utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing,listingSchema, isAuthor}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage });

// Display all listings
router.get("/", wrapAsync(listingController.index));

// Form to create new listing
router.get("/new", isLoggedIn,listingController.renderNewForm);

// Create new listing
// router.post("/add", validateListing, wrapAsync(listingController.createNewList));
router.post("/add", isLoggedIn,upload.single('listing[image]'),listingController.createNewList)
// Show a single listing
router.get("/:id", wrapAsync(listingController.singleList));

// Edit form
router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.editList));

// Update listing
router.put("/:id", validateListing,isLoggedIn,isOwner,upload.single('listing[image]'), wrapAsync(listingController.updateList));

// Delete listing
router.delete("/:id",isLoggedIn,isOwner,isAuthor, wrapAsync(listingController.deleteList));

module.exports = router;
