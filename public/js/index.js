//--------------------------------------------------------获取数据库信息---------------------------------------------

var arr_img = [
  "../assets/轮播图images/我的徒弟都是大反派.jpg",
  "../assets/轮播图images/白骨大圣.jpeg",
  "../assets/轮播图images/皇兄万岁.jpg",
  "../assets/轮播图images/伏天氏.png",
  "../assets/轮播图images/圣墟.jpeg",
  "../assets/轮播图images/你有法力我有神功.jpg",
  "../assets/轮播图images/我师父收的徒弟都是怪物.jpg",
  "../assets/轮播图images/临渊行.jpg",
  "../assets/轮播图images/公子实在太正义了.jpeg",
  "../assets/轮播图images/最初进化.jpg",
];
var book_img = [];
var writer = [];
var book_name = [];
var introduce = [];
// document.body.style.width = `${document.body.clientWidth}px`;
var transform_x = 0;

//--------------------------------------------------------定义功能函数---------------------------------------------------
//获取用户信息
var get_user_information = function () {
  return new Promise((resolve, reject) => {
    $.post("/api/get_user_information", (res) => {
      if (!res.code) {
        resolve(res.user);
      } else {
        reject();
      }
    });
  });
};
var is_login = false;

//接受后台发送的信息，判断是否是登陆状态
get_user_information().then(
  (res) => {
    $(".login_btn").css({ display: "none" });
    $(".user").css({ display: "flex" });
    $(".user img").attr("src", res.headImage);
    $(".user p").text(`${res.userName}`);

    $(".user_login_box").css({ display: "none" });
    $(".user_islogin")
      .css({ display: "inline-block" })
      .prev()
      .prev()
      .attr("src", res.headImage);

    $(".user_islogin h2").text(`Hi ${res.userName}`);
    is_login = true;
  },
  () => {
    alert({},"当前未登陆");
  }
);
//获取传递的信息
var get_send_information = function () {
  return new Promise((resolve, reject) => {
    $.post("/api/get_send_information", (res) => {
      resolve(res);
    });
  });
};

//传递信息
var send_information = function (information) {
  
  return new Promise((resolve, reject) => {
    $.post("/api/send_information", information, (res) => {
      resolve(res);
    });
  });
};

//封装查询 信息的函数，输入条件name返回{
//   arr_img: arr_img,
//   arr_name: arr_name,
//   writer: writer,
//   introduce: introduce
// }
//查询数据库的函数
// let name = {type:"type1_name"}
var getInfromation = function (name) {
  return new Promise(function (resolve, reject) {
    $.post("/api/getimg", name, (res) => {
      resolve(res);
    });
  });
};

//点击小说类型函数
function click_book_type(information) {
  return function () {
    send_information(information).then((res) => {
      location.href = "../html/classf.html";
    });
  };
}

//点击小说函数
function click_book(information) {
  return function () {
    send_information(information).then((res) => {
      location.href = "../html/novelMainPage.html";
    });
  };
}

//点击函数后将小说点击数加一
function change_number(book_name) {
  book_name = { book_title: book_name };
  return new Promise((resolve, reject) => {
    $.post("/api/update_num", book_name, (res) => {
      resolve(res);
    });
  });
}
//获取点击量排名前十二的数据
function get_top_book() {
  return new Promise((resolve, reject) => {
    $.post("/api/get_top_book", (res) => {
      resolve(res);
    });
  });
}
//随机获取书本的函数
function round_book() {
  return new Promise((resolve, reject) => {
    $.post("/api/round_book", (res) => {
      resolve(res);
    });
  });
}
//对小说进行模糊搜索
function search_book(book_name) {
  return new Promise((resolve, reject) => {
    $.post("/api/search_book", { book_name: book_name }, (res) => {
      resolve(res);
    });
  });
}

//编写十本推荐小说的类
class Book {
  constructor(img, name, introduce, num, num_img) {
    this.img = img;
    this.name = name;
    this.introduce = introduce;
    this.num = num;
    this.num_img = num_img;
    this.init();
  }
  init() {
    this.render();
  }
  //创建dom节点
  render() {
    let li1 = $(`<li>
    <img class="rank" src="${this.num_img}" alt="排名">
    <img class="book_img" src="${this.img}" alt="" book_name = ${this.name}>
    <h3>${this.name}</h3>
    <p>${this.introduce}</p>
    </li>`);
    let li2 = $(`<li>
    <img class="book_img" src="${this.img}" alt="" book_name = ${this.name}>
    <h3>${this.name}</h3>
    <p>${this.introduce}</p>
    </li>`);
    this.li = this.num <= 3 ? li1 : li2;
    this.li.children(".book_img").on("click", this.click.bind(this));
    $(".book_list").append(this.li);
  }

