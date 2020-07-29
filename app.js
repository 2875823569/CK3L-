const novelDate = require("./models/novelDate");

const novel_zj = require("./models/db_zj");//俊林写的
var book_whichChapter = null//俊林写的

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var user=require("./models/userModel")

var path = require("path");
const User = require("./models/user");
const { resolve } = require("path");
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.post("/api/signIn", function (req, res) {
  var user = new User({
    username: req.body.userName,
    pwd: req.body.psw1,
    email: req.body.email
  })
  console.log(user)
  user.save(function (err, user) {
    if (err) {
      throw err
    }
    res.send({
      code: 0,
      msg: "添加成功！"
    })
  })
})
app.use(express.static(path.join(__dirname, 'public')))
app.listen(8080, function () {
  console.log("connected!")
})
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());

//获取小说信息

app.post("/api/getimg", (req, res) => {
  let arr_img = [],
    arr_name = [],
    writer = [],
    introduce = [];
  novelDate.find(
    { type1_name: "玄幻" },
    { book_img: 1, book_title: 1, book_author: 1, book_desc: 1 },
    (err, date) => {
      for (let i = 0; i < 10; i++) {
        arr_img.push(date[i].book_img);
        arr_name.push(date[i].book_title);
        writer.push(date[i].book_author);
        introduce.push(date[i].book_desc);
      }
      res.send({
        arr_img: arr_img,
        arr_name: arr_name,
        writer: writer,
        introduce: introduce
      });
    }
  );
});

app.post("/api/login", (req, res) => {
  let usr = { "email": req.body.mail }
  User.find(usr, function (err, data) {
    if (err) {
      res.send({
        code: 1,
        msg: "查询失败"
      })
    }

    if (data[0]) {
      // console.log(req.body.psw+"q")
      console.log(123);
      if (req.body.psw === data[0].pwd) {
        res.send({
          code: 0,
          msg: "查询成功！"
        })
      } else {
        res.send({
          code: 1,
          msg: "信息错误"
        })
      }
    } else {
      res.send({
        code: 1,
        msg: "查询失败"
      })
    }

  })
})

app.post("/api/booktype", (req, res) => {
  let booktype = [];
  novelDate.aggregate(
    [
      {
        $group: {
          _id: "$type1_name",
          // symbols:{$push:"$type1_name"}
        },
      },
    ],
    (err, date) => {
      date.forEach((item) => {
        booktype.push(item._id);
      });
      res.send({
        booktype: booktype,
      });
    }
  );
});


/*******************lm：获取后台用户信息*********************/
var userInformation={}
user.find({},(err,docs)=>{
  if(err){
    console.log("查询错误");
  }else{
    userInformation=docs;
  }
})
app.post("/api/homepage",(req,res)=>{
  res.send(userInformation)
})


/************************查询章节****************************///俊林写的,寇靖别动
app.post("/api/book_chapter",(req,res)=>{
  novel_zj.find({},{Chapter:1,_id:0},(err,docs)=>{
    if(!err){
      res.send(docs)
    }
    else{
      console.log("查询错误");
    }
  })
})

app.post("/api/book_desc",(req,res)=>{
  novelDate.find({book_title:"白骨大圣"},(err,docs)=>{
    if(!err){
      res.send(docs)
    }
    else{
      console.log("查询错误");
    }
  })
})

app.post("/api/book_whichChapter",(req,res)=>{
  book_whichChapter = req.body
})

app.post("/api/book_yourChapter",(req,res)=>{
  res.send(book_whichChapter)
})

/************************************************************/
app.listen("8888", () => {
  // console.log(arr_img);
});
