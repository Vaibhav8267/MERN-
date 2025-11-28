require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/reviews.js");
const userRouter = require("./routers/user.js");

const ExpressError = require("./views/Utils/ExpressError.js");

// -----------------------
// ⭐ MONGODB CONNECTION
// -----------------------
const dbUrl = process.env.ATLASDB_URL;

async function connectDB() {
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 8000,
      // DEBUG ONLY — uncomment if your TLS issue persists:
      // tlsAllowInvalidCertificates: true,
      // tlsAllowInvalidHostnames: true,
    });
    console.log("🟢 MongoDB Connected");
  } catch (err) {
    console.error("🔴 MongoDB Connection Error:", err);
  }
}
connectDB();

// -----------------------
// ⭐ SESSION STORE
// -----------------------
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("❌ Mongo Session Store Error:", err);
});

// -----------------------
// ⭐ SESSION OPTIONS
// -----------------------
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // FIXED (correct ms)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// -----------------------
// ⭐ MIDDLEWARE SETUP
// -----------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions));
app.use(flash());

// -----------------------
// ⭐ PASSPORT AUTH
// -----------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -----------------------
// ⭐ GLOBAL TEMPLATE VARIABLES
// -----------------------
app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// -----------------------
// ⭐ ROUTES
// -----------------------
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// -----------------------
// ⭐ 404 HANDLER
// -----------------------
app.all(/.*/ , (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// -----------------------
// ⭐ ERROR HANDLER
// -----------------------
app.use((err, req, res, next) => {
    // Do NOT log stack trace for 404 errors
    if (err.status !== 404) {
        console.error("---ERROR---", err);
    }

    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    res.status(status).render("listings/error.ejs", { err, ...res.locals });
});

// -----------------------
// ⭐ START SERVER
// -----------------------
app.listen(8080, () => {
  console.log("🚀 Server listening on port 8080");
});
