//---------------------------------------------------------轮播图 --------------------------------------------------------
/**
 * Author         : CheneyLiu
 * Date           : date
 * isAuto:        true, 自动播放
 * transTime:     3000, 自动播放间隔
 * animateSpeed:  1000,  动画速度
 * sliderMode:    'slide', 类型//'slide | fade',
 * pointerControl: true, 指示器开关
 * pointerEvent:  'click', 指示器类型//'hover' | 'click',
 * arrowControl:  true, 左右控制
 */

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

//封装查询 信息的函数，输入条件name返回{
//   arr_img: arr_img,
//   arr_name: arr_name,
//   writer: writer,
//   introduce: introduce
// }

//--------------------------------------------------------定义功能函数---------------------------------------------------
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
  
  return function(){
    send_information(information).then((res) => {
      
      location.href = "../html/classf.html";
      
    });
  }
}

//点击小说函数
function click_book(information) {
  
  return function(){
    send_information(information).then((res) => {
      location.href = "../html/novelMainPage.html";
      
    });
  }
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
    
    send_information({book_name:this.name}).then(() => {
      location.href = "../html/novelMainPage.html";
    });
  }
}
//--------------------------------------------------------界面js--------------------------------------------------------
//添加八本小说到底部推荐区

//调用查找函数并渲染界面
getInfromation({ type1_name: "玄幻" }).then((res) => {
  
  for (let i = 0; i < res.arr_name.length; i++) {
    // 将十本小说的信息保存下来备用
    book_img.push(res.arr_img[i]);
    writer.push(res.writer[i]);
    book_name.push(res.arr_name[i]);
    introduce.push(res.introduce[i]);

    let img = $(`<div class="item" book_name=${res.arr_name[i]}>
        <img class="img"  style="background-image: url('${arr_img[i]}');">
      </div>`);
    $(".slider-inner").append(img);
  }
  for (let i = 0; i < 8; i++) {
    $(".activetis").append($(`<img src=${arr_img[i]} name=${book_name[i]} alt="" >`));
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

  let num = 1; //排名
  for (let i = 0; i < book_name.length; i++) {
    num <= 3
      ? new Book(
          book_img[i],
          book_name[i],
          introduce[i],
          num,
          `../assets/images/第${num}.png`
        )
      : new Book(book_img[i], book_name[i], introduce[i]);
    num++;
  }
  //渲染底部分类
  for (let i = 0; i < 8; i++) {
    let li = $(` <li book_name=${book_name[i]}>
    <p class="book_name">${book_name[i]}</p>
    <p class="book_container">
      ${introduce[i]}
    </p>
  </li>`);
    // 
    $(".recommend2_container ul").append(li);
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
    li.on("click", click_book_type({book_type:res.booktype[i]}));
  }
});
//鼠标移到分类显示分类
$(".fenlei").on("mouseenter", () => {
  $(".classification_hidden").addClass("classification_display");
});
//鼠标移出隐藏分类
$(".fenlei").on("mouseleave", () => {
  $(".classification_hidden").removeClass("classification_display");
});
//给小说分类添加点击事件
$(".titles li").on("click", function(){
  send_information({book_type:this.getAttribute("book_type")}).then((res) => {
    location.href = "../html/classf.html";
  })
});


//给周榜左右按钮添加点击事件
$(".go_right").on("click", function () {
  transform_x += 220;
  $(".go_left").css({"display":"block"})
  if (transform_x >= 660) {
    transform_x = 660;
    $(this).css({"display":"none"})
  }
  $(".book_list").css({ transform: `translateX(${-transform_x}px)` });
});
$(".go_left").on("click", function () {
  transform_x -= 220;
  $(".go_right").css({"display":"block"})
  if (transform_x <= 0) {
    transform_x = 0;
    $(this).css({"display":"none"})
  }
  
  $(".book_list").css({ transform: `translateX(${-transform_x}px)` });
});

//给编辑推荐中的书籍添加点击事件
$(".activetis").on("click","img", function(){
  send_information({book_name:this.name}).then((res) => {
    location.href = "../html/novelMainPage.html";
  })
})
$(".recommend2_container ul").on("click","li", function(){
  send_information({book_name:this.getAttribute("book_name")}).then((res) => {
    location.href = "../html/novelMainPage.html";
  })
})

//登陆按钮点击事件
$(".login_btn").on("click", function () {
  send_information({
    is_login: true,
  }).then(() => {
    location.href = "../login.html";
  });
});

//登陆按钮
$(".user_login_box span:nth-of-type(1)").on("click", function () {
  send_information({
    is_login: true,
  }).then(() => {
    location.href = "../login.html";
  });
});
//注册按钮
$(".user_login_box span:nth-of-type(2)").on("click", function () {
  send_information({
    is_login: false,
  }).then(() => {
    location.href = "../login.html";
  });
});
var a
//推荐轮播图添加点击事件
$(".slider-inner").on("click", ".item", function () {
  send_information({
    book_name: this.getAttribute("book_name")
  }).then(() => {
    location.href = "../html/novelMainPage.html";
  });
});
