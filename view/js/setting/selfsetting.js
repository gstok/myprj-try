//getUserInfo();
// getmySetting()
// //上传头像
function upData() {
     var imgPath = $("#file").val();
     //判断上传文件的后缀名
     var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
     if (strExtension != 'jpg' && strExtension != 'jpeg'&& strExtension != 'gif'&& strExtension != 'png') {
            dcrmAlertWarning("请选择jpg,jpeg,gif,png格式的图片");
      $("#file").val("");
           return;
       }
      var maxsize = 2*1024*1024;//2M
      var fileSize = 0;
      var obj_file = document.getElementById("file");
      var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
      if (isIE && !obj_file.files) {
         var filePath = obj_file.value;
         var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
         var file = fileSystem.GetFile (filePath);
         fileSize = file.Size;
      }else {
         fileSize = obj_file.files[0].size;
      }
      if(fileSize>maxsize){
        dcrmAlertWarning("照片最大尺寸为2M，请重新上传!");
        return false;
      }
       MaskUtil.Loading();
       $.ajaxFileUpload({
           type: "POST",
           url: API.baseUrl+"/user-apis/pc/user/headUpLoad.action",
           data: {},
           dataType: 'json',
           secureuri:false,
           fileElementId:'file',
           async : false,
           cache: false,
           contentType: false,
           processData: false,
           success: function(data) {
               if(data && data.code == 200) {
          //dcrmAlertSuccess("上传成功");
                 $("#file").val("");
                 console.log(data);
                   //修改首页头像显示
                   $("#head_img").attr("src",data.data.url);
                   $("#head_img").attr("data-src",data.data.name);
                   $('#userImg').attr("src",data.data.url);
                  // getmySetting();
               }else{
                  console.log(data);
            dcrmAlertError(data.msg);
           }
               MaskUtil.RemoveLoading();
           }
       });
}


function up_head(){
  return $('#file').click();
}


//获取用户信息
/*function getUserInfo(){
  var data={
    "id":window.myoid
  };
  API.getUserInfo(data, function(data){
    if(data && data.code == 200) {
      console.log(data);
      var obj=data.data.obj;
      $('#username').val(obj.userName);
       $('#qq').val(obj.qq);
       $('#birthday').val(obj.birthday);
       $('#email').val(obj.email);
       $('#profession').val(obj.job);
       $('#phone').val(obj.mobile);
      $("input[name='sex'][value='"+obj.sex+"']").attr("checked",true);
       $('#weixin').val(obj.weixinId);
       if(obj.headUrl){
          $("#head_img").attr("src",obj.headUrl);
          $("#userImg").attr("src",obj.headUrl);
       }else{
          $("#head_img").attr("src",'../images/head.png');
          $("#userImg").attr("src",'../images/head.png');
       }

    }
    console.log($("input[val='"+obj.sex+"']"))
  });
}*/




// 保存个人设置
$('#save').click(function(){
  var data={
    "loginName":$('#loginname').val(),
    "userName":$('#username').val(),
    "id":window.myoid,
    'qq':$('#qq').val(),
    "birthday":$('#birthday').val(),
    "email":$('#email').val(),
    "job":$('#profession').val(),
    "mobile":$('#phone').val(),
    "sex":$("input[name='sex']:checked").val()?$("input[name='sex']:checked").val():'',
    "weixinId":$('#weixin').val(),
    "headName":$("#head_img").attr("data-src")
  };

  var mobileReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  var emailReg=/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;

  // if($.trim(data.userName).length<2){
  //   dcrmAlertError("姓名须为2-5个字符");
  //   return false;
  // }else if($.trim(data.userName).length>5){
  //   dcrmAlertError("姓名须为2-5个字符");
  //   return false;
  // }
  if(data.loginName==''){
    dcrmAlertWarning('登录名不能为空');
    return;
  }else if(data.userName==''){
    dcrmAlertWarning('姓名不能为空');
    return;
  }
  else if(!mobileReg.test(data.mobile)){
    dcrmAlertWarning('请输入正确的手机号');
    return false;
  }else if(!emailReg.test(data.email)){
    dcrmAlertWarning('请输入正确的邮箱');
    return false;
  }

  MaskUtil.Loading();
  API.mySetting(data, function(data){
    if(data && data.code == 200) {
        //dcrmAlertSuccess(data.msg);
        window.location.href = "/view/index.html";
    }else{
      dcrmAlertError(data.msg);
    }
    MaskUtil.RemoveLoading();
  });

});

