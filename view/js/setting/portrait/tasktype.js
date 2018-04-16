$(function(){
	taskTypeList(0,20);
})
// 任务类型列表
function taskTypeList(page,size,count){
	var data = {
        "pageIndex":page,
        "pageSize":size
    };
    MaskUtil.Loading();
	API.taskTypeList(data,function(data){
		var obj=data.data.pageData.list;
		if(obj.length){
		for (var i =0;i< obj.length; i++) {
		// 判断数据是否为null
        var cz;
        var str;
        var bjsc;
        var status=obj[i].status;
        if(hasPermission('taskType', 'UPDATE')){
        	bjsc='<a href="javascript:;" class="tbBtn zcBtn" onclick="editTaskType(event,'+obj[i].id+')">编辑</a>'+
            '<a href="javascript:;" class="tbBtn zcBtn" onclick="delTaskType(event,'+obj[i].id+',\''+obj[i].name+'\')">删除</a>'
        }else{
        	bjsc='<a href="javascript:;" class="tbBtn zcBtn disabledBtn">编辑</a>'+
            '<a href="javascript:;" class="tbBtn zcBtn disabledBtn">删除</a>'
        }
        if(status==0){
        	if(hasPermission("taskType","UPDATE")){
        		cz='<a href="javascript:;" class="useordis" onclick="isUse(\'启用\',event,'+obj[i].id+','+status+')"><span class="switch-on"></span></a>'
        	}else{
        		cz='<a href="javascript:;" class="useordis pr">'+
        		'<span class="switch-on"></span>'+
        		'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
        		'</a>';
        	}
        }else{
        	if(hasPermission("taskType","UPDATE")){
        		cz='<a href="javascript:;" class="useordis" onclick="isUse(\'禁用\',event,'+obj[i].id+','+status+')"><span class="switch-off"></span></a>'
        	}else{
        		cz='<a href="javascript:;" class="useordis pr">'+
        		'<span class="switch-off"></span>'+
        		'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
        		'</a>';
        	}
        }
				str+='<tr data-id='+isNull(obj[i].id)+'>'+
							'<td class="firstTd">'+isNull(obj[i].name)+'</td>'+
							"<td class='iconTd'>"+cz+bjsc+"</td>" +
		                '</tr>'
			}
			$('#taskTypeList tbody').html(str);

			if(page==0){
			$('.ui-paging-container').eq(0).remove();
        	$('#taskTypeListPage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
     		    taskTypeList(page,size);
     		 }});
        }
		}
		else{
			trdat = "<tr >"+
	            	"<td  colspan='2' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
	            	"</tr> ";
	        $('#taskTypeList tbody').html(trdat)
		}
		setTimeout(function(){
			var honeySwitch = {};
			honeySwitch.themeColor = "#7e8fe1";
			honeySwitch.init = function() {
				var s = "<span class='txt textLeft'>启用</span><span class='slider'></span><span class='txt textRight'>禁用</span>";
				$("[class^=switch]").html(s);

				$("[class^=switch]").unbind('click').click(function () {

					if ($(this).hasClass("switch-on")) {
						$(this).attr('class','switch-off');

						$(".switch-off").css({
							'border-color' : '#7e8fe1;',
							// 'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
							'background-color' : 'rgb(255, 255, 255)'
						});
					} else {
						$(this).removeClass("switch-off").addClass("switch-on");
						if (honeySwitch.themeColor) {
							var c = honeySwitch.themeColor;
							$(this).css({
								'border-color' : c,
								// 'box-shadow' : c + ' 0px 0px 0px 16px inset',
								'background-color' : '#7e8fe1'
							});
						}
					}
				});

				if (this.themeColor) {
					var c = this.themeColor;
					$(".switch-on").css({
						'border-color' : c,
						// 'box-shadow' : c + ' 0px 0px 0px 16px inset',
						'background-color' : c
					});
					$(".switch-off").css({
						'border-color' : '#7e8fe1',
						// 'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
						'background-color' : 'rgb(255, 255, 255)'
					});
				}
				if ($('[themeColor]').length > 0) {
					$('[themeColor]').each(function() {
						var c = $(this).attr('themeColor') || honeySwitch.themeColor;
						if ($(this).hasClass("switch-on")) {
							$(this).css({
								'border-color' : c,
								// 'box-shadow' : c + ' 0px 0px 0px 16px inset',
								'background-color' : c
							});
						} else {
							$(".switch-off").css({
								'border-color' : '#7e8fe1',
								// 'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
								'background-color' : 'rgb(255, 255, 255)'
							});
						}
					});
				}
			};
			$(function() {
				honeySwitch.init();
			});

		},50);
		MaskUtil.RemoveLoading();
	});

}



