var box = document.querySelector("#box");

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
    $.post("/api/findUserLike", { userEmail }, (res) => {
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
        var str='';
        console.log(res);
        for(var i=0;i<res.msg.length;i++){
            str+= `<div class="history">
            <div id="historyBook" style="background-Image:url(${res.msg[i].novel_img});background-size:cover;"></div>
            <P>${res.msg[i].book_name}</P>
        </div>
        `
        }
        box.innerHTML=str;
    })
})