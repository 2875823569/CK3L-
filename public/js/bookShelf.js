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
function get_user_information() {
    return new Promise((resolve, rejects) => {
        $.post("/api/get_user_information", (res) => {
            resolve(res)
        })
    })
}
get_user_information().then((data) => {
    userEmail = data.user.email;
    var sendUserEmail = function () {
        return new Promise((resolve,rejects)=>{
        $.post("/api/findUser", { userEmail }, (res) => {
            resolve(res);
        })
        })
        
    }
})
    sendUserEmail().then((res) => {
        console.log(res.msg);
        var str='';
        for(var i=0;i<res.msg.length;i++){
            str+= `<div class="history">
            <div id="historyBook" style="background-Image:url(${res.msg.novel_img});background-size:cover;"></div>
            <P>${res.msg.book_name}</P>
        </div>
        `
        }
        box.innerHTML=str;
    })