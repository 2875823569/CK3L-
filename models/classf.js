var mongoose = require("mongoose")
// var mongoClient = require("mongoose").MongoClient


mongoose.connect("mongodb://192.168.5.29:27017/noval")

var db = mongoose.connection

db.on("error",()=>{
    console.log("连接失败");
})
db.once("open",()=>{
    console.log("连接成功")
    
})
// db.once("close",()=>{
//     console.log("断开连接成功")
// })

// var MongoClient = require('mongodb').MongoClient;
// var url= 'mongodb://192.168.5.29:27017/';
 
// MongoClient.connect(url,{ useNewUrlParser: true },(err, db)=>{
//     if (err) throw err;
//     var dbo = db.db("noval");
//     var whereStr = {"type1_name":'玄幻'};  // 查询条件
//     dbo.collection("novelDatas").find(whereStr).toArray(function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         db.close();
//     });
// });




