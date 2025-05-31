const mongoose = require("mongoose");
const initData =require("./data.js");
const Listing = require("../models/listing");

//Connet to Data base
main().then(()=>{
    console.log("Connected  to DataBase");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
};

//Initalise Database
const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was Initalized");
};
//Calling initilzed function
initDB();