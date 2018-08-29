const express = require('express');
const router = express.Router();
const passport = require("../config/passport"); // 1

/* GET home page. */
router.get('/', function (req, res, next) {
	console.log('/index page 접속');
	res.render('home/index');
});

// Login
router.get("/login", function (req, res) {
	const username = req.flash("username")[0];
	const errors = req.flash("errors")[0] || {};
	res.render("home/login", {
		username: username,
		errors  : errors
	});
});

// Post Login
router.post("/login",
	function (req, res, next) {
		const errors = {};
		let isValid = true;

		if (!req.body.username) {
			isValid = false;
			errors.username = "Username is required!";
		}
		if (!req.body.password) {
			isValid = false;
			errors.password = "Password is required!";
		}

		if (isValid) {
			next();
		} else {
			req.flash("errors", errors);
			res.redirect("/login");
		}
	},
	passport.authenticate("local-login", {
			successRedirect: "/posts",
			failureRedirect: "/login"
		}
	));

// Logout
router.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

// Temp
router.get('/template', function (req, res, next) {
	console.log('/template page 접속');
	res.render('template');
});

router.get('/main', function (req, res, next) {
	console.log('/main page 접속');
	res.render('main');
});


module.exports = router;
