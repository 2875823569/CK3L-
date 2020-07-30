var UserSchema=require("../schemas/user")
var mongoose=require("mongoose")
var userModel=mongoose.model("users",UserSchema)
module.exports=userModel;