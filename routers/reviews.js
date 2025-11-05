const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../views/Utils/wrapAsync.js")
const ExpressError = require("../views/Utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const { isAuthor } = require("../middleware.js");

// Validate Review Middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};

// Add Review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found!");

    const review = new Review(req.body.review);
    review.author=req.user._id;

    listing.reviews.push(review); // corrected from review -> reviews
    await review.save();
    console.log(review);
    await listing.save();
    req.flash("success","Review Added");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review
router.delete("/:reviewId",isAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;
