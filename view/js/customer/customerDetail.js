$(function(){
	$(".customerli").find("ul").show();
	$(".menuNormal").find("a").removeClass("active");
	$(".customerli").find("span").attr("class","icon icon-jiantou");
	$(".customerli").find("ul #index_customer").find("a").addClass("active");
	power();
})
// 查看客户
var oid=window.location.search.split('=')[1].split('&')[0];
if(window.location.search.split('&')[1]){
var companyId=window.location.search.split('&')[1].split('=')[1];
}
if(window.location.search.split('&')[2]){
var group=window.location.search.split('&')[2].split('=')[0];
}

var name='';
	var data={
		id:oid
	}

	var pamam={
		'custId':oid
	}

//获取基本信息
MaskUtil.Loading();
API.viewCustomer(data,function(data){
	//显示信息列表
	var obj=data.data.commonAttrList;
	var cust=data.data.cust;

	var str='';
	//显示销售列表

	//销售阶段
	var stageList=data.data.stageList;
    var stageStr='<option value="">请选择</option>';
    $.each(stageList,function(index,item){

        stageStr+='<option value="'+item.id+'">'+item.name+'</option>'
    })
    console.log(stageStr)
    $('.customerStage').html(stageStr);

	//显示群组标签
	var getgroupTagobj='';
	var param={
		custId:oid
	};
	API.getGroup(param,function(data){
			getgroupTagobj=data.data.groupList;
	});

	if(data.data.groupTagArray){
	    var groupArray=data.data.groupTagArray;
	    $(".group-select").html('');
	    if(getgroupTagobj){
	    	$.each(getgroupTagobj,function(index,item){
				var lock=true;
				if(lock){
					$.each(groupArray,function(i,currentItem){
			        	if(item.groupName==currentItem){
							lock=false;
			        	}
				    })
				    if(lock==false){
				    	$(".group-select").append('<option  value="'+item.groupName+'" selected>'+item.groupName+'</option>');
				    }else{
				    	$(".group-select").append('<option  value="'+item.groupName+'">'+item.groupName+'</option>');
				    }
				}

		    })
	    }


	}else{
		if(getgroupTagobj){
			$.each(getgroupTagobj,function(index,item){
				$(".group-select").append('<option  value="'+item.groupName+'">'+item.groupName+'</option>');
	    	})
		}else{

			$('body').on('click','#customergroup_chosen .chosen-choices',function(){
				dcrmAlertWarning('该用户不在任何群组')
			})

		}
	}

	// $(".group-select").select2();
	var groupSelectEle = $(".group-select");
	groupSelectEle.chosen({
	     search_contains: true,//可以让chosen搜索选项的中间及末尾字符
	     disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
	    });
	groupSelectEle.trigger("liszt:updated");//更新选项

	// 修改群组标签
	groupSelectEle.change(function(){
		var groupTag="";
			console.log($(this).val());
			if($(this).val()){
				if($(this).val().length>1){
					groupTag=$(this).val().join(';');
				}else if($(this).val().length==1){
					groupTag=$(this).val()[0];
				}

			}
				var data={
					'groupTag':groupTag,
					'id':oid
				}
		    API.updateGroupTag(data,function(data){
				if(data.code == 200){
		    		//dcrmAlertSuccess(data.msg);
		    	}else{
		    		//dcrmAlertError(data.msg);
		    	}
			})
	})

	//显示客户标签
	var getAllTagobj;
	API.getAllTag(param,function(data){
			getAllTagobj=data.data.taglist;
	});
	if(data.data.customTagList){
	    var tagArray=data.data.customTagList;
	    // $(".zdy").html('');
	    // $(".hkdw").html('');
	    var param={};
		$.each(getAllTagobj,function(index,item){
			var lock=true;
			if(lock){
				$.each(tagArray,function(index,currentItem){
		        	if(item.tagName==currentItem){
						lock=false;
		        	}
			    });
			    if(lock==false){
			    	$(".tag-select").append('<option  value="'+item.tagName+'" selected>'+item.tagName+'</option>');
			    }else{
			    	$(".tag-select ").append('<option  value="'+item.tagName+'">'+item.tagName+'</option>');
			    }
			}

	    })

	}else{
		$.each(getAllTagobj,function(index,item){
			$(".tag-select").append('<option  value="'+item.tagName+'">'+item.tagName+'</option>');
	    })
	}
		//下拉多选
	// $("#tag-select").select2();
	$(".tag-select").chosen({
	     search_contains: true,//可以让chosen搜索选项的中间及末尾字符
	     disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
	    });
	$(".tag-select").trigger("liszt:updated");//更新选项

	// 修改客户标签
	$('#tag-select').change(function(){
		var tagName="";
		if($(this).val()){
			if($(this).val().length>1){
				tagName=$(this).val().join(';');
			}else if($(this).val().length==1){
				tagName=$(this).val()[0];
			}

		}
		console.log(tagName)
			var data={
				'custTag':tagName,
				'custId':oid,
				'comId':companyId
			}
	    API.changeCusTag(data,function(data){
			if(data.code == 200){
	    		//dcrmAlertSuccess(data.msg);
	    	}else{
	    		//dcrmAlertError(data.msg);
	    	}
		})
	})

	// 获取内容标签
	getContTagObj=data.data.makingTagList;
	if(getContTagObj&&getContTagObj.length>0){
		var contTagstr='';
		$.each(getContTagObj,function(index,item){
			contTagstr+='<span>'+item+'</span>'
		})
		$('.contTag').html(contTagstr)
	}else{
		$('.contTag').html('<div class="zanwu">暂无<div>')
	}

	// 获取华坤道威标签
	gethkTagObj=data.data.hkdwTaglist;
	if(gethkTagObj&&gethkTagObj.length>0){
		var hkTagstr='';
		$.each(gethkTagObj,function(index,item){
			hkTagstr+='<span>'+item+'</span>'
		})
		$('.hkTag').html(hkTagstr)
	}else{
		$('.hkTag').html('<div class="zanwu">暂无</div>')
	}

    //显示个人数据
	for(var i=0;i<obj.length;i++){
		if(obj[i].attrName=='手机号'){
			if(obj[i].contentvalue!=null&&data.data.grantMobileStatus==10){
				$('.customerMobile').html('<i class="icon icon-B-mima"></i>');
			}else{
				$('.customerMobile').html(obj[i].contentvalue).attr('id',obj[i].attrKey)
			}


		}else if(obj[i].attrName=='客户姓名'){
			$('.customerName').html(obj[i].contentvalue).attr('id',obj[i].attrKey)
			name=obj[i].contentvalue;
			$('#involvingcustomer').val(obj[i].contentvalue)
		}else if(obj[i].attrName=='客户类型'){
			if(obj[i].contentvalue){
				$('#customerType').html('('+obj[i].contentvalue+')').attr('id',obj[i].attrKey)
			}else{
				$('#customerType').html('').attr('id',obj[i].attrKey)
			}

		}else if(obj[i].attrName=='微信号'){
			$('.customerWeixin').html(obj[i].contentvalue).attr('id',obj[i].attrKey)
		}else if(obj[i].attrName=='微信昵称'){
			$('.weixinnickname').html(obj[i].contentvalue).attr('id',obj[i].attrKey)
		}else if(obj[i].attrName=='微信头像'){
			if(obj[i].contentvalue){
				$('.weixinurl').html('<img  src="" alt="" height=40 width=40 >');
				$('.weixinurl img').attr('src',obj[i].contentvalue).attr('id',obj[i].attrKey);
				console.log(obj[i].contentvalue);
			}else{
				$('.weixinurl').html('');
			}
		}else if(!obj[i].attrName=='微信头像'){
			$('.weixinurl').html('');
		}else if(obj[i].attrName=='QQ'){
			$('.customerQq').html(obj[i].contentvalue).attr('id',obj[i].attrKey)
		}else if(obj[i].attrName=='微信昵称'){
			$('.customerWeixinName').html(obj[i].contentvalue).attr('id',obj[i].attrKey)
		}else if(obj[i].attrName=='邮箱'){
			$('.customerEmail').html(obj[i].contentvalue).attr('id',obj[i].attrKey)
		}else if(obj[i].attrName=='客户来源'){
			$('.customerSource1').html(obj[i].contentvalue).attr('id',obj[i].attrKey)
		}else if(obj[i].attrName=='客户ID'){
			$('#involvingcustomer').attr('data-id',obj[i].contentvalue);
			$('.addEventId').attr('data-id',obj[i].contentvalue)
		}
		else if(obj[i].attrName=='销售阶段'){
			if(obj[i].contentvalue){
				$('.customerStage').val(obj[i].contentvalue).attr('id',obj[i].attrKey)
			}else{
				$('.customerStage').val(1).attr('id',obj[i].attrKey)
			}

		}
		else if(obj[i].attrName=='性别'){
			var sex=obj[i].contentvalue;
			if(sex=='女'){
				$('.personPic').removeClass('man').addClass('woman')
			}else if(sex=='男'){
				$('.personPic').removeClass('woman').addClass('man')
			}else{
				$('.personPic').removeClass('man').removeClass('woman');
			}
		}else{
			str+= '<dl class="clearfix"><dt>'+isNull(obj[i].attrName)+'：</dt><dd id="'+isNull(obj[i].attrKey)+'">'+isNull(obj[i].contentvalue)+'</dd> </dl>'
		}

	}

	$('#commonAttrList').html(str);

	var obj1=data.data.uncommonAttrList;
	//显示个人数据
	for(var i=0;i<obj1.length;i++){
		if(obj1[i].attrName=='手机号'){
			$('.customerMobile').html(obj1[i].contentvalue).attr('id',obj1[i].attrKey)

		}else if(obj1[i].attrName=='客户姓名'){
			$('.customerName').html(obj1[i].contentvalue).attr('id',obj1[i].attrKey)
			name=obj1[i].contentvalue;
			$('#involvingcustomer').val(obj1[i].contentvalue)
		}else if(obj1[i].attrName=='客户类型'){
			if(obj1[i].contentvalue){
				$('#customerType').html('('+obj1[i].contentvalue+')').attr('id',obj1[i].attrKey)
			}else{
				$('#customerType').html('').attr('id',obj1[i].attrKey)
			}

		}else if(obj1[i].attrName=='微信号'){
			$('.customerWeixin').html(obj1[i].contentvalue).attr('id',obj1[i].attrKey)
		}else if(obj1[i].attrName=='QQ'){
			$('.customerQq').html(obj1[i].contentvalue).attr('id',obj1[i].attrKey)
		}else if(obj1[i].attrName=='微信昵称'){
			$('.customerWeixinName').html(obj1[i].contentvalue).attr('id',obj1[i].attrKey)
		}else if(obj1[i].attrName=='邮箱'){
			$('.customerEmail').html(obj1[i].contentvalue).attr('id',obj1[i].attrKey)
		}else if(obj1[i].attrName=='客户来源'){
			$('.customerSource1').html(obj1[i].contentvalue).attr('id',obj1[i].attrKey)
		}else if(obj1[i].attrName=='客户ID'){
			$('#involvingcustomer').attr('data-id',obj1[i].contentvalue)
			$('.addEventId').attr('data-id',obj1[i].contentvalue)
		}
		else if(obj1[i].attrName=='销售阶段'){
			if(obj1[i].contentvalue){
				$('.customerStage').val(obj1[i].contentvalue).attr('id',obj1[i].attrKey)
			}else{
				$('.customerStage').val(1).attr('id',obj1[i].attrKey)
			}

		}
		else if(obj1[i].attrName=='性别'){
			var sex=obj1[i].contentvalue;
			if(sex=='女'){
				$('.personPic').removeClass('man').addClass('woman')
			}else if(sex=='男'){
				$('.personPic').removeClass('woman').addClass('man')
			}else{
				$('.personPic').removeClass('man').removeClass('woman');
			}
		}else{
			str+= '<dl class="clearfix"><dt>'+isNull(obj1[i].attrName)+'：</dt><dd id="'+isNull(obj1[i].attrKey)+'">'+isNull(obj1[i].contentvalue)+'</dd> </dl>'
		}

	}
	var str2='';
	for(var i=0;i<obj1.length;i++){
		str2+= '<dl class="clearfix"><dt>'+isNull(obj1[i].attrName)+'：</dt><dd id="'+isNull(obj1[i].attrKey)+'">'+isNull(obj1[i].contentvalue)+'</dd> </dl>'
	}
	$('#unCommonAttrList').html(str2);
	//活跃度
	$('.thirtyLiveness').html(data.data.thirtyLiveness);
	$('.liveness').html(data.data.liveness);

	//头像区域
	$('#customerName').html()


	// 权限隐藏
	var sceneHideConfig={};
		if(data.data.sceneHideConfig.cust){
			sceneHideConfig=data.data.sceneHideConfig.cust;
		}

	$.each(sceneHideConfig,function(index,item){
		if(item==false){//显示
			if(index=='name'||index=='stage_id'){
				$('#'+index).removeClass('hide')
			}else{
				$('#'+index).parent().removeClass('hide')
			}

		}else{
			if(index=='name'||index=='stage_id'){
				$('#'+index).addClass('hide')
			}else{
				console.log($('#'+index))
				$('#'+index).parent().addClass('hide')
			}
			/*客户标签因为页面写死，所以单独做判断*/
			if(index=='cust_tag'){
				$('.khTag').addClass('hide')
			}
			/*群组因为页面写死，所以单独做判断*/
			if(index=='group_tag'){
				$('.theGroup').addClass('hide')
			}
			/*内容标签因为页面写死，所以单独做判断*/
			if(index=='content_tag'){
				$('.nrtag').addClass('hide')
			}
			/*累计活跃度因为页面写死，所以单独做判断*/
			if(index=='conut_liveness'){
				$('.last').addClass('hide')
				$('.centerLine').addClass('hide')
			}
			/*30天活跃度因为页面写死，所以单独做判断*/
			if(index=='month_liveness'){
				$('.thirtyLiveness').parent().addClass('hide')
				$('.centerLine').addClass('hide')
			}
			/*最近接触因为页面写死，所以单独做判断*/
			if(index=='near_touch'){
				$('.lastEventTime').parent().addClass('hide')
			}
			/*上次接触因为页面写死，所以单独做判断*/
			if(index=='last_touch'){
				$('.lastTwoEventTime').parent().addClass('hide')
			}
			/*首次接触因为页面写死，所以单独做判断*/
			if(index=='first_touch'){
				$('.firstEventTime').parent().addClass('hide')
			}
		}

	})
    MaskUtil.RemoveLoading();
})

