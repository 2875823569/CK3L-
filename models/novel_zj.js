var NovelSchema = require("../schemas/novel_zj")
var mongoose = require("mongoose")
var Novel_zj_model = mongoose.model("Novel_zj",NovelSchema)
module.exports = Novel_zj_model