var box=document.querySelector("#box")
var PageNumberLi=document.querySelectorAll(".PageNumberLi")

function book_pagination(query,onepage_num,page_num) {
  //传递参数为三个：查询条件query，一页的数量onepage_num,第几页page_num
  return new Promise((resolve,reject) => {
    $.post("/api/book_pagination",{query:query,onepage_num:onepage_num,page_num:page_num},(res) => {
      resolve(res)
    })
  })
}
// {"type1_name":"玄幻"},10,6
function write(query,onepage_num,page_num){
    var str='';
    book_pagination(query,onepage_num,page_num).then((res) => {
        for(var i=0;i<res.date.length;i++){
            str+=`
            <div class="history">
                 <div id="historyBook"style="background-image:url(${res.date[i].book_img});background-size:cover;"></div>
                 <P>${res.date[i].book_title}</P>
             </div>
            `
        }
        box.innerHTML=str;
    })
}
write({"type1_name":"玄幻"},10,1)
for(let i=0;i<PageNumberLi.length;i++){
    PageNumberLi[0].classList.add('cur');
    PageNumberLi[i].addEventListener('click',(e)=>{
        e.target.classList.add('cur');
        $(e.target).siblings().removeClass('cur')
        write({"type1_name":"玄幻"},10,i+1)
    })
}

//事件代理，点击书跳转到对应的页面
$('#box').on('click','p',(e)=>{
    send_information({book_name:$(e.target).text()})
    location.href = "../html/novelMainPage.html"
})


//获取传递的信息
var get_send_information = function () {
    return new Promise((resolve, reject) => {
      $.post("/api/get_send_information", (res) => {
        resolve(res);
      });
    });
  };
  
  //传递信息
  var send_information = function (information) {
    return new Promise((resolve, reject) => {
      $.post("/api/send_information", information, (res) => {
        resolve(res);
      });
    });
  };
