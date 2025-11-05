const express = require("express");
const app = express();
// const user=require("../routers/");
// const routers=require("");
const session = require("express-session");
const port = 3000;
const flash=require("connect-flash");
const path=require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({ secret: "12345", resave: false, saveUninitialized: true }));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.messages=req.flash("Success")
    next();
});
app.get("/test", (req, res) => {
    let {name="abcd"}=req.query;
    req.session.name=name;
    req.flash('Success',"User Regestered succesfully");

    res.redirect("/hello");
})
app.get("/hello", (req, res) => {
    res.render("page",{name:req.session.name});
})
app.listen(3000, () => {
    console.log(`Using port${port}`)
})