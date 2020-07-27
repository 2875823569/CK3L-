var monoose = require("mongoose");

var BookSchema=monoose.Schema({
    type1_name:String,
    type1_url:String,
    type2_name:String,
    type2_url:String,
    book_img:String,
    book_title:String,
    book_url:String,
    book_author:String,
    book_desc:String
});
module.exports = BookSchema;