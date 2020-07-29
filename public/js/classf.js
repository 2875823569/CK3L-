// const { resolve } = require("path");
// const { rejects } = require("assert");

var bookbox = $(".allbook");  //书架
var bookmes = $(".allbook>li")  //获取书本框
var result = $(".righttopbox>p>span")  //搜索结果
var allclassbtn = $('.allclass')  //获取分类框
var btitle = $(".righttopbox>span") //获取当面分类标题


class Book {                        //创建书对象
    constructor({ src, name }) {
        this.src = src;
        this.name = name;
        this.init();
    }
    init() {
        this.creatdom()
    }
    creatdom() {
        let li = document.createElement("li");
        li.innerHTML =
            `<div class="bookboxs">
                <img src="${this.src}"></img>
                <p>${this.name}</p>
            </div>`
        bookbox.append(li)
    }
}
class classNav {                    //创建分类对象
    constructor({ bookname }) {
        this.bookname = bookname;
        this.init()
    };
    init() {
        this.creatdom()
    }
    creatdom(num) {
        let li = document.createElement("li")
        li.classList.add("classbtn")
        li.innerHTML =
            `
            <p>${this.bookname}</p>
            <span class="choose iconfont icon-arrow-right"></span>
            `
        allclassbtn.append(li)
    }
    // onclicks(){

    // }

}

function getbooktype() {                //从端口获取书本分类
    return new Promise((resolve, reject) => {
        $.post("/api/booktype", (res) => {
            // console.log(res.booktype);
            btitle.append(`${res.booktype[0]}小说`) //设置默认显示
            for (let i = 0; i < res.booktype.length; i++) {
                new classNav({ bookname: res.booktype[i] })
            }
        })
    })
}
getbooktype()

//查询数据库的函数
// let name = {type:"type1_name"}
var getInfromation = function (name) {
    return new Promise(function (resolve, reject) {
      $.post("/api/getimg", name, (res) => {
        resolve(res);
      });
    });
  };

// getInfromation({type1_name:"玄幻"}).then((res)=>{
//     console.log(res);
// })

var clarr=[]
$(".allclass").on("click","li",function(){
    // console.log($(this).children().html();
    clarr.push($(this).children().html())
    getInfromation({type1_name:clarr[0]}).then((res)=>{
        console.log(res.arr_img.length);
        for(let i = 0;i<res.arr_img.length;i++){
            // getinformation(res.arr_img[i],res.arr_name[i])
            new Book({src:res.arr_img[i],name:res.arr_name[i]})
        }
    })
    clarr=[]
})
