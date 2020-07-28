var modifyI = document.querySelector("#headPortrait i")//第一个修改图标
var box = document.querySelector("#box")
var modifyPage = document.querySelector('#modifyPage')
var wrap = document.querySelector(".wrap")
var nickname=document.querySelector("#nickname")
var userInformation=null;
var nicknameIpt=document.querySelector("#nicknameIpt")
var fisrstPsdInp=document.querySelector("#fisrstPsdInp")
var secondPsdInp=document.querySelector("#secondPsdInp")
//点击该修改图标跳出修改页面
modifyI.addEventListener('click', () => {
    box.style.display = "none";
    modifyPage.style.display = "block";
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
})
