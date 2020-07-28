const novelDate = require("./models/db");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
let path = require("path");
const router = express.Router()


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
    { book_img: 1, book_title: 1 ,book_author: 1, book_desc: 1},
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
        writer:writer,
        introduce:introduce
      });
    }
  );
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

app.listen("8888", () => {
  // console.log(arr_img);
});
