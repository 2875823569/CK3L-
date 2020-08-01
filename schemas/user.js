var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
     username:String,
     pwd:String,
     profilePic:String,
     email:String,
     users_likes:[],
     history:[]
})

module.exports = UserSchema