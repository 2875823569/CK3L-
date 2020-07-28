var monoose = require("mongoose");

var UserSchema=monoose.Schema({
    username:String,
    pwd:String,
    email:String
});
module.exports = UserSchema;