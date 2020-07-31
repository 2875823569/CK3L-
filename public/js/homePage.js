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
var historyBack=document.querySelectorAll(".historyBack")
var historyBackP=document.querySelectorAll(".historyBack p")
var headPortrait=document.querySelector("#headPortrait")
var modifyPageI=document.querySelector("#modifyHeadportrait i")
var modifyHeadportrait=document.querySelector("#modifyHeadportrait")
var closePrompt=document.querySelector(".icon-guanbi7-01copy")
var promptBox=document.querySelector("#promptBox")
var pptStrong=document.querySelector("#promptBox strong")
var pptP=document.querySelector("#promptBox p")
var loginBtn=document.querySelector("#loginBtn")
var backToHome=document.querySelector("#backToHome")
var footerBox=document.querySelector("#footerBox")
var historyMore=document.querySelector("#icon-danseshixintubiao-")

var beforeName=null;//为修改之前，登录账户的昵称

//返回主页
backToHome.addEventListener("click",()=>{
    location.href='../index.html'
})

//点击该修改图标跳出修改页面
modifyI.addEventListener('click', () => {
    box.style.display = "none";
    modifyPage.style.display = "block";
    footerBox.style.display="none";
})
//点击登录与注册跳转页面
loginBtn.addEventListener('click',()=>{
    location.href='../login.html'
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
var afterUrl=null;
modifyPageI.addEventListener('click',()=>{
    selectHeader.click();
})
$("#selectHeader").on("change", function (e) {
    var type = this.files[0].type;
    if (type == "image/jpeg" || type == "image/png") {
        var form = new FormData();
        form.append("upload", this.files[0]);
        $.ajax({
            url: "/upload",
            dataType: "json",
            data: form,
            type: "POST",
            processData: false,
            contentType: false
        }).done((res) => {
            modifyHeadportrait.style.backgroundImage=`url(${res.img})`;
            headPortrait.style.backgroundImage=`url(${res.img})`;
            // $pic.attr("src", res.img);
            // $pic.css("display", "block");
            // profilePic = res.img
            afterUrl=res.img;
        })
    } else {
        alert("请上传JPEG/PNG格式的图片")
    }
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
wrap.addEventListener("click",()=>{
    location.href="../index.html"
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
        historyBook[i].style.backgroundImage=`url(${data.msg[i].book_img})`;
        historyBack[i].setAttribute('data-bookName',data.msg[i].book_title);
        historyBook[i].addEventListener("mouseenter",(e)=>{
            e.target.children[0].classList.add("show");
        })
        historyBook[i].addEventListener("mouseleave",(e)=>{
            e.target.children[0].classList.remove("show")
        })
        historyBackP[i].innerText=data.msg[i].book_desc;

    }
})
//历史记录：
//点击之后跳转到小说阅读
for(let i=0;i<historyBack.length;i++){
    historyBack[i].addEventListener("click",()=>{
    send_information({book_name:historyBack[i].getAttribute("data-bookName")})
    location.href = "../html/novelMainPage.html"
})
}

//点击显示更多历史记录
historyMore.addEventListener('click',()=>{
    
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

  //获取当前登录账户
  var get_user_information = function(){
    return new Promise((resolve,reject) => {
      $.post("/api/get_user_information",(res) => {
        resolve(res)
      })
    })
  }
  get_user_information().then((data)=>{
        beforeName=data.user.userName;
        modifyHeadportrait.style.backgroundImage=`url(${data.user.headImage})`;
        nickname.innerText=data.user.userName;
        nicknameIpt.value=data.user.userName;
        fisrstPsdInp.value=data.user.pwd;
        secondPsdInp.value=data.user.pwd;
        headPortrait.style.backgroundImage=`url(${data.user.headImage})`
  })


//点击保存按钮
saveBtn.addEventListener('click',()=>{
    var afterNickname=nicknameIpt.value;
    var afterFirstPsw=fisrstPsdInp.value;
    var afterSecondPsw=secondPsdInp.value;
    nickname.innerText=afterNickname;
    if(afterFirstPsw!=afterSecondPsw){
        Prompt('警告！','两次密码不一致')
        return
    }
    var setUser=function(){
        return new Promise((resolve,reject)=>{
            $.post("/api/setUser",{beforeName,afterUrl,afterNickname,afterFirstPsw,afterSecondPsw},(data,status)=>{
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
            footerBox.style.display="block";
        }
    })
})

