$(function(){
    $(".setli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
    $(".setli").find("ul #index_userSet").find("a").addClass("active");
    //用户管理--新增
    // if(hasPermission("user","ADD")){
    //     $('.rightAdd').show();
    // }else{
    //     $('.rightAdd').hide();
    // }
    // //用户管理--删除
    // if(hasPermission("user","DEL")){
    //     $('.btn-del').show();
    // }else{
    //     $('.btn-del').hide();
    // }
    // //用户管理--权限分配
    // if(hasPermission("user","USER_ROLE")){
    //     $('.btn-fenpei').show();
    // }else{
    //     $('.btn-fenpei').hide();
    // }
    
    
    queryRole(null,'permissionUl');
    innerW();//表格宽度
});
$(window).resize(function(){
    innerW();//表格宽度
});
//表格宽度
function innerW(){
    var innerW = $(".userbox").width();
    if(innerW<1276){
        $(".userbox").addClass("minWind");
    }else{
        $(".userbox").removeClass("minWind");
    }
}
partial();


function partial(){
    var data={};
    var  zNodes=[];
    updateZtree();
    // 渲染列表
    function updateZtree(){
        API.getDepByUser(data,function(data){
            if(data&&data.code==200&&data.data){
                var arr=data.data.data;
                window.departId=arr[0].id;
                $.each(arr,function(index,item){
                    var obj={};
                    obj.id=item.id;
                    obj.pId=item.parentId;
                    obj.name=item.departName;

                    if(index==0){
                        obj.open=true;
                    }

                    zNodes.push(obj)
                });

                userList(0,20);
                selectList();
            }else{
                dcrmAlertError(data.msg)
            }

        })
    }


    var setting = {
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: false,
            selectedMulti: false,
            showLine: true,//不显示连接线，默认值true
            showIcon:true,//是否显示节点的图标(包括父级的文件夹图标子级的文件图标都不显示)，默认值true
            showTitle:false,//是否显示节点的title提示信息,默认为true（如果 setting.view.showTitle = true & setting.data.key.title = ''，zTree 会自动使用 setting.data.key.name 指定的节点名称当做 title）
            //fontCss:个性化文字样式,JSON格式的数据
            //fontCss: {'font-weight':'bold','color':'#058'}//统一设置样式
            // fontCss:getFontCss,//设置自定义的样式
            nameIsHTML:true//设置name属性是否支持HTML脚本，默认值为false
        },

        edit: {
            enable: false,
            editNameSelectAll: false,
            showRemoveBtn: false,
            showRenameBtn: false,
            // 取消拖拽
            drag: {
                autoExpandTrigger: false,
                isMove: false,
                prev: false,
                next: false,
                inner: false,
                autoOpenTime: 0
            }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            // beforeDrag: false,
            // beforeEditName: beforeEditName,
            // beforeRemove: beforeRemove,
            // beforeRename: beforeRename,
            // onRemove: onRemove,
            // onRename: onRename,
        }
    };


    var log, className = "dark";




    function showLog(str) {
        if (!log) log = $("#log");
        log.append("<li class='"+className+"'>"+str+"</li>");
        if(log.children("li").length > 8) {
            log.get(0).removeChild(log.children("li")[0]);
        }
    }
    function getTime() {
        var now= new Date(),
        h=now.getHours(),
        m=now.getMinutes(),
        s=now.getSeconds(),
        ms=now.getMilliseconds();
        return (h+":"+m+":"+s+ " " +ms);
    }


    // 鼠标移入
    function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "'  onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_"+treeNode.tId);
        // 添加节点
        // 添加部门 点击添加按钮，出现添加弹窗
        if (btn) btn.bind("click", function(){
            console.log(treeNode);
            reset();
            departId=treeNode.id;
            console.log(departId);
            userList(0,20);
            selectList();
            return false;
        });

    }

    // 鼠标移出
    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_"+treeNode.tId).unbind().remove();
    }


    $(document).ready(function(){
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        $("#selectAll").bind("click", selectAll);
    });


}

// 重置
function reset(){
    $('.userFilter input').val('');
    $('.userFilter select').val('');
    $(".selectpicker ").select2();
    $('#selectAll').attr('checked',false);
    userList(0,20);
}


// 全选按钮改变时
$('#selectAll').change(function(){
    selectAll();
});

// 全选
function selectAll(){
    if($('#selectAll').prop('checked')){//全选按钮选中时
        $('#userList').find(':checkbox').prop('checked',true);
         $('#userList').find(':checkbox').prop('disabled',true);
        $('.manyuser').html(window.total);

    }else{//全选按钮没选中
         $('#userList').find(':checkbox').prop('checked',false);
         $('#userList').find(':checkbox').prop('disabled',false);
        $('.manyuser').html('0');
    }

}

//$('body').on('change',$('#userList').find('input:checked'),function(){
$('#userList').on('change',$('input:checked'),function(){
var checkeds=$('#userList').find('input:checked');
     $('.manyuser').html(checkeds.length);
});


