const novelDate = require("./models/db");


// app.all('*', (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1');
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
const User = require("./models/user");
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

app.listen("8888", () => {
  // console.log(arr_img);
});
