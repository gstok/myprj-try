if(window.location.search.split('=')[1]){
	var oid=window.location.search.split('=')[1].split('&')[0];
}

// 封装post方法
function post(url, data, callback) {
    data = JSON.stringify(data);
    var settings = {
        type: 'POST',
        url: url,
        data: data,
        async: true,
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function () {
            return true;
        },
        success: function (res) {
            callback(res);
        },
        error: function (result) {
            alert("Ajax请求出错");
        },
        complete: function () {
        }
    };
    $.ajax(settings);
}

function post2(url, data, callback) {
    var settings = {
        type: 'POST',
        url: url,
        data: data,
        async: true,
        cache: false,
        beforeSend: function () {
            return true;
        },
        success: function (res) {
            callback(res);
        },
        error: function (result) {
            alert("Ajax请求出错");
        },
        complete: function () {
        }
    };
    $.ajax(settings);
}

$('.save').click(function(){

})

function returnManage(){
	window.location.href = API.baseUrl+"/view/setting/tagmanage.html";
}
// 修改回显
if(oid){
	$('.tjorxg').html('修改新标签')
	var url = "/apis/tag/geekerToEdit.json";
	var data={
		id:Number(oid)
	};
	post2(url, data, function (res) {
		if(res.code==200){
			var tag=res.data.tag;
			$('#tagContribute').val(tag.tagColumn);
			$('#tagName').val(tag.tagName);
			$('#searchType').val(tag.defaultType);
			$('#numCount').val(tag.dataRange);
			$('#describe').val(tag.remark);
			var defaultDisplay=tag.defaultDisplay;
			$.each($('input[type="checkbox"]'),function(index,item){
				if($(item).attr('value')==defaultDisplay){
					$(item).attr('checked',true)
				}
			})

			var display=tag.display;
			$.each($('input[type="radio"]'),function(index,item){
				if($(item).attr('value')==display){
					$(item).attr('checked',true)
				}
			})

		}else{
			dcrmAlertError(res.msg)
		}
	})

}else{
	$('.tjorxg').html('添加新标签')
}

// 获取标签属性
geekerGetAllTags()
function geekerGetAllTags(){
	var url = "/apis/search/client/geekerGetAllTags.json";
	var data={};
	// MaskUtil.Loading();
	post(url, data, function (res) {
		var obj=res.data.properties;
		var str='<option value="">请选择</option>';
	    $.each(obj,function(index,item){
	        str+='<option value="'+index+'">'+index+'</option>'
	    })
	    $('#tagContribute').html(str)
	})
}

// 添加或修改标签
function addTags(){
	var str=''
	var str2=''
	$.each($('input[type="checkbox"]'),function(index,item){
		if($(item).is(":checked")){
			str+=$(item).val()+','
		}
	})

	$.each($('input[type="radio"]'),function(index,item){
		if($(item).is(":checked")){
			str2=$(item).val()
		}
	})
	console.log(str)
	var data={
		'dataRange':$('#numCount').val(),
		'defaultDisplay':str,
		'display':str2,
		'remark':$('#describe').val(),
		'tagColumn':$('#tagContribute').val(),
		'tagName':$('#tagName').val(),
		'tagTableName':'user',
		'tagType':$('#searchType').val(),
	};
	if(oid){//修改
		data.id=oid;
		var url = "/apis/tag/geekerEdit.json";
		post(url, data, function (res) {
			if(res.code==200){
				dcrmAlertSuccess(res.msg);
				returnManage()
			}else{
				dcrmAlertError(res.msg);
			}
		})
	}else{//添加
		// MaskUtil.Loading();
		var url = "/apis/tag/geekerAdd.json";
		post(url, data, function (res) {
			if(res.code==200){
				dcrmAlertSuccess(res.msg);
				returnManage()
			}else{
				dcrmAlertError(res.msg);
			}
		})
	}

}


