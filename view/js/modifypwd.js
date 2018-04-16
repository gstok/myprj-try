//登陆框居中
vermiddle();
function vermiddle(){
    var _loginbox = $(".pass-box"),
        loginbox = $(".loginbox"),
        H = $(window).height(),
        h = loginbox.height();
    _loginbox.css({"width":H/2+80+"px","border-top-right-radius": H/2+80+"px","border-bottom-right-radius": H/2+80+"px"});
}
$(window).resize(function(){
    vermiddle();
});


// input获取焦点加白边，失去焦点白边消失
$(".login-form input:not(.g_btn)").on("focus",  function(){
    this.style.border='1px solid #FFF';
    this.style.backgroundColor='#001437';

}).on("blur",function(){
    this.style.border='1px solid transparent';
    this.style.backgroundColor='#1A2A47';
});


var PwdReg = /^[A-Za-z0-9_]{6,15}$/;
//验证登录名
function validusername() {
    if ($.trim($("#username").val()) == "") {
        dcrmAlertWarning('用户名不能为空！');
        return false;
    }else{
        return true;
    }
}
//验证旧密码
function validpwdold() {
    if ($.trim($("#oldPwd").val()) == "") {
        dcrmAlertWarning('原密码不能为空！');
        return false;
    }else{
        return true;
    }
}
//验证新密码
function validpwdnew() {
    if($.trim($("#newPwd").val())==$.trim($("#oldPwd").val())){
        dcrmAlertWarning('新密码与原密码不能相同');
        return false;
    }
    if ($.trim($("#newPwd").val()) == "") {
        dcrmAlertWarning('新密码不能为空');
        return false;
    } else if(!PwdReg.test($.trim($("#newPwd").val()))){
        dcrmAlertWarning('密码请设置6－15位字符，可包含英文字母、数字！');
        return false;
    }else{
        return true;
    }
}
//验证二次输入密码
function validpwdnew2() {
    if ($.trim($("#confirnPwd").val()) == "") {
        dcrmAlertWarning('再确认新密码！');
        return false;
    }else if ($.trim($("#newPwd").val()) != $.trim($("#confirnPwd").val())) {
        dcrmAlertWarning('两次密码不一致！');
        return false;
    }else{
        return true;
    }
}
//重置密码确定按钮提交
$("#sureBtn").on("click",function(){

    if (!validusername() || !validpwdold() || !validpwdnew() ||!validpwdnew2()) {
        return false;
    }
    var data={
        "loginName":$.trim($("#username").val()),
        "loginPwd":$.trim($("#oldPwd").val()),
        "newLoginPwd":$.trim($("#newPwd").val())
    };
    API.updatePwdByLoginName(data, function(res){
        if(res && res.code == 200) {
            dcrmAlertSuccess("密码修改成功，请重新登录！");
            setTimeout(function(){
                window.location.href=API.baseUrl+"/login.html";
            },1000)
        }else{
            dcrmAlertError(res.msg);
        }
    });
});








//输入框不为空，下一步按钮变成可用状态
// $('#username,#password').on('keyup',function(){
//     if($.trim($('#password').val())!='' && $.trim($('#username').val())!=''){
//         $('.login-btn').css('backgroundColor','#606cbf')
//     }else{
//         $('.login-btn').css('backgroundColor','#5762b0')
//     }

// })

