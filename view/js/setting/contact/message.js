$(function(){
	messageList(0,20);
})


// 短信签名列表
function messageList(page,size,count){
	var data = {
        "pageIndex":page,
        "pageSize":size
    };
    MaskUtil.Loading();
	API.smsSignList(data,function(data){
		console.log(data);
		var obj=data.data.pageData.list;
		var str;
		var statusName='';

		if(obj.length){
		for (var i =0;i< obj.length; i++) {

			var type=obj[i].smsType;
			if(type==0){
				type='通知短信'
			}else{
				type='营销短信'
			}
       		var cz = '';
        		if(hasPermission('smsSign', 'DEL')){
        			cz='<a href="javascript:;" class="tbBtn zcBtn" onclick="delmessage(event,'+obj[i].id+',\''+obj[i].signature+'\')">删除</a>'
				}else{
					cz='<a href="javascript:;" class="tbBtn zcBtn">删除</a>'
				}
				str+='<tr data-id='+isNull(obj[i].id)+'>'+
					'<td >'+isNull(obj[i].signature)+'</td>'+
					'<td>'+isNull(obj[i].applyResult)+'</td>'+
					'<td>'+type+'</td>'+
					'<td>'+isNull(obj[i].userName)+'</td>'+
					'<td>'+isNull(obj[i].displayApplyTime)+'</td>'+
					"<td class='iconTd'>"+cz+"</td>" +
		            '</tr>'
		}
			$('#messageList tbody').html(str);
			if(page==0){
			$('.ui-paging-container').eq(0).remove();
        	$('#messageListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
     		    messageList(page,size);
     		}});
        }
		}
		else{
			trdat = "<tr >"+
	            	"<td  colspan='6' class='textcenter'><i class='icon icon-icon nodata'>&#xe601;</i>暂无数据</td>"+
	            	"</tr> ";
	        $('#messageList tbody').html(trdat)
		}
		MaskUtil.RemoveLoading();
	});
}


// 新建短信签名
function addSign(){
	clearInfo();
	var modelContent=$('#addSign');//弹窗最外层
	var contentInfo=$('#addSign .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}

// 新建短信签名保存
function addsure(){
	var data={
		'signature':$('#signature').val(),
		'mobile':$('#mobile').val(),
		'smsType':''
	};
	if($('#callsms').prop('checked')==false&&$('#marketsms').prop('checked')==false){
		dcrmAlertError('请选择短信类型');
		return false;
	}
	if($('#callsms').prop('checked')){
		data.smsType=0
	}else if($('#marketsms').prop('checked')){
		data.smsType=1
	}
	 var reg=/\d+/ ;
	 var allEng=/a-z/;


	if($.trim(data.signature)==''){
		dcrmAlertWarning("短信签名不能为空");
		return false;
	}else if(data.signature.length>8||data.signature.length<3){
		dcrmAlertWarning("短信签名必须为3-8个字符");
		return false;
	}else if(reg.test(data.signature)){
		dcrmAlertWarning("短信签名不能包含数字");
		return false;
	 }
	 else if(reg.test(data.signature)){
		dcrmAlertWarning("短信签名不能是纯英文");
		return false;
	 }

	//手机号验证
	var mobileReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
	if(data.mobile&&!mobileReg.test(data.mobile)){
    	dcrmAlertError('请输入正确的手机号');
    	return false;
  	}

	// MaskUtil.Loading();
	API.addSmsSign(data, function(res) {
		console.log(res);
		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
			messageList(0,20);
		}else{
			dcrmAlertError(res.msg);
		}
	    // MaskUtil.RemoveLoading();
	    $('#addSign').fadeOut();
	    $('.bg').fadeOut();
	});
}


// 删除短信签名
function delmessage(event,id,name){
	event.stopPropagation();
  	var data = {
  		id:id
  	};
  	dcrmConfirm("您确定要删除短信签名'"+name+"'吗？",function(){
	  	// MaskUtil.Loading();
	    API.delSmsSign(data, function(data){
		  if(data && data.code == 200) {
			  dcrmAlertSuccess(data.msg);
			 	messageList(0,20);
			 }else{
				 dcrmAlertError(data.msg);
		     }
			// MaskUtil.RemoveLoading();
	    });
  	});
}