// 新建用户
function addUser(){
    window.location.href="/view/setting/usermanagement/add.html";
}
//编辑/查看用户
function editUser(id){
    window.location.href="/view/setting/usermanagement/edit.html?oid="+id;
}
// 用户列表
function userList(page,size){

    var data={
        departId:departId,
        pageIndex:page,
        pageSize:size,
        job:$('#position').val(),
        roleId:$('#role').val(),
        upperId:$("#shangji").val(),
        userName:$('#userName').val()
    }
    MaskUtil.Loading();
    API.queryUserList(data,function(data){
    // 取消勾选全选按钮
    $('#selectAll').attr('checked',false);
        if(data.code&&data.code==200){
          console.log(data);
          var obj=data.data.pageData.list;
          var str='';
          window.total=data.data.pageData.page.total;

          if(obj.length){
            $.each(obj,function(index,item){
                var status=isNull(item.status);
                var statuscon='';
                if(status==1){
                    statuscon='<td class="green">正常</td>'
                }else if(status==0){
                     statuscon='<td class="red">暂停</td>'
                }else if(status==2){
                     statuscon='<td>审核</td>'
                }else if(status==9){
                     statuscon='<td >删除</td>'
                }

                var roleIds='';//roleIds\
                var chak='';//查看
                var seelog = '';//查看操作日志
                var seepower = '';//查看权限
                if(item.roleIds){
                     roleIds=item.roleIds.join(',')
                }
                //用户管理--查看详情
                if(hasPermission("user","GET")){
                    chak = '<span onclick="editUser('+item.id+')">'+isNull(item.userName)+'</span>';
                    seelog = '<a href="javascript:;"  data-container="body" data-toggle="popover" data-placement="top" data-content="查看操作日志" onclick="viewLog('+item.id+')"><i class="icon icon-rizhi"></i></a>';
                    seepower = '<a href="javascript:;" data-container="body" data-toggle="popover" data-placement="top" data-content="查看权限" onclick="viewPower('+item.id+')"><i class="icon icon-quanxian"></i></a>';
                }else{
                    chak = '<span>'+isNull(item.userName)+'</span>';
                    seelog = '<a><i class="icon icon-rizhi disabled"></i></a>';
                    seepower = '<a><i class="icon icon-quanxian disabled"></i></a>';
                }
                str+='<tr>'+
                      '  <td><input class="checkname" data-roleId="'+roleIds+'" data-id="'+item.id+'" type="checkbox"/>'+chak+
                      '  </td>'+
                      '  <td>'+isNull(item.email)+'</td>'+
                      '  <td>'+isNull(item.mobile)+'</td>'+
                      '  <td>'+isNull(item.departName)+'</td>'+
                      '  <td>'+isNull(item.job)+'</td>'+
                      '  <td>'+isNull(item.upperName)+'</td>'+
                      '  <td>'+isNull(item.roleName)+'</td>'+statuscon+
                      '  <td class="textcenter">'+
                              seelog+'<i class="shugang">|</i>'+seepower+
                      '  </td>'+
                      ' </tr>'
            })
            $('#userList tbody').html(str);
            if(page==0){
                $('.ui-paging-container').eq(0).remove();
                $('#userListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                    userList(page,size);
                    selectAll()
                }});
            }

          }else{
            $('#userList tbody').html('<tr><td colspan="9" class="textcenter"><i class="icon icon-icon nodata"></i>暂无数据</td></tr>');
          }
        }
        $("[data-toggle='popover']").popover({trigger:"hover"});
        MaskUtil.RemoveLoading();
    })
}

// 查看操作日志
function viewLog(id){
    window.location.href="/view/setting/usermanagement/viewLog.html?oid="+id;
}
// 查看权限
function viewPower(id){
    window.location.href="/view/setting/usermanagement/viewPower.html?oid="+id;
}
// 权限分配显示弹出框
function permission(){
    $('#permissionUl').find(':checkbox').prop('checked',false);

    var modelContent=$('#permission');//弹窗最外层
    var contentInfo=$('#permission .contentInfo');//弹窗内层
    frameDiv(modelContent,contentInfo);//弹窗操作
    var roleArr=[];
    if($('#selectAll').prop('checked')){//全选状态下
        selectAll=1;
        // $('#permissionUl').find(':checkbox').prop('checked',true);
          var userchecked=$('#userList').find('input:checked');

        $.each(userchecked,function(index,item){
            $.each($(item).attr('data-roleId').split(','),function(i,u){
                roleArr.push(u)
            })

        });
        var roleArr=Array.from(new Set(roleArr));//es6数组去重

    }else{//未全选
        var userchecked=$('#userList').find('input:checked');

        $.each(userchecked,function(index,item){
            $.each($(item).attr('data-roleId').split(','),function(i,u){
                roleArr.push(u)
            })

        });
        var roleArr=Array.from(new Set(roleArr));//es6数组去重

    }

    $.each(roleArr,function(index,item){
      $('#permissionUl').find(':checkbox[id="'+item+'"]').prop('checked',true);
    })
}
// 新建角色
function addRole(){
    $('.bg').fadeOut();
    $('#permission').fadeOut();
    clearInfo();
    var modelContent=$('#addRole');//弹窗最外层
    var contentInfo=$('#addRole .contentInfo');//弹窗内层
    frameDiv(modelContent,contentInfo);//弹窗操作
}

