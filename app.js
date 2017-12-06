"use strict";

const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      session = require("express-session"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      flash = require("connect-flash"),
      seedDB = require("./seeds");
      
const User = require("./models/user"),
      Poll = require("./models/poll");

const indexRoutes = require("./routes/index"),
	  pollRoutes = require("./routes/poll");

const app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(session({
	secret: "votingAppSecret",
	resave: false,
	saveUninitialized: false
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make req.user and flash message available in ejs templates
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Routes
app.use("/", indexRoutes);
app.use("/poll/", pollRoutes);

// Error handling
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
		.json({ error: err.message });
});

// seedDB(); // Seed the database

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
