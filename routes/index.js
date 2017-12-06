const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user"),
      Poll = require("../models/poll"),
      middleware = require("../middleware");
      
// Root route
router.get("/", function(req, res) {
    res.redirect("/poll");
})

// Signup routes
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to PollPool, " + user.username);
            res.redirect("/");
        });
    });
});

// Login routes
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res) {
        req.flash("success", "Welcome to PollPool, " + req.user.username);
        res.redirect("/");
});

// Logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("Logged you out.");
    res.redirect("/");
});

// Profile route
router.get("/profile/:userid", middleware.checkUserid, function(req, res) {
    User.findById(req.params.userid, function(err, foundUser) {
        if (err) {
            req.flash("No user found");
            return res.redirect("back");
        }
        Poll.find({ "creator.id": req.params.userid }, function(err, foundPolls) {
            if (err) {
                req.flash("Error locating polls associated with current user");
                res.redirect("back");
            }
            res.render("profile", { polls: foundPolls, user: foundUser })
        });
    });
});

module.exports = router;