//点击更多
$('.commonAttrmore a').click(function(){
	if($('.commonAttrmore a').html()=='查看更多'){
		$('#unCommonAttrList').removeClass('hide');
		$('.commonAttrmore a').html('收起')
	}else{
		$('#unCommonAttrList').addClass('hide');
		$('.commonAttrmore a').html('查看更多')
	}

})
// 删除客户
function delCustomer(event,id){
	event.stopPropagation();
	if(id){
		delId=id
	}else{
		delId=oid;
	}
	var data={
		id:delId
	}
	dcrmConfirm('您确定要删除该客户吗',function(){
		API.deleteCustomer(data,function(res){
			if(res.code == 200){
				dcrmAlertSuccess(res.msg);
				window.location.href = "/view/customer/customer/customer.html";
			}else{
				dcrmAlertError(res.msg);
			}
		})
	})
}




// 新建事件显示
function addEvent(event){
	window.location.href = "/view/customer/customer/addEvent.html?oid="+oid;
}

// 新建任务
function addTask(event){
	window.location.href = "/view/customer/customer/addTask.html?oid="+oid+"&str="+escape(name);
}




//首次上次接触事件
API.contactTime(pamam,function(data){
	console.log(data)
	if(data.data.firstEvent&&data.data.lastTwoEvent&&data.data.lastEvent){
		$('.firstEventTime').html(isNull(data.data.firstEvent.showEventTime.split(' ')[0]));
		$('.firstEventName').attr('data-content','<p>'+isNull(data.data.firstEvent.showEventTime.split(' ')[0])+'</p><p>'+isNull(data.data.firstEvent.remark)+'</p>');
		$('.lastTwoEventTime').html(isNull(data.data.lastTwoEvent.showEventTime.split(' ')[0]));
		$('.lastTwoEventName').attr('data-content','<p>'+isNull(data.data.lastTwoEvent.showEventTime.split(' ')[0])+'</p><p>'+isNull(data.data.lastTwoEvent.remark)+'</p>');
		$('.lastEventTime').html(isNull(data.data.lastEvent.showEventTime.split(' ')[0]));
		$('.lastEventName').attr('data-content','<p>'+isNull(data.data.lastEvent.showEventTime.split(' ')[0])+'</p><p>'+isNull(data.data.lastEvent.remark)+'</p>');
	}
	$('.day').html(data.data.day);
});


