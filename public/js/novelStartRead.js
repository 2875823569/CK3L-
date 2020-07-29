$(function () {
    //全局变量


    //获取节点
    let book_tittle = $(".book_tittle")
    let book_reader_content = $(".book_reader_content")

    //获取章节
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
        //渲染页面
        book_tittle.empty().append(res.book_whichChapter.page_chapter_content)
        //文章
        book_reader_content.append(
            `<p>${res.data}</p>`
        )
    })

})