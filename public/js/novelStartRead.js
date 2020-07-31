$(function () {
    //全局变量
    let pages = []

    //获取节点
    let book_tittle = $(".book_tittle")
    let header_logo = $(".header_logo")
    let book_reader_content = $(".book_reader_content")
    let mune = $(".mune")
    let book_navigation = $(".book_navigation")
    let tools_back = $(".book_navigation").children().eq(0)
    let tools_mnue = $(".book_navigation").children().eq(1)
    let tools_settings = $(".book_navigation").children().eq(2)
    let tools_bookshelf = $(".book_navigation").children().eq(3)
    let tools_888 = $(".book_navigation").children().eq(4)
    let tools_toTop = $(".book_navigation").children().eq(5)
    let setting = $(".setting")
    let book_content = $(".book_content")
    let color_change = $(".setting").children().eq(1)
    let font_change = $(".setting").children().eq(2).children().eq(1).children()
    let font_size = $(".setting").children().eq(3).children().eq(1).children()
    let close = $(".setting").children().eq(4)
    let reset = $(".setting").children().eq(5)
<<<<<<< HEAD
=======
    let now_chapter = $(".now_chapter")
>>>>>>> 309aa66d473325715fd6658a16e1a03a25962467

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
        return res
    })
        .then(function (ress) {
            //渲染章节
            getPages(ress)
        })

    function getPages(ress) {
        return new Promise(function (resolve, reject) {
            $.post("/api/book_chapter", {}, (res) => {
                for (let i = 0; i < res.length; i++) {
                    pages.push(res[i].Chapter)
                }
                resolve(ress);
            })
        })
            .then((res) => {
<<<<<<< HEAD
                console.log();
                pages.forEach(element => {
                    mune.append(`<li>${element}</li>`)
                });
                mune.children().eq(res.book_whichChapter.page_chapter_idx - 1).addClass("color")
                mune.append(`<li style="font-size:14px">人家也是有底线的啦~</li>`)
=======
                pages.forEach(element => {
                    mune.children("div").append(`<li>${element}</li>`)
                });
                mune.children("div").children().eq(res.book_whichChapter.page_chapter_idx - 1).addClass("color")
                now_chapter.children().empty().append(res.book_whichChapter.page_chapter_content)
                mune.children("div").append(`<li style="font-size:14px">人家也是有底线的啦~</li>`)
>>>>>>> 309aa66d473325715fd6658a16e1a03a25962467
                tools()
            })
    }

<<<<<<< HEAD
=======
    //工具开关
