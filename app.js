//---------------------------------------------------------配置信息-----------------------------------------------------------
const novelDate = require("./models/novelDate"); //俊林写的

/**********************************************/ const novel_zj = require("./models/db_zj");
var book_whichChapter = {};
var fs = require("fs");
/**********************************************/

var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();
var user = require("./models/userModel");
var upload = require("./utils/upload");
var path = require("path");
const User = require("./models/user");
const { throws } = require("assert");
const { resolve } = require("path");
const router = express.Router();
//---------------------------------------------------------配置信息------------------------------------------------------------

//--------------------------------------------------------中间件设置---------------------------------------------------------
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "uploadcache")));
app.use(bodyParser.json());
// 设置令牌
app.use(
  session({
    secret: "user_secret", //生成唯一的令牌要加密 这个就是加密的密钥
    resave: false, //中间如果session数据被修改，不能重新设置到前端的cookie里面
    rolling: true, //每次请求都重置 cookie的设置
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, // 如果为true ，这个cookie的设置只能是 https
      sameSite: "lax", // 允许三方访问cookie否
      httpOnly: true, //只能在http协议下 访问 cookie
    },
  })
);
// 除了观看小说，其他操作跳过令牌验证
app.use(function (req, res, next) {
  if (
    !req.url.includes("book_whichChapter") &&
    !req.url.includes("user_likes")
  ) {
    next(); //放行，执行后面的路由匹配
  } else {
    if (req.session.userName) {
      // res.send({
      //   code: 0,
      // });
      next();
    } else {
      res.send({
        code: 2,
        msg: "登录失效!",
      });
    }
  }
});
//---------------------------------------------------------中间件设置--------------------------------------------------------------

// ----------------------------------------------------小说信息获取与处理----------------------------------------------------

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
      if (err) throw err;
      for (let i = 0; i < 10; i++) {
        arr_img.push(date[i].book_img || "");
        arr_name.push(date[i].book_title);
        writer.push(date[i].book_author);
        introduce.push(date[i].book_desc);
      }

      res.send({
        arr_img: arr_img,
        arr_name: arr_name,
        writer: writer,
        introduce: introduce,
      });
    }
  );
});
//模糊搜索查询小说
app.post("/api/search_book", (req, res) => {
  let regex = new RegExp(req.body.book_name);
  novelDate.find(
    { book_title: new RegExp(req.body.book_name) },
    (err, date) => {
      console.log(date);
      res.send({
        date: date,
      });
    }
  );
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
//小说分页获取
app.post("/api/book_pagination", (req, res) => {
  //传递参数为三个：查询条件query，一页的数量onepage_num,第几页page_num
  let query = req.body.query;
  let onepage_num = (req.body.onepage_num - 0) * (req.body.page_num - 1);
  let page_num = req.body.onepage_num - 0;

  novelDate
    .find(req.body.query)
    .skip((req.body.onepage_num - 0) * (req.body.page_num - 1))
    .limit(req.body.onepage_num - 0)
    .exec((err, date) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          date,
        });
      }
    });
});

//添加评论
app.post("/api/add_comment", (req, res) => {
  new Promise((resolve, reject) => {
    user.find({ email: req.body.email }, {}, (err, user_date) => {
      resolve(user_date[0])
    })
  }).then((user_date) => {
    novelDate.find(
      { book_title: req.body.book_name },
      { comment: 1 },
      (err, date) => {
        let old_comment = date[0].comment;
        let add_comment = {
          book_name: req.body.book_name,
          email: req.body.email,
          headImage: user_date.profilePic,
          username: user_date.username
        }
        let new_comment = old_comment.concat([add_comment]);
        novelDate.findOneAndUpdate(
          { book_title: req.body.book_name },
          { $set: { comment: new_comment } },
          (err, data1) => {
            if (err) {
              console.log(err);
            } else {
              res.send({
                code: 0,
                msg: "评论成功",
              });
            }
          }
        );
      }
    );
  })
});
//获取书籍评论
app.post("/api/get_comment", (req, res) => {
  novelDate.find(
    { book_title: req.body.book_name },
    { comment: 1 },
    (err, date) => {
      res.send({
        comment: date[0].comment
      })
    }
  );
});

//用户浏览记录
app.post("api/add")
// ----------------------------------------------------小说信息获取与处理----------------------------------------------------