// 删除用户
function delUser(){
    var selectAll=0;
    var idArr='';
    if($('#selectAll').prop('checked')){//全选状态下
        selectAll=1;
    }else{//未全选
        var checkeds=$('#userList').find('input:checked');

        $.each(checkeds,function(index,item){
            idArr+=$(item).attr('data-id')+','
        })
    }
    // 去掉最后一个逗号
    idArr=(idArr.substring(idArr.length-1)==',')?idArr.substring(0,idArr.length-1):idArr;
    var data={
        idList:idArr,
        isSelAll:selectAll,
        job:$('#position').val(),
        roleId:$('#role').val(),
        upperId:$("#shangji").val(),
        userName:$('#userName').val(),
        departId: window.departId
    };
    if (checkeds.length==0) {
        dcrmConfirm("请选择用户！",function(){
            userList(0,20)
        })
    }else{
         dcrmConfirm("确定删除选中的用户吗",function(){

        MaskUtil.Loading();
        API.delUser(data,function(res){
            if(res.code == 200){
                dcrmAlertSuccess(res.msg);
                $('.manyuser').html('0');
                userList(0,20)
            }else{
                dcrmAlertError(res.msg);
            }
            MaskUtil.RemoveLoading();
        })
    })
    }




}
// 权限分配保存
function permissionsure(){
    var selectAll=0;
    var userid='';
    var roleid='';
    console.log($('#selectAll').prop('checked'));
    if($('#selectAll').prop('checked')){//全选状态下
        selectAll=1;
    }else{//未全选
        var userchecked=$('#userList').find('input:checked');

        $.each(userchecked,function(index,item){
            userid+=$(item).attr('data-id')+','
        });
        // 去掉最后一个逗号
        userid=(userid.substring(userid.length-1)==',')?userid.substring(0,userid.length-1):userid;

    }

    var rolechecked=$('#permissionUl').find('input:checked');
    $.each(rolechecked,function(index,item){
        roleid+=$(item).attr('id')+','
    });
    roleid=(roleid.substring(roleid.length-1)==',')?roleid.substring(0,roleid.length-1):roleid;

    var data={
        idList:userid,
        isSelAll:selectAll,
        roleIds:roleid,
        job:$('#position').val(),
        roleId:$('#role').val(),
        upperId:$("#shangji").val(),
        userName:$('#userName').val(),
        departId: window.departId
    };
    MaskUtil.Loading();
    API.createUserRole(data,function(res){
        if(res.code == 200){
            dcrmAlertSuccess(res.msg);
            $('.bg').fadeOut();
            $('#permission').fadeOut();
            console.log( window.departId);
            $('.manyuser').html('0');
            userList(0,20)
        }else{
            dcrmAlertError(res.msg);
        }
        MaskUtil.RemoveLoading();
    })
}


// 获取下拉框
function selectList(){
    var data={
         departId: window.departId
    };
    MaskUtil.Loading();
    API.getSelData(data,function(data){
        console.log(data);
        var job=data.data.job;
        var role=data.data.role;
        var upper=data.data.upper;
        var str1='<option value="">请选择</option>';
        var str2='<option value="">请选择</option>';
        var str3='<option value="">请选择</option>';
        $.each(job,function(index,item){
            str1+='<option value="'+item+'">'+item+'</option>'
        })
        $.each(role,function(index,item){
             str2+='<option value="'+index+'">'+item+'</option>'
        })
        $.each(upper,function(index,item){
            str3+='<option value="'+index+'">'+item+'</option>'
        })
        $('#position').html(str1);
        $('#role').html(str2);
        $('#shangji').html(str3);
        MaskUtil.RemoveLoading();
    })
}

// 收起
// $('.ckmore a em').click(function(){
//     console.log($(this).val())
//     if($(this).html()=='收起'){
//         $('.ckfilter').addClass('hide');
//         $(this).html('展开')
//         $('.sanjiaojt').addClass('xiangxia')
//     }else{
//         $('.ckfilter').removeClass('hide');
//         $(this).html('收起')
//         $('.sanjiaojt').removeClass('xiangxia')
//     }

// })
// 新建角色
$('.addRoleSure').click(function(){
    var data={
        roleName:$('#roleName').val()
    };
    API.createRole(data,function(res){
         if(res.code == 200){
            //dcrmAlertSuccess(res.msg);
            queryRole(null,'permissionUl');
            $('#addRole').fadeOut();
            $('#permission').fadeIn();

        }else{
            dcrmAlertError(res.msg);
        }
    })

});
