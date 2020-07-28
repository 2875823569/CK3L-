
var novalDate = require("./models/db")

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
const User = require("./models/user");

novalDate();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))
app.post("/api/signIn",function(req,res){
    var user = new User({
        username : req.body.userName,
        pwd : req.body.psw1,
        email : req.body.email
    })
    console.log(user)
    user.save(function(err,user){
        if(err){
            throw err
        }
        res.send({
            code:0,
            msg:"添加成功！"
        })
    })
})
app.use(express.static(path.join(__dirname, 'public')))
app.listen(8080,function(){
    console.log("connected!")
})