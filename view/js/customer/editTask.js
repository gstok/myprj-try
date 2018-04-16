$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_customer").find("a").addClass("active");
})
//详情页面编辑任务
var taskId=window.location.search.split('&')[0].split('=')[1];
var isIndex=window.location.search.split('&')[0].split('=')[0];
var name=unescape(window.location.search.split('&')[1].split('=')[1]);

if(taskId){
	$('#involvingcustomer').attr('data-id',taskId);
    $('#involvingcustomer').val(name)
}

getExecutor('executorUserId');//获取执行人
getTypeId('typeId');//获取任务类型
console.log(taskId)

//编辑任务获取资料
var data={
        'id':taskId
}
MaskUtil.Loading();
API.getCustTaskdetail(data,function(data){
    console.log(data)
    var obj=data.data.data;
    console.log(obj.createUserId)
    if(data.code == 200){
        $('#completeTime').val(isNull(obj.finishTime));
        $('#executorUserId').val(isNull(obj.executorUserName));
        // $('#custId').val(isNull(obj.custId));
        $('#level').val(obj.level);
        $('#remark').val(isNull(obj.remark));
        $('.addTaskTitle').val(isNull(obj.taskName));
        $('#typeId').val(obj.typeId);
        //如果从客户详情页过来，则获取当前用户的id
        if(isIndex!='?indexoid'){
            window.custId=obj.custId;
        }
    }else{
        dcrmAlertError(data.msg);
    }
    MaskUtil.RemoveLoading();
});
//编辑任务保存
function addTaskSure(){

	var data={
    	'finishTime':$('#completeTime').val(),
    	'executorUserId':$('#executorUserId').val(),
    	'custId':window.custId,
    	'level':$('#level').val(),
    	'remark':$('.remark').val(),
    	'taskName':$('.addTaskTitle').val(),
    	'typeId':$('#typeId').val(),
        'id':taskId
    };

    if(data.taskName.length>50){
    	dcrmAlertWarning('任务名称不能超过50个字符');
    	return false;
    }else if(data.remark.length>100){
    	dcrmAlertWarning('备注不能超过100个字符');
    	return false;
    }
    MaskUtil.Loading();
    API.editCustTask(data,function(data){

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
    if(isIndex=='?indexoid'){//说明从任务列表过来的
      window.location.href = "/view/task/task.html";
    }else{//说明是从客户详情页过来的
      window.location.href = "/view/customer/customer/customerDetail.html?oid="+window.custId;
    }
}



