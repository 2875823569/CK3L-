var mongoose = require("mongoose")
var novel_zj = require("../models/novel_zj")
mongoose.connect("mongodb://192.168.31.1/noval").then(() => console.log("链接成功"))

module.exports = novel_zj