// 新建任务类型
function addTaskType(){
	clearInfo();
	var modelContent=$('#addTaskType');//弹窗最外层
	var contentInfo=$('#addTaskType .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}

// 新建任务类型保存
function addsure(){
	var data={
		name:$('#tasktypeNameAdd').val()
	}
	if(data.name==""){
		dcrmAlertError('类型名称不能为空');
		return false;
	}
	console.log($('#tasktypeNameAdd').val())
	MaskUtil.Loading();
	API.addTaskType(data, function(res) {
		console.log(res)
		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
			var hash=window.location.hash.split('=')[1];
				if(hash){
					taskTypeList(hash,20);
				}else{
					taskTypeList(0,20);
				}
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	    $('#addTaskType').fadeOut();
	    $('.bg').fadeOut();
	});
}

// 编辑任务类型
function editTaskType(event,id){
	clearInfo();
	event.stopPropagation();
	var modelContent=$('#editTaskType');//弹窗最外层
	var contentInfo=$('#editTaskType .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
	var data={
		id:id
	};
	window.editTaskTypeId=id;
	//MaskUtil.Loading();
	API.viewTaskType(data, function(res) {
		if(res.code == 200){
			$('#tasktypeNameEdit').val(res.data.obj.name)
		}else{
			dcrmAlertError(res.msg);
		}
	    //MaskUtil.RemoveLoading();
	});


	// 编辑后保存
	$('.editSure').unbind('click').click(function(){
		var data={
			'id':window.editTaskTypeId,
			'name':$('#tasktypeNameEdit').val()
		};
		if(data.taskname==""){
			dcrmAlertError('类型名称不能为空');
			return false;
		}
		//MaskUtil.Loading();
		API.updateTaskType(data, function(res) {
			if(res.code == 200){
				dcrmAlertSuccess(res.msg);
				$('#editTaskType').fadeOut();
				$('.bg').fadeOut();
				var hash=window.location.hash.split('=')[1];
				if(hash){
					taskTypeList(hash,20);
				}else{
					taskTypeList(0,20);
				}
			}else{
				dcrmAlertError(res.msg);
			}
		    //MaskUtil.RemoveLoading();
		});
	})

}




// 删除客户标签
function delTaskType(event,id,name){
	event.stopPropagation();
  	var data = {
  		'id':id,
  		'status':2
  	};
  	dcrmConfirm("您确定要删除任务类型'"+name+"'吗？",function(){
	  	MaskUtil.Loading();
	    API.delStatustype(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);

				var hash=window.location.hash.split('=')[1];
				if(hash){
					taskTypeList(hash,20);
				}else{
					taskTypeList(0,20);
				}
			 }else{
				 dcrmAlertError(data.msg);
		     }
			MaskUtil.RemoveLoading();
	    });
  	});
}

// 禁用客户标签
function isUse(isuse,event,id,status){
	event.stopPropagation();

	if(status==0){
		status=1;
	}else if(status==1){
		status=0;
	}
	var data = {
  		id:id,
  		status:status
  	};


   var str="您确定要"+isuse+"该任务类型吗？";
  	// dcrmConfirm(str,function(){
	  	MaskUtil.Loading();
	    API.updateStatus(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);
			  var hash=window.location.hash.split('=')[1];
				if(hash){
					taskTypeList(hash,20);
				}else{
					taskTypeList(0,20);
				}
			 }else{
				 dcrmAlertError(data.msg);
		     }
			MaskUtil.RemoveLoading();
	    });
  	// });
}