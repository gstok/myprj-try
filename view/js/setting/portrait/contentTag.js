// 客户标签列表
var contentTagList=function(page,size,count){
	var data = {
        "pageIndex":page,
        "pageSize":size
    };
    MaskUtil.Loading();
	API.contentTagList(data,function(data){
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
        	if(hasPermission("contentTag","UPDATE")){
        		bjsc='<a href="javascript:;" class="tbBtn zcBtn" onclick="editContentTag(event,'+obj[i].id+')">编辑</a>'+
            	'<a href="javascript:;" class="tbBtn zcBtn" onclick="delContentTag(event,'+obj[i].id+',\''+obj[i].tagName+'\')">删除</a>';
        	}else{
        		bjsc='<a href="javascript:;" class="tbBtn zcBtn disabledBtn">编辑</a>'+
            	'<a href="javascript:;" class="tbBtn zcBtn disabledBtn">删除</a>';
        	}
        }
        if(status==0){
        	if(hasPermission("contentTag","UPDATE")){
        		cz='<a href="javascript:;" class="useordis" onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-on"></span></a>';
        	}else{
        		cz='<a href="javascript:;" class="useordis pr">'+
        		'<span class="switch-on"></span>'+
        		'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
        		'</a>';
        	}
        }else{
        	if(hasPermission("contentTag","UPDATE")){
        		cz='<a href="javascript:;" class="useordis"  onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-off"></span></a>';
        	}else{
        		cz='<a href="javascript:;" class="useordis pr">'+
        		'<span class="switch-off"></span>'+
        		'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
        		'</a>';
        	}
        }
				str+='<tr data-id='+isNull(obj[i].id)+'>'+
							'<td class="firstTd">'+isNull(obj[i].tagName)+'</td>'+
							"<td class='iconTd'>"+cz+bjsc+"</td>" +
		                '</tr>'
			}
			$('#contentTagList tbody').html(str);

			if(page==0){
			$('.ui-paging-container').eq(0).remove();
        	$('#contentTagListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
     		    contentTagList(page,size);
     		 }});
        }
		}
		else{
			var trdat = "<tr >"+
	            	"<td  colspan='2' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
	            	"</tr> ";
	        $('#contentTagList tbody').html(trdat)
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
contentTagList(0,20);



// 新建内容标签
function addContentTag(){
	clearInfo();
	var modelContent=$('#addContentTag');//弹窗最外层
	var contentInfo=$('#addContentTag .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}

// 新建内容标签保存
function addsure(){
	var data={
		tagName:$('#tagNameAdd').val()
	}
	if($.trim($('#tagNameAdd').val())==''){
		dcrmAlertError('请输入标签名称');
		return false;
	}
	MaskUtil.Loading();
	API.addContentTag(data, function(res) {
		console.log(res);
		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
			var hash=window.location.hash.split('=')[1];
				if(hash){
					contentTagList(hash,20);
				}else{
					contentTagList(0,20);
				}
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	    $('#addContentTag').fadeOut();
	    $('.bg').fadeOut();
	});
}

// 编辑客户标签
function editContentTag(event,id){
	clearInfo();
	event.stopPropagation();
	var modelContent=$('#editContentTag');//弹窗最外层
	var contentInfo=$('#editContentTag .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
	var data={
		id:id
	}
	window.editContentTagId=id;
	MaskUtil.Loading();
	API.viewContentTag(data, function(res) {
		if(res.code == 200){
			$('#tagNameEdit').val(res.data.obj.tagName)
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	});


	// 编辑后保存
	$('.editSure').unbind('click').click(function(){
		var data={
			'id':window.editContentTagId,
			'tagName':$('#tagNameEdit').val()
		};
		if($.trim($('#tagNameEdit').val())==''){
			dcrmAlertError('请输入标签名称');
			return false;
		}
		MaskUtil.Loading();
		API.updateContentTag(data, function(res) {
			if(res.code == 200){
				dcrmAlertSuccess(res.msg);
				$('#editContentTag').fadeOut();
				$('.bg').fadeOut();
				var hash=window.location.hash.split('=')[1];
				if(hash){
					contentTagList(hash,20);
				}else{
					contentTagList(0,20);
				}
			}else{
				dcrmAlertError(res.msg);
			}
		    MaskUtil.RemoveLoading();
		});
	})

}




// 删除客户标签
function delContentTag(event,id,name){
	event.stopPropagation();
  	var data = {
  		id:id
  	};

	  	dcrmConfirm("您确定要删除内容标签'"+name+"'吗？",function(){
	  		MaskUtil.Loading();
		  	API.delContentTag(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);
					var hash=window.location.hash.split('=')[1];
					if(hash){
						contentTagList(hash,20);
					}else{
						contentTagList(0,20);
					}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
  	   });

}

// 修改内容标签状态
function isUse(event,id,status){
	event.stopPropagation();
  	var data = {
  		id:id
  	};
	if(status==0){
		var str="您确定要启用该内容标签吗？";
	  	// dcrmConfirm(str,function(){
		  	MaskUtil.Loading();
		    API.contentTagEnable(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);
				  var hash=window.location.hash.split('=')[1];
				if(hash){
					contentTagList(hash,20);
				}else{
					contentTagList(0,20);
				}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
	  	// });
	}else{
		var str="您确定要禁用该内容标签吗？";
	  	// dcrmConfirm(str,function(){
		  	MaskUtil.Loading();
		    API.contentTagDisable(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);
				  var hash=window.location.hash.split('=')[1];
				if(hash){
					contentTagList(hash,20);
				}else{
					contentTagList(0,20);
				}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
	  	// });
	}
}