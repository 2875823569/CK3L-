var mongoose = require("mongoose")

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

var Schema = mongoose.Schema;
var BookSchema=new Schema({
    typ1_name:String,
    typ1_url:String,
    type2_name:String,
    type2_url:String,
    book_img:String,
    book_title:String,
    book_url:String,
    book_author:String,
    book_desc:String
});

var book = mongoose.model("book",BookSchema);

var book1 = new book({
    typ1_name:"String",
    typ1_url:"String",
    type2_name:"String",
    type2_url:"String",
    book_img:"String",
    book_title:"String",
    book_url:"String",
    book_author:"String",
    book_desc:"String"
})

console.log(book1);

// module.exports = novelDate
// db.on("open",()=>{
//     novelDate.find({},(err,doc)=>{
//         if(err){
//             console.log(err);
//         }
//         console.log(doc[1]);
//     })
// })