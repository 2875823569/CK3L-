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
var modifyPageI=document.querySelector("#modifyHeadportrait i")
var modifyHeadportrait=document.querySelector("#modifyHeadportrait")
var closePrompt=document.querySelector(".icon-guanbi7-01copy")
var promptBox=document.querySelector("#promptBox")
var pptStrong=document.querySelector("#promptBox strong")
var pptP=document.querySelector("#promptBox p")
//点击该修改图标跳出修改页面
modifyI.addEventListener('click', () => {
    box.style.display = "none";
    modifyPage.style.display = "block";
})

//提示框事件
closePrompt.addEventListener('click',(e)=>{
    e.target.parentNode.style.display="none"
})
function Prompt(type,content){
    pptStrong.innerText=type;
    pptP.innerText=content;
    promptBox.style.display="block";
}
//修改页面

//点击头像旁边的修改进行选择文件
modifyPageI.addEventListener('click',()=>{
    var selectHeader=document.querySelector("#selectHeader");
    selectHeader.click();
})
selectHeader.addEventListener("change",()=>{
    console.log(selectHeader.files[0]);
})
//点击取消按钮
cancelBtn.addEventListener('click',()=>{
    box.style.display = "block";
    modifyPage.style.display = "none";
})

//3d效果控制与暂停
wrap.addEventListener('mouseenter', () => {
    wrap.style.animationPlayState = "paused";
})
wrap.addEventListener('mouseleave', () => {
    wrap.style.animationPlayState = "running";
})

//获取小说信息
// var getBook=function(){
//     return new Promise((resolve,reject)=>{
//         $.post('/api/getBook',(data,status)=>{
//             if(status=="success"){
//                 resolve(data)
//             }
//         })
//     })
// }
// getBook().then((data)=>{
//     for(var i=0;i<historyBook.length;i++){
//         historyBook[i].style.backgroundImage=`url(${data[i].book_img})`;
//     }
// })

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

  //获取当前登录账户
  var get_user_information = function(){
    return new Promise((resolve,reject) => {
      $.post("/api/get_user_information",(res) => {
        resolve(res)
      })
    })
  }
  get_user_information().then((data)=>{
        nickname.innerText=data.user.userName;
        nicknameIpt.value=data.user.userName;
        fisrstPsdInp.value=data.user.pwd;
        secondPsdInp.value=data.user.pwd;
        console.log(data);
  })


//点击保存按钮
saveBtn.addEventListener('click',()=>{
    var afterNickname=nicknameIpt.value;
    var afterFirstPsw=fisrstPsdInp.value;
    var afterSecondPsw=secondPsdInp.value;
    if(afterFirstPsw!=afterSecondPsw){
        Prompt('警告！','两次密码不一致')
        return
    }
    var setUser=function(){
        return new Promise((resolve,reject)=>{
            $.post("/api/setUser",{afterNickname,afterFirstPsw,afterSecondPsw},(data,status)=>{
                if (status == "success") {
                    resolve(data)
                }
            })
        })
    }
    setUser().then((data)=>{
        if(!data.code){
            Prompt('提示！',data.msg)
            box.style.display = "block";
            modifyPage.style.display = "none";
        }
    })
})