//获取所有订单
API.allOrder(pamam,function(data){
	var orderObj=data.data.pageData.list;
	//点击更多按钮
    $('.moreOrder').click(function(){
    	if($(this).text()=='更多'){
    		$(this).show();
    		if(orderObj.length>5){
				getOrderTable(orderObj.length);
				$(this).text('收起');
			}else{
				$(this).hide()
			}

    	}else if($(this).text()=='收起'){
    		if(orderObj.length>=5){
				getOrderTable(5)
			}else{
				getOrderTable(orderObj.length)
			}
    	}
    });
	if(orderObj.length>0){
		if(orderObj.length>=5){
			getOrderTable(5)
			$('.moreOrder').removeClass('hide');
		}else{
			getOrderTable(orderObj.length)
		}


			function getOrderTable(num){
				for (var i =0;i< num; i++) {
					// 判断数据是否为null
			        var orderStr;
			        orderStr+='<tr>'+
		                '   <td class="textLeft">'+isNull(orderObj[i].orderId)+'</td>'+
		                '   <td>'+isNull(orderObj[i].goodsName)+'</td>'+
		                '   <td>'+isNull(orderObj[i].goodsPrice)+'</td>'+
		                '   <td>'+orderObj[i].goodsNum+'</td>'+
		                '   <td>'+isNull(orderObj[i].goodsTotal)+'</td>'+
		                '   <td>'+isNull(orderObj[i].buyChannel)+'</td>'+
		                '   <td class="textLeft">'+isNull(orderObj[i].showCreateTime)+'</td>'+
		                ' </tr>'
			    }
			        $('#customerOrderList tbody').html(orderStr);

			}

	}else{
		orderStr = "<tr >"+
            "<td  colspan='7' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
            "</tr> ";
        $('#customerOrderList tbody').html(orderStr)
	}

})