  //节点的点击事件
  click() {
    console.log(123);
    let name = this.name;
    send_information({ book_name: name }).then((res) => {
      change_number(name).then((res) => {
        location.href = "../html/novelMainPage.html";
      });
    });
  }
}
//--------------------------------------------------------界面js--------------------------------------------------------
//添加八本小说到底部推荐区

//调用查找函数并渲染界面
getInfromation({ type1_name: "玄幻" }).then((res) => {
  // 渲染中间轮播图
  let img = "";
  for (let i = 0; i < 10; i++) {
    img += `<div class="item" book_name=${res.arr_name[i]}>
        <img class="img"  style="background-image: url('${arr_img[i]}');">
      </div>`;
  }
  $(".slider-inner").html(img);

  for (let i = 0; i < 8; i++) {
    $(".activetis").append(
      $(`<img src=${arr_img[i]} name=${res.arr_name[i]} alt="" >`)
    );
  }

  $(".mohu").css({ "background-image": `url(${arr_img[0]})` });
  (function ($) {
    $.fn.Slider = function (options) {
      "use strict";

      var settings = $.extend(
        {
          isAuto: true,
          transTime: 4000,
          animateSpeed: 1000,
          sliderMode: "slide", //'slide | fade',
          pointerControl: true,
          pointerEvent: "click", //'hover' | 'click',
          arrowControl: true,
        },
        options
      );
      var interval;
      var isAnimating = false;
      var $slider = $(this);
      var $sliderWrap = $slider.find(".slider-inner");
      var sliderCount = $sliderWrap.find("> .item").length;
      var sliderWidth = $slider.width();

      var currentIndex = 0;

      var sliderFun = {
        controlInit: function () {
          // pointerControl
          if (settings.pointerControl) {
            var html = "";
            html += '<ol class="slider-pointer">';
            for (var i = 0; i < sliderCount; i++) {
              if (i == 0) {
                html += '<li class="active"></li>';
              } else {
                html += "<li></li>";
              }
            }
            html += "</ol>";
            $slider.append(html);
            // 指示器居中
            var $pointer = $slider.find(".slider-pointer");
            $pointer.css({
              left: "50%",
              marginLeft: -$pointer.width() / 2,
            });
          }
          // pointerControl
          if (settings.arrowControl) {
            var html = "";
            html += '<span class="slider-control prev">&lt;</span>';
            html += '<span class="slider-control next">&gt;</span>';
            $slider.append(html);
          }
          $slider.on("click", ".slider-control.prev", function (event) {
            sliderFun.toggleSlide("prev");
          });
          $slider.on("click", ".slider-control.next", function (event) {
            sliderFun.toggleSlide("next");
          });
        },
        // slider
        sliderInit: function () {
          sliderFun.controlInit();
          // 模式选择
          if (settings.sliderMode == "slide") {
            // slide 模式
            $sliderWrap.width(sliderWidth * sliderCount);
            $sliderWrap.children().width(sliderWidth);
          } else {
            // mode 模式
            $sliderWrap.children().css({
              position: "absolute",
              left: 0,
              top: 0,
            });
            $sliderWrap.children().first().siblings().hide();
          }
          // 控制事件
          if (settings.pointerEvent == "hover") {
            $slider.find(".slider-pointer > li").mouseenter(function (event) {
              sliderFun.sliderPlay($(this).index());
            });
          } else {
            $slider.find(".slider-pointer > li").click(function (event) {
              if (currentIndex != $(this).index()) {
                sliderFun.sliderPlay($(this).index());
              }
            });
          }
          // 自动播放
          sliderFun.autoPlay();
        },
        // slidePlay
        sliderPlay: function (index) {
          sliderFun.stop();
          isAnimating = true;
          $sliderWrap.children().first().stop(true, true);
          $sliderWrap.children().stop(true, true);
          $slider
            .find(".slider-pointer")
            .children()
            .eq(index)
            .addClass("active")
            .siblings()
            .removeClass("active");
          $(".mohu").css({
            "background-image": `url(${arr_img[index]})`,
          });
          if (settings.sliderMode == "slide") {
            // slide
            if (index > currentIndex) {
              $sliderWrap.animate(
                {
                  left:
                    "-=" + Math.abs(index - currentIndex) * sliderWidth + "px",
                },
                settings.animateSpeed,
                function () {
                  sliderFun.stop();
                  isAnimating = false;
                  sliderFun.autoPlay();
                }
              );
            } else if (index < currentIndex) {
              $sliderWrap.animate(
                {
                  left:
                    "+=" + Math.abs(index - currentIndex) * sliderWidth + "px",
                },
                settings.animateSpeed,
                function () {
                  isAnimating = false;
                  sliderFun.autoPlay();
                }
              );
            } else {
              return;
            }
          } else {
            // fade
            if ($sliderWrap.children(":visible").index() == index) return;
            $sliderWrap
              .children()
              .fadeOut(settings.animateSpeed)
              .eq(index)
              .fadeIn(settings.animateSpeed, function () {
                isAnimating = false;
                sliderFun.autoPlay();
              });
          }
          currentIndex = index;
        },
        // toggleSlide
        toggleSlide: function (arrow) {
          if (isAnimating) {
            return;
          }
          var index;
          if (arrow == "prev") {
            index = currentIndex == 0 ? sliderCount - 1 : currentIndex - 1;
            sliderFun.sliderPlay(index);
          } else if (arrow == "next") {
            index = currentIndex == sliderCount - 1 ? 0 : currentIndex + 1;
            sliderFun.sliderPlay(index);
          }
        },
        // autoPlay
        autoPlay: function () {
          if (settings.isAuto) {
            interval = setInterval(function () {
              var index = currentIndex;

              currentIndex == sliderCount - 1
                ? (index = 0)
                : (index = currentIndex + 1);
              sliderFun.sliderPlay(index);

              //
            }, settings.transTime);
          } else {
            return;
          }
        },
        //stop
        stop: function () {
          clearInterval(interval);
        },
      };
      sliderFun.sliderInit();
    };
  })(jQuery);
  jQuery(document).ready(function ($) {
    $("#slider").Slider();
  });
  //渲染底部分类
  for (let i = 0; i < 8; i++) {
    let li = $(` <li book_name=${res.arr_name[i]}>
    <p class="book_name">${res.arr_name[i]}</p>
    <p class="book_container">
      ${res.introduce[i]}
    </p>
  </li>`);
    //
    $(".recommend2_container ul").append(li);
  }
});

