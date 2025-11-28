const { model } = require("mongoose");
const Listing = require("../models/listing");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new");
}

module.exports.createNewList = async (req, res) => {
     let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();
      

    let url = req.file.path;
    let filename = req.file.filename;
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for the listing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry=response.body.features[0].geometry;
    let saveList=await newListing.save();
    console.log(saveList)
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.singleList = async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    console.log(listing);
    if (!listing) {
        console.log("Working");
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}

module.exports.editList = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        throw new ExpressError(404, "Listing Not Found!");


    }
    res.render("listings/edit", { list });
}

// module.exports.updateList = async (req, res) => {
   
//     console.log(response.body.features);
//     if (!req.body.listing) {
//         throw new ExpressError(400, "Send valid data for the listing");
//     }
//     const { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // ✅ lowercase
//     if (typeof req.file !== "undefined") {
//         let url = req.file.path;
//         let filename = req.file.filename;
//         // Listing.owner = req.user._id;
//         listing.image = { url, filename };
//         await listing.save();
//     }
//     req.flash("success", "Listing Updated");
//     res.redirect("/listings");
// }

module.exports.updateList = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for the listing");
    }

    // Find the listing first
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Update basic fields
    listing.set(req.body.listing); // merges and marks modified

    // If location was provided (and different), re-geocode
    if (req.body.listing.location) {
      const geoResp = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();

      if (
        geoResp &&
        geoResp.body &&
        geoResp.body.features &&
        geoResp.body.features.length > 0
      ) {
        listing.geometry = geoResp.body.features[0].geometry;
      } else {
        // optional: clear geometry or keep previous
        console.warn("Geocoding returned no result for:", req.body.listing.location);
      }
    }

    // If a new file was uploaded, replace image
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.deleteList = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}