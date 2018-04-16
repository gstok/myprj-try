$(function(){
	custEventList(0,20);
});
// 客户事件列表
function custEventList(page,size,count){
	var data = {
        "pageIndex":page,
        "pageSize":size
    };
    MaskUtil.Loading();
	API.custEventList(data,function(data){
		var obj=data.data.pageData.list;

		if(obj.length){
			//如果status不是全部==2
			for (var i =0;i< obj.length; i++) {
				// 判断数据是否为null
		        var cz;
		        var str;
		        var bjsc;
		        var typeName;
		        var status=obj[i].status;
		        var eventFrom=obj[i].eventFrom;
		        //(eventFrom!=''&&eventFrom!=null)?eventFrom:'自定义';
		        if(eventFrom==null){
		            eventFrom='自定义';

		        }else if(eventFrom=='自定义'){
		        	if(status==0){
			        	if(hasPermission("custEvent","UPDATE")){
			        		cz='<a href="javascript:;" class="useordis" onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-on"></span></a>';
			        	}else{
			        		cz='<a href="javascript:;" class="useordis pr">'+
			        		'<span class="switch-on"></span>'+
			        		'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
			        		'</a>';
			        	}
			        }else{
			        	if(hasPermission("custEvent","UPDATE")){
			        		cz='<a href="javascript:;" class="useordis"  onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-off"></span></a>';
			        	}else{
			        		cz='<a href="javascript:;" class="useordis pr">'+
			        		'<span class="switch-off"></span>'+
			        		'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
			        		'</a>';
			        	}
			        }
		        	if(hasPermission("custEvent","UPDATE")){
			        	bjsc='<a href="javascript:;" class="tbBtn zcBtn" onclick="editcustEvent(event,'+obj[i].id+')">编辑</a>'+
			            '<a href="javascript:;" class="tbBtn zcBtn" onclick="delCustEvent(event,'+obj[i].id+')">删除</a>';
		        	}else{
		        		bjsc='<a href="javascript:;" class="tbBtn zcBtn disabledBtn">编辑</a>'+
			            '<a href="javascript:;" class="tbBtn zcBtn disabledBtn">删除</a>';
		        	}
		        }else{
		        	cz='';
		        	bjsc='';
		        }
		        var type=obj[i].type;

		        if(type==0){
		        	typeName='系统';
		        }else{
		        	typeName='客户';
		        }

		        if(obj[i].eventFrom!='手机应用' && obj[i].eventFrom!='微信公众号'&& obj[i].eventFrom!='打开外部应用'){
		        	str+='<tr data-id='+isNull(obj[i].id)+'>'+
								'<td class="firstTd">'+eventFrom+'</td>'+
								'<td class="firstTd">'+typeName+'</td>'+
								'<td class="firstTd">'+isNull(obj[i].eventName)+'</td>'+
								'<td class="firstTd">'+isNull(obj[i].stageName)+'</td>'+
								'<td class="firstTd">'+obj[i].score+'</td>'+
								"<td class='iconTd'>"+cz+bjsc+"</td>" +
			              '</tr>'
					}
		        }

				$('#custEventList tbody').html(str);

			if(page==0){
				$('.ui-paging-container').eq(0).remove();
	        	$('#custEventListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size,count){
	     		    custEventList(page,size);
	     		}});
		    }
		}else{
			var trdat = "<tr >"+
	            "<td  colspan='6' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
	            "</tr> ";
	        $('#custEventList tbody').html(trdat)
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

	},50)
	MaskUtil.RemoveLoading();
	});
}



