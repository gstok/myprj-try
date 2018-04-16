$(function(){
	cusSourceList(0,20);
});

// 客户来源列表
function cusSourceList(page,size,count){
	var data = {
        "pageIndex":page,
        "pageSize":size
    };
    MaskUtil.Loading();
	API.cusSourceList(data,function(data){
		console.log(data);
		var obj=data.data.pageData.list;
		if(obj.length){
		for (var i =0;i< obj.length; i++) {
		// 判断数据是否为null
        var cz;
        var str;
        var bjsc;
        var status=obj[i].status;
        var type=obj[i].type;
        if(type==0){
        	bjsc='<a href="javascript:;" class="tbBtn zcBtn disabledBtn">编辑</a>'+
            '<a href="javascript:;" class="tbBtn zcBtn disabledBtn">删除</a>';
        }else{
        	if(hasPermission("custSource","UPDATE")){
        		bjsc='<a href="javascript:;" class="tbBtn zcBtn" onclick="editSusSource(event,'+obj[i].id+')">编辑</a>'+
            	'<a href="javascript:;" class="tbBtn zcBtn" onclick="delCusSource(event,'+obj[i].id+',\''+obj[i].custFrom+'\')">删除</a>';
        	}else{
        		bjsc='<a href="javascript:;" class="tbBtn zcBtn disabledBtn">编辑</a>'+
            	'<a href="javascript:;" class="tbBtn zcBtn disabledBtn">删除</a>';
        	}
        }
        if(status==0){
        	if(hasPermission("custSource","UPDATE")){
        		cz='<a href="javascript:;" class="useordis" onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-on"></span></a>';
        	}else{
        		cz='<a href="javascript:;" class="useordis pr">'+
        		'<span class="switch-on"></span>'+
        		'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
        		'</a>';
        	}
        }else{
        	if(hasPermission("custSource","UPDATE")){
        		cz='<a href="javascript:;" class="useordis"  onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-off"></span></a>';
        	}else{
        		cz='<a href="javascript:;" class="useordis pr">'+
        		'<span class="switch-off"></span>'+
        		'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
        		'</a>';
        	}
        }

			str+='<tr data-id='+isNull(obj[i].id)+'>'+
						'<td class="firstTd">'+isNull(obj[i].custFrom)+'</td>'+
						"<td class='iconTd'>"+cz+bjsc+"</td>" +
	              '</tr>'
			}
			$('#cusSourceList tbody').html(str);

			if(page==0){
			$('.ui-paging-container').eq(0).remove();
        	$('#cusSourceListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
     		    cusSourceList(page,size);
     		 }});
        }
		}
		else{
			var trdat = "<tr >"+
	            	"<td  colspan='3' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
	            	"</tr> ";
	        $('#cusSourceList tbody').html(trdat)
		}
	setTimeout(function(){
		var honeySwitch = {};
		honeySwitch.themeColor = "#7e8fe1";
		honeySwitch.init = function() {
			var s = "<span class='txt textLeft'>启用</span><span class='slider'></span><span class='txt textRight'>禁用</span>";
			$("[class^=switch]").html(s);

			$("[class^=switch]").unbind('click').click(function () {

				if ($(this).hasClass("switch-on")) {
					$(this).attr('class','switch-off')

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
			$('.often span.textLeft').text('常用')
		$('.often span.textRight').text('非常用')
		});

	},50);
	MaskUtil.RemoveLoading();
	});
}



// 新建客户来源
function addCusSource(){
	clearInfo();
	var modelContent=$('#addCusSource');//弹窗最外层
	var contentInfo=$('#addCusSource .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 新建客户来源保存
function addsure(){
	var data={
		'custFrom':$('#custFromAdd').val()
	}
	if($.trim($('#custFromAdd').val())==''){
		dcrmAlertError('来源名称不能为空');
		return false;
	}
	MaskUtil.Loading();
	API.addCusSource(data, function(res) {
		console.log(res);
		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
			var hash=window.location.hash.split('=')[1];
			if(hash){
				cusSourceList(hash,20);
			}else{
				cusSourceList(0,20);
			}
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	    $('#addCusSource').fadeOut();
	    $('.bg').fadeOut();
	});
}

// 编辑客户来源
function editSusSource(event,id){
	clearInfo();
	event.stopPropagation();
	var modelContent=$('#editSusSource');//弹窗最外层
	var contentInfo=$('#editSusSource .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
	var data={
		'id':id
	};
	window.editCustSourceId=id;
	MaskUtil.Loading();
	API.viewCustSource(data, function(res) {
		if(res.code == 200){
			$('#custFromEdit').val(res.data.obj.custFrom);
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	});

	// 编辑后保存
	$('.editSure').unbind('click').click(function(){
		var data={
			'id':window.editCustSourceId,
			'custFrom':$('#custFromEdit').val()
		};
		if($.trim($('#custFromEdit').val())==''){
			dcrmAlertError('来源名称不能为空');
			return false;
		}
		MaskUtil.Loading();
		API.updateCustSource(data, function(res) {
			if(res.code == 200){
				dcrmAlertSuccess(res.msg);
				$('#editSusSource').fadeOut();
				$('.bg').fadeOut();
				var hash=window.location.hash.split('=')[1];
				if(hash){
					cusSourceList(hash,20);
				}else{
					cusSourceList(0,20);
				}
			}else{
				dcrmAlertError(res.msg);
			}
		    MaskUtil.RemoveLoading();
		});
	})

}

// 修改客户来源状态
function isUse(event,id,status){
	event.stopPropagation();
  	var data = {
  		id:id
  	};
	if(status==0){
		var str="您确定要启用该客户来源吗？";
	  	// dcrmConfirm(str,function(){
		  	MaskUtil.Loading();
		    API.cusSourceEnable(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);
					var hash=window.location.hash.split('=')[1];
					if(hash){
						cusSourceList(hash,20);
					}else{
						cusSourceList(0,20);
					}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
	  	// });
	}else{
		var str="您确定要禁用该客户来源吗？";
	  	// dcrmConfirm(str,function(){
		  	MaskUtil.Loading();
		    API.cusSourceDisable(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);
				  var hash=window.location.hash.split('=')[1];
					if(hash){
						cusSourceList(hash,20);
					}else{
						cusSourceList(0,20);
					}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
	  	// });
	}
}

// 删除客户来源
function delCusSource(event,id,name){
	event.stopPropagation();
  	var data = {
  		id:id
  	};
  	dcrmConfirm("您确定要删除客户来源'"+name+"'吗？",function(){
	  	MaskUtil.Loading();
	    API.delCusSource(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);
			 	var hash=window.location.hash.split('=')[1];
				if(hash){
					cusSourceList(hash,20);
				}else{
					cusSourceList(0,20);
				}
			 }else{
				 dcrmAlertError(data.msg);
		     }
			MaskUtil.RemoveLoading();
	    });
  	});
}
