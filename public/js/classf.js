
var bookbox = $(".allbook");  //书架
var bookmes = $(".allbook>li")  //获取书本框
var result = $(".righttopbox>p>span")  //搜索结果
var allclassbtn = $('.allclass')  //获取分类框
var btitle = $(".righttopbox>span") //获取当面分类标题
var headlogo = $('.headlogo')   //获取头部logo


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
            // console.log(res.booktype);
            // btitle

            btitle.append(`${res.booktype[0]}小说`) //设置默认显示
            getInfromation({type1_name:res.booktype[0]}).then((res)=>{
                // console.log(res.arr_img.length);
                result.append(res.arr_img.length)
                for(let i = 0;i<res.arr_img.length;i++){
                new Book({src:res.arr_img[i],name:res.arr_name[i]})
            
                }
            }) //默认首页显示


            for (let i = 0; i < res.booktype.length; i++) {
                new classNav({ bookname: res.booktype[i] })
            }
        })

        

    })
}
getbooktype()

//-----------------查询数据库的函数-------------------
var getInfromation = function (name) {
    return new Promise(function (resolve, reject) {
      $.post("/api/getimg", name, (res) => {
        resolve(res);
      });
    });
  };


var clarr=[]
//-------------------分类-----------------------------
$(".allclass").on("click","li",function(){             
    bookbox.empty();
    // console.log($(this).children().html();
    let classfy = $(this).children().html();
    btitle.empty();
    btitle.append(`${classfy}小说`) 
    clarr.push($(this).children().html())

    creatbooks()                //创建书本
    clarr=[]
})
//---------------------创建book实例------------------------
function creatbooks(){  
    
    getInfromation({type1_name:clarr[0]}).then((res)=>{
        // console.log(res.arr_img.length);
        result.empty()
        result.append(res.arr_img.length) //搜索结果
        for(let i = 0;i<res.arr_img.length;i++){
            // getinformation(res.arr_img[i],res.arr_name[i])
        new Book({src:res.arr_img[i],name:res.arr_name[i]})

        }
    })

}



//------------------------传参数-----------------------
var clarr2=[]
$(".allbook").on("click",'li',function(){
    // console.log($(this).children().children().eq(1).html();
    clarr2.push($(this).children().children().eq(1).html());
    console.log(clarr2[0]);
    var clarr3 = clarr2[0]
    $.post("/api/send_information",{"book_name":clarr3},(res) => {
        // console.log(res.booktype);
        console.log(res);
        clarr2=[]
        location.href='../html/novelMainPage.html'
    })
})

headlogo.on('click',()=>{
    location.href='../../index.html'
})

$('.log_btn').on('click',()=>{
    location.href='../../login.html'
})
$('.reg_btn').on('click',()=>{
    location.href='../../login.html'
})

