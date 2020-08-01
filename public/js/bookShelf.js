var box = document.querySelector("#box");
var PageNumber=document.querySelector("#PageNumber")
var username = null;
var userEmail = null;
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


//获取数据库中的用户收藏的书
// function getBookShelf(){
//     send_information().then((data)=>{
//         username=data.user.userName;
//     })
// }
var sendUserEmail = function (userEmail) {
    return new Promise((resolve,rejects)=>{
    $.post("/api/findUserLike", { userEmail}, (res) => {
        resolve(res);
    })
    })
    
}
function get_user_information() {
    return new Promise((resolve, rejects) => {
        $.post("/api/get_user_information", (res) => {
            resolve(res)
        })
    })
}
get_user_information().then((data) => {
    userEmail = data.user.email;
    sendUserEmail(userEmail).then((res) => {
        var count=Math.ceil(res.msg.length/10);
        var strLi='';
        for(var i=0;i<count;i++){
            if(i==0){
                strLi+=`<li class="PageNumberLi now">${i+1}</li>`;
            }else{
                strLi+=`<li class="PageNumberLi">${i+1}</li>`;
}
            }
          
      PageNumber.innerHTML=strLi;
        writePaging(box,PageNumber,res.msg,0,10,res);
        $("#PageNumber").on('click','li',(e) => {
            $(e.target).siblings().removeClass('now');
            $(e.target).addClass('now')
            var curIndex=$(e.target).text()-1;
            writePaging(box,PageNumber,res.msg,curIndex,10,res)
        })
    })
})

 var writePaging=(element1,element2,arr,page,pagenum,res) => {
     var allpage=Math.ceil(arr.length/pagenum);
     var strDiv='';
     var arrSlice=[];
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
         <div id="historyBook" style="background-Image:url(${arrSlice[i].novel_img});background-size:cover;"></div>
         <P>${arrSlice[i].book_name}</P>
        </div>
         `
     }
    element1.innerHTML=strDiv;
}

$('#box').on('click','p',(e) => {
    console.log(123);
    var name=$(e.target).text();
    send_information({book_name:name})
    location.href="../html/novelMainPage.html"
  })
