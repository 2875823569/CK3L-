var NovelSchema = require("../schemas/noveldate")

var mongoose = require("mongoose")
var NovelDate_model = mongoose.model("novelDates",NovelSchema,"novelDates")

module.exports = NovelDate_model;