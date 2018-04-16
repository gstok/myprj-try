$(function(){
	$(".setli").find("ul").show();
	$(".menuNormal").find("a").removeClass("active");
	$(".setli").find("span").attr("class","icon icon-jiantou");
	$(".setli").find("ul #index_userSet").find("a").addClass("active");
	// 获取职位下拉框
	queryPositionAll('apositionId')
	// 获取部门下拉框
	queryDepart('adepartId')
	// 获取直属下拉框
	selectExecutorUser('aupperId')
	$('#companyId').html( Global.companyName)
	var $ddd = $(".selectpicker ").select2({
		placeholder: "请选择"
	});
	getFinAccount();//获取财务账号
})

function returnback(){
	window.location.href="/view/setting/usermanagement/usermanagement.html";
}
//获取财务账户
function getFinAccount(){
	API.getFinAccount({},function(data){
		if(data&&data.code==200){
			var obj = data.data.data;
			$("#FinAccount").val(obj.finAccountId);
			if(obj.hasCreate == 0){
				$(".addAccount").show();
			}else{
				$(".addAccount").hide();
			}
		}else{
			dcrmAlertError(data.msg);
		}
	})
}
//新建账户按钮点击
function addPop(){
	$("#addBox").show();
}
//新建账户
function addAccount(){
	API.createFinAccount({},function(data){
		if(data&&data.code==200){
			dcrmAlertSuccess(data.msg);
			$("#addBox").hide();
			getFinAccount();
		}else{
			dcrmAlertError(data.msg);
		}
	})
}
//关闭弹窗
function closeR(){
	$("#addBox").fadeOut();
}

$('.save').click(function(){

	var adepartId=$('#adepartId').val()
	if(adepartId){
		adepartId=adepartId.join(',')
	}
	console.log(adepartId)
	var data={
		// id:oid,
		birthday:$('#userBirthday').val(),
		companyId:Global.companyId,
		departIdList:adepartId,
		email:$('#aemail').val(),
		loginName:$('#aloginName').val(),
		loginPwd:$('#aloginPwd').val(),
		mobile:$('#amobile').val(),
		//job:$('#positionId').parent("li").find("span.select2-selection__rendered").html(),
		job:$('#apositionId').val(),
		//positionId:$('#positionId').val(),
		sex:$('#asex').val(),
		upperId:$('#aupperId').val(),
		userName:$('#auserName').val(),
		finAccountId:$("#FinAccount").val()
	};
	var PwdReg = /^[A-Za-z0-9_]{6,15}$/;
	if(data.loginName==''){
		dcrmAlertWarning('登录账号不能为空');
		return;
	}else if(data.loginPwd==''){
		dcrmAlertWarning('登录密码不能为空');
		return;
	}else if(!PwdReg.test(data.loginPwd)){
		dcrmAlertWarning('密码请设置6－15位字符，可包含英文字母、数字！');
		return;
	}else if(data.userName==''){
		dcrmAlertWarning('姓名不能为空');
		return;
	}else if(data.email.length>30){
		dcrmAlertWarning('邮箱不能超过30个字符');
		return;
	}else if(data.finAccountId==''){
		dcrmAlertWarning('财务账号不能为空');
		return;
	}

	var phone = $('#mobile').val();
	if($.trim(phone)!=''&&!(/^1[34578]\d{9}$/.test(phone))){
   		dcrmAlertError("手机号码有误，请重填");
    	return false;
	}

	API.createUser(data,function(data){
		if(data&&data.code==200){
			dcrmAlertSuccess(data.msg);
				window.location.href = "/view/setting/usermanagement/usermanagement.html";
		}else{
			dcrmAlertError(data.msg);
		}
	})
})