//获取所有任务列表
var allTask=function(){
	API.custTaskList(pamam,function(data){
	var cusTaskObj=data.data.pageData.list;
	//点击更多按钮
    $('.moreTask').unbind('click').click(function(){

    	if($(this).text()=='更多'){
    		if(cusTaskObj.length>5){
				getTaskTable(cusTaskObj.length);
				$(this).text('收起')
			}else {

			}

    	}else if($(this).text()=='收起'){
    		if(cusTaskObj.length>=5){
    			getTaskTable(5);
    		}else{
    			getTaskTable(cusTaskObj.length)
    		}

    		$(this).text('更多')
    	}

    })
	if(cusTaskObj.length>0){
		//获取一条任务列表
		if(cusTaskObj.length>=5){
			getTaskTable(5)
			$('.moreTask').removeClass('hide');
			$('.moreTaski').removeClass('hide');
		}else{
			getTaskTable(cusTaskObj.length);
			console.log(2)

		}

		//获取任务列表
		function getTaskTable(num){
			var cz;
		    var taskstr;
		    var statusName='';
		    var statusContent='';
		  	for (var i =0;i< num; i++) {
		        //判断状态
		        if( cusTaskObj[i].status=='0'){
		        	statusName='未分配';
		        	statusContent='<span class="gray spcspan">●</span>';
					cz='<td class="textcenter">'+
			        '  </td>';
		        }else if(cusTaskObj[i].status=='2'){
		        	statusName='处理中';
		        	statusContent='<span class="yellow spcspan">●</span>';
		        	cz= ' <td class="textRight">'+
			        '      <a href="javascript:;" class="btn finishBtn nodata" onclick="completeTask(event,'+cusTaskObj[i].id+','+cusTaskObj[i].status+')"><i class="icon icon-querenshoudao "></i>完成任务</a>'+
			        '     </td>';

		        }else if(cusTaskObj[i].status=='1'){
		        	statusName='已完成';
		        	statusContent='<span class="green spcspan">●</span>';
		        	cz='<td class="textcenter">'+
			        '  </td>';
		        };
		        //判断优先级
		        var level=isNull(cusTaskObj[i].level);
		        if(level==0){
		        	levelName='普通';
		        }else if(level==1){
		        	levelName='紧急';
		        }else{
		        	levelName='非常紧急';
		        }
		        if(status==null){
			        taskstr+=' <tr>'+
			        '    <td class="textLeft typeblue" onclick="chakan('+cusTaskObj[i].id+','+cusTaskObj[i].status+')">'+isNull(cusTaskObj[i].taskName)+'</td>'+
			        '    <td>'+levelName+'</td>'+
			        '    <td>'+isNull(cusTaskObj[i].executorUserName)+'</td>'+
			        '    <td>'+statusName+statusContent+'</td>'+cz;
			        '</tr>';
		        }else{
		        	taskstr+=' <tr>'+
			        '    <td class="textLeft typeblue" onclick="chakan('+cusTaskObj[i].id+','+cusTaskObj[i].status+')">'+isNull(cusTaskObj[i].taskName)+'</td>'+
			        '    <td>'+levelName+'</td>'+
			        '    <td>'+isNull(cusTaskObj[i].executorUserName)+'</td>'+
			        '    <td>'+statusName+statusContent+'</td>'+cz;
			        '</tr>';
		        }
		    }

		    $('#customerTaskList tbody').html(taskstr);
	    }

	}else{
		taskstr = "<tr >"+
            "<td  colspan='5' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
            "</tr> ";
        $('#customerTaskList tbody').html(taskstr)
	}
 });
}
 allTask();

 function chakan(id,status){
	window.location.href = "/view/task/viewTask.html?oid="+id+'&status='+status;
 }
