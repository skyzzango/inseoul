const mongoose = require("mongoose");
const util = require("../util"); // 1

// schema
const postSchema = mongoose.Schema({
	title: {type: String, required: [true, "Title is required!"]},
	body: {type: String, required: [true, "Body is required!"]},
	author: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}, //1
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date},
}, {
	toObject: {virtuals: true}
});

// virtuals
postSchema.virtual("createdDate")
	.get(function () {
		return util.getDate(this.createdAt); // 1
	});

postSchema.virtual("createdTime")
	.get(function () {
		return util.getTime(this.createdAt); // 1
	});

postSchema.virtual("updatedDate")
	.get(function () {
		return util.getDate(this.updatedAt); // 1
	});

postSchema.virtual("updatedTime")
	.get(function () {
		return util.getTime(this.updatedAt); // 1
	});

// model & export
const Post = mongoose.model("post", postSchema);
module.exports = Post;