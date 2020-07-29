const novelDate = require("./models/novelDate");

/**********************************************///俊林写的
const novel_zj = require("./models/db_zj");
var book_whichChapter = {}
var fs = require('fs');

/**********************************************/

var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();
var user = require("./models/userModel");
var upload = require("./utils/upload")


var path = require("path");
const User = require("./models/user");
const { resolve } = require("path");
const router = express.Router();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//用户注册
app.post("/api/signIn", function (req, res) {
  console.log(req.body)
  let usr = { email: req.body.email };
  User.find(usr, function (err, data) {
    if (err) {
      return err
    }
    if (data[0]) {
      res.send({
        code: 3,
        msg: "此邮箱已被注册！",
      })
      return
    }
    var user = new User({
      username: req.body.userName,
      pwd: req.body.psw1,
      email: req.body.email,
      profilePic:req.body.profilePic
    });
    user.save(function (err, user) {
      if (err) {
        throw err;
      }
      res.send({
        code: 0,
        msg: "添加成功！",
      });
      return
    });
  })
});
app.use(express.static(path.join(__dirname, "public")));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, 'uploadcache')))
app.use(bodyParser.json());

// 设置令牌
app.use(session({
    secret: "user_secret", //生成唯一的令牌要加密 这个就是加密的密钥
    resave: false, //中间如果session数据被修改，不能重新设置到前端的cookie里面
    rolling: true, //每次请求都重置 cookie的设置
    cookie: {
      maxAge: 1000 * 60* 60,
      secure: false, // 如果为true ，这个cookie的设置只能是 https
      sameSite: "lax", // 允许三方访问cookie否
      httpOnly: true, //只能在http协议下 访问 cookie
    },
  })
);

// 除了观看小说，其他操作跳过令牌验证
app.use(function (req, res, next) {
  if (!req.url.includes("book_whichChapter"))
    // req.url.indexOf("register") > -1 ||
    // req.url.indexOf("/api/booktype") > -1 ||
    // req.url.indexOf("/api/getimg") > -1
   {
    next(); //放行，执行后面的路由匹配
  } else {
    next();//后面删除---------------------------------------------------------------------------------------------
    if (req.session.username) {
      next();
    } else {
      next(); //后面删除！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
      res.send({
        code: 2,
        msg: "登录失效!",
      });
    }
  }
});
// req.session.username = user._id

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
      for (let i = 0; i < 16; i++) {
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
//用户登录
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
      if (req.body.psw === data[0].pwd) {
        req.session.userName = data[0].username
        req.session.pwd = data[0].psd
        req.session.headImage = data[0].profilePic
        req.session.email = data[0].email
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
//获取所有小说类型
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
//上传头像
app.post("/upload",(req,res)=>{
  upload.upload(req,res)
})

//传递数据
app.post("/api/send_information", (req, res) => {
  req.session.send_information = req.body;
  res.send({
    code: 0,
    msg: "传递成功",
  });
});
app.post("/api/get_send_information", (req, res) => { 
  res.send({
    send_information: req.session.send_information,
  });
});
//------------------------------------------------测试用例-----------------------------------
// req.session.userName = "小明"
// req.session.pwd = "123"
// req.session.headImage = "fjlsajf"
//------------------------------------------------测试用例-----------------------------------

//获取用户数据
app.post("/api/get_user_information",(req,res)=>{
  console.log(req.session);
  if(req.session || req.session.userName){
    // req.session.userName = "小明"
    // req.session.pwd = "123"
    // req.session.headImage = "fjlsajf"
    res.send({
      code:0,
      user:{
        userName:req.session.userName,
        pwd : req.session.pwd,
        headImage : req.session.headImage
      }
    })
  }
})

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
});

app.post("/api/setUser",(req,res)=>{
  user.find({username:"小明"},(err,docs)=>{
    if(err){
      console.log("更改查询失败！");
    }else{
      // { afterNickname: '小明', afterFirstPsw: '123', afterSecondPsw: '123' }
      user.update({username:"test"},{$set:{username:req.body.afterNickname,pwd:req.body.afterSecondPsw}},(err)=>{
        if(!err){
          res.send({
            code:0,
            msg:"修改成功！"
          })
        }
      })
    }
  })
})
/************************查询章节****************************///俊林写的,寇靖别动
app.post("/api/book_chapter", (req, res) => {
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
  novelDate.find({ book_title: send_information.book_name }, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("查询错误");
    }
  })
})

app.post("/api/book_whichChapter", (req, res) => {
  book_whichChapter = req.body
})

app.post("/api/book_yourChapter", (req, res) => {
  fs.readFile(`./public/assets/novels/${book_whichChapter.page_chapter_idx}.txt`, 'utf-8', function (err, data) {
    if (err) {
      console.error(err);
    }
    else {
      res.send({book_whichChapter,data})
    }
  });
})

/************************************************************/
app.listen("8888", () => {
  console.log("端口已打开");
});
