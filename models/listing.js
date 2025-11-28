const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { number, required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: { type: Number },
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: 
  {
  type:{
    type: String,
    enum: ["Point"],
    required: false,
  },
  coordinates: {
    type: [Number],
    required: false,
  }},
   mobile: {
    type: String,
    required: true,  // set to false if optional
    minlength: 10,
    maxlength: 10,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  // 💡 CORRECTION 2: Updated references in middleware to use 'reviews'
  if (listing && listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);