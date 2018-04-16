(function(){

	var t_val,y_val;
	var btn=$('.g_btn');
	var r_btn=$('.next-btn');
	var num=60,timer;
	//验证手机号
	var MobileReg = /^0?(13[0-9]|15[012356789]|18[0123456789]|14[57]|17[0678])[0-9]{8}$/;


	function validmobile() {
		if ($.trim($("  ").val()) == "") {
			dcrmAlertWarning('手机号码不能为空');
            return false;
        } else if(!MobileReg.test($.trim($(".test").val()))){
        	dcrmAlertWarning('请输入正确的手机号码');
        	return false;
        }
	}

	//获取验证码
	btn.on('click',function(){
		$('.repass .g_btn').css('color','#4c5d99');
		t_val=$('.test').val();

		if ($.trim(t_val) == "") {
			dcrmAlertWarning('手机号码不能为空');
            return false;
        } else if(!MobileReg.test($.trim(t_val))){
        	dcrmAlertWarning('请输入正确的手机号码');
        	return false;
        }else{

        	API.getPass( {'usercode':t_val},function(data){
				if(!data.success){
					 dcrmAlertWarning(data.msg);
					 if(timer){
						 clearInterval(timer);
					 }
					$('.g_btn').val('获取验证码');
					$('.g_btn').prop({'disabled':''});
				}
			})
        	timer=setInterval(function(){
				num--;
				$('.g_btn').val(num+'秒后重试');
				$('.g_btn').prop({'disabled':'disabled'});
				if(num==0){
					clearInterval(timer);
					num=60;
					$('.g_btn').val('获取验证码');
					$('.g_btn').prop({'disabled':''});
				}
			},1000);

        }
	})
	//点击下一步
	r_btn.on('click',function(){
			y_val=$('#passYzm').val();
			if(y_val!=''){
				API.getRel({'identifyCode':y_val,'usercode':t_val},function(data){
					console.log(data)
					if(data.success){
						location.href='repass.html?usercode='+t_val;
					}else{
						dcrmAlertWarning(data.msg);
					}

				})
			}else{
				dcrmAlertWarning('验证码不能为空');
			}


	})

//输入框不为空，下一步按钮变成可用状态
$('#passPhone,#passYzm').on('keyup',function(){
	if($.trim($('#passPhone').val())!='' && $.trim($('#passYzm').val())!=''){
		$('.pass-btn').css('backgroundColor','#58c1a8')
	}else{
		$('.pass-btn').css('backgroundColor','#208A71')
	}

})
 // input获取焦点加白边，失去焦点白边消失
    $(".login-form input:not(.g_btn)").on("focus",  function(){
           this.style.border='1px solid #FFF';
           this.style.backgroundColor='#001437';

        }).on("blur",function(){
           this.style.border='1px solid transparent';
           this.style.backgroundColor='#1A2A47';
    });

}())

