
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const listings = require("./routers/listing.js");
const reviews = require("./routers/reviews.js");

const ExpressError = require("./Utils/ExpressError");

//Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Connet to Data base
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
};
main().then(() => {
  console.log("Connected to DataBase");
}).catch((err) => {
  console.log(err);
});

//API
const checkToken = (req, res, next) => {
  let { token } = req.query;
  if (token === "access") {
    next();
  }
  throw new Error("Access Denied!");
};
app.get("/api", checkToken, (req, res) => {
  res.send("data");
});

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);//reviews

//LISTINGS
//Home Route
app.get("/", (req, res) => {
  res.send("Welcome to home :)");
});



// //Error midddleware for all
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//Error middleware
app.use((err, req, res, next) => {
  console.log("---ERROR---");
  let { status = 500, message = "Some error" } = err;
  res.render("listings/error.ejs",{err})
});

//Creating Port request
app.listen(8080, () => {
  console.log("Server is listening to port : 8080");
});
