
var oid=window.location.search.split('=')[1];
$(function(){
    $(".menuNormal").find("a").removeClass("active");
	$('.nav-tabs li').on('click',function(){
		$('.nav-tabs li').removeClass('active');
		$(this).addClass('active');
	})
	power();
	getExecutor('executorUserId');
	getTypeId('typeId');
	getSelectCust('custId');
	//首页点击进去显示相应的任务列表
	setTimeout(function(){
		if(oid=='undistributed'){
			$('.unallotTask').click()//未分配任务
		}else if(oid=='inProcess'){
			$('.allInhandTask').click()//所有处理中任务
		}else if(oid=='myInProcess'){
			$('.inhandTask').click()//我处理中任务
		}else if(oid=='completedTask'){
			$('.completedTask').click();//已完成任务
		}else{
			allTask()//全部任务
		}
	},200)

});

// 显示任务列表及分页
function custTaskList(page,size,num,status,executorUserId){
	var data = {
		"pageIndex":page,
		"pageSize":size,
		'status':status,
		'executorUserId':executorUserId

    };
    // console.log(data)
    MaskUtil.Loading();
	API.custTaskList(data,function(data){
		var obj=data.data.pageData.list;
		if(obj.length>0){
			$('#unallottasklist tbody').html('');
			for (var i =0;i< obj.length; i++) {
				// 判断数据是否为null
		        var str = '';
		        var cz;
		        var statusName='';
		        var levelContent='';
		        var statusContent='';
		        var chak = '';//查看
		        var edit = '';//编辑
		        var del = '';//删除
		        //任务管理--查看
				if (hasPermission("task", "GET")) {
					chak = '<td class="typeblue" onclick="chakan('+isNull(obj[i].id)+','+obj[i].status+','+obj[i].executorUserId+')">'+isNull(obj[i].taskName)+'</td>';
				}else{
					chak = '<td class="typeblue">'+isNull(obj[i].taskName)+'</td>';
				}
		        //判断状态
		        if( obj[i].status=='0'){
		        	statusName='未分配';
		        	statusContent='<span class="gray spcspan">●</span>';
		        	//任务管理--编辑
					if (hasPermission("task", "UPDATE")) {
		        		edit = '<a href="javascript:;" onclick="editTask(event,'+obj[i].id+','+obj[i].status+')" data-container="body" data-toggle="popover" data-placement="top" data-content="编辑任务"><i class="icon icon-renwu2"></i></a>';
		        	}else{
		        		edit ='<a><i class="icon iicon-renwu2 disabled"></i></a>';
		        	}
		        	//任务管理--删除
					if (hasPermission("task", "DEL")) {
		        		del = '<a href="javascript:;" onclick="delTask(event,'+obj[i].id+','+status+')" data-container="body" data-toggle="popover" data-placement="top" data-content="删除"><i class="icon icon-shanchu"></i></a>';
		        	}else{
		        		del ='<a><i class="icon icon-shanchu disabled"></i></a>';
		        	}
					cz= edit+'<i class="shugang">|</i>'+del;

		        }else if(obj[i].status=='2'){
		        	statusName='处理中';
		        	statusContent='<span class="yellow spcspan">●</span>';
		        	// if(executorUserId){//我处理中
		        		//任务管理--编辑----完成任务
					if (hasPermission("task", "UPDATE")) {
		        		cz= '<a href="javascript:;" class="btn finishBtn" onclick="completeTask(event,'+obj[i].id+','+obj[i].status+')"><i class="icon icon-querenshoudao"></i>完成任务</a>';
		        	}else{
		        		cz= '<i class="icon icon-querenshoudao disabled"></i><sapn style="color:#999">完成任务</span>';
		        	}

		        	// }
		        	// else if(!executorUserId&&(obj[i].executorUserId==Global.userId)){
		        	// 	cz= ' <td class="textcenter">'+
			        // 	'      <a href="javascript:;" class="btn finishBtn" onclick="completeTask(event,'+obj[i].id+','+obj[i].status+')"><i class="icon icon-querenshoudao"></i>完成任务</a>'+
			        // 	'     </td>';
		        	// }
		        	// else{
		        	// 	cz='<td>'+
			        // 	'  </td>';
		        	// }


		        }else if(obj[i].status=='1'){
		        	statusName='已完成';
		        	statusContent='<span class="green spcspan">●</span>';
		        	cz='';
		        };
		        //判断优先级
		        var level=isNull(obj[i].level);
		        if(level==0){
		        	levelName='普通';
		        }else if(level==1){
		        	levelName='紧急';
		        	levelContent='<img class="marginLeft10" src="/view/images/hurry.png">';
		        }else{
		        	levelName='非常紧急';
		        	console.log('非常紧急');
		        	levelContent='<img class="marginLeft10" src="/view/images/veryhurry.png">';
		        	console.log(levelContent);
		        }
		        if(status==null){
			        str+=' <tr>'+chak+
			        '    <td>'+isNull(obj[i].displayCreateTime)+'</td>'+
			        '    <td>'+levelName+levelContent+'</td>'+
			        '    <td>'+isNull(obj[i].executorUserName)+'</td>'+
			        '    <td>'+isNull(obj[i].custName)+'</td>'+
			        '    <td>'+statusName+statusContent+'</td>'+
			        '	 <td class="textcenter">'+cz+'</td>'+
			        '</tr>';
		        }else if(status==0||status==2){
		        	str+=' <tr>'+chak+
			        '    <td>'+isNull(obj[i].displayCreateTime)+'</td>'+
			        '    <td>'+levelName+levelContent+'</td>'+
			        '    <td>'+isNull(obj[i].executorUserName)+'</td>'+
			        '    <td>'+isNull(obj[i].custName)+'</td>'+
			        '	 <td class="textcenter">'+cz+'</td>'+
			        '</tr>';
		        }else{
	        		str+=' <tr>'+chak+
			        '    <td>'+isNull(obj[i].displayCreateTime)+'</td>'+
			        '    <td>'+levelName+levelContent+'</td>'+
			        '    <td>'+isNull(obj[i].executorUserName)+'</td>'+
			        '    <td>'+isNull(obj[i].custName)+'</td>'+
			        '</tr>';
	            }
	            //console.log(str);
				$('#unallottasklist tbody').append(str);
				if(page==0){
				$('.ui-paging-container').remove();
                $('.tasklistpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                    custTaskList(page,size,num,status,executorUserId);
                }});

            }
       		};
		}else{
				trdat = "<tr >"+
	            	"<td  colspan='"+num+"' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
	            	"</tr> ";
	        	$('.taskList tbody').html(trdat)
		};
		MaskUtil.RemoveLoading();
		setTimeout(function(){
           $("[data-toggle='popover']").popover({trigger:"hover"});
        },500)

		});
};




