var mongoose = require("mongoose")
var novel_zj = require("../models/novel_zj")
mongoose.connect("mongodb://127.0.0.1/noval").then(() => console.log("链接成功"))

module.exports = novel_zj