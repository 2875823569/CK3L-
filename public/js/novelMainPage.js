$(function () {
    //获取节点
    let start_read = $(".novel_introduce_btns").children().eq(0)
    let header_logo = $(".header_logo")
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
    let novel_introduce_tittle = $(".novel_introduce_left").children().eq(0)
    let novel_introduce_author = $(".novel_introduce_left").children().eq(1).children()
    let main_content_txt_desc = $(".main_content_txt").children().eq(1)
    let novel_img = $(".novel_img").children()
    let novel_type = $(".novel_introduce_right").children().eq(1).children().eq(1)

    //全局变量
    var pages = new Array();
    var page_chapter_idx = null
    var page_chapter_content = null

    //渲染标题
    function getBookName() {
        return new Promise(function (resolve, reject) {
            $.post("/api/get_send_information", {}, (res) => {
                resolve(res)
            })
        })
    }
    getBookName().then((res) => {
        novel_introduce_tittle.empty().append(res.send_information.book_name)
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
        //渲染章节
        main_content_chapter_page.empty()
        chapter_pages.empty().append(pages.length)
        pages.forEach(element => {
            main_content_chapter_page.append(`<li>${element}</li>`)
        });
    })

    //渲染简介
    function getDesc() {
        return new Promise(function (resolve, reject) {
            $.post("/api/book_desc", {}, (res) => {
                console.log(res);
                if (res.length == 0) {
                    $("body").empty().append("404错误,服务器资源丢失!")
                }
                resolve(res[0])
            })
        })
    }
    getDesc().then((res) => {
        console.log(res);
        main_content_txt_desc.empty().append(`\xa0\xa0\xa0\xa0${res.book_desc}...`)
        main_content_txt_right.css("top", -main_content_txt_desc.height())
        //渲染book_author
        novel_introduce_author.empty().append(res.book_author)
        //渲染小说图片
        novel_img.attr("src", res.book_img)
        //渲染小说类型
        novel_type.empty().append(res.type2_name)
    })

    //初始化页面效果
    function init() {
        //初始化页面样式
        main_content_txt.css("height", main_content_txt_right.height() + 40 + "px")

        //开始阅读
        start_read.click(function () {
            page_chapter_idx = 1
            page_chapter_content = "第一章 修仙归来！"
            return new Promise(function (resolve, reject) {
                $.post("/api/book_whichChapter", { page_chapter_idx, page_chapter_content }, (res) => {
                    if (res.code != 0) {
                        alert("亲爱的亲，您还未登录噢！登录后即可阅读。")
                    }
                    else {
                        location.href = "./novelStartRead.html"
                    }
                })
            })
        })

        //加入书架
        addToBookShelf.click(function () {
            var book_name = novel_introduce_tittle.html()
            console.log(book_name);
            // return new Promise(function (resolve, reject) {
            //     $.post("/api/user_likes", { book_name }, (res) => {
            //         console.log(res);
            //     })
            // alert()
            // })
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

        //返回首页
        header_logo.click(function () {
            location.href = "../index.html"
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

        //章节跳转
        main_content_chapter_page.click(function (e) {
            if (e.target.tagName == "LI") {
                page_chapter_idx = ($(e.target).index())
                page_chapter_content = ($(e.target).html())
                page_chapter_idx++
                return new Promise(function (resolve, reject) {
                    $.post("/api/book_whichChapter", { page_chapter_idx, page_chapter_content }, (res) => {
                        if (res.code != 0) {
                            alert("亲爱的亲，您还未登录噢！登录后即可阅读。")
                        }
                        else {
                            location.href = "./novelStartRead.html"
                        }
                    })
                })
            }
        })

    }
    init()
})