//渲染排行前十的小说
get_top_book().then((res) => {
  let num = 1; //排名
  for (let i = 0; i < res.arr_name.length; i++) {
    num <= 3
      ? new Book(
          res.arr_img[i],
          res.arr_name[i],
          res.introduce[i],
          num,
          `../assets/images/第${num}.png`
        )
      : new Book(res.arr_img[i], res.arr_name[i], res.introduce[i]);
    num++;
  }
});
//小说分类
$.post("/api/booktype", {}, (res) => {
  let color = [
    "#CBDEFF",
    "#BFB6FF",
    "#D7B6FF",
    "#0F67FF",
    "#FFCFC1",
    "#FFE8C5",
    "#4D4D4D",
    "#E2EFC3",
    "#DBDBDB",
    "#67E2FF",
    "#69A1FF",
    "#FF835F",
  ];
  //渲染顶部分类
  for (let i = 0; i < res.booktype.length; i++) {
    let li = $(
      `<li type=${res.booktype[i]} style=background:${color[i]}>${res.booktype[i]}</li>`
    );
    $(".classification_hidden").append(li);
    li.on("click", click_book_type({ book_type: res.booktype[i] }));
  }
});

//-------------------------------------------------------------------------事件---------------------------------------------
//鼠标移到分类显示分类
$(".fenlei").on("mouseenter", () => {
  $(".classification_hidden").addClass("classification_display");
});
//鼠标移出隐藏分类
$(".fenlei").on("mouseleave", () => {
  $(".classification_hidden").removeClass("classification_display");
});
//给小说分类添加点击事件
$(".titles li").on("click", function () {
  send_information({ book_type: this.getAttribute("book_type") }).then(
    (res) => {
      location.href = "../html/classf.html";
    }
  );
});

//给周榜左右按钮添加点击事件
$(".go_right").on("click", function () {
  transform_x += 220;
  $(".go_left").css({ display: "block" });
  if (transform_x >= 880) {
    transform_x = 880;
    $(this).css({ display: "none" });
  }
  $(".book_list").css({ transform: `translateX(${-transform_x}px)` });
});
$(".go_left").on("click", function () {
  transform_x -= 220;
  $(".go_right").css({ display: "block" });
  if (transform_x <= 0) {
    transform_x = 0;
    $(this).css({ display: "none" });
  }

  $(".book_list").css({ transform: `translateX(${-transform_x}px)` });
});

//给编辑推荐中的书籍添加点击事件
$(".activetis").on("click", "img", function () {
  send_information({ book_name: this.getAttribute("name") }).then((res) => {
    change_number(this.getAttribute("name")).then(() => {
      location.href = "../html/novelMainPage.html";
    });
  });
});
$(".recommend2_container ul").on("click", "li", function () {
  send_information({ book_name: this.getAttribute("book_name") }).then(
    (res) => {
      location.href = "../html/novelMainPage.html";
    }
  );
});

