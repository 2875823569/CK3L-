const novelDate = require("./models/novelDate");
const novel_zj = require("./models/db_zj"); //俊林写的
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();
var user = require("./models/userModel");

var path = require("path");
const User = require("./models/user");
const router = express.Router();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.post("/api/signIn", function (req, res) {
  var user = new User({
    username: req.body.userName,
    pwd: req.body.psw1,
    email: req.body.email,
  });
  console.log(user);
  user.save(function (err, user) {
    if (err) {
      throw err;
    }
    res.send({
      code: 0,
      msg: "添加成功！",
    });
  });
});
app.use(express.static(path.join(__dirname, "public")));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());

//设置令牌
// app.use(
//   session({
//     //
//     secret: "user_secret", //生成唯一的令牌要加密 这个就是加密的密钥
//     resave: false, //中间如果session数据被修改，不能重新设置到前端的cookie里面
//     rolling: true, //每次请求都重置 cookie的设置
//     cookie: {
//       maxAge: 10000 * 1000 * 3600,
//       secure: false, // 如果为true ，这个cookie的设置只能是 https
//       sameSite: "lax", // 允许三方访问cookie否
//       httpOnly: true, //只能在http协议下 访问 cookie
//     },
//   })
// );

//注册和登陆跳过令牌验证
// app.use(function (req, res, next) {
//   if (
//     req.url.indexOf("login") > -1 ||
//     req.url.indexOf("register") > -1 ||
//     req.url.indexOf("upload") > -1
//   ) {
//     next(); //放行，执行后面的路由匹配
//   } else {
//     if (req.session.username) {
//       next();
//     } else {
//       res.send({
//         code: 2,
//         msg: "登录失效!",
//       });
//     }
//   }
// });
var send_information = {};

//获取小说信息
app.post("/api/getimg", (req, res) => {
  let arr_img = [],
    arr_name = [],
    writer = [],
    introduce = [];
  // type = res.body ? res.body : "玄幻"

  novelDate.find(
    req.body,
    { book_img: 1, book_title: 1, book_author: 1, book_desc: 1 },
    (err, date) => {
      for (let i = 0; i < 10; i++) {
        arr_img.push(date[i].book_img || "");
        arr_name.push(date[i].book_title);
        writer.push(date[i].book_author);
        introduce.push(date[i].book_desc);
      }
      // console.log(book_img,book_title);
      res.send({
        arr_img: arr_img,
        arr_name: arr_name,
        writer: writer,
        introduce: introduce,
      });
    }
  );
});
//添加用户信息
app.post("/api/login", (req, res) => {
  let usr = { email: req.body.mail };
  User.find(usr, function (err, data) {
    if (err) {
      res.send({
        code: 1,
        msg: "查询失败",
      });
    }

    if (data[0]) {
      // console.log(req.body.psw+"q")
      console.log(123);
      if (req.body.psw === data[0].pwd) {
        res.send({
          code: 0,
          msg: "查询成功！",
        });
      } else {
        res.send({
          code: 1,
          msg: "信息错误",
        });
      }
    } else {
      res.send({
        code: 1,
        msg: "查询失败",
      });
    }
  });
});
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

//传递数据
app.post("/api/send_information", (req, res) => {
  send_information = req.body;
  console.log(req.body);
  res.send({
    code: 0,
    msg: "传递成功",
  });
});
app.post("/api/get_send_information", (res, req) => {
  req.send({
    send_information: send_information,
  });
});

/*******************lm：获取后台用户信息*********************/
var userInformation = {};
user.find({}, (err, docs) => {
  if (err) {
    console.log("查询错误");
  } else {
    userInformation = docs;
  }
});
app.post("/api/homepage", (req, res) => {
  res.send(userInformation);
}); //俊林写的,寇靖别动
/************************查询章节****************************/ app.post(
  "/api/book_chapter",
  (req, res) => {
    novel_zj.find({}, { Chapter: 1, _id: 0 }, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log("查询错误");
      }
    });
  }
);

app.post("/api/book_desc", (req, res) => {
  novelDate.find({ book_title: "白骨大圣" }, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("查询错误");
    }
  });
});

// //获取分类
// app.post("/api/getwx",(req,res)=>{
//   let imgarr = [],
//       booknamearr = [],
//       writerarr = [],
//       introducearr = [];
//   novelDate.find({arr_name:"武侠"},(err,date)=>{
//     if(err) throw err;
//     for (let i = 0; i < 10; i++) {
//       imgarr.push(date[i].arr_img);
//       booknamearr.push(date[i].arr_name);
//       writerarr.push(date[i].writer);
//       introducearr.push(date[i].introduce);
//     }
//     app.send({
//         imgarr: arr_img,
//         booknamearr:arr_name,
//         writerarr:  writer,
//         introducearr: introduce,
//     })
//   })

// })

/************************************************************/
app.listen("8888", () => {
  console.log("端口已打开");
});
