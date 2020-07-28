var mongoose = require("mongoose")
var novelDate = require("../models/novelDate")
mongoose.connect("mongodb://192.168.31.1/noval").then(() => console.log("链接成功"))

module.exports = novelDate
// db.on("open",()=>{
//     novelDate.find({},(err,doc)=>{
//         if(err){
//             console.log(err);
//         }
//         console.log(doc[1]);
//     })
// })