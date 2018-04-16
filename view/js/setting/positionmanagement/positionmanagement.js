$(function(){
    $(".setli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
    $(".setli").find("ul #index_departSet").find("a").addClass("active");
    queryPosition(0,20);
})
// 职位列表
function queryPosition(pageIndex,pageSize){
    var data={
        pageIndex:pageIndex,
        pageSize:pageSize
    };
    MaskUtil.Loading();
    API.queryPosition(data,function(data){
        if(data&&data.code==200){
            $('.positionList').html('');
            console.log(data);
            var obj=data.data.pageData.list;
            //职位管理---添加
            var addstr = '';
            if(hasPermission("position", "ADD")){
                addstr='<li class="firstLi"><input type="text" placeholder="输入职位名称" id="positionName"><a href="javascript:;" class="btn btn-primary" onclick="addPosition()">+添加</a>'+
                    '</li>';
            }else{
                addstr='';
            }
            $('.positionList').append(addstr);
            for (var i =0;i< obj.length; i++) {
                var str = '';
                var edit = '';//编辑
                var del = '';//删除
                if(hasPermission("position", "UPDATE")){
                    edit='<a href="javascript:;" onclick="editPosition('+obj[i].id+',\''+obj[i].positionName+'\')" data-container="body" data-toggle="popover" data-placement="top" data-content="编辑"><i class="icon icon-bianji"></i></a><i class="shugang">|</i>';
                }else{
                    edit='<a><i class="icon icon-bianji disabled"></i></a><i class="shugang">|</i>';
                }
                if(hasPermission("position", "DEL")){
                    del='<a href="javascript:;" onclick="delPosition('+obj[i].id+')" data-container="body" data-toggle="popover" data-placement="top" data-content="删除"><i class="icon icon-shanchu"></i></a>';
                }else{
                    del='<a><i class="icon icon-shanchu disabled"></i></a>';
                }
                str+='<li><span class="cont fl">'+obj[i].positionName+'</span>'+
                 '           <span class="caozuo fr">'+edit+del+
                 '           </span>'+
                 '    </li>';
                $("[data-toggle='popover']").popover({trigger:"hover"});
                console.log(str);
                $('.positionList').append(str);
            }

        }
        MaskUtil.RemoveLoading();
    })
}
// 新建职位
function addPosition(){
    var data={
        positionName:$('#positionName').val()
    };
    if(data.positionName==''){
        dcrmAlertError("职位名称不能为空");
        return;
    }
    API.addPosition(data,function(data){
        if(data&&data.code==200){
            dcrmAlertSuccess(data.msg)
            queryPosition(0,20)
        }else{
            dcrmAlertError(data.msg)
        }
    })
}
// 编辑显示
function editPosition(id,iname){

    clearInfo();
    var modelContent=$('#editPosition');//弹窗最外层
    var contentInfo=$('#editPosition .contentInfo');//弹窗内层
    frameDiv(modelContent,contentInfo);//弹窗操作
    window.editPositionId=id;
    $('#positionNameEdit').val(iname)
}
// 编辑职位
function editSure(){
    var data={
        id:window.editPositionId,
        positionName:$('#positionNameEdit').val()
    };
    console.log(data);
    API.updatePosition(data,function(data){
        if(data&&data.code==200){
           // dcrmAlertSuccess(data.msg);
            queryPosition(0,20);
            $('#editPosition').fadeOut();
            $('.bg').fadeOut();
        }else{
            dcrmAlertErrer(data.msg);
        }
    })
}
// 删除职位
function delPosition(id){
    var data={
        id:id
    };
    dcrmConfirm("您确定要删除该职位吗？",function(){
        API.delPosition(data,function(data){
             if(data&&data.code==200){
                //dcrmAlertSuccess(data.msg);
                queryPosition(0,20)
            }else{
                dcrmAlertErrer(data.msg);
            }
        })
    })

}

