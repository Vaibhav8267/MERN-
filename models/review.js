const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema= new Schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    // 🚨 CRITICAL FIX: Add a reference back to the Listing 🚨
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing", // Ensure this matches the name of your Listing model
    }
});

module.exports=mongoose.model("Review",reviewSchema);