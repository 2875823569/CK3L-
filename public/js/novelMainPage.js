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
    let main_content_txt = $(".main_content_txt")
    let main_content_chapter = $(".main_content_chapter")
    
    //初始化
    function init() {
        //初始化页面
        function init_page() {

        }
        init_page()

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

        //作品信息&章节目录
        main_content_header.click(function () {
            $(this).siblings().removeClass("border_bottom")
            $(this).addClass("border_bottom")
            if($(this).index()==0){
                main_content_txt.removeClass("hide")
                main_content_txt.next().addClass("hide")
            }
            else{
                main_content_chapter.removeClass("hide")
                main_content_chapter.prev().addClass("hide")
            }
        })
    }
    init()
})