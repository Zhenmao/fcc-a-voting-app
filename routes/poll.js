const express = require("express"),
      router = express.Router(),
      Poll = require("../models/poll"),
      User = require("../models/user"),
      middleware = require("../middleware");

// Index route 
router.get("/", function(req, res, next) {
    Poll.find({}, function(err, foundPolls) {
        if (err) return next(err);
        res.render("poll/index", { polls: foundPolls });
    });
});

// New route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("poll/new");
});

// Create route
router.post("/", middleware.isLoggedIn, function(req, res) {
    const pollText = req.body.pollText;
    const creator = {
        id: req.user._id,
        username: req.user.username
    };
    const options = req.body.pollOptions
        .filter(function(pollOption) {
            return pollOption !== "";
        })
        .map(function(pollOption) {
        return {
            optionText: pollOption,
            count: 0
        }
    });
    const poll = { pollText: pollText, creator: creator, options: options };
    Poll.create(poll, function(err, newPoll) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.redirect("/poll/" + newPoll._id + "/edit");
    })
})

// Show route
router.get("/:id", function(req, res) {
    Poll.findById(req.params.id, function(err, foundPoll) {
        if (err || !foundPoll) {
            req.flash("error", "Poll not found");
            return res.redirect("back");
        }
        res.render("poll/show", { poll: foundPoll });
    });
});

// Edit route
router.get("/:id/edit", function(req, res) {
    Poll.findById(req.params.id, function(err, foundPoll) {
        if (err || !foundPoll) {
            req.flash("error", "Poll not found");
            return res.redirect("back");
        }
        res.render("poll/edit", { poll: foundPoll });
    });
});

// Update route
router.put("/:id", function(req, res) {
    const option = req.body;
    if (option.hasOwnProperty("option_id")) { // Vote an existing option
        Poll.findOneAndUpdate(
            { _id: req.params.id, "options._id": option.option_id },
            { $inc: { "options.$.count": 1 } },
            { new: true }, 
            function(err, updatedPoll) {
                if (err || !updatedPoll) {
                    req.flash("error", "Poll not found");
                    return res.redirect("back");
                }
                res.redirect("/poll/" + req.params.id);
            });
    } else if (option.option_new === "") {
        req.flash("error", "Poll option cannot be empty");
        res.redirect("back");
    } else { // Vote a new option
        const newOption = { optionText: option.option_new, count: 1 };
        Poll.findByIdAndUpdate(
            req.params.id, 
            { $push: { options: newOption }},
            { new: true },
            function(err, updatedPoll) {
                if (err || !updatedPoll) {
                    req.flash("error", "Poll not found");
                    return res.redirect("back");
                }
                res.redirect("/poll/" + req.params.id);
            }
        )
    }
});

// Destroy route
router.delete("/:id", middleware.checkPollOwnership, function(req, res) {
    Poll.findById(req.params.id, function(err, foundPoll) {
        if (err || !foundPoll) {
            req.flash("error", "Poll not found");
            return res.redirect("back");
        }
        foundPoll.remove(function(err){
            if (err) {
                req.flash("error", "Poll cannot be deleted");
                return res.redirect("back");
            }
            User.update({ _id: foundPoll.creator.id },
            { $pull: { polls: foundPoll._id }},
            function(err, updatedPoll) {
                if (err) {
                    req.flash("error", "Poll not found under current user");
                    return req.redirect("back");
                }
                res.redirect("back");
            })
        });
    });
})
    
module.exports = router;