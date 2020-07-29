$(function () {
    //全局变量
    var page_chapter_idx = null

    //获取章节
    function getChapter() {
        return new Promise(function (resolve, reject) {
            $.post("/api/book_yourChapter", {}, (res) => {
                page_chapter_idx = res.page_chapter_idx
                if (page_chapter_idx == undefined) {
                    page_chapter_idx = 1
                }
                resolve()
            })
        })
    }
    getChapter().then(function () {
        //渲染页面
        console.log(page_chapter_idx);

    })
    
})