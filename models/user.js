const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
   
});

userSchema.plugin(passportLocalMongoose); //useing passport username and password is by deafult defined by the passport

module.exports=mongoose.model("User",userSchema);