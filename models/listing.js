const mongoose=require("mongoose");
const Schema= mongoose.Schema

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
       type: String
    },
    image: {
      type: {
        filename: String,
        url: String
        },
        default: {
            filename: "",
            url: "https://unsplash.com/photos/an-elephant-stands-under-a-thatched-sunshade-56xiH78bDCc"
        },
        set: (v) => {
            if (typeof v === "string") {
            return {
                filename: "",
                url: v || "https://unsplash.com/photos/an-elephant-stands-under-a-thatched-sunshade-56xiH78bDCc"
            };
            }
            return v;
        }
     },

    price:{
        type:Number
    },
    location:{
       type: String
    },
    country:{
       type: String
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;