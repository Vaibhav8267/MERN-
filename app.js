const express=require("express");
const app=express();
const ExpressError=require("./ExpressErr.js");
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//Middlewares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
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
//insert values
app.post("/Listings/add",async (req,res)=>{
    const newListings= new Listing( req.body.Listing);
    await newListings.save();
    res.redirect("/Listings");
});
//Edit routes
app.get("/Listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const list= await Listing.findById(id);
    console.log(list);
    res.render("listings/edit",{list});
});
//Show routes
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show",{listing});
});
//Update route
app.put("/Listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing}) //it is our javascript object by this we can deconstruct  to take all parameters as individual values 
    res.redirect("/Listings");
});
//DELETE route
app.delete("/Listing/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/Listings");
});
//Error
app.get("/err",(req,res)=>{
    abc=abc;
});

app.get("/admin",(req,res)=>{
    throw new ExpressError(403,"Access to admin denied ");
})

app.use((err,req,res,next)=>{
    let{status=500,message="Some error"}=err;
    res.status(status).send(message);
    console.log("-----------ERROR-----------");
    // next(err);
})
// //Test Database
// app.get("/test",async(req,res)=>{
    //     let sampleListing=new Listing({
        //         title:"My new Villa",
        //         description:"By the beach",
        //         price:"1200",
        //         location:"Calagute,Goa",
        //         contry:"India"
        //     });
        //     sampleListing.save();
        //     console.log("Sample was saved");
        //     res.send("Success"); 
        // });

//Creating Port request
app.listen(8080,()=>{
console.log("Server is listening to port : 8080");
});