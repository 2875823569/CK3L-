$(function () {
    //全局变量
    let pages = []

    //获取节点
    let book_tittle = $(".book_tittle")
    let header_logo = $(".header_logo")
    let book_reader_content = $(".book_reader_content")
    let mune = $(".mune")
    // let book_navigation = $(".book_navigation")
    let tools_back = $(".book_navigation").children().eq(0)
    let tools_mnue = $(".book_navigation").children().eq(1)
    let tools_settings = $(".book_navigation").children().eq(2)
    let tools_bookshelf = $(".book_navigation").children().eq(3)
    let tools_888 = $(".book_navigation").children().eq(4)
    let tools_toTop = $(".book_navigation").children().eq(5)

    //渲染页面
    function getChapter() {
        return new Promise(function (resolve, reject) {
            $.post("/api/book_yourChapter", {}, (res) => {
                console.log(res);
                if (res.page_chapter_content == undefined || res.page_chapter_content == 1) {
                    res.page_chapter_content = "第一章 修仙归来！"
                }
                resolve(res)
            })
        })
    }
    getChapter().then(function (res) {
        //标题
        book_tittle.empty().append(res.book_whichChapter.page_chapter_content)
        //文章
        book_reader_content.append(
            `<p>${res.data}</p>`
        )
    })

    //渲染章节
    function getPages() {
        return new Promise(function (resolve, reject) {
            $.post("/api/book_chapter", {}, (res) => {
                for (let i = 0; i < res.length; i++) {
                    pages.push(res[i].Chapter)
                }
                resolve();
            })
        })
    }
    getPages().then(() => {
        pages.forEach(element => {
            mune.append(`<li>${element}</li>`)
        });
    })

    //工具
    function tools(){
        //返回首页
        header_logo.click(function(){
            location.href = "../index.html"
        })

        tools_back.click(function(){
            location.href="./novelMainPage.html"
        })
        tools_mnue.click(function(){

        })
        tools_settings.click(function(){

        })
        tools_bookshelf.click(function(){
            
        })
        tools_888.click(function(){
            
        })
        tools_toTop.click(function(){
            
        })
    }
    tools()
})