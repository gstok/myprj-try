$(function(){
    $(".setli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
    $(".setli").find("ul #index_userSet").find("a").addClass("active");

});

var oid=window.location.search.split('=')[1].split('&')[0];
function returnback(){
	window.location.href="/view/setting/usermanagement/usermanagement.html";
}

logList(0,20)
function logList(page,size){
    var data={
    	  userId:oid,
        pageIndex:page,
        pageSize:size
    }
    API.queryUserLoginLog(data,function(data){
        if(data.code&&data.code==200){
          console.log(data)
          var obj=data.data.pageData.list;
          var str=''


          if(obj.length){
            $.each(obj,function(index,item){
                var status='';
                if(item.status==1){
                  status='成功'
                }else if(item.status==0){
                  status='失败'
                }
                str+='<tr>'+
                      '  <td>'+isNull(item.loginName)+'</td>'+
                      '  <td>'+isNull(item.loginIp)+'</td>'+
                      '  <td>'+isNull(item.loginType)+'</td>'+
                      '  <td>'+isNull(item.displayLoginTime)+'</td>'+
                      '  <td>'+status+'</td>'+
                      ' </tr>'
            })
            $('#logList tbody').html(str);
            if(page==0){
                $('.ui-paging-container').eq(0).remove();
                $('#logListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                    userList(page,size);

                }});
            }

          }else{
            $('#logList tbody').html('<tr><td colspan="5" class="textcenter"><i class="icon icon-icon nodata"></i>暂无数据</td></tr>');
          }
        }

    })
}