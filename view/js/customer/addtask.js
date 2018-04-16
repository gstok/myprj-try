$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
	$(".customerli").find("ul #index_customer").find("a").addClass("active");
})
var taskId=window.location.search.split('&')[0].split('=')[1];
var isIndex=window.location.search.split('&')[0].split('=')[0];
var name=unescape(window.location.search.split('&')[1].split('=')[1]);

if(taskId){
	$('#involvingcustomer').attr('data-id',taskId);
    $('#involvingcustomer').val(name)
}

//说明从客户列表过来的
if(isIndex=='?indexoid'){
    $('.adetail').addClass('hide')
}else{
    $('.adetail').attr('href',"/view/customer/customer/customerDetail.html?oid="+taskId);
}
getExecutor('executorUserId');
getTypeId('typeId');
//显示添加类型
$('#addType').click(function(){
	$('.addType').removeClass('hide');
})
$('.cancelAdd').click(function(){
	$('.addType').addClass('hide');
})
//添加新任务类型
$('.sureAdd').click(function(){
	var data={
		name:$('#addTypeId').val()
	}

	MaskUtil.Loading();
	API.addTaskType(data, function(res) {

		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
			getTypeId('typeId')
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	    $('#addTaskType').fadeOut();
	    $('.bg').fadeOut();
	});
})

function addNewTask(){
	var custId=$('#involvingcustomer').attr('data-id');
	var data={
    	'finishTime':$('#taskTime').val(),
    	'executorUserId':$('#executorUserId').val(),
    	'custId':custId,
    	'level':$('#level').val(),
    	'remark':$('.remark').val(),
    	'taskName':$('.addTaskTitle').val(),
    	'typeId':$('#typeId').val()
    };
    if(data.taskName.length>50){
    	dcrmAlertWarning('任务名称不能超过50个字符');
    	return false;
    }else if(data.remark.length>100){
    	dcrmAlertWarning('备注不能超过100个字符');
    	return false;
    }
    MaskUtil.Loading();
    API.creatCustTask(data,function(data){

    	if(data.code == 200){
    		dcrmAlertSuccess(data.msg);
            returnCustomer()
    	}else{
    		dcrmAlertError(data.msg);
    	}
    	MaskUtil.RemoveLoading();
    })
}

function returnCustomer(){
    if(isIndex=='?indexoid'){//说明从客户列表过来的
      window.location.href = "/view/customer/customer/customer.html";
    }else{//说明是从客户详情页过来的
      window.location.href = "/view/customer/customer/customerDetail.html?oid="+taskId;
    }
}
