const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./Utils/ExpressError");
const {ListingSchema}= require("./schema.js");

//Middlewares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Validate Middleware
const validateListing=(req,res,next)=>{
    let {error}=  ListingSchema.validate(req.body);
  if(error){
    let errMsg= error.details.map((el)=>el.message).join(",");
    throw new ExpressError(404, errMsg);
  }else{
    next();
  }
}


//Connet to Data base
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
};
main().then(()=>{
    console.log("Connected  to DataBase");
}).catch((err)=>{
    console.log(err);
});

//API
const checkToken=(req,res,next)=>{
    let {token}=req.query;
    if(token==="access"){
         next();
    }
    throw new Error("Access Denied!");
};
app.get("/api",checkToken,(req,res)=>{
    res.send("data");
});

//LISTINGS

//Home Route
app.get("/",(req,res)=>{
    res.send("Welcome to home :)");
});
//Display all Data
app.get("/Listings",async(req,res)=>{
     
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})
//Create new listings
app.get("/Listings/new",(req,res)=>{
       res.render("listings/new");
});
//Create Route
app.post("/Listings/add", validateListing,wrapAsync(async (req, res,next) => {
  const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/Listings");
}));

//Edit routes
app.get("/Listings/:id/edit", async (req, res, next) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit", { list });
});

//Show routes
app.get("/Listings/:id", async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
});
//Update route
app.put("/Listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing}) //it is our javascript object by this we can deconstruct  to take all parameters as individual values 
    res.redirect("/Listings");
    
})
);
//DELETE route
app.delete("/Listings/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/Listings");
});
// //Error midddleware for all
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//Error middleware
app.use((err,req,res,next)=>{
    let{status=500,message="Some error"}=err;
    res.render("listings/error.ejs",{message})
    // res.status(status).send(message);
    console.log("-----------ERROR-----------");
    // res.send("Something went wrong!!");
});

//Creating Port request
app.listen(8080,()=>{
console.log("Server is listening to port : 8080");
});
