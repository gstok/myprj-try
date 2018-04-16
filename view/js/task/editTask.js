$(function(){
    $(".menuNormal").find("a").removeClass("active");
});


if(window.location.search){//任务页面编辑客户
    var taskId=window.location.search.split('&')[0].split('=')[1];//id
    var isIndex=window.location.search.split('&')[0].split('=')[0];//是否为任务列表页过来
    var name=unescape(window.location.search.split('&')[1].split('=')[1]);//涉及客户名字或者tab名字
    console.log(name)
}else{//任务页面新建客户
    $('.titleSpan em').html(' / 创建任务');
}

getExecutor('executorUserId');//执行人下拉
getTypeId('typeId');//任务类型下拉
getSelectCust('custId');//涉及客户下拉


if(taskId){
	$('#involvingcustomer').attr('data-id',taskId);
    $('#involvingcustomer').val(name);

    // 编辑任务获取资料
    var data={
        'id':taskId
    }
    MaskUtil.Loading();
    API.getCustTaskdetail(data,function(data){

        var obj=data.data.data;

        if(data.code == 200){
            console.log(obj.custId)
            $('#completeTime').val(isNull(obj.finishTime));
            $('#executorUserId').val(isNull(obj.executorUserName));
            $('#custId').val(obj.custId);
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
}



function returnCustomer(){
    if(isIndex&&isIndex=='?indexoid'){//说明从任务列表过来的
        if(name=='全部任务'){
            currentTab='allTask';
        }else if(name=='未分配任务'){
            currentTab='undistributed';
        }else if(name=='我处理中的任务'){
            currentTab='myInProcess';
        }else if(name=='所有处理中的任务'){
            currentTab='inProcess';
        }else{
            currentTab='completedTask'
        }

      window.location.href = "/view/task/task.html?oid="+currentTab;
    }else if(isIndex&&isIndex!='?indexoid'){//说明是从客户详情页过来的
      window.location.href = "/view/customer/customer/customerDetail.html?oid="+window.custId;
    }else{
      window.location.href = "/view/task/task.html";
    }
}

// 新建或编辑任务保存
function addTaskSure(){
    if($('.titleSpan em').text()!=' / 编辑任务'){//新建任务保存
        var data={
            'finishTime':$('#completeTime').val(),
            'executorUserId':$('#executorUserId').val(),
            'custId':$('#custId').val(),
            'level':$('#level').val(),
            'remark':$('#remark').val(),
            'taskName':$('#taskName').val(),
            'typeId':$('#typeId').val()
        };
        if(data.taskName==''){
            dcrmAlertWarning('标题不能为空');
            return false;
        }else if(data.taskName.length>50){
            dcrmAlertWarning('标题不能超过50个字符');
            return false;
        }else if(data.remark.length>100){
            dcrmAlertWarning('备注不能超过100个字符');
            return false;
        }
        MaskUtil.Loading();
        API.creatCustTask(data,function(data){
            console.log(data)
            if(data.code == 200){
                dcrmAlertSuccess(data.msg);
                //创建成功后跳转到全部任务
               window.location.href = "/view/task/task.html";

            }else{
                dcrmAlertError(data.msg);
            }
            MaskUtil.RemoveLoading();
        })
    }else{//编辑任务保存
         var data={
         'finishTime':$('#completeTime').val(),
         'executorUserId':$('#executorUserId').val(),
         'custId':$('#custId').val(),
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

}




