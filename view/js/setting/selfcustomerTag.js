$(function(){
    $(".menuNormal").find("a").removeClass("active");
})
// 客户标签列表
var custTagList=function(page,size,count){
	var data = {
        "pageIndex":page,
        "pageSize":size,
        "type":1
    };

	API.customList(data,function(data){
		console.log(data);
		var obj=data.data.pageData.list;
		if(obj.length){
		for (var i =0;i< obj.length; i++) {
		// 判断数据是否为null
        var cz;
        var str;
        var status=obj[i].status;
        var statusName;
        var type=obj[i].type;
        var bjsc;
        if(status!=2){
        	if(type==0){
        		bjsc=''
	        }else{
	        	bjsc='<a href="javascript:;" class="tbBtn zcBtn" onclick="editCustomerTag(event,'+obj[i].id+')">编辑</a>'+
	            '<a href="javascript:;" class="tbBtn zcBtn" onclick="delCustTag(event,'+obj[i].id+')">删除</a>'
	        }
	        if(status==0){
	        	cz='<a href="javascript:;" class="useordis" onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-on"></span></a>'

	        }else{
	        	cz='<a href="javascript:;" class="useordis" onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-off"></span></a>'

	        }

				str+='<tr data-id='+isNull(obj[i].id)+'>'+
								'<td class="firstTd">'+isNull(obj[i].tagName)+'</td>'+
								"<td class='iconTd'>"+cz+bjsc+"</td>" +
			                '</tr>'
				}
				$('#customerTagList tbody').html(str);

				if(page==0){
				$('.ui-paging-container').eq(0).remove();
	        	$('#customerTagListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
	     		    custTagList(page,size);
	     		 }});
	        }
			}
        }
		else{
			trdat = "<tr >"+
	            	"<td  colspan='2' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
	            	"</tr> ";
	        $('#customerTagList tbody').html(trdat)
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
		});

	},50)
	});
}
custTagList(0,20);



// 新建客户标签
function addCustomerTag(){
	clearInfo();
	var modelContent=$('#addCustomerTag');//弹窗最外层
	var contentInfo=$('#addCustomerTag .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作

}

// 新建客户标签保存
function addsure(){
	var data={
		id:Global.userId,
		tagName:$('#tagNameAdd').val()
	}
	if(data.tagName.length>5){
		dcrmAlertError('标签名不能超过5个字');
		return false;
	}
	MaskUtil.Loading();
	API.addCustom(data, function(res) {
		console.log(res)
		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
			var hash=window.location.hash.split('=')[1];
			if(hash){
					custTagList(hash,20);
				}else{
					custTagList(0,20);
				}
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	    $('#addCustomerTag').fadeOut();
	    $('.bg').fadeOut();
	});
}

// 编辑客户标签
function editCustomerTag(event,id){
	clearInfo();
	event.stopPropagation();
	var modelContent=$('#editCustomerTag');//弹窗最外层
	var contentInfo=$('#editCustomerTag .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
	var data={
		id:id
	}
	window.editCusTagId=id;
	//MaskUtil.Loading();
	API.viewCustTag(data, function(res) {
		if(res.code == 200){
			$('#tagNameEdit').val(res.data.obj.tagName)
		}else{
			dcrmAlertError(res.msg);
		}
	    //MaskUtil.RemoveLoading();
	});


	// 编辑后保存
	$('.editSure').unbind('click').click(function(){
		var data={
			'id':window.editCusTagId,
			'tagName':$('#tagNameEdit').val()
		}
		if(data.tagName.length>5){
			dcrmAlertError('标签名不能超过5个字');
			return false;
		}
		//MaskUtil.Loading();
		API.updateCustTag(data, function(res) {
			if(res.code == 200){
				dcrmAlertSuccess(res.msg);
				$('#editCustomerTag').fadeOut();
				$('.bg').fadeOut();
				var hash=window.location.hash.split('=')[1];
				if(hash){
						custTagList(hash,20);
					}else{
						custTagList(0,20);
					}
			}else{
				dcrmAlertError(res.msg);
			}
		    //MaskUtil.RemoveLoading();
		});
	})

}




// 删除客户标签
function delCustTag(event,id){
	event.stopPropagation();
  	var data = {
  		id:id
  	};
  	dcrmConfirm("您确定要删除该客户标签吗？",function(){
	  	MaskUtil.Loading();
	    API.delCustTag(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);

				var hash=window.location.hash.split('=')[1];
				if(hash){
						custTagList(hash,20);
					}else{
						custTagList(0,20);
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
  	console.log(status)
	if(status==0){
		var str="您确定要启用该客户标签吗？";
	  	// dcrmConfirm(str,function(){
		  	MaskUtil.Loading();
		    API.custTagEnable(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);
				 var hash=window.location.hash.split('=')[1];
				if(hash){
						custTagList(hash,20);
					}else{
						custTagList(0,20);
					}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
	  	// });
	}else{
		var str="您确定要禁用该客户标签吗？";
	  	// dcrmConfirm(str,function(){
		  	MaskUtil.Loading();
		    API.custTagDisable(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);
				 var hash=window.location.hash.split('=')[1];
				if(hash){
						custTagList(hash,20);
					}else{
						custTagList(0,20);
					}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
	  	// });
	}
}


