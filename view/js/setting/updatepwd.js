
var PwdReg = /^[A-Za-z0-9_]{6,15}$/;
//验证旧密码
function validpwdold() {
  if ($.trim($("#oldPwd").val()) == "") {
      $("#text-warn").html('旧密码不能为空！');
        return false;
    }else{
      $("#text-warn").html('');
        return true;
    }
}
//验证新密码
function validpwdnew() {
  if($.trim($("#newPwd").val())==$.trim($("#oldPwd").val())){
    $("#text-warn").html('新密码与原密码不能相同');
        return false;
  }
    if ($.trim($("#newPwd").val()) == "") {
      $("#text-warn").html('新密码不能为空');
        return false;
    } else if(!PwdReg.test($.trim($("#newPwd").val()))){
      $("#text-warn").html('密码请设置6－15位字符，可包含英文字母、数字！');
        return false;
    }else{
      $("#text-warn").html('');
        return true;
    }
}
//验证二次输入密码
function validpwdnew2() {
  if ($.trim($("#confirnPwd").val()) == "") {
      $("#text-warn").html('再输一次密码！');
        return false;
    }else if ($.trim($("#newPwd").val()) != $.trim($("#confirnPwd").val())) {
      $("#text-warn").html('两次密码不一致！');
        return false;
    }else{
      $("#text-warn").html('');
        return true;
    }
}
//重置密码确定按钮提交
$("#sureBtn").on("click",function(){

  if (!validpwdold() || !validpwdnew() ||!validpwdnew2()) {
        return false;
    }
   var data={
     "loginPwd":$("#oldPwd").val(),
     "newLoginPwd":$("#newPwd").val()
   };
    MaskUtil.Loading();
    API.updateUserPwd(data, function(data){
    if(data && data.code == 200) {
      dcrmAlertSuccess("密码修改成功，请重新登录");
      setTimeout(function(){
        var datas={};
      API.logout(datas,function(res){
         if(res.code == 200){
            window.location.href=API.baseUrl+"/login.html"
         }else{
          dcrmAlertError("退出登录失败，请稍后重试!");
         }
      });
      },1000)

    }else{
      $("#text-warn").html(data.msg);
    }
    MaskUtil.RemoveLoading();
  });
});
