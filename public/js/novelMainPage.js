$(function () {
    //获取节点
    let start_read = $(".novel_introduce_btns").children().eq(0)
    let addToBookShelf = $(".novel_introduce_btns").children().eq(1)
    let goTOItemsList = $(".header_right").children().eq(0)
    let goTOBookShelf = $(".header_right").children().eq(1)
    let goTOVipCenter = $(".header_right").children().eq(2)
    let goTOApp = $(".header_right").children().eq(3)
    let goTOSearch = $(".loginInOut").children().eq(0)
    let goTOLogin = $(".loginInOut").children().eq(1)
    let goTORegister = $(".loginInOut").children().eq(2)
    let main_content_header = $(".main_content_header").children().children()
    let main_content_page = $(".main_content_page")
    let main_content_chapter = $(".main_content_chapter")
    let main_content_txt = $(".main_content_txt")
    let main_content_txt_right = $(".main_content_txt_right")
    let main_content_chapter_page = $(".main_content_chapter_page")
    let chapter_pages = $(".chapter_pages")
    let main_content_txt_desc = $(".main_content_txt").children().eq(1)

    //全局变量
    var pages = new Array();

    //获取章节
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
        init_page()
    })

    //渲染简介
    function getDesc() {
        return new Promise(function (resolve, reject) {
            $.post("/api/book_desc", {}, (res) => {
                resolve(res[0].book_desc)
            })
        })
    }
    getDesc().then((res) => {
        main_content_txt_desc.empty().append(`\xa0\xa0\xa0\xa0${res}...`)
        main_content_txt_right.css("top", -main_content_txt_desc.height())
        init_page()
    })

    //初始化页面内容
    function init_page() {
        main_content_txt.css("height", main_content_txt_right.height() + 40 + "px")

        //渲染章节
        pages.forEach(element => {
            chapter_pages.empty().append(pages.length)
            main_content_chapter_page.append(`<li>${element}</li>`
            )
        });
    }

    //初始化页面效果
    function init() {
        //开始阅读
        start_read.click(function () {
            location.href = "./novelStartRead.html"
        })

        //加入书架
        addToBookShelf.click(function () {
            location.href = "#"
        })

        //跳转分类
        goTOItemsList.click(function () {
            location.href = "#"
        })

        //跳转书架
        goTOBookShelf.click(function () {
            location.href = "#"
        })

        //跳转VIP
        goTOVipCenter.click(function () {
            location.href = "#"
        })

        //跳转App
        goTOApp.click(function () {
            location.href = "#"
        })

        //跳转搜索
        goTOSearch.click(function () {
            location.href = "#"
        })

        //跳转登录
        goTOLogin.click(function () {
            location.href = "#"
        })

        //跳转注册
        goTORegister.click(function () {
            location.href = "#"
        })

        //作品信息&章节目录切换
        main_content_header.click(function () {
            $(this).siblings().removeClass("border_bottom")
            $(this).addClass("border_bottom")
            if ($(this).index() == 0) {
                main_content_page.removeClass("hide")
                main_content_page.next().addClass("hide")
            }
            else {
                main_content_chapter.removeClass("hide")
                main_content_chapter.prev().addClass("hide")
            }
        })
    }
    init()
})