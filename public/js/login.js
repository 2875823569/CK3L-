
var get_send_information = function () {
    return new Promise((resolve, reject) => {
        $.post("/api/get_send_information", (res) => {
            resolve(res);
        });
    });
};
var send_information = function (information) {
    return new Promise((resolve, reject) => {
        $.post("/api/send_information", information, (res) => {
            resolve(res);
        });
    });
};

$("#btmBtn").show(1000);
$("#logintext").show(1500);

var logInSwitch = () => {
    $(".front").css("transform", "rotateY(0deg)");
    $(".back").css("transform", " rotateY(-180deg)")
    $("#btmBtn").html('<span id="logintext">登录</span>')
    setTimeout(() => {
        $("#btmBtn").show(1000)
        $("#logintext").css("opacity", "1")
    }, 1000)
    $("#btmBtn").hide(1000)
    $("#logintext").css("opacity", "0")
}
var isLogin = true;



var $profilePic = $("#profilePic"), $pic = $("#pic"), profilePic = "";
$profilePic.on("change", function (e) {
    var type = this.files[0].type;
    if (type == "image/jpeg" || type == "image/png") {
        var form = new FormData();
        form.append("upload", this.files[0]);
        $.ajax({
            url: "upload",
            dataType: "json",
            data: form,
            type: "POST",
            processData: false,
            contentType: false
        }).done((res) => {
            $pic.attr("src", res.img);
            $pic.css("display", "block");
            profilePic = res.img
        })
    } else {
        _alert("请上传JPEG/PNG格式的图片")
    }
})

var get_user_information = function () {
    return new Promise((resolve, reject) => {
        $.post("/api/get_user_information", (res) => {
            resolve(res.user)
        })
    })
}
var alreadyLogin = false;
get_user_information().then((data) => {
    if (data.userName) {
        alreadyLogin = true
        $(".notLogIn").css("opacity", "0")
        $("#note").css("opacity","0")
        setTimeout(() => {
            $(".notLogIn").remove();
            $(`<div class="alreadyLogin"><span id="logout" style="position: absolute;top: 24px;right: 24px;"><i class="iconfont icon-dengchu-" style="font-size: 30px;color: #7c7c7c;"></i></span>
        <div class="profilePic" style="margin-top: 55px;width: 100px;height: 100px;margin-left: 135px;">
        <img style="display:block" id="pic" src="${data.headImage}" alt=""></div>
        <div style="position: absolute;width: 100%;bottom: 27px;text-align: center;">
        <span style="display: block;margin-bottom: 16px;color: #4b4b4b;">${data.userName}</span>
        <span style="color: #9b9b9b;font-size: 13px;">以此账号登录 </span></div>
            </div>
        </div>`).appendTo(".front")
        $("#btmBtn").html('<span id="logintext">进入</span>')
        }, 1000);
        setTimeout(() => {
            $(".alreadyLogin").css("opacity","1")
            $("#logout").on("click", () => {
                $.post("/api/logout",(req,res)=>{
                    if(res){
                        _alert("green","注销成功")
                    }
                    alreadyLogin = false
                    setTimeout(() => {
                        location.reload()
                    }, 2700);
                })
            })
        }, 1100);
    }
    

})

var submit = function () {
    if (isLogin == true) {
        if($(".checkbox").is(":checked")){
            var mail = $("#LogEmail").val(), psw = $("#LogPsw").val();
        $.post("/api/login", { mail, psw }, function (res) {
            if (!res.code) {
                _alert("green","登录成功嘤嘤嘤")
                setTimeout(() => {
                    location.href = "../index.html"
                }, 2700);
                // get_user_information().then((res)=>{
                //     console.log(res);
                // });
            } else {
                _alert("red","登录失败，应该是你号没了")
            }

        })
        }else{
            _alert("red","你还没有勾选协议哦，笨猪")
        }
    } else {
        var userName = $("#name").val();
        var email = $("#email").val();
        var psw1 = $("#psw1").val();
        var psw2 = $("#psw2").val();
        console.log(email);
        if(/^[a-zA-Z0-9_\u4e00-\u9fa5]{3,10}$/.test(userName)){
            if(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)){
                if (psw1 != psw2) {
                    $("#psw1").val("");
                    $("#psw2").val("");
                    _alert("red","两次密码输入不一致")
                    return
                }
                if(psw1 == "" || psw2 == ""){
                    $("#psw1").val("");
                    $("#psw2").val("");
                    _alert("red","请输入密码")
                    return
                }
                if (!userName) {
                    $("#psw1").val("");
                    $("#psw2").val("");
                    _alert("red","请输入昵称")
                    return
                }
                if (!email) {
                    $("#psw1").val("");
                    $("#psw2").val("");
                    _alert("red","请输入邮箱地址")
                    return
                }
                if (!profilePic) {
                    $("#psw1").val("");
                    $("#psw2").val("");
                    _alert("red","请上传头像")
                    return
                }
                $.post("api/signIn", { userName, email, psw1, profilePic }, function (res) {
                    if (res.code == 0) {
                        isLogin = true;
                        _alert("green","注册成功")
                        logInSwitch()
                    } else if (res.code == 3) {
                        _alert("red","此邮箱已被注册！")
                        return
                    }
                })
            }else{
                _alert("red","请检查邮箱是否符合规范")
            }
        }else{
            _alert("red","用户名不符合规范，请输入3到10位（字母，数字，下划线，减号,汉字）")
        }
       
    }
}
$("#note").on("click",function(){
    _alert("red","蠢")
})
$(".close").on("click", function () {
    isLogin = true;
    logInSwitch()
})
var SignInSwitch = function () {
    isLogin = false
    $(".front").css("transform", "rotateY(180deg)");
    $(".back").css("transform", " rotateY(0deg)");
    $("#btmBtn").hide(1000);
    $("#logintext").css("opacity", "0")
    setTimeout(() => {
        $(".back").css("height", "478px");
        $(".back").css("margin-top", "9%");
        $("#btmBtn").html('<span id="logintext">注册</span>')
        $("#btmBtn").show(1000);
        $("#logintext").css("opacity", "1")
    }, 1000)

}
$("#btmBtn").on("click", function () {
    if(alreadyLogin){
        location.href = "../index.html"
    }else{
        submit();
    }
})
$("#signIn").on("click", function () {
    SignInSwitch();
})


get_send_information().then((res) => {
    if (res.send_information.is_login == 0) {
        SignInSwitch();
    }
})
 function _alert(color,content){
    $(`<div class="alert" style="position: absolute;border-radius: 15px;font-weight: bold;text-align: center;line-height: 43px;padding: 0px 20px;top: -10%;z-index: 9999;box-shadow: 1px 1px 12px 1px #bfbfbf;" >${content}</div>`).appendTo("body");
    let _left =($(window).width()/2 -  ($(".alert").width()+20)/2) + "px"
    document.getElementsByClassName("alert")[0].style.left = _left
    $(".alert").animate({top:"+6%",opacity:"1"},1000 ,"swing")
    setTimeout(() => {
        $(".alert").animate({top:"-6%",opacity:"0"},800,"swing")
    }, 2000);
    setTimeout(() => {
        $(".alert").remove()
    }, 3000);if(color == "green"){
        $(".alert").css({"background-color":"rgb(223 240 216 / 1)","color":"#66a31f"})
    }else if(color == "red"){
        $(".alert").css({"background-color":"rgb(242, 222, 222)","color":"rgb(182 65 29)"})
    }else{
        console.log("啥啊，这颜色没做呢")
    }
 }
