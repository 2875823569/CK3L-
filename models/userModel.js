var UserSchema=require("../schemas/users")
var mongoose=require("mongoose")
var userModel=mongoose.model("users",UserSchema)
module.exports=userModel;