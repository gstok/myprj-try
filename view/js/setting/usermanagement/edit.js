//用户管理--编辑
if(hasPermission("user","UPDATE")){
	$('#setting li').find('input').removeAttr("readonly");
	$('#setting li').find('select').removeAttr("disabled");
	$('.save').removeAttr("disabled");
}else{
	$('#setting li').find('input').attr("readonly","readonly");
	$('#setting li').find('select').attr("disabled","disabled");
	$("#userBirthday").unbind();
	$('.save').attr("disabled","disabled");
}




$(function(){
	$(".setli").find("ul").show();
	$(".menuNormal").find("a").removeClass("active");
	$(".setli").find("span").attr("class","icon icon-jiantou");
	$(".setli").find("ul #index_userSet").find("a").addClass("active");
	// 获取职位下拉框
	queryPositionAll('positionId');
	// 获取部门下拉框
	queryDepart('departId');
	// 获取直属下拉框
	selectExecutorUser('upperId');
	var $ddd = $(".selectpicker ").select2();
})

var oid=window.location.search.split('=')[1].split('&')[0];
function returnback(){
	window.location.href="/view/setting/usermanagement/usermanagement.html";
}
//查看用户
// function UserInfo(){
// 	var data ={
// 		id:oid
// 	};
// 	API.UserInfo(data,function(data){
// 		if( data && data.code==200){
// 			var obj = data.data.data;
// 			$('#loginName').val(obj.loginName);
// 			$('#loginPwd').val(obj.loginPwd);
// 			$('#userName').val(obj.userName);
// 			$('#mobile').val(obj.mobile);
// 			$('#email').val(obj.email);
// 			$('#sex').val(obj.sex);
// 			$('#departId').val(obj.departId);
// 			$('#positionId').val(obj.positionId);
// 			$('#upperId').val(obj.upperId);
// 			$('#userBirthday').val(obj.userBirthday);
// 			$('#companyId').html(obj.companyName)
// 		}else{
// 			dcrmAlertError(data.msg);
// 		}
// 	})
// }


// 编辑用户回显
var datas={
	id:oid
}
MaskUtil.Loading();
API.sgetUserInfo(datas,function(data){
	if(data&&data.code==200){
		var obj=data.data.data;

		$('#userBirthday').val(obj.birthday),
		$('#departId').val(obj.departIds),
		$('#email').val(obj.email),
		$('#loginName').val(obj.loginName),
		$('#loginPwd').val(obj.loginPwd),
		$('#mobile').val(obj.mobile),
		// $('#positionId').val(obj.job),
		$('#sex').val(obj.sex),
		// $('#upperId').val(obj.upperId),
		$('#userName').val(obj.userName),
		$('#companyId').html(obj.companyName),
		$('#companyId').attr('data-id',obj.companyId);


		setTimeout(function(){
			if(obj.departIds){
				$("#departId ").select2().val(obj.departIds).trigger('change');
			}

			$("#positionId").select2().val(obj.job).trigger('change');
			$("#upperId").select2().val(obj.upperId).trigger('change');;
		},1000)
		console.log(obj.departIds);
		console.log($('#departId').val());
		console.log($('#positionId').val());


	}else{
		dcrmAlertError(data.msg);
	}
	MaskUtil.RemoveLoading();
})

// 编辑用户保存
$('.save').click(function(){

var departIdList='';
if($('#departId').val()){
	departIdList=$('#departId').val().join(',');
}
	var data={
		id:oid,
		birthday:$('#userBirthday').val(),
		companyId:$('#companyId').attr('data-id'),
		departIdList:departIdList,
		email:$('#email').val(),
		loginName:$('#loginName').val(),
		loginPwd:$('#loginPwd').val(),
		mobile:$('#mobile').val(),
		//job:$('#positionId').parent("li").find("span.select2-selection__rendered").html(),
		job:$('#positionId').val(),
		//positionId:$('#positionId').val(),
		sex:$('#sex').val(),
		upperId:$('#upperId').val(),
		userName:$('#userName').val()
	};
	var PwdReg = /^[A-Za-z0-9_]{6,15}$/;
	if(data.loginName==''){
		dcrmAlertWarning('登录账号不能为空');
		return;
	}else if(data.loginPwd==''){
		dcrmAlertWarning('登录密码不能为空');
		return;
	}else if(!PwdReg.test(data.loginPwd)&&data.loginPwd!='**********'){
		dcrmAlertWarning('密码请设置6－15位字符，可包含英文字母、数字！');
		return;
	}else if(data.userName==''){
		dcrmAlertWarning('姓名不能为空');
		return;
	}else if(data.email.length>30){
		dcrmAlertWarning('邮箱不能超过30个字符');
		return;
	}
	var phone = $('#mobile').val();
	if($.trim(phone)!=''&&!(/^1[34578]\d{9}$/.test(phone))){
   		dcrmAlertError("手机号码有误，请重填");
    	return false;
	}
	API.updateUser(data,function(data){
		if(data&&data.code==200){
			dcrmAlertSuccess(data.msg);
				window.location.href = "/view/setting/usermanagement/usermanagement.html";
		}else{
			dcrmAlertError(data.msg);
		}
	})
});