function completeTask(event,id,status){
	event.stopPropagation();
	var data = {
  		'id':id,
  		'status':status
  	};
  	dcrmConfirm('您确定要完成任务吗',function(){
  		API.completeCustTask(data, function(data){
		  if(data && data.code == 200) {
			    dcrmAlertSuccess(data.msg);
			    allTask();
			    $('.moreTask').text('更多')
			 }else{
				dcrmAlertError(data.msg);
		     }
	    });
  	})

}
//获取时间轴
var timer=function(){
	var data = {
  		'custId': oid,
  		'eventFrom':$('#selectEvent').val()
  	};
  	MaskUtil.Loading();
	API.getCustEvent(data,function(data){
		var timeObj=data.data.eventByTimeGroup;
		var timeStr='';
		var hourStr='';
		var stageDescStr='';

		if(timeObj.length){
			for(var i=0;i<timeObj.length;i++){
				hourStr='';
	            timeStr+= '<div class="year closes">'+
	              '            <h2><a href="#">'+timeObj[i].date+'<i></i></a></h2>'+
	              '            <div class="list">'+
	              '              <ul>'

	              $.each(timeObj[i].custEventList,function(index,item){
	              	var showEventTime=item.showEventTime;
	              	var score=item.score;
	              	var tubiao='';
	              	if(item.eventFrom=='微页面与表单'){
	              		tubiao='<img  src="/view/images/event1.png">'
	              	}else if(item.eventFrom=='电子邮件'){
	              		tubiao='<img  src="/view/images/event2.png">'
	              	}else if(item.eventFrom=='短信'){
	              		tubiao='<img  src="/view/images/event3.png">'
	              	}else if(item.eventFrom=='外呼'){
	              		tubiao='<img  src="/view/images/event4.png">'
	              	}else if(item.eventFrom=='微信群'){
	              		tubiao='<img  src="/view/images/event5.png">'
	              	}else if(item.eventFrom=='购买服务和产品'){
	              		tubiao='<img  src="/view/images/event6.png">'
	              	}else if(item.eventFrom=='客户生命周期'){
	              		tubiao='<img  src="/view/images/event7.png">'
	              	}else if(item.eventFrom=='自定义'){
	              		tubiao='<img  src="/view/images/event8.png">'
	              	}
	              	if(score==null){
	              		score=0;
	              	}
	              	showEventTime=showEventTime.split(' ')[1]

	              	//如果有销售阶段的改变
					if(item.stageDesc){
	                    stageDescStr='     <p class="version">&nbsp;</p>'+
	                    '                  <div class="more">'+
	                    '                      <p>'+item.stageDesc+'</p>'+
	                    '                  </div>'
	              	}else{
	              		 stageDescStr='';
	              	}


	              	if(item.type==0){//系统事件
	              		if(eventCd='change_stage'){
	              			hourStr+=
			              	  '<li class="cls type0">'+
			                  '    <p class="date">'+showEventTime+'</p>'+
			                  '    <div class="popover right in intro" role="tooltip" id="popover256418" style="display: block;">'+
			                  '        <div class="arrow"></div>';

			                  if(Number(score)<0){
			                  	hourStr+=
			                  	'        <div class="popover-content">'+tubiao+item.showEventRemark+score+'</div>'+
			                  	'    </div>'+stageDescStr+
			                  	'</li>'
			                  }else{
			                  	hourStr+=
			                  	'        <div class="popover-content">'+tubiao+item.showEventRemark+'+'+score+'</div>'+
			                  	'    </div>'+stageDescStr+
			                  	'</li>';
			                  }


	              		}else{
	              			hourStr+=
			              	  '<li class="cls type0">'+
			                  '    <p class="date">'+showEventTime+'</p>'+
			                  '    <div class="popover right in intro" role="tooltip" id="popover256418" style="display: block;">'+
			                  '        <div class="arrow"></div>';

			                  if(Number(score)<0){
			                  	hourStr+=
			                  	'        <div class="popover-content">'+tubiao+item.showEventRemark+score+'</div>'+
			                  	'    </div>'+stageDescStr+
			                  	'</li>'
			                  }else{
			                  	hourStr+=
			                  	'        <div class="popover-content">'+tubiao+item.showEventRemark+'+'+score+'</div>'+
			                  	'    </div>'+stageDescStr+
			                  	'</li>';
			                  }
	              		}


	              	}else{//客户事件

	              	hourStr+=
	              	'                <li class="cls type1">'+
	                '                  <p class="date">'+showEventTime+'</p>'+
	                '                  <div class="popover right in intro" role="tooltip" id="popover256418" style="display: block;">'+
	                '                      <div class="arrow"></div>';
	               if(Number(score)<0){
			                  	hourStr+=
			                  	'        <div class="popover-content">'+tubiao+item.showEventRemark+score+'</div>'+
			                  	'    </div>'+stageDescStr+
			                  	'</li>'
			                  }else{
			                  	hourStr+=
			                  	'        <div class="popover-content">'+tubiao+item.showEventRemark+'+'+score+'</div>'+
			                  	'    </div>'+stageDescStr+
			                  	'</li>';
			                  }

	              	}

	              });

	              timeStr+=hourStr;
	              timeStr+='              </ul>'+
	              '            </div>'+
	              '         </div>'
	              $('#timeContent .main').removeClass('noline')
			}

		}else{
			timeStr='当前没有事件';
			$('#timeContent .main').addClass('noline')

		}
		$('.main').html(timeStr);

		setTimeout(function(){
			$(".year .list").each(function(e, target){
			        var $target=  $(target),
			        $ul = $target.find("ul");

			        $target.height($ul.height()), $ul.css("position", "absolute");
			    });
			$(" .year>h2").click(function(e){
			    e.preventDefault();
			    $(this).parents(".year").toggleClass("closes");
			    $(".year .list").each(function(e, target){
			        var $target=  $(target),
			        $ul = $target.find("ul");

			        $target.height($ul.height()), $ul.css("position", "absolute");
			    });
			});
		},200)
		MaskUtil.RemoveLoading();
	})
}
timer();
$('#selectEvent').change(function(){
	timer();
})

