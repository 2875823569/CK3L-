// const { findById } = require("../../models/user")
// const { resolve } = require("path")

var modifyI = document.querySelector("#headPortrait i")//第一个修改图标
var box = document.querySelector("#box")
var modifyPage = document.querySelector('#modifyPage')
var wrap = document.querySelector(".wrap")
var nickname=document.querySelector("#nickname")
var nicknameIpt=document.querySelector("#nicknameIpt")
var fisrstPsdInp=document.querySelector("#fisrstPsdInp")
var secondPsdInp=document.querySelector("#secondPsdInp")
var cancelBtn=document.querySelector(".cancel")
var saveBtn=document.querySelector(".save")
var historyBook=document.querySelectorAll(".historyBook")
//点击该修改图标跳出修改页面
modifyI.addEventListener('click', () => {
    box.style.display = "none";
    modifyPage.style.display = "block";
})


//修改页面

//点击取消按钮
cancelBtn.addEventListener('click',()=>{
    box.style.display = "block";
    modifyPage.style.display = "none";
})

//点击保存按钮
saveBtn.addEventListener('click',()=>{
    var afterNickname=nicknameIpt.value;
    var afterFirstPsw=fisrstPsdInp.value;
    var afterSecondPsw=secondPsdInp.value;
    var setUser=function(){
        return new Promise((resolve,reject)=>{
            $.post("/api/setUser",{afterNickname,afterFirstPsw,afterSecondPsw},(data,status)=>{
                if (status == "success") {
                    resolve(data)
                }
            })
        })
    }
})
//3d效果控制与暂停
wrap.addEventListener('mouseenter', () => {
    wrap.style.animationPlayState = "paused";
})
wrap.addEventListener('mouseleave', () => {
    wrap.style.animationPlayState = "running";
})
//向后台获取用户信息
var getUsers=function() {
    return new Promise((resolve, reject) => {
        $.post("/api/homepage", (data, status) => {
            if (status == "success") {
                resolve(data)
            }
        })
    })
}
getUsers().then((data)=>{
    nickname.innerText=data[0].username;
    nicknameIpt.value=data[0].username;
    fisrstPsdInp.value=data[0].pwd;
    secondPsdInp.value=data[0].pwd;
    if(fisrstPsdInp!=secondPsdInp){
        // alert("两次密码不一致！");
        return
    }
})

//获取小说信息
var getBook=function(){
    return new Promise((resolve,reject)=>{
        $.post('/api/getBook',(data,status)=>{
            if(status=="success"){
                resolve(data)
            }
        })
    })
}
getBook().then((data)=>{
    for(var i=0;i<historyBook.length;i++){
        historyBook[i].style.backgroundImage=`url(${data[i].book_img})`;
    }
})