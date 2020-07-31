function book_pagination(query,onepage_num,page_num) {
  //传递参数为三个：查询条件query，一页的数量onepage_num,第几页page_num
  return new Promise((resolve,reject) => {
    $.post("/api/book_pagination",{query:query,onepage_num:onepage_num,page_num:page_num},(res) => {
      resolve(res)
    })
  })
}

book_pagination({"type1_name":"玄幻"},3,3).then((res) => {
  console.log(res);
})

