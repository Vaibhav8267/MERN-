require('dotenv').config();
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require('connect-mongo'); 
const flash = require("connect-flash");

const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/reviews.js");
const userRouter = require("./routers/user.js");
const ExpressError = require("./views/Utils/ExpressError.js")


//Passport setting up
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const { date } = require("joi");
const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl)
}
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", () => {
    console, log("Error in Mongo session store", err);
})
//session option
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 100,
        maxAge: 7 * 24 * 60 * 60 * 100,
        httpOnly: true,
    },
}



//Middlewares
app.use(session(sessionOptions));
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());//require to know that wheater the same user is sending req to another page of diff user  
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser()); //store user data into session
passport.deserializeUser(user.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// //Connect to Database
// mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
//     .then(() => console.log("Connected to Database"))
//     .catch(err => console.log(err));



main()
    .then(() => console.log("Connected to Database"))
    .catch(err => console.log(err));
//API example
const checkToken = (req, res, next) => {
    let { token } = req.query;
    if (token === "access") {
        return next();
    }
    throw new Error("Access Denied!");
};
app.get("/api", checkToken, (req, res) => {
    res.send("data");
});

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
// //logger--morgan
// app.use((req, res, next) => {
//     req.time = new Date(Date.now()).toString();
//     console.log(req.method, req.hostname, req.path, req.time);
//     next();
// });


//Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// passport Router
app.use("/", userRouter);


app.get("/", (req, res) => {
    res.send("Welcome to home :)");
});
// app.use("/api", (req, res, next) => {
//     const checkToken = (req, res, next) => {
//     let { token } = req.query;
//     if (token === "access") {
//         return next();
//     }
//     throw new Error("Access Denied!");
// }
// })
// //404
// app.use((req, res, next) => {
//     res.send("Page Not Found ");
//     next();
// });

// app.get("/api", (req, res) => {
//     res.send("Data")
// })

//Home Route

//404 Middleware
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//Error middleware
app.use((err, req, res, next) => {
    console.log("---ERROR---", err);
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { err, ...res.locals });
});

//Start server
app.listen(8080, () => {
    console.log("Server listening on port 8080");
});