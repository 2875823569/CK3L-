var box=document.querySelector("#box")
var PageNumberLi=document.querySelectorAll(".PageNumberLi")

// function book_pagination(query,onepage_num,page_num) {
//   //传递参数为三个：查询条件query，一页的数量onepage_num,第几页page_num
//   return new Promise((resolve,reject) => {
//     $.post("/api/historyBook_pagination",{query:query,onepage_num:onepage_num,page_num:page_num},(res) => {
//       resolve(res)
//     })
//   })
// }
// book_pagination({email:'lm'},5,3).then((res) => {
//   console.log(res);
// })
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
// write({"type1_name":"玄幻"},10,1)
// for(let i=0;i<PageNumberLi.length;i++){
//     PageNumberLi[0].classList.add('cur');
//     PageNumberLi[i].addEventListener('click',(e)=>{
//         e.target.classList.add('cur');
//         $(e.target).siblings().removeClass('cur')
//         write({"type1_name":"玄幻"},10,i+1)
//     })
// }

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
//获取用户信息
  function get_user_information() {
    return new Promise((resolve, rejects) => {
        $.post("/api/get_user_information", (res) => {
            resolve(res)
        })
    })
}
var sendUserEmail=function (userEmail) {
  return new Promise((resolve,rejects)=>{
  $.post("/api/findUserHistory", { userEmail }, (res) => {
      resolve(res);
  })
  })
  
};
 get_user_information().then((data) => {
    userEmail = data.user.email;
    sendUserEmail(userEmail).then((res) => {
    //   var str='';
    //   for(var i=0;i<res.msg.length;i++){
    //     str+=`
    //     <div class="history">
    //          <div id="historyBook"style="background-image:url(${res.msg[i].book_img});background-size:cover;"></div>
    //          <P>${res.msg[i].book_name}</P>
    //      </div>
    //     `
    // }
    writePaging(box,PageNumber,res.msg,0,10,res);
    $("#PageNumber").on('click','li',(e) => {
        $(e.target).siblings().removeClass('now');
        e.target.classList.add('now');
        var curIndex=$(e.target).text()-1;
        writePaging(box,PageNumber,res.msg,curIndex,10,res)
    })
    })
})

//分页函数
var writePaging=(element1,element2,arr,page,pagenum,res) => {
  var allpage=Math.ceil(arr.length/pagenum);
  var strLi='';
  var strDiv='';
  var arrSlice=[];
  for(var i=0;i<allpage;i++){
      strLi+=`<li class="PageNumberLi">${i+1}</li>`;
  }
  element2.innerHTML=strLi;
  if(page==0){
      arrSlice=arr.slice(0,pagenum)
  }
  else if(page<allpage){
       arrSlice=arr.slice(page*pagenum,(page+1)*pagenum);
  }else if(page>allpage){
      arrSlice=arr.slice(page*pagenum,arr.length-1)
  }
  for(var i=0;i<arrSlice.length;i++){
      strDiv+=`
      <div class="history">
      <div id="historyBook" style="background-Image:url(${arrSlice[i].book_img});background-size:cover;"></div>
      <P>${arrSlice[i].book_name}</P>
     </div>
      `
  }
 element1.innerHTML=strDiv;
}

//点击跳转到对应的小说阅读页面
$('#box').on('click','p',(e) => {
  var name=$(e.target).text();
  send_information({book_name:name})
  location.href="../html/novelMainPage.html"
})