//-----------------------------------------------------------数据处理---------------------------------------------------------
//清空cookie登录信息
app.post("/api/logout", (req, res) => {
  req.session.userName = "";
  req.session.pwd = "";
  req.session.headImage = "";
  req.session.email = "";
  res.send({
    code: 0,
    msg: "注销成功！",
  });
});
//上传头像
app.post("/upload", (req, res) => {
  upload.upload(req, res);
});
//传递数据
app.post("/api/send_information", (req, res) => {
  req.session.send_information = req.body;
  res.send({
    code: 0,
    msg: "传递成功",
  });
});
//接收数据
app.post("/api/get_send_information", (req, res) => {
  res.send({
    send_information: req.session.send_information,
  });
});
//-----------------------------------------------------------数据处理-----------------------------------------------------------


Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "H+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//-----------------------------------------------------------排行榜相关-----------------------------------------------------
//点击小说后观看次数加一
app.post("/api/update_num", (req, res) => {
  console.log(req.body);
  //获取小说浏览次数
  new Promise((resolve, reject) => {
    novelDate.find(
      { book_title: req.body.book_title },
      (err, date) => {
        let number = JSON.parse(JSON.stringify(date[0])).number - 0 + 1;
        //获取后次数加一并更新数据库
        novelDate.updateOne(
          { book_title: req.body.book_title },
          { $set: { number: number } },
          function (err, date1) {
            if (err) {
              console.log("观看次数更新失败");
            } else {
              resolve(date[0])
            }
          }
        );
      }
    );
  }).then((book_date) => {
    return new Promise((resolve, reject) => {
      // 判读用户是否登陆,登陆则将书本信息加入到历史记录中
      if (req.session.userName) {
        console.log("开始执行添加历史记录");
        user.find({ email: req.session.email }, { history: 1 }, (err, user_date) => {
          let old_history = user_date[0].history;
          let add_history = {
            book_name: book_date.book_title,
            book_img: book_date.book_img,
            introduce: book_date.book_desc,
            time: new Date().Format("yyyy-MM-dd HH:mm:ss")
          }
          let new_history = old_history.concat([add_history])
          resolve(new_history)
        })
      } else {
        reject()
      }
    })
  }).then((new_history) => {
    user.findOneAndUpdate({ email: req.session.email }, { $set: { history: new_history } }, (err, update_date) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          code: 0,
          msg: "更新成功",
        });
      }
    })
  }, () => {
    res.send({
      code: 2,
      msg: "用户未登录"
    })
  })
});
//查询排名前几的书
app.post("/api/get_top_book", (req, res) => {
  let arr_img = [],
    arr_name = [],
    writer = [],
    introduce = [];
  novelDate
    .find({})
    .sort({ number: -1 })
    .limit(12)
    .exec((err, date) => {
      for (let i = 0; i < date.length; i++) {
        arr_img.push(date[i].book_img);
        arr_name.push(date[i].book_title);
        writer.push(date[i].book_author);
        introduce.push(date[i].book_desc);
      }
      res.send({
        arr_img: arr_img,
        arr_name: arr_name,
        writer: writer,
        introduce: introduce,
      });
    });
});
//随机获取书籍当作编辑推荐页面
app.post("/api/round_book", (req, res) => {
  let arr_img = [],
    arr_name = [],
    writer = [],
    introduce = [];
  novelDate
    .find({})
    .skip(Math.random() * 5141 + 1)
    .limit(8)
    .exec((err, date) => {
      for (let i = 0; i < date.length; i++) {
        arr_img.push(date[i].book_img);
        arr_name.push(date[i].book_title);
        writer.push(date[i].book_author);
        introduce.push(date[i].book_desc);
      }
      res.send({
        arr_img: arr_img,
        arr_name: arr_name,
        writer: writer,
        introduce: introduce,
      });
    });
});
//------------------------------------------------------------排行榜相关----------------------------------------------------

