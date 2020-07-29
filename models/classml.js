var mongoose = require("mongoose")
var novelDate = require("../models/db")
var express = require("express")
var classm = express()
var path = require("path")
var router = express.Router()
var bodyparser = require("body-parser")

// var novelDate = require("./novelDate")
// module.exports = novelDate

classm.use("/", express.static(path.join(__dirname, "/public")))
classm.use(bodyparser.json());

classm.post("/api/getimg", (req, res) => {
    var imgarr = [],
        booknamearr = [],
        writerarr = [],
        introduce = [];
    novelDate.find(
        { type1_name: "玄幻" },
        (err, date) => {
            if (err) throw err;
            for (let i = 0; i < 10; i++) {
                imgarr.push(date[i].book_img);
                booknamearr.push(date[i].book_title);
                writerarr.push(date[i].book_author);
                introduce.push(date[i].book_desc);
            }
            res.send({
                imgarr: imgarr,
                booknamearr: booknamearr,
                writerarr: writerarr,
                introduce: introduce
            });
        }
    )
})

classm.listen("8888", () => {

});




// mongoose.connect("mongodb://192.168.5.29:27017/noval")

// var db = mongoose.connection

// db.on("error",()=>{
//     console.log("连接失败");
// })
// db.once("open",()=>{
//     console.log("连接成功")
//     novelDate.find({},(err,doc)=>{
//         if(err) throw err;
//         console.log(doc);
//     })
// })



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




