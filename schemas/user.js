var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
     username:String,
     pwd:String,
     icon:String,
     email:String
})

module.exports = UserSchema