//------------------------------------------------------------用户相关------------------------------------------------------
//用户注册
app.post("/api/signIn", function (req, res) {
  let usr = { email: req.body.email };
  User.find(usr, function (err, data) {
    if (err) {
      return err;
    }
    if (data[0]) {
      res.send({
        code: 3,
        msg: "此邮箱已被注册！",
      });
      return;
    }
    var user = new User({
      username: req.body.userName,
      pwd: req.body.psw1,
      email: req.body.email,
      profilePic: req.body.profilePic,
    });
    user.save(function (err, user) {
      if (err) {
        throw err;
      }
      res.send({
        code: 0,
        msg: "添加成功！",
      });
      return;
    });
  });
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
        req.session.userName = data[0].username;
        req.session.pwd = data[0].pwd;
        req.session.headImage = data[0].profilePic;
        req.session.email = data[0].email;
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
//上传头像
app.post("/upload", (req, res) => {
  upload.upload(req, res);
});
//获取用户数据
app.post("/api/get_user_information", (req, res) => {
  //   req.session.userName = "小明"
  // req.session.pwd = "123"
  // req.session.headImage = "../assets/user_head/斗破苍穹.jpg"
  // req.session.email = "fjlsa@fds"

  if (req.session && req.session.userName) {
    res.send({
      code: 0,
      user: {
        userName: req.session.userName,
        pwd: req.session.pwd,
        email: req.session.email,
        headImage: req.session.headImage,
      },
    });
  } else {
    res.send({
      code: 1,
      msg: "登陆失败",
    });
  }
});

//------------------------------------------------------------用户相关------------------------------------------------------
/*******************lm：获取后台用户信息*********************/
var userInformation = {};
user.find({}, (err, docs) => {
  if (err) {
    console.log(err);
  } else {
    userInformation = docs;
  }
});
app.post("/api/homepage", (req, res) => {
  res.send(userInformation);
});

app.post("/api/setUser", (req, res) => {
  // { afterNickname: '小明', afterFirstPsw: '123', afterSecondPsw: '123' }
  user.updateOne(
    { username: req.body.beforeName },
    {
      $set: {
        username: req.body.afterNickname,
        pwd: req.body.afterSecondPsw,
        profilePic: req.body.afterUrl,
      },
    },
    (err) => {
      if (!err) {
        console.log(req.body.afterUrl);
        res.send({
          code: 0,
          msg: "修改成功！",
        });
      }
    }
  );
});

app.post("/api/getBook", (req, res) => {
  novelDate.find({}, (err, docs) => {
    if (!err) {
      res.send({
        code: 0,
        msg: docs,
      });
    }
  });
}); //俊林写的,寇靖别动
/************************查询章节****************************/ app.post(
  "/api/book_chapter",
  (req, res) => {
    novel_zj.find({}, { Chapter: 1, _id: 0 }, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
      }
    });
  }
);

app.post("/api/book_desc", (req, res) => {
  novelDate.find(
    { book_title: req.session.send_information.book_name },
    (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        return false;
      }
    }
  );
});

app.post("/api/book_whichChapter", (req, res) => {
  book_whichChapter = req.body;
  res.send({
    code: 0
  })
});

app.post("/api/book_yourChapter", (req, res) => {
  fs.readFile(
    `./public/assets/novels/${book_whichChapter.page_chapter_idx}.txt`,
    "utf-8",
    function (err, data) {
      if (err) {
        console.log("错误");
      } else {
        res.send({ book_whichChapter, data });
      }
    })
});

app.post("/api/user_likes", (req, res) => {
  var email = req.body.email
  var book_name = req.body.book_name
  var novel_img = req.body.novel_img
  var obj = { book_name, novel_img }
  // console.log(novel_img);
  if (email != undefined && obj.book_name != undefined) {
    user.find({ email: email }, (err, docs) => {
      if (!err) {
        var arr = docs[0].user_likes
        if (arr.length <= 0) {
          arr.push(obj)
          user.updateOne({ email }, { $set: { user_likes: arr } }, (err, date) => { })
          // res.send({ code: 0, success: "成功加入书架" })
        }
        else {
          for (var i = 0; i < arr.length; i++) {
            // console.log(arr[i], book_name);
            if (arr[i].book_name == obj.book_name) {
              // res.send({ code: 1, err: "已在书架" })
              break
            }
            if (i == arr.length - 1) {
              arr.push(obj)
              // console.log(arr);
              user.updateOne({ email }, { $set: { user_likes: arr } }, () => { })
              break
              // res.send({ code: 0, success: "成功加入书架" })
            }
          }
        }
      }
      else {
        return false
      }
    })
  }
  else {
    return false
  }

})

/************************************************************/
app.listen("8888", () => {
  console.log("端口已开启");
});
