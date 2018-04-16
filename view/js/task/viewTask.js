
var id=window.location.search.split('&')[0].split('=')[1];
var status=window.location.search.split('&')[1].split('=')[1];

if(window.location.search.split('&').length>2){//执行人
 var executorUserId=window.location.search.split('&')[2].split('=')[1];
}

if(window.location.search.split('&').length>3){//任务tab值
 var currentTab=unescape(window.location.search.split('&')[3].split('=')[1]);
}

var isIndex=window.location.search.split('&')[0].split('=')[0];//是否为任务列表页
console.log(executorUserId)

if(isIndex=='?indexoid'){
    $(function(){
        $(".menuNormal").find("a").removeClass("active");
    })
}else{
    $(function(){
        $(".customerli").find("ul").show();
        $(".menuNormal").find("a").removeClass("active");
        $(".customerli").find("span").attr("class","icon icon-jiantou");
        $(".customerli").find("ul").find("a").eq(1).addClass("active");
    })
}
$('.completeoredit').html('');
setTimeout(function(){
    if(status=='0'){
        //任务管理--编辑任务
        if (hasPermission("task", "UPDATE")) {
            $('.completeoredit').show().html('编辑任务').removeClass('completeTask').addClass('editTask');
        }else{
            $('.completeoredit').hide();
        }

    }else if(status=='2'){
        //任务管理--编辑---完成任务
        if (hasPermission("task", "UPDATE")) {
            $('.completeoredit').show().html('完成任务').addClass('completeTask').removeClass('editTask');
        }else{
            $('.completeoredit').hide();
        }

    }else if(status=='1'){
        $('.completeoredit').hide();
    }else{
        $('.completeoredit').hide();
    }

},100)

var data={
	'id':id
};

API.getCustTaskdetail(data,function(data){
	console.log(data)
	var obj=data.data.data;
	var level=isNull(obj.level);
    if(level==0){
    	levelName='普通';
    }else if(level==1){
    	levelName='紧急';
    }else{
    	levelName='非常紧急';
    }
	if(data.code == 200){
		$('#finishTimeck').html(isNull(obj.finishTime));
		$('#executorUserNameck').html(isNull(obj.executorUserName));
		$('#custIdck').html(isNull(obj.custName));
		$('#levelck').html(levelName);
		$('#remarkck').html(isNull(obj.remark));
		$('#taskNameck').html(isNull(obj.taskName));
		$('#typeIdck').html(isNull(obj.typeName));
        window.custId=obj.custId;
        window.name=obj.custName;
	}else{
		dcrmAlertError(data.msg);
	}
});

//点击完成任务按钮
$('body').on('click','.completeTask',function(){
    completeTask(id,status)
})

//点击编辑任务按钮
$('body').on('click','.editTask',function(){

    if(isIndex=='?indexoid'){//说明从客户列表过来的

        window.location.href = "/view/task/editTask.html?indexoid="+id+"&str="+escape(currentTab);
    }else{//说明从客户详情过来的
         window.location.href = "/view/customer/customer/editTask.html?oid="+id+'&name='+escape(window.name);
    }
})


//完成任务
function completeTask(id,status){
    var data = {
        'id':id,
        'status':status
    };
    API.completeCustTask(data, function(data){
      if(data && data.code == 200) {
            dcrmAlertSuccess(data.msg);
            if(isIndex=='?indexoid'){//说明从客户列表过来的
              window.location.href = "/view/task/task.html";
            }else{
                window.location.href = "/view/customer/customer/customerDetail.html?oid="+window.custId;
            }
            //查看页面完成任务按钮隐藏
            $('.completeoredit').hide();
         }else{
            dcrmAlertError(data.msg);
         }
      MaskUtil.RemoveLoading();
    });
}

// 点击取消和关闭返回原页面
function returnCustomer(){
    if(isIndex=='?indexoid'){//说明从任务列表过来的
      window.location.href = "/view/task/task.html";

    }else{//说明是从客户详情页过来的
      window.location.href = "/view/customer/customer/customerDetail.html?oid="+window.custId;

    }
}

