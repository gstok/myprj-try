(function(){
	//获取用户名
	var thisUrl=document.URL;
	var  getval =thisUrl.split('?')[1];
	var showval= getval.split('=')[1];
	$('.save-btn').on('click',function(){
		//获取两次框内密码
		var new_psd=$('.new_psd').val();
		var re_psd=$('.re_psd').val();

		if(!validpassword(new_psd)||!validpassword(re_psd)){
			return false;
		}
		//判断两次密码是否相同
		if($.trim(new_psd) == $.trim(re_psd)){
			API.changePsd({'usercode':showval,'password':re_psd},function(data){
				if(data.success){
					dcrmAlertWarning(data.msg);
					setTimeout(function(){
						location.href='login.html';
					},2000);

				}
			})
		}else{
			 dcrmAlertWarning('两次密码输入不一致');
		}
	})


	//验证密码
	var PwdReg = /^[A-Za-z0-9_]{6,15}$/;
	function validpassword(value) {
		if(!PwdReg.test($.trim(value))){
        	dcrmAlertWarning('密码请设置6－15位字符，可包含英文字母、数字！');
        	return false;
        }else{
            return true;
        }
	}


	 // input获取焦点加白边，失去焦点白边消失
    $(".login-form input:not(.g_btn)").on("focus",  function(){
           this.style.border='1px solid #FFF';
           this.style.backgroundColor='#001437';

        }).on("blur",function(){
           this.style.border='1px solid transparent';
           this.style.backgroundColor='#1A2A47';

    });


    //输入框不为空，下一步按钮变成可用状态
	$('.new_psd,.re_psd').on('keyup',function(){
	    if($.trim($('.new_psd').val())!='' && $.trim($('.re_psd').val())!=''){
	        $('.repass-btn').css('backgroundColor','#58c1a8')
	    }else{
	        $('.repass-btn').css('backgroundColor','#208A71')
	    }

	})

}())