>>>>>>> 309aa66d473325715fd6658a16e1a03a25962467
    function tools_close_open(e) {
        if (e.hasClass("hide")) {
            e.siblings().addClass("hide")
            e.removeClass("hide")
        }
        else {
            e.addClass("hide")
        }
    }

    //工具
    function tools() {
        //初始化
        var windowlHeight = window.innerHeight;
        mune.css("left", -(mune.width() + 30))
<<<<<<< HEAD
        mune.height(windowlHeight - book_navigation.offset().top)
        setting.css("left", -setting.width())
=======
        mune.height(windowlHeight - book_navigation.offset().top - 30)
        mune.children("div").css("height", mune.height() - mune.children("p").height() - 30)
        setting.css("left", -(setting.width() + 56))
>>>>>>> 309aa66d473325715fd6658a16e1a03a25962467

        //返回首页
        header_logo.click(function () {
            location.href = "../index.html"
        })

        //返回小说页
        tools_back.click(function () {
            location.href = "./novelMainPage.html"
        })

        //目录开关
        tools_mnue.click(function () {
            tools_close_open(mune)
        })

        //目录跳转
        mune.click(function (e) {
            if (e.target.tagName == "LI") {
                if (e.target.nextSibling == null) {
                    return false
                }
                else {
                    $(e.target).siblings().removeClass("color")
                    $(e.target).addClass("color")
                    page_chapter_idx = ($(e.target).index())
                    page_chapter_content = ($(e.target).html())
                    page_chapter_idx++
                    return new Promise(function (resolve, reject) {
                        $.post("/api/book_whichChapter", { page_chapter_idx, page_chapter_content }, () => { })
                        return new Promise(function (resolve, reject) {
                            $.post("/api/book_yourChapter", {}, (res) => {
                                resolve(res)
                            })
                        }).then(function (res) {
                            mune.addClass("hide")
                            //标题
                            book_tittle.empty().append(res.book_whichChapter.page_chapter_content)
                            //文章
                            book_reader_content.empty().append(
                                `<p>${res.data}</p>`
                            )
<<<<<<< HEAD
=======
                            //目录下标
                            now_chapter.children().empty().append(res.book_whichChapter.page_chapter_content)
                            mune.css("left", -(mune.width() + 14))
>>>>>>> 309aa66d473325715fd6658a16e1a03a25962467
                        })
                    })
                }
            }
        })

        //设置开关
        tools_settings.click(function () {
            tools_close_open(setting)
        })
<<<<<<< HEAD

        //换主题
        color_change.click(function (e) {
            if (e.target.tagName == "SPAN" || e.target.tagName == "I") {
                if ($(e.target).children().css("display") == "block" || $(e.target).css("display") == "block") {
                    return false
                }
                else {
                    $(e.target).siblings().css("border-color", "#635752")
                    $(e.target).css("border-color", "red")
                    $(e.target).siblings("span").children().css("display", "none")
                    $(e.target).children().css("display", "block").css("border", "red")

                    //更换主题
                    console.log($(e.target).css("background-color"));
                    book_content.css("background-color", $(e.target).css("background-color"))
                    setting.css("background-color", $(e.target).css("background-color"))
                    mune.css("background-color", $(e.target).css("background-color"))
                    book_navigation.css("background-color", $(e.target).css("background-color"))
                }
            }
        })

        //换字体
        font_change.click(function () {
            book_content.css("font-family", $(this).html())
            $(this).css("color", "red").siblings().css("color", "#635752")
        })

        //换字体大小
        font_size.click(function () {
            if ($(this).index() == 0) {
                var font_size_num = parseInt($(this).next().html())
                var book_content_num = parseInt($(this).next().html()) + 8
                if (font_size_num <= 10) {
                    return false
                }
                else {
                    font_size_num -= 2
                    book_content_num -= 2
                    $(this).next().empty().append(font_size_num)
                    book_reader_content.children().css("font-size", font_size_num)
                    book_tittle.css("font-size", book_content_num)
                }
            }
            else if ($(this).index() == 2) {
                var font_size_num = parseInt($(this).prev().html())
                var book_content_num = parseInt($(this).prev().html()) + 8
                if (font_size_num >= 34) {
                    return false
                }
                else {
                    book_content_num += 2
                    font_size_num += 2
                    $(this).prev().empty().append(font_size_num)
                    book_reader_content.children().css("font-size", font_size_num)
                    book_tittle.css("font-size", book_content_num)
                }
            }
        })

        //确认样式
        close.click(function () {
            setting.addClass("hide")
        })

=======

        //换主题
        color_change.click(function (e) {
            if (e.target.tagName == "SPAN" || e.target.tagName == "I") {
                if ($(e.target).children().css("display") == "block" || $(e.target).css("display") == "block") {
                    return false
                }
                else {
                    $(e.target).siblings().css("border-color", "#635752")
                    $(e.target).css("border-color", "red")
                    $(e.target).siblings("span").children().css("display", "none")
                    $(e.target).children().css("display", "block").css("border", "red")

                    //更换主题
                    console.log($(e.target).css("background-color"));
                    book_content.css("background-color", $(e.target).css("background-color"))
                    setting.css("background-color", $(e.target).css("background-color"))
                    mune.css("background-color", $(e.target).css("background-color"))
                    book_navigation.css("background-color", $(e.target).css("background-color"))
                }
            }
        })

        //换字体
        font_change.click(function () {
            book_content.css("font-family", $(this).html())
            $(this).css("color", "red").siblings().css("color", "#635752")
        })

        //换字体大小
        font_size.click(function () {
            if ($(this).index() == 0) {
                var font_size_num = parseInt($(this).next().html())
                var book_content_num = parseInt($(this).next().html()) + 8
                if (font_size_num <= 10) {
                    return false
                }
                else {
                    font_size_num -= 2
                    book_content_num -= 2
                    $(this).next().empty().append(font_size_num)
                    book_reader_content.children().css("font-size", font_size_num)
                    book_tittle.css("font-size", book_content_num)
                }
            }
            else if ($(this).index() == 2) {
                var font_size_num = parseInt($(this).prev().html())
                var book_content_num = parseInt($(this).prev().html()) + 8
                if (font_size_num >= 34) {
                    return false
                }
                else {
                    book_content_num += 2
                    font_size_num += 2
                    $(this).prev().empty().append(font_size_num)
                    book_reader_content.children().css("font-size", font_size_num)
                    book_tittle.css("font-size", book_content_num)
                }
            }
        })

        //确认样式
        close.click(function () {
            setting.addClass("hide")
        })

>>>>>>> 309aa66d473325715fd6658a16e1a03a25962467
        //重置样式
        reset.click(function () {
            console.log(color_change, font_change, font_size);
            color_change.children().eq(1).click()
            font_change.eq(0).click()
            font_size.eq(1).empty().append(22)
            book_reader_content.children().css("font-size", 22)
            book_tittle.css("font-size", 30)
        })

        tools_bookshelf.click(function () {

        })

        tools_888.click(function () {
            
        })

        tools_toTop.click(function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        })
    }
})