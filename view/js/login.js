
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if(userAgent.indexOf("Chrome") == -1){
        $('#isChrome').show();
    }
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

// 点击登录按钮
    $(".login-btn a").on("click",function(e){
        e.preventDefault();
        if($("#username").val()=="" || $("#password").val()==""){
            dcrmAlertWarning("用户名或密码不能为空！");
            //$('#.login-btn').css('backgroundColor','#5762b0')
        }else{

            var data = {
                loginName:$.trim($("#username").val()),
                loginPwd:$.trim($("#password").val()),
                type:0
                // rememberMe:$('#free-30days').prop('checked')
            };
            /*if($("input[type='checkbox']").is(':checked')){
              setCookie();
            }*/
            API.login(data,function(res){
                console.log(res.data);
                if(res.code == 200){
                   $.cookie("wxloginName",'');
                    Global.userId = res.data.obj.id;
                    var sysResList = res.data.obj.sysResList;
                    /*if(res.data.obj.isAgreeDisclaimer == 0){
                        $('#AgreementBox').show();
                        return;
                    }*/
                    //if(res.data.obj.id == 17){
                      if(res.data.obj.isAgreeDisclaimer == 0){
                        $('#AgreementBox').show();
                        //同意协议
                        $("#agreenBtn").on('click',function(){
                          API.isAgreeDisclaimer(data,function(res){
                            if(res.code == 200){
                              $("#AgreementBox").hide();
                              loginow();
                            }
                          })
                        });
                    }else{
                      loginow();
                    }

                    function loginow(){
                      var urllist = [];
                      var url = '';
                      if(sysResList&&sysResList.length>0){
                          $.each(sysResList,function(i,u){
                              if (u.resType == 1 && u.resName == "首页") {
                                  urllist.push(u);
                              }else{
                                  if (u.resType == 2) {
                                      urllist.push(u);
                                  }
                              }
                              url = urllist[0];
                          });
                          console.log(url);
                          url = url.resUrl;
                          $("#url").val(url);
                          if($("input[type='checkbox']").is(':checked')){
                              setCookie();
                          }
                          /*if(){
                            $('#AgreementBox').show();
                          }else{*/
                            setTimeout(function(){
                                //$(".xcConfirm").hide();
                                //window.location.href = API.baseUrl+"/view/index.html";
                                window.location.href = API.baseUrl+url;
                            },300);
                          //}
                      }else{
                          //dcrmAlertWarning("该用户没有任何权限");
                          window.location.href = API.baseUrl+"/view/setting/selfsetting.html";
                      }
                    }
                }else if(res.code == 10001){
                    window.location.href = API.baseUrl+"/modifypwd.html";
                }else{
                    dcrmAlertError(res.msg);
                }
            });
        }
    });
  //服务协议弹窗关闭
  function closeAgreement(){
    $('#AgreementBox').hide();
  };
  //服务内容关闭
  function closeAgree(){
    $('#AgreementDet').hide();
  };
  //显示服务协议内容弹窗
  function showAgreement(){
    $('#AgreementDet').show();
  };
    function KeyDown(event){
      if (event.keyCode == 13)
      {
        event.returnValue=false;
        event.cancel = true;
        $(".login-btn a").click();
      }
    }


    function setCookie(){
         var loginCode = $("#username").val();
         var pwd = $("#password").val();
         var checked = $("#free-30days");
         var url = $("#url").val();
         $.cookie("url",url);
         if($("input[type='checkbox']").is(':checked')){
            $.cookie("login_code",loginCode);
            $.cookie("pwd",$.base64.encode(pwd));
         }else{
            $.cookie("pwd", null);
         }
    }

    function getCookie(){
         var loginCode = $.cookie("login_code");
         var pwd = $.cookie("pwd");
         var url = $.cookie("url");

         if(pwd){
            $("#free-30days").attr("checked","true");
         }
         if(loginCode){
            $("#username").val(loginCode);
         }
         if(pwd){
            $("#password").val($.base64.decode(pwd));
         }
    }
    getCookie();
    //显示大二维码
    $(".qrcodeBox").mouseenter(function () {
        $(".qrcode").show();
    }).mouseleave(function () {
        $(".qrcode").hide();
    });


    //输入框不为空，下一步按钮变成可用状态
// $('#username,#password').on('keyup',function(){
//     if($.trim($('#password').val())!='' && $.trim($('#username').val())!=''){
//         $('.login-btn').css('backgroundColor','#606cbf')
//     }else{
//         $('.login-btn').css('backgroundColor','#5762b0')
//     }

// })