//全部任务
function allTask(){
	console.log(Global.userId)
	var str = '<tr>'+
                '<th>标题</th>'+
                '<th>创建时间</th>'+
                '<th>优先级</th>'+
                '<th>执行者</th>'+
                '<th>涉及客户</th>'+
                '<th>任务状态</th>'+
                '<th class="textcenter">操作</th>'+
            '</tr>';
	$('#unallottasklist thead').html(str);
	custTaskList(0,20,7,null);
}
//未分配任务列表
function unallotTask(){
	var str = '<tr>'+
                '<th>标题</th>'+
                '<th>创建时间</th>'+
                '<th>优先级</th>'+
                '<th>执行者</th>'+
                '<th>涉及客户</th>'+
                '<th class="textcenter">操作</th>'+
            '</tr>';
	$('#unallottasklist thead').html(str);
	custTaskList(0,20,6,0);
}
//我处理中的任务列表
function inhandTask(){
	var str = '<tr>'+
                '<th>标题</th>'+
                '<th>创建时间</th>'+
                '<th>优先级</th>'+
                '<th>涉及客户</th>'+
                '<th>执行者</th>'+
                '<th class="textcenter">操作</th>'+
            '</tr>';
	$('#unallottasklist thead').html(str);
	custTaskList(0,20,6,2,Global.userId);
}
//所有处理中的任务列表
function allInhandTask(){
	var str = '<tr>'+
                '<th>标题</th>'+
                '<th>创建时间</th>'+
                '<th>优先级</th>'+
                '<th>执行者</th>'+
                '<th>涉及客户</th>'+
                '<th class="textcenter">操作</th>'+
            '</tr>';
	$('#unallottasklist thead').html(str);
	custTaskList(0,20,6,2);
}
//已完成的任务列表
function completedTask(){
	var str = '<tr>'+
                '<th>标题</th>'+
                '<th>创建时间</th>'+
                '<th>优先级</th>'+
                '<th>执行者</th>'+
                '<th>涉及客户</th>'+
            '</tr>';
	$('#unallottasklist thead').html(str);
	custTaskList(0,20,5,1);
}
//任务页取消和保存按钮
$('#addType').click(function(){
	$('.addType').removeClass('hide');
})

