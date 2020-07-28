var mongoose = require("mongoose")

mongoose.connect("mongodb://192.168.5.29/noval").then(() => console.log("链接成功"))


// db.on("open",()=>{
//     novelDate.find({},(err,doc)=>{
//         if(err){
//             console.log(err);
//         }
//         console.log(doc[1]);
//     })
// })