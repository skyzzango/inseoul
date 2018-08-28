const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const util = require("../util");

// Index
router.get("/", function (req, res) {
	Post.find({})
		.populate("author") // 1
		.sort("-createdAt")
		.exec(function (err, posts) {
			if (err) return res.json(err);
			res.render("posts/index", {posts: posts});
		});
});

// New
router.get("/new", util.isLoggedin, function (req, res) { // 2
	const post = req.flash("post")[0] || {};
	const errors = req.flash("errors")[0] || {};
	res.render("posts/new", {post: post, errors: errors});
});

// Create
router.post("/", util.isLoggedin, function (req, res) { // 2
	req.body.author = req.user._id; // 2
	Post.create(req.body, function (err, post) {
		if (err) {
			req.flash("post", req.body);
			req.flash("errors", util.parseError(err));
			return res.redirect("/posts/new");
		}
		res.redirect("/posts");
	});
});

// Show
router.get("/:id", function (req, res) {
	Post.findOne({_id: req.params.id}) // 3
		.populate("author")               // 3
		.exec(function (err, post) {        // 3
			if (err) return res.json(err);
			res.render("posts/show", {post: post});
		});
});

// edit
router.get("/:id/edit", util.isLoggedin, checkPermission, function (req, res) { // 2, 3
	const post = req.flash("post")[0];
	const errors = req.flash("errors")[0] || {};
	if (!post) {
		Post.findOne({_id: req.params.id}, function (err, post) {
			if (err) return res.json(err);
			res.render("posts/edit", {post: post, errors: errors});
		});
	} else {
		post._id = req.params.id;
		res.render("posts/edit", {post: post, errors: errors});
	}
});

// update
router.put("/:id", util.isLoggedin, checkPermission, function (req, res) { // 2, 3
	req.body.updatedAt = Date.now();
	Post.findOneAndUpdate({_id: req.params.id}, req.body, {runValidators: true}, function (err, post) {
		if (err) {
			req.flash("post", req.body);
			req.flash("errors", util.parseError(err));
			return res.redirect("/posts/" + req.params.id + "/edit");
		}
		res.redirect("/posts/" + req.params.id);
	});
});

// destroy
router.delete("/:id", util.isLoggedin, checkPermission, function (req, res) { // 2, 3
	Post.remove({_id: req.params.id}, function (err) {
		if (err) return res.json(err);
		res.redirect("/posts");
	});
});

module.exports = router;

// private functions // 1
function checkPermission(req, res, next) {
	Post.findOne({_id: req.params.id}, function (err, post) {
		if (err) return res.json(err);
		if (post.author != req.user.id) return util.noPermission(req, res);

		next();
	});
}