function addTag(id){
	if(id){
		window.location.href = API.baseUrl+"/view/setting/addTag.html?="+id;
	}else{
		window.location.href = API.baseUrl+"/view/setting/addTag.html";
	}

}
var API2={
    //项目名字改变修改此处
    baseUrl:"",
    post: function (url, data,async, callback, errorcallback) {
        var settings = {
            type: 'POST',
            url: API.baseUrl+url,
            data: data,
            cache: false,
            async: async,
            dataType: 'json',
            // contentType: 'application/json',
            beforeSend: function () {
                return true;
            },
            success: function (res) {
                if(res.code == 403){
                    window.location.href = API.baseUrl+"/login.html";
                }else{
                    callback(res);
                }

            }

        };
        $.ajax(settings);
    },
    // 启用禁用
    geekerStatus:function(param,callback){
        API2.post("  /tag/geekerStatus.json",param,true,callback);
    },

}

// 封装post方法
function post(url, data, callback) {
    // data = JSON.stringify(data);
    var settings = {
        type: 'POST',
        url: url,
        data: data,
        async: true,
        cache: false,
        // dataType: 'json',
        // contentType: 'application/json',
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
function stopTag(){
	alert('停用')
}

// 标签列表
function tagList(page,size){
	var tagName=$('.tagName').val();
	var tagColumn=$('.zdName').val();
	var tagTableName=$('.tableName').val();

    var data={
    	'curPage':page,
    	'tagColumn':tagColumn,
    	'tagName':tagName,
    	'tagTableName':tagTableName,
    	'pageSize':size
    };

    var url = "/apis/tag/geekerTaglist.json";
        // MaskUtil.Loading();
    post(url, data, function (res) {
        var obj=res.data.tagList;
        if(obj.length>0){
        	var tagstr='';
	        var statusName='';
	        var caozuo='';
	        $.each(obj,function(index,item){

	            if(item.status=='U'){
	            	statusName='启用';
	            	caozuo='<td class="textcenter"><a href="javascript:;" class="tbBtn zcBtn" onclick="addTag('+item.id+')">修改</a><a href="javascript:;" class="tbBtn zcBtn" onclick="updateStatus('+item.id+','+'\'E\')">停用</a></td>';
	            }else{
	            	statusName='禁用';
	            	caozuo='<td class="textcenter"><a href="javascript:;" class="tbBtn zcBtn" onclick="addTag('+item.id+')">修改</a><a href="javascript:;" class="tbBtn zcBtn" onclick="updateStatus('+item.id+','+'\'U\')">启用</a></td>';
	            }
	            tagstr+='<tr>'+
	                       '  <td>'+item.tagName+'</td>'+
	                       '  <td>'+item.tagColumn+'</td>'+
	                       '  <td>'+item.tagTableName+'</td>'+
	                       '  <td>'+statusName+'</td>'+
	                       '  <td>'+item.showCreateTime+'</td>'+
	                       '  <td>'+item.remark+'</td>'+caozuo+
	                       '</tr>'
	        })
	        $('.tagTbody').html(tagstr);
	        if(page==1){
				$('.ui-paging-container').eq(0).remove();
	        	$('#tagListpage').Paging({pagesize:10,count:res.data.page.totalCount,toolbar:true,callback:function(page,size){
	     		    tagList(page,size);
	     		 }});
       		}
        }


    });
}
tagList(1,10)

// 启用禁用标签
function updateStatus(id,status){
	var data={
		id:id,
		status:status
	}
	var url = "/apis/tag/geekerStatus.json";
	post(url, data, function (res) {
		if(res.code==200){
			dcrmAlertSuccess(res.msg);
			tagList(1,10)
		}else{
			dcrmAlertError(res.msg);
		}
	})
}