//登陆按钮点击事件
$(".login_btn").on("click", function () {
  send_information({
    is_login: 1,
  }).then(() => {
    location.href = "../login.html";
  });
});
//登陆后用户点击头像进入个人主页
$(".user img").on("click", () => {
  location.href = "../html/homepage.html";
});
//点击底部个人主页按钮进入个人主页
$(".user_islogin span").on("click", () => {
  location.href = "../html/homepage.html";
});
$(".login_out").on("click", function () {
  send_information({ alreadyLogin: false }).then(() => {
    location.href = "../login.html";
  });
});

//登陆按钮
$(".user_login_box span:nth-of-type(1)").on("click", function () {
  send_information({
    is_login: 1,
  }).then(() => {
    location.href = "../login.html";
  });
});
//注册按钮
$(".user_login_box span:nth-of-type(2)").on("click", function () {
  send_information({
    is_login: 0,
  }).then(() => {
    location.href = "../login.html";
  });
});

//推荐轮播图添加点击事件
$(".slider-inner").on("click", ".item", function () {
  let book_name = this.getAttribute("book_name")
  send_information({
    book_name: book_name,
  }).then(() => {
    change_number(book_name).then(() => {
      location.href = "../html/novelMainPage.html";
    });
  });
});

// 点击更新随机切换八本小说推荐
$(".remommend2_top i").on("click", function () {
  round_book().then((res) => {
    $(".recommend2_container ul").html("");
    let li = "";
    for (let i = 0; i < 8; i++) {
      let li_ = ` <li book_name=${res.arr_name[i]}>
      <p class="book_name">${res.arr_name[i]}</p>
      <p class="book_container">
        ${res.introduce[i]}
      </p>
    </li>`;
      li += li_;
    }
    $(".recommend2_container ul").html(li);
  });
});
//点击放大镜显示搜索框
$(".search i").on("click", function () {
  $(".top_nav").fadeToggle("fast");
  $(".search input").slideToggle("fast");
  $(this).toggleClass("icon-fangdajing").toggleClass("icon-guanbi");
  $(".sear_container ul").html("");
  $(".search input").val("");
});
//搜索框事件
function debounce(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    let callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);

    if (callNow) func.apply(context, args);
  };
}
function star_search() {
  search_book($(this).val()).then((res) => {
    if (!$(this).val()) return;
    let li = "";
    for (let i = 0; i < res.date.length; i++) {
      li += `<li name=${res.date[i].book_title}>${res.date[i].book_title}</li>`;
    }
    $(".sear_container ul").html(li);
  });
}

//搜索部分
$(".search input").on("input", debounce(star_search, 100));
$(".search input").on("keydown", function (e) {
  if (!$(this).val()) return;
  if (e.keyCode == 13) {
    search_book($(this).val()).then((res) => {
      let li = "";
      for (let i = 0; i < res.date.length; i++) {
        li += `<li name=${res.date[i].book_title}>${res.date[i].book_title}</li>`;
      }
      $(".sear_container ul").html(li);
    });
  }
});
$(".sear_container ul").on("click", "li", function () {
  send_information({
    book_name: this.getAttribute("name"),
  }).then(() => {
    location.href = "../html/novelMainPage.html";
  });
});

//书架
$(".bookshelf").on("click",function(){
  if(is_login){
    location.href = "../html/bookShelf.html"
  }else{
    alert({},"你当前未登陆哦，获取不到你的书架")
  }
})

//分页测试
function book_pagination(query, onepage_num, page_num) {
  //传递参数为三个：查询条件query，一页的数量onepage_num,第几页page_num
  return new Promise((resolve, reject) => {
    $.post(
      "/api/book_pagination",
      { query: query, onepage_num: onepage_num, page_num: page_num },
      (res) => {
        resolve(res);
      }
    );
  });
}

//弹窗测试
// let alertName = {}//弹窗名字
function alert(alertName,content) {
  if (alertName.dialog11) {
    return alertName.dialog11.show();
  }
  alertName.dialog11 = jqueryAlert({
    icon: "",
    content: content,
    closeTime: 2000,
  });
}

//加入这个类改变弹窗样式
// .myallter{
//   top:30px !important;
// }

// alert()


//---------------------------------------------------------评论相关--------------------------------------------------------
//#region
//添加评论
function add_comment(email, book_name, comment) {
  //邮箱email,书名：book_name,评论内容comment
  return new Promise((resolve, reject) => {
    $.post(
      "/api/add_comment",
      { email: email, book_name: book_name, comment: comment },
      (res) => {
        resolve(res);
      }
    );
  });
}
// add_comment("123", "我的徒弟都是大反派", "牛逼").then((res) => {
//   if (!res.code) {
//     console.log(res);
//   }
// });
// 获取评论
function get_comment(book_name) {
  return new Promise((resolve,reject) => {
    $.post("/api/get_comment",{book_name:book_name},(res) => {
      resolve(res)
    })
  })
}
// get_comment("我的徒弟都是大反派").then((res) => {
//   console.log(res);
// })
// #endregion
