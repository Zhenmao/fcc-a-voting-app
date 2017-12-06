const Poll = require("../models/poll"),
      User = require("../models/user");
      
const middlewareObj = {};

middlewareObj.checkUserid = function(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.userid, function(err, foundUser) {
            if (err || !foundUser) {
                req.flash("error", "User not found");
                res.redirect("back");
            } else {
                if (foundUser._id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("/login");
    }
}

middlewareObj.checkPollOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Poll.findById(req.params.id, function(err, foundPoll) {
            if (err || !foundPoll) {
                req.flash("error", "Poll not found");
                res.redirect("back");
            } else {
                if (foundPoll.creator.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first");
    res.redirect("/login");
}

module.exports = middlewareObj;