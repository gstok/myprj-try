
$(function(){
	cusAttributeList(0,20);
})


var hash;
// 客户属性列表
function cusAttributeList(page,size){
	var data = {
        "pageIndex":page,
        "pageSize":size
    };
    MaskUtil.Loading();
	API.cusAttrList(data,function(data){
		console.log(data);
		var obj=data.data.pageData.list;
		if(obj.length){
		for (var i =0;i< obj.length; i++) {
		// 判断数据是否为null
        var dis = '';//禁用启用
        var str;
        var del = '';//删除
        var use = '';//常用非常用
        var scope=obj[i].scope;
        var status=obj[i].status;
        var type=obj[i].type;
        var attrValName='';
        var edit = '';//编辑
        if(type==0){//华坤

        	if(obj[i].attrType=='select'||obj[i].attrType=='bool'){
				if(obj[i].attrName=='省份'||obj[i].attrName=='城市'||obj[i].attrName=='县/区'){
        				attrValName=''
        		}else{
        			attrValName=isNull(obj[i].attrVal);
        		}
        		if(obj[i].attrVal=='NULL'){
        			attrValName=''
        		}
        	}
        	del='<a href="javascript:;" class="tbBtn zcBtn disabledBtn">删除</a>';
        }else if(type==1){
        	attrValName=isNull(obj[i].attrVal);
        	//客户属性--删除
			if(hasPermission("custAttr","DEL")){
			    del='<a href="javascript:;" class="tbBtn zcBtn" onclick="delcusAttribute(event,'+obj[i].id+',\''+obj[i].attrName+'\')">删除</a>';
			}else{
			    del='<a href="javascript:;" class="tbBtn zcBtn disabledBtn">删除</a>';
			}
        }
        //客户属性--编辑
		if(hasPermission("custAttr","UPDATE")){
		    edit='<a href="javascript:;" class="tbBtn zcBtn" onclick="editAttribute(event,'+obj[i].id+')">编辑</a>';
		}else{
		    edit='<a href="javascript:;" class="tbBtn zcBtn disabledBtn">编辑</a>';
		}

        if(status==0){
        	//客户属性--编辑
			if(hasPermission("custAttr","UPDATE")){
			    dis='<a href="javascript:;" class="useordis" onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-on dis"></span></a>';
			}else{
			    dis='<a href="javascript:;" class="useordis pr">'+
			    '<span class="switch-off dis"></span>'+
			    '<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
			    '</a>'
			}

        }else if(status==1){
        	//客户属性--编辑
			if(hasPermission("custAttr","UPDATE")){
			    dis='<a href="javascript:;" class="useordis" onclick="isUse(event,'+obj[i].id+','+status+')"><span class="switch-off dis"></span></a>';
			}else{
			    dis='<a href="javascript:;" class="useordis pr">'+
			    '<span class="switch-off dis"></span>'+
			    '<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
			    '</a>'
			}

        }
        if(scope==1){
        	if(hasPermission("custAttr","UPDATE")){
        		use='<a href="javascript:;" class="isoften" onclick="isOften(\'非常用\',event,'+obj[i].id+','+obj[i].scope+')"><span class="switch-off often"></span></a>'
        	}else{
				use='<a href="javascript:;" class="isoften pr">'+
				'<span class="switch-off often"></span>'+
				'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
			    '</a>'
        	}
        }else{
        	if(hasPermission("custAttr","UPDATE")){
        		use='<a href="javascript:;" class="isoften" onclick="isOften(\'常用\',event,'+obj[i].id+','+obj[i].scope+')"><span class="switch-on often"></span></a>'
        	}else{
				use='<a href="javascript:;" class="isoften pr">'+
				'<span class="switch-on often"></span>'+
				'<span class="tbBtn zcBtn disabledBtn disbutton"></sapn>'+
			    '</a>'
        	}
        }

			str+='<tr data-id='+isNull(obj[i].id)+'>'+
						'<td class="firstTd">'+isNull(obj[i].attrName)+'</td>'+
						'<td >'+attrValName+'</td>'+
						"<td class='iconTd textcenter'>"+dis+use+edit+del+"</td>" +
	              '</tr>'
			}

			$('#cusAttributeList tbody').html(str);

			if(page==0){
			$('.ui-paging-container').eq(0).remove();
        	$('#cusAttributeListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
     		    cusAttributeList(page,size);
     		 }});
        }
		}
		else{
			var trdat = "<tr >"+
	            	"<td  colspan='3' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
	            	"</tr> ";
	        $('#cusAttributeList tbody').html(trdat)
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






// 新建客户属性
function addcusAttribute(){
	clearInfo();
	var modelContent=$('#addcusAttribute');//弹窗最外层
	var contentInfo=$('#addcusAttribute .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}

$('#attrTypeAdd').change(function(){

    if($(this).val()=='bool'){
    	$('#arrtValAdd').html('<input class="arrtValEdit" value="是;否" readonly/>');
    }else if($(this).val()=='select'){
    	$('#arrtValAdd').html('<input type="text" class="arrtValAdd" placeholder="可输入多个选项值，请用分号隔开">');
    }else{
    	$('#arrtValAdd').html('<input type="text" class="arrtValAdd" readonly placeholder="不可填写">');
    }
});

// 新建客户属性保存
function addsure(){
	var allEng= /^[a-zA-Z_]+$/;
	var data={
		'attrName':$('#attrNameAdd').val(),
		'attrType':$('#attrTypeAdd').val(),
		'attrVal':$('#arrtValAdd input').val(),
		'attrKey':$('#attrKeyAdd').val()
	};
	if($.trim($('#attrNameAdd').val())==''){
		dcrmAlertError('属性名称不能为空');
		return false;
	}else if($.trim($('#attrKeyAdd').val())==''){
		dcrmAlertError('属性标识不能为空');
		return false;
	}else if(!allEng.test($('#attrKeyAdd').val())){
		dcrmAlertError('属性标识只能是英文和下划线');
		return false;
	}
	MaskUtil.Loading();
	API.addcusAttribute(data, function(res) {
		console.log(res);
		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
			cusAttributeList(0,20);
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	    $('#addcusAttribute').fadeOut();
	    $('.bg').fadeOut();
	});
}



// 编辑客户属性
function editAttribute(event,id){
	clearInfo();
	event.stopPropagation();
	var modelContent=$('#editAttribute');//弹窗最外层
	var contentInfo=$('#editAttribute .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作

	var attrval;
	var attrType;
	var data={
		'id':id
	};
	window.editcusAttributeId=id;
	MaskUtil.Loading();
	API.viewAttribute(data, function(res) {
		if(res.code == 200){
			$('#attrNameEdit').val(res.data.obj.attrName);
			$('#attrTypeEdit').val(res.data.obj.attrType);
			$('#attrValEdit input').val(res.data.obj.attrVal);
			$('#attrKeyEdit').val(res.data.obj.attrKey);

			if (res.data.obj.type === 0) {
                $('#attrKeyEdit').attr("disabled", "disabled");
			} else {
                $('#attrKeyEdit').removeAttr("disabled");
			}

			arrtVal=res.data.obj.attrVal;
			attrType=res.data.obj.attrType;
			if(attrType=='text'){
				$('#attrValEdit input').attr('readonly','true')
			}else if(attrType=='select'){
				$('#attrValEdit input').attr('readonly','false')
			}
		}else{
			dcrmAlertError(res.msg);
		}
	    MaskUtil.RemoveLoading();
	});

	$('#attrTypeEdit').change(function(){

		    if($(this).val()=='bool'){
	    	    $('#attrValEdit').html('<input class="arrtValEdit" value="是;否" readonly/>');
		    }else if($(this).val()=='select'){
		    	$('#attrValEdit').html('<input type="text" class="arrtValEdit" placeholder="可输入多个选项值，请用逗号隔开">');
		    	if(attrType=='select'){
		    		$('#attrValEdit input').val(arrtVal);
				}
		    }else{
		    	console.log(11)
		    	$('#attrValEdit').html('<input type="text" class="arrtValEdit" readonly placeholder="不可填写">');
		    	$('#attrValEdit input').val('');
		    }



	})

}

//编辑后保存
$('.editSure').unbind('click').click(function(){
	var allEng= /^[a-zA-Z_]+$/;
	var data={
			'id':window.editcusAttributeId,
			'attrName':$('#attrNameEdit').val(),
			'attrType':$('#attrTypeEdit').val(),
			'attrVal':$('#attrValEdit input').val(),
			'attrKey':$('#attrKeyEdit').val()
		};
		if($.trim($('#attrNameEdit').val())==''){
			dcrmAlertError('属性名称不能为空');
			return false;
		}else if($.trim($('#attrKeyEdit').val())==''){
			dcrmAlertError('属性标识不能为空');
			return false;
		}else if(!allEng.test($('#attrKeyEdit').val())){
			dcrmAlertError('属性标识只能是英文和下划线');
			return false;
		}
			//MaskUtil.Loading();
		API.editAttribute(data, function(res) {
			if(res.code == 200){
				dcrmAlertSuccess(res.msg);
				var hash=window.location.hash.split('=')[1];
				if(hash){
					cusAttributeList(hash,20);
				}else{
					cusAttributeList(0,20);
				}

			}else{
				dcrmAlertError(res.msg);
			}
		    //MaskUtil.RemoveLoading();
		    $('#editAttribute').fadeOut();
			$('.bg').fadeOut();
		});

});

// 修改客户属性状态
function isUse(event,id,status){
	event.stopPropagation();
  	var data = {
  		id:id
  	};
	if(status==0){
		var str="您确定要启用该客户属性吗？";
	  	// dcrmConfirm(str,function(){
		  	MaskUtil.Loading();
		    API.attributeEnable(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);

			      var hash=window.location.hash.split('=')[1];
					if(hash){
						cusAttributeList(hash,20);
					}else{
						cusAttributeList(0,20);
					}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
	  	// });
	}else{
		var str="您确定要禁用该客户属性吗？";
	  	// dcrmConfirm(str,function(){
		  	MaskUtil.Loading();
		    API.attributeDisable(data, function(data){
			  if(data && data.code == 200) {
				  dcrmAlertSuccess(data.msg);

			      var hash=window.location.hash.split('=')[1];
					if(hash){
						cusAttributeList(hash,20);
					}else{
						cusAttributeList(0,20);
					}
				 }else{
					 dcrmAlertError(data.msg);
			     }
				MaskUtil.RemoveLoading();
		    });
	  	// });
	}
}

// 客户标签常用设置
function isOften(isOften,event,id,scope){
	event.stopPropagation();

	if(scope==0){
		scope=1;
	}else if(scope==1){
		scope=0;
	}

  	var data = {
  		'id':id,
  		'scope':scope
  	};

   var str="您确定要将该客户属性设为"+isOften+"？";
  	// dcrmConfirm(str,function(){
	  	//MaskUtil.Loading();
	    API.attributeStatus(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);
			  var hash=window.location.hash.split('=')[1];
				if(hash){
					cusAttributeList(hash,20);
				}else{
					cusAttributeList(0,20);
				}
			 }else{
				 dcrmAlertError(data.msg);
		     }
			//MaskUtil.RemoveLoading();
	    });
  	// });
}

// 删除客户属性
function delcusAttribute(event,id,name){
	event.stopPropagation();
  	var data = {
  		id:id
  	};
  	dcrmConfirm("您确定要删除客户属性'"+name+"'吗？",function(){
	  	// MaskUtil.Loading();
	    API.delcusAttribute(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);
			  var hash=window.location.hash.split('=')[1];
				if(hash){
					cusAttributeList(hash,20);
				}else{
					cusAttributeList(0,20);
				}
			 }else{
				 dcrmAlertError(data.msg);
		     }
			// MaskUtil.RemoveLoading();
	    });
  	});
}