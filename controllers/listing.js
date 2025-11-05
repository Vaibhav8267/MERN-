const { model } = require("mongoose");
const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm=(req, res) => {
   
        res.render("listings/new");
}

module.exports.createNewList=async (req, res) => {

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for the listing");
    }
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id; 
    await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
}

module.exports.singleList=async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing);
    if (!listing) {
        console.log("Working");
         req.flash("error","Listing not found");
        return res.redirect("/listings");   
    }
    res.render("listings/show", { listing });
}

module.exports.editList=async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        throw new ExpressError(404, "Listing Not Found!");
      
        
    }
    res.render("listings/edit", { list });
}

module.exports.updateList=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for the listing");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // ✅ lowercase
    req.flash("success","Listing Updated");
    res.redirect("/listings");
}
module.exports.deleteList=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}