//获取活跃度
API.getLiveness(pamam,function(data){
	var liveObj=data.data

	if(parseInt(liveObj.liveness)<10000&&parseInt(liveObj.thirtyLiveness)<10000){

		$('.liveness').html(liveObj.liveness);
		$('.thirtyLiveness').html(liveObj.thirtyLiveness)
	}else if(parseInt(liveObj.liveness)<10000&&parseInt(liveObj.thirtyLiveness)>10000){

	}else if(parseInt(liveObj.liveness)>0000&&parseInt(liveObj.thirtyLiveness)>10000){
		var num=liveObj.thirtyLiveness.substring(0,liveObj.thirtyLiveness.length-4);
		var num2=liveObj.liveness.substring(0,liveObj.liveness.length-4);
		$('.thirtyLiveness').html(num+'万+')
		$('.liveness').html(num2+'万+')
	}else{

	}

})
//客户阶段修改
$('.customerStage').change(function(){
	var data={
		'id':oid,
		'stageId':$('.customerStage').val()
	};
	API.updateStage(data,function(data){
    	if(data.code == 200){
    		dcrmAlertSuccess('您已成功修改客户阶段');
    		timer();

    	}else{
    		dcrmAlertError(data.msg);
    	}

    })
})

function addCustomer(){
	window.location.href = "/view/customer/customer/addCustomer.html?editid="+oid;
}
//跳转到客户画像
if(window.location.search.split('&')[0]){
var profileId=window.location.search.split('&')[0].split('=')[1];
}
if(window.location.search.split('&')[1]){
var companyId=window.location.search.split('&')[1].split('=')[1];
}

console.log(profileId);
function profile(companyId){
    window.location.href = "/view/customer/customer/miniPcProfile.html?id="+profileId+"&type=1&companyId="+companyId;
	// $.ajax({
	// 	type: 'GET',
	// 	url: "/json/"+profileId+".json",
	// 	async: false,
	// 	dataType: 'json',
	// 	success: function () {
	// 		window.location.href = "/view/customer/customer/pcProfile.html?id="+profileId+'&type=1&companyId='+companyId;
	// 	},
	// 	error:function(){
	// 		dcrmAlertWarning("无客户画像");
	// 	}
	// })
}





