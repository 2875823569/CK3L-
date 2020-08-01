// const { resolve } = require("path");

var bookbox = $(".allbook");  //书架
var bookmes = $(".allbook>li")  //获取书本框
var result = $(".righttopbox>p>span")  //搜索结果
var allclassbtn = $('.allclass')  //获取分类框
var btitle = $(".righttopbox>span") //获取当面分类标题
var headlogo = $('.headlogo')   //获取头部logo
var booktitle = $('.classf_nav li') //获取菜单
var booklike = booktitle.eq(1) //获取菜单中的书架按钮
// var booklike = $('.booktitle li').eq(2)

//------------------创建书对象---------------------
class Book {
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
//------------------创建分类对象--------------------
class classNav {
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

}



//----------------从端口获取书本分类--------------------------
function getbooktype() {
    return new Promise((resolve, reject) => {
        $.post("/api/booktype", (res) => {
            // console.log(res.booktype[0]);
            // btitle.append(`${res.booktype[0]}小说`) //设置默认显示

            classpage({ type1_name: res.booktype[0] }, {}, 1)


            for (let i = 0; i < res.booktype.length; i++) {
                new classNav({ bookname: res.booktype[i] })
            }
        })
    })
}

//--------------------初始化----------------------

function init() {
    getbooktype()

}
init()


//---------------------分页查询----------------------------
var pageNum = 0, pageSize = 20, total = 0;
function getInfromation(query, onepage_num, page_num) {

    return new Promise(function (resolve, reject) {

        $.post("/api/book_pagination", { query: query, onepage_num: onepage_num, page_num: page_num }, (res) => {
            bookbox.empty()

            for (let i = 0; i < res.date.length; i++) {
                new Book({ src: res.date[i].book_img, name: res.date[i].book_title })
            }
            resolve(res);
        });
    });
};
//-------------------查询数据库的函数-------------------------

var clas3 = []
function classpage(query, onepage_num, page_num) {
    return new Promise(function (resolve, reject) {
        $.post("/api/book_pagination", { query: query, onepage_num: onepage_num, page_num: page_num }, (res) => {
            result.empty()

            result.append(res.date.length) //搜索结果

            total = res.date.length
            let pagenumber = Math.ceil(total / pageSize)
            // console.log(pagenumber);
            // console.log(res.date[0].type1_name);
            let lis = document.createDocumentFragment()

            for (let index = 0; index < pagenumber; index++) {
                var li = $(`<li><a href="#" clas=${res.date[0].type1_name} data-num=${index}>${index + 1}</a></li>`);
                // if (index == pageNum) {
                //     li.addClass("active")
                // }
                lis.append(li[0]);
            }
            $('.pagination').empty()
            $('.pagination')[0].appendChild(lis)

            resolve(res);
        });
    });
}

//-----------------分页渲染-------------------------


$('.pagination').on('click', 'a', function () {
    let pageNum2 = $(this).attr("data-num");

    clas2 = $(this).attr("clas");
    console.log($(this).parent()[0]);
    // $(this).parent()[0].classList.add('active')


    // console.log(clas2,pageSize,pageNum2-0+1);
    // classpage({ type1_name:clas2}, pageSize, pageNum2-0+1)

    getInfromation({ type1_name: clas2 }, pageSize, pageNum2 - 0 + 1)
})

//-------------------分类-----------------------------
var clarr = []

$(".allclass").on("click", "li", function () {
    bookbox.empty();
    $('.pagination').empty();
    // console.log($(this).children().html();
    let classfy = $(this).children().html();

    btitle.empty();
    btitle.append(`${classfy}小说`)
    clarr.push($(this).children().html())
    // console.log(clarr);
    creatbooks()                //创建书本
    classpage({ type1_name: clarr[0] }, {}, 1)

    clarr = []
    // console.log(clarr);
})
//---------------------创建book实例------------------------
function creatbooks() {
    getInfromation({ type1_name: clarr[0] }, 20, 1).then((res) => {
        // console.log(res.arr_img.length);
        // console.log(res);

        for (let i = 0; i < res.date.length; i++) {
            // getinformation(res.arr_img[i],res.arr_name[i])
            new Book({ src: res.date[i].book_img, name: res.date[i].book_title })

        }
    })

}


//------------------------传参数-----------------------
var clarr2 = []
$(".allbook").on("click", 'li', function () {
    // console.log($(this).children().children().eq(1).html();
    clarr2.push($(this).children().children().eq(1).html());
    console.log(clarr2[0]);
    
    var clarr3 = clarr2[0]
    $.post("/api/send_information", { "book_name": clarr3 }, (res) => {
        // console.log(res.booktype);
        console.log(res);
        clarr2 = []
        location.href = '../html/novelMainPage.html'
    })
    console.log(clarr3);    
    $.post('/api/update_num',{book_title:clarr3}, (res) => {
        console.log(res);
    })   

})

//--------------------获取分类信息-------------------------
function getclassmessage() {
    return new Promise(function (resolve, reject) {


        $.post('/api/get_send_information', (res) => {

            // console.log(res);
            btitle.append(`${res.send_information.book_type}小说`) //设置显示

            classpage({ type1_name: res.send_information.book_type }, 20, 1).then((res) => {
                result.append(res.date.length)
                // console.log(res.date.length);

                for (let i = 0; i < res.date.length; i++) {
                    new Book({ src: res.date[i].book_img, name: res.date[i].book_title })
                }
            })
            resolve(res)

        })
    })
}
getclassmessage()






// function num(booknames) {
//     return new Promise(function(resolve, reject){
        // $.post('/app/update_num'),{booknames}, (res) => {


        //     resolve(res)
        // }
//     })

// }
// num()



$('.icon-fangdajing').on('click', function () {
    // $('.seatch_btn')
    $('.sbtn>input')[0].classList.toggle('seatch_btn2')
})


headlogo.on('click', () => {
    location.href = '../../index.html'
})

$('.log_btn').on('click', () => {
    location.href = '../../login.html'
})
$('.reg_btn').on('click', () => {
    location.href = '../../login.html'
})

booklike.on('click', () => {
    location.href = '../html/novelStartRead.html'

})
