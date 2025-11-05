const user = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.singup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new user({ email, username });
        const regUser = await user.register(newUser, password);
        console.log(regUser);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "Welcome to Wanderlust");
                res.redirect("/listings");
            }
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
    // req.flash("error","Login Successfull")
    // res.send(newUser);
}
module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.login = async (req, res) => {
    req.flash("success", "Welome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged Out");
        res.redirect("/login");
    })
}