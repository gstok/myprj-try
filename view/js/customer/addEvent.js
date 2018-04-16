$(function(){
	$(".customerli").find("ul").show();
	$(".menuNormal").find("a").removeClass("active");
	$(".customerli").find("span").attr("class","icon icon-jiantou");
	$(".customerli").find("ul #index_customer").find("a").addClass("active");
})
var oid=window.location.search.split('=')[1];
$('.titleSpan').attr('data-id',oid)
$('.adetail').attr('href','/view/customer/customer/customerDetail.html?oid='+oid)
//新建事件保存
$('.addEventSave').click(function(){
	var data={
		'eventCd':$('#addCusName').val(),
		'eventFrom':$('#addSource').val(),
		'eventTime':$('#occurrenceTime').val(),
		'remark':$('#addRemark').val(),
		'custId':oid
	};

	if(data.eventFrom==''){
		dcrmAlertWarning('事件来源不能为空');
		return;
	}else if(data.eventCd==''){
		dcrmAlertWarning('事件名称不能为空');
		return;
	}else if(data.eventTime==''){
		dcrmAlertWarning('事件时间不能为空');
		return;
	}else if(data.remark.length!=''&&data.remark.length>50){
		dcrmAlertWarning('事件记录不能超过50个字符');
		return;
	}

	API.addEvent(data,function(res){
		if(res.code == 200){
			dcrmAlertSuccess(res.msg);
	        window.location.href = "/view/customer/customer/customerDetail.html?oid="+oid;
		}else{
			dcrmAlertError(res.msg);
		}
		// MaskUtil.RemoveLoading();

	})
})

//获取事件来源
getEventSource('addSource');
//获取事件
$('#addSource').change(function(){
	var data={
		'eventFrom':$('#addSource').val()
	};
	API.getEventName(data,function(res){
		if(res.code == 200){
			var obj=res.data.list;
	        var str='<option value="">请选择</option>';
	        $.each(obj,function(index,item){
	            str+='<option value="'+item.eventCd+'">'+item.eventName+'</option>'
	        });
	        $('#addCusName').html(str)
		}else{
			dcrmAlertError(res.msg);
		}

	})

});

function returnDetail(){
	var oid=$('.titleSpan').attr('data-id');
	window.location.href = "/view/customer/customer/customerDetail.html?oid="+oid;

}