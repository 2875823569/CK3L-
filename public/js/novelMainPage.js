$(function () {
    //获取节点
    // #region
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
    let saysTop = $(".saysTop")
    let books_send = $(".books_send")
    let sendSays = $(".sendSays")
    let send_says = $(".send_says")
    let main_content_txt_right = $(".main_content_txt_right")
    let main_content_chapter_page = $(".main_content_chapter_page")
    let chapter_pages = $(".chapter_pages")
    let novel_introduce_tittle = $(".novel_introduce_left").children().eq(0)
    let novel_introduce_author = $(".novel_introduce_left").children().eq(1).children()
    let main_content_txt_desc = $(".main_content_txt").children().eq(1)
    let novel_img = $(".novel_img").children()
    let novel_type = $(".novel_introduce_right").children().eq(1).children().eq(1)
    // #endregion

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
        //渲染评论区
        function get_comment(book_name) {
            return new Promise((resolve, reject) => {
                $.post("/api/get_comment", { book_name: book_name }, (res) => {
                    resolve(res)
                })
            })
        }
        get_comment(res.send_information.book_name).then((res) => {
            // console.log(res);
            if (res.comment.length == 0) {
                return false
            }
            else {
                saysTop.empty()
                for (let i = res.comment.length - 1, j = 0; i > 0, j < 10; i--, j++) {
                    saysTop.append(
                        `
                    <div class="readers">
                        <div>
                            <img src="${res.comment[i].headImage}">
                            <span>${res.comment[i].username}<li>8月1日 13:40</li></span>
                        </div>
                        <div>
                            <p>${res.comment[i].comment}</p>
                        </div>
                    </div>
                `
                    )
                }
            }
        })
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
                // console.log(res);
                if (res.length == 0) {
                    $("body").empty().append("404错误,服务器资源丢失!")
                }
                resolve(res[0])
            })
        })
    }
    getDesc().then((res) => {
        // console.log(res);
        main_content_txt_desc.empty().append(`\xa0\xa0\xa0\xa0${res.book_desc}...`)
        // main_content_txt_right.css("top", readerSay.children().eq(0).height())
        //渲染book_author
        novel_introduce_author.empty().append(res.book_author)
        //渲染小说图片
        novel_img.attr("src", res.book_img)
        //渲染小说类型
        novel_type.empty().append(res.type2_name)
    })

    //渲染相关推荐
    function setIntro() {
        return new Promise(function (resolve, reject) {
            $.post("/api/round_book", {}, (res) => {
                // console.log(res);
                resolve(res)
            })
                .then(function (res) {
                    for (let i = 0; i < 4; i++) {
                        main_content_txt_right.append(
                            `
                            <div>
                                <div><img src="${res.arr_img[i]}"></div>
                                <div>
                                    <li>《<span>${res.arr_name[i]}</span>》</li>
                                    <li>${res.writer[i]} 著</li>
                                    <li>${res.introduce[i]}</li>
                                </div>
                            </div>
                        `
                        )
                    }
                })
        })
    }
    setIntro()

    //初始化页面效果
    function init() {
        //初始化页面样式
        $(".box").css("min-width", window.innerWidth - 30)
        books_send.css("top", main_content_txt.height() + 22)

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
            var novel_img = $(".novel_img").children().attr("src")
            // console.log(novel_img);
            new Promise(function (resolve, reject) {
                $.post("/api/get_user_information", {}, (res) => {
                    // console.log(res);
                    resolve();
                })
                    .then(function (res) {
                        new Promise(function (resolve, reject) {
                            if (res.code != 0) {
                                alert("亲爱的亲，您还未登录噢！登录后即可添加至书架。")
                            }
                            else {
                                $.post("/api/user_likes", { email: res.user.email, book_name, novel_img }, () => { })
                                alert("已成功加入书架。")
                            }
                        })
                    })
            })
        })

        //跳转分类
        goTOItemsList.click(function () {
            location.href = "./classf.html"
        })

        //跳转书架
        goTOBookShelf.click(function () {
            location.href = "./homepage.html"
        })

        //跳转VIP
        goTOVipCenter.click(function () {
            alert("想什么呢，赶紧加寇靖QQ:2875823569充值")
        })

        //跳转App
        goTOApp.click(function () {
            alert("加寇靖QQ:2875823569下载APP")
        })

        //跳转搜索
        goTOSearch.click(function () {
            location.href = "#"
        })

        //跳转登录
        goTOLogin.click(function () {
            location.href = "../login.html"
        })

        //跳转注册
        goTORegister.click(function () {
            location.href = "../login.html"
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
                books_send.removeClass("hide")
                main_content_chapter.addClass("hide")
            }
            else {
                main_content_chapter.removeClass("hide")
                books_send.addClass("hide")
                main_content_page.addClass("hide")
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

        //相关推荐跳转
        main_content_txt_right.click(function (e) {
            if (e.target.tagName == "IMG") {
                var book_name = $(e.target).parent().next().children().eq(0).children().html()
                new Promise(function (resolve, reject) {
                    $.post("/api/send_information", { book_name }, (res) => {
                        window.open("./novelMainPage.html")
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        resolve()
                    })
                        .then(function () {
                            return new Promise(function (resolve, reject) {
                                $.post("/api/update_num", { book_name: book_name }, (res) => { })
                            })
                        })
                })
            }
        })

        //展开评论框
        sendSays.click(function () {
            send_says.removeClass("hide")
            $(this).css("height", 100)
        })

        //发表评论
        send_says.click(function () {
            var comment = sendSays.children("textarea").val()
            var book_name = novel_introduce_tittle.html()
            if (comment == '') {
                alert("亲什么都没写呢!")
            }
            else {
                new Promise((resolve, reject) => {
                    $.post("/api/get_user_information", {}, (res) => {
                        // console.log(res);
                        resolve(res)
                    })
                        .then((res) => {
                            if (res.code != 0) {
                                alert("亲，还没登录哦!")
                            }
                            else {
                                var email = res.user.email
                                return new Promise((resolve, reject) => {
                                    $.post(
                                        "/api/add_comment",
                                        { email: email, book_name: book_name, comment: comment },
                                        (res) => {
                                            resolve(res);
                                        }
                                    )
                                        .then((res) => {
                                            if (!res.code) {
                                                // console.log(res);
                                                sendSays.children("textarea").val('')
                                                getBookName().then((res) => {
                                                    novel_introduce_tittle.empty().append(res.send_information.book_name)
                                                    //渲染评论区
                                                    function get_comment(book_name) {
                                                        return new Promise((resolve, reject) => {
                                                            $.post("/api/get_comment", { book_name: book_name }, (res) => {
                                                                resolve(res)
                                                            })
                                                        })
                                                    }
                                                    get_comment(res.send_information.book_name).then((res) => {
                                                        // console.log(res);
                                                        if (res.comment.length == 0) {
                                                            return false
                                                        }
                                                        else {
                                                            saysTop.empty()
                                                            for (let i = res.comment.length - 1, j = 0; i > 0, j < 10; i--, j++) {
                                                                saysTop.append(
                                                                    `
                                                                <div class="readers">
                                                                    <div>
                                                                        <img src="${res.comment[i].headImage}">
                                                                        <span>${res.comment[i].username}<li>8月1日 13:40</li></span>
                                                                    </div>
                                                                    <div>
                                                                        <p>${res.comment[i].comment}</p>
                                                                    </div>
                                                                </div>
                                                            `
                                                                )
                                                            }
                                                            var timer = null
                                                            timer = setInterval(function () {
                                                                let pos = saysTop.scrollTop();
                                                                if (pos > 0) {
                                                                    saysTop.scrollTop(pos - 20)
                                                                } else {
                                                                    window.clearInterval(timer)
                                                                }
                                                            }, 2)
                                                        }
                                                    })
                                                })
                                            }
                                        })
                                })
                            }
                        })
                })
            }
        })
    }
    init()
})