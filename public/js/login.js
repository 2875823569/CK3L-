
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


var logInSwitch = () => {
    $(".front").css("transform", "rotateY(0deg)");
    $(".back").css("transform", " rotateY(-180deg)")
    $("#btmBtn").html("登录")
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
        alert("请上传JPEG/PNG格式的图片")
    }
})

var get_user_information = function () {
    return new Promise((resolve, reject) => {
        $.post("/api/get_user_information", (res) => {
            resolve(res.user)
        })
    })
}
var submit = function () {
    if (isLogin == true) {
        console.log("yup")
        var mail = $("#LogEmail").val(), psw = $("#LogPsw").val();
        $.post("/api/login", { mail, psw }, function (res) {
            if (!res.code) {
                alert("登录成功")
                 location.href = "../index.html"
            } else {
                alert("登录失败")
            }

        })
    } else {
        var userName = $("#name").val();
        var email = $("#email").val();
        var psw1 = $("#psw1").val();
        var psw2 = $("#psw2").val();
        if (psw1 != psw2) {
            $("#psw1").val("");
            $("#psw2").val("");
            alert("两次密码输入不一致")
            return
        }
        if (!userName) {
            $("#psw1").val("");
            $("#psw2").val("");
            alert("请输入昵称")
            return
        }
        if (!email) {
            $("#psw1").val("");
            $("#psw2").val("");
            alert("请输入邮箱地址")
            return
        }
        if (!profilePic) {
            $("#psw1").val("");
            $("#psw2").val("");
            alert("请上传头像")
            return
        }
        $.post("api/signIn", { userName, email, psw1, profilePic }, function (res) {
            if (res.code == 0) {
                isLogin = true;
                alert("注册成功");
                logInSwitch()
            } else if (res.code == 3) {
                alert("此邮箱已被注册！")
                return
            }
        })
    }
}
$(".close").on("click", function () {
    isLogin = true;
    logInSwitch()
})
var SignInSwitch = function () {
    isLogin = false
    $(".front").css("transform", "rotateY(180deg)");
    $(".back").css("transform", " rotateY(0deg)")
    setTimeout(() => {
        $(".back").css("height", "478px")
    }, 1000)
    $("#btmBtn").html("注册")
}
$("#btmBtn").on("click", function () {
    submit();
})
$("#signIn").on("click", function () {
    SignInSwitch();
})

// $("#note").on("click", () => {
//     $("html").append('<div class="alert alert-info" role="alert">爷没做这功能！</div>')
// })

get_send_information().then((res) => {
    if (res.send_information.is_login == 0) {
        SignInSwitch();
    }
})