$('.cancelAdd').click(function(){
	$('.addType').addClass('hide');
})


// 新建任务展示
$('.rightAdd').click(function(){
 window.location.href = "/view/task/editTask.html";
})

// 编辑任务显示
function editTask(event,id,status){
	event.stopPropagation();

var currentTab=$('.nav-tabs li.active a').html();
window.location.href = "/view/task/editTask.html?indexoid="+id+"&str="+escape(currentTab);

}


//查看任务
function chakan(id,status,executorUserId){
	var currentTab=$('.nav-tabs li.active a').html();
	window.location.href = "/view/task/viewTask.html?indexoid="+id+'&status='+status+'&executorUserId='+executorUserId+"&str="+escape(currentTab);
}

//点击完成任务按钮
$('body').on('click','.completeTask',function(){
	var id=$('.completeoredit').attr('data-id');
	var status=$('.completeoredit').attr('data-status');
	completeTask(event,id,status)
})

//点击编辑任务按钮
$('body').on('click','.editTask',function(){
	var id=$('.completeoredit').attr('data-id');
	var status=$('.completeoredit').attr('data-status');
	editTask(event,id,status);
	$('.ckTask').addClass('hide');
})

//删除任务
function delTask(event,id,status){
	event.stopPropagation();
	var data = {
  		id:id
  	};
  	dcrmConfirm("您确定要删除该任务吗？",function(){
  		var currentTab=$('.nav-tabs li.active a').html();
	  	MaskUtil.Loading();
	    API.delectCustTask(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);
			  // 跳转到相应页面
			   if(currentTab=='全部任务'){
	    			allTask()
	    		}else if(currentTab=='未分配任务'){
	    			custTaskList(0,20,6,0);
	    		}else if(currentTab=='我处理中的任务'){
	    			inhandTask()
	    		}else if(currentTab=='所有处理中的任务'){
	    			$('.allInhandTask').click();
	    		}else{
	    			completedTask()
	    		}
			 }else{
				 dcrmAlertError(data.msg);
		     }
		  MaskUtil.RemoveLoading();
	    });
  	});
}
//完成任务
function completeTask(event,id,status){
	event.stopPropagation();
	var data = {
  		'id':id,
  		'status':status
  	};
  	API.completeCustTask(data, function(data){
  		var currentTab=$('.nav-tabs li.active a').html();

	  if(data && data.code == 200) {
		    dcrmAlertSuccess(data.msg);
		     // 跳转到相应页面

		    if(currentTab=='全部任务'){
    			allTask()
    		}else if(currentTab=='未分配任务'){
    			unallotTask()
    		}else if(currentTab=='我处理中的任务'){
    			inhandTask()
    		}else if(currentTab=='所有处理中的任务'){
    			$('.allInhandTask').click();
    		}else{
    			completedTask()
    		}
    		//查看页面完成任务按钮隐藏
		    $('.completeoredit').hide();
		 }else{
			dcrmAlertError(data.msg);
	     }
	  MaskUtil.RemoveLoading();
    });
}




