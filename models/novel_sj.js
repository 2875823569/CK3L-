var NovelSchema = require("../schemas/user_likes")
var mongoose = require("mongoose")
var Novel_sj_model = mongoose.model("user_likes",NovelSchema)
module.exports = Novel_sj_model