// 新建客户事件
function addCustEvent(){
	clearInfo();
	stageSelect('stageIdAdd');
	var modelContent=$('#addCustEvent');//弹窗最外层
	var contentInfo=$('#addCustEvent .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 新建客户事件保存
function addsure(){
	var data={
		'stageId':$('#stageIdAdd').val(),
		'score':$('#scoreAdd').val(),
		'type':$('#generatorAdd').val(),
		'eventName':$('#eventNameAdd').val()
	}

	if (!(/(^[1-9]\d*$)/.test(data.score))) {
		dcrmAlertError('评分须为正整数');
		return false;
	}else if($.trim(data.stageId)==''){
		dcrmAlertError('推进阶段不能为空');
		return false;
	}else if($.trim(data.score)==''){
		dcrmAlertError('评分标准不能为空');
		return false;
	}else if($.trim(data.type)==''){
		dcrmAlertError('产生者不能为空');
		return false;
	}else if($.trim(data.eventName)==''){
		dcrmAlertError('名称不能为空');
		return false;
	}

	//MaskUtil.Loading();
	API.addCustEvent(data, function(res) {
		console.log(res);
		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
			$('#addCustEvent').fadeOut();
			$('.bg').fadeOut();
			var hash=window.location.hash.split('=')[1];
			if(hash){
					custEventList(hash,20);
				}else{
					custEventList(0,20);
				}
		}else{
			dcrmAlertError(res.msg);
		}
	    //MaskUtil.RemoveLoading();
	    $('#addCustEvent').fadeOut();
	    $('.bg').fadeOut();
	});
}

// 编辑客户事件
function editcustEvent(event,id){
	clearInfo();
	stageSelect('stageIdEdit');
	event.stopPropagation();
	var modelContent=$('#editCustEvent');//弹窗最外层
	var contentInfo=$('#editCustEvent .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
	var data={
		'id':id
	};
	window.editcustEventId=id;
	MaskUtil.Loading();
	API.viewCustEvent(data, function(res) {
		if(res.code == 200){
			$('#stageIdEdit').val(res.data.obj.stageId);
			$('#scoreEdit').val(res.data.obj.score);
			$('#generatorEdit').val(res.data.obj.type);
			$('#eventNameEdit').val(res.data.obj.eventName);

		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	});

}
// 编辑后保存
	$('.editSure').unbind('click').click(function(){
		var data={
			'id':window.editcustEventId,
			'stageId':$('#stageIdEdit').val(),
			'score':$('#scoreEdit').val(),
			'type':$('#generatorEdit').val(),
			'eventName':$('#eventNameEdit').val()
		};

		if (!(/(^[1-9]\d*$)/.test(data.score))) {
		    dcrmAlertError('评分须为正整数');
		    return false;
		}else if($.trim(data.stageId)==''){
			dcrmAlertError('推进阶段不能为空');
			return;
		}else if($.trim(data.score)==''){
			dcrmAlertError('评分标准不能为空');
			return;
		}else if($.trim(data.type)==''){
			dcrmAlertError('产生者不能为空');
			return;
		}else if($.trim(data.eventName)==''){
			dcrmAlertError('名称不能为空');
			return;
		}

		MaskUtil.Loading();
		API.editCustEvent(data, function(res) {
			if(res.code == 200){
				dcrmAlertSuccess(res.msg);
				$('#editCustEvent').fadeOut();
				$('.bg').fadeOut();
				var hash=window.location.hash.split('=')[1];
				if(hash){
					custEventList(hash,20);
				}else{
					custEventList(0,20);
				}
			}else{
				dcrmAlertError(res.msg);
			}
		    MaskUtil.RemoveLoading();
		    $('#editCustEvent').fadeOut();
	    	$('.bg').fadeOut();
		});
	})
// 修改客户事件状态
function isUse(name,event,id,status){
	event.stopPropagation();
	var statuss;
	if(status==0){
		statuss=1
	}else{
		statuss=0
	}
  	var data = {
  		'id':id,
  		'status':statuss
  	};


   var str="您确定要"+name+"该客户事件吗？";
  	// dcrmConfirm(str,function(){
	  	MaskUtil.Loading();
	    API.updateCustEvent(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);
			  var hash=window.location.hash.split('=')[1];
			  if(hash){
					custEventList(hash,20);
				}else{
					custEventList(0,20);
				}
			 }else{
				 dcrmAlertError(data.msg);
		     }
			MaskUtil.RemoveLoading();
	    });
  	// });
}
// 删除客户事件
function delCustEvent(event,id){
	event.stopPropagation();
  	var data = {
  		id:id,
  		status:2
  	};
  	dcrmConfirm("您确定要删除该客户事件吗？",function(){
	  	MaskUtil.Loading();
	    API.delStatus(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);
			  var hash=window.location.hash.split('=')[1];
			  if(hash){
					custEventList(hash,20);
				}else{
					custEventList(0,20);
				}
			 }else{
				 dcrmAlertError(data.msg);
		     }
			MaskUtil.RemoveLoading();
	    });
  	});
}
