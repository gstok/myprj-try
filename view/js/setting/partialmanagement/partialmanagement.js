
$(function(){
    $(".setli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
    $(".setli").find("ul #index_departSet").find("a").addClass("active");
    partial();
})

// 部门管理列表
function partial(){
    var data={};
    var  zNodes=[];
    // 渲染列表
    API.queryDepartment(data,function(data){
        var arr=data.data.data;
        $.each(arr,function(index,item){
            var obj={};
            obj.id=item.id;
            obj.pId=item.parentId;
            obj.name=item.departName;

            if(index==0){
                obj.open=true;
            }

            zNodes.push(obj)
        })

       console.log(zNodes)

    })


    var setting = {
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: false,
            showLine: true,//不显示连接线，默认值true
            showIcon:false,//是否显示节点的图标(包括父级的文件夹图标子级的文件图标都不显示)，默认值true
            showTitle:true,//是否显示节点的title提示信息,默认为true（如果 setting.view.showTitle = true & setting.data.key.title = ''，zTree 会自动使用 setting.data.key.name 指定的节点名称当做 title）
            //fontCss:个性化文字样式,JSON格式的数据
            //fontCss: {'font-weight':'bold','color':'#058'}//统一设置样式
            // fontCss:getFontCss,//设置自定义的样式
            nameIsHTML:true//设置name属性是否支持HTML脚本，默认值为false
        },

        edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: function(){
                //部门管理--删除
                if(hasPermission("depart", "DEL")){
                    return true;
                }else{
                    return false;
                }
            },
            showRenameBtn: function(){
                //部门管理--编辑
                if(hasPermission("depart", "UPDATE")){
                    return true;
                }else{
                    return false;
                }
            },
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
            beforeDrag: beforeDrag,
            beforeEditName: beforeEditName,
            beforeRemove: beforeRemove,
            beforeRename: beforeRename,
            onRemove: onRemove,
            onRename: onRename
        }
    };
    var log, className = "dark";
    function beforeDrag(treeId, treeNodes) {
        return false;
    }
    function hover(treeId, treeNodes) {
        console.log(treeNodes)
    }
    function beforeEditName(treeId, treeNode) {
        className = (className === "dark" ? "":"dark");
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.editName(treeNode);
        //alert(treeNode.name);
        clearInfo();
        console.log($("#"+treeNode.tId+"_span").html());
        $("#"+treeNode.tId+"_span").find("input").blur();
        var modelContent=$('#addPartial');//弹窗最外层
        var contentInfo=$('#addPartial .contentInfo');//弹窗内层
        frameDiv(modelContent,contentInfo);//弹窗操作
        $("#partName").html("编辑部门");
        $("#addPartialName").val(treeNode.name);
        return false;
    }

    // 删除节点之前
    function beforeRemove(treeId, treeNode) {
        className = (className === "dark" ? "":"dark");
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        console.log(treeNode.id)//获取当前节点id
        return confirm("确认删除" + treeNode.name + " 吗？");
    }
    // 删除节点
    function onRemove(e, treeId, treeNode) {

        var data={
            id:treeNode.id
        }
        API.delDepartment(data,function(data){
            if(data&&data.code==200){
                dcrmAlertSuccess(data.msg);
            }else{
                dcrmAlertSuccess(data.msg);
            }
        })
    }

    // 编辑名称
    function beforeRename(treeId, treeNode, newName, isCancel) {
        return true;
    }
    function onRename(e, treeId, treeNode, isCancel) {
        $('.addPartialSure').unbind('click').click(function(){
            //编辑部门
            var newName = $("#addPartialName").val();
            var data={
                departName:newName,
                id:treeNode.id
            };
            if (newName.length == 0) {
                dcrmAlertError("部门名称不能为空");
                return false;
            }
            API.updateDepartment(data,function(data){
                if(data&&data.code==200){
                    dcrmAlertSuccess(data.msg);
                    $('#addPartial,.bg').fadeOut();
                    window.location.reload();//刷新列表


                    }else{
                    dcrmAlertSuccess(data.msg);
                }
            })

        });}


    var newCount = 1;

    // 鼠标移入
    function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
        var addStr;
        if(hasPermission("depart", "ADD")){
            addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='添加' onfocus='this.blur();'></span>";
        }else{
            addStr = '';
        }
        sObj.after(addStr);
        var btn = $("#addBtn_"+treeNode.tId);
        // 添加节点
        // 添加部门 点击添加按钮，出现添加弹窗
        if (btn) btn.bind("click", function(){
            clearInfo();
            var modelContent=$('#addPartial');//弹窗最外层
            var contentInfo=$('#addPartial .contentInfo');//弹窗内层
            frameDiv(modelContent,contentInfo);//弹窗操作

            $("#partName").html("新建部门");
            // 点击弹窗确定按钮，调添加接口
            $('.addPartialSure').unbind('click').click(function(){
                $('#addPartial').fadeOut();
                $('.bg').fadeOut();
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                // 插件默认的赋值不需要
                // zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
                console.log(treeNode)//被添加的当前父节点
                var data={
                    departName:$('#addPartialName').val(),
                    parentId:treeNode.id
                }
                API.createDepartment(data,function(data){
                    if(data&&data.code==200){

                      var znodes=data.data.data;
                      // 添加之后，将zTree赋值。
                      zTree.addNodes(treeNode, {id:znodes.id, pId:znodes.parentId, name:znodes.departName});
                    }else{
                        dcrmAlertSuccess(data.msg);
                    }
                })
            })
            return false;
        });

    };

    // 鼠标移出
    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_"+treeNode.tId).unbind().remove();
    };

    function selectAll() {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
    }

    $(document).ready(function(){
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        $("#selectAll").bind("click", selectAll);
    });

    //beforeDrag方法：在拖拽之前，先判断该节点能否被拖拽，能拖拽的才会继续后续操作，否则直接退出拖拽功能
    function beforeDrag(treeId, treeNodes) {
        className = (className === "dark" ? "":"dark");
        for (var i=0,l=treeNodes.length; i<l; i++) {
            if (treeNodes[i].drag === false) {
                curDragNodes = null;
                return false;
            } else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
                curDragNodes = null;
                return false;
            }
        }
        curDragNodes = treeNodes;
        return true;
    }

    //beforeDrop方法：在添加到目标节点下之前，判断目标节点是否存在（这里限制了对于根节点的添加），若存在则判断目标节点下是否已存在相同的节点
    function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
        //如果有提交到后台的操作，则会先执行if…else…再执行post等提交操作
        if(targetNode) {
            if(targetNode.children != undefined){
                //console.log(targetNode.children[0].name)
                //var nodes = targetNode.children;
                var name = treeNodes[0].name;
                for (i = 0; i < targetNode.children.length; i++) {
                    if(targetNode.children[i].name == name){
                        alert("Error: This name already exists.");
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

    //onDrop方法：在加入到目标节点时，一并将信息提交给后台进行更新
    function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
        className = (className === "dark" ? "":"dark");
        //拖拽成功时，修改被拖拽节点的pid
        if(treeNodes && targetNode){
            $.post('./index.php?r=selenium/updatePId&id='+treeNodes[0].id+"&pid="+targetNode.id)
            rightContent(treeNodes[0]); //调用右半部分
        }
    }
}



// // 职位列表
// function position(){
//    queryPosition(0,20)
// }

// function queryPosition(pageIndex,pageSize){
//     var data={
//         pageIndex:pageIndex,
//         pageSize:pageSize
//     };

//     API.queryPosition(data,function(data){
//         if(data&&data.code==200){
//             console.log(data)
//             var arr=data.data.pageData.list;
//             var str='<li><input type="text" placeholder="输入职位名称" id="positionName"><a href="javascript:;" class="btn btn-primary" onclick="addPosition()">+添加</a>'+
//                 '</li>';
//             $.each(arr,function(index,item){
//                 str+='<li><span class="cont fl">'+item.positionName+'</span>'+
//                  '           <span class="caozuo fr">'+
//                  '           <a href="javascript:;" onclick="editPosition('+item.id+',\''+item.positionName+'\')" data-container="body" data-toggle="popover" data-placement="top" data-content="编辑客户"><i class="icon icon-bianji"></i></a><i class="shugang">|</i>'+
//                  '           <a href="javascript:;" onclick="delPosition('+item.id+')" data-container="body" data-toggle="popover" data-placement="top" data-content="删除"><i class="icon icon-shanchu"></i></a>'+
//                  '           </span>'+
//                  '       </li>'
//             })
//             $('.positionList').html(str)
//         }

//     })
// }
// // 新建职位
// function addPosition(){
//     var data={
//         positionName:$('#positionName').val()
//     }
//     API.addPosition(data,function(data){
//         if(data&&data.code==200){
//             dcrmAlertSuccess(data.msg)
//             queryPosition(0,20)
//         }else{
//             dcrmAlertErrer(data.msg)
//         }
//     })
// }
// // 编辑显示
// function editPosition(id,iname){

//     clearInfo();
//     var modelContent=$('#editPosition');//弹窗最外层
//     var contentInfo=$('#editPosition .contentInfo');//弹窗内层
//     frameDiv(modelContent,contentInfo);//弹窗操作
//     window.editPositionId=id;
//     $('#positionNameEdit').val(iname)
// }
// // 编辑职位
// function editSure(){
//     var data={
//         id:window.editPositionId,
//         positionName:$('#positionNameEdit').val()
//     }
//     console.log(data)
//     API.updatePosition(data,function(data){
//         if(data&&data.code==200){
//             dcrmAlertSuccess(data.msg)
//             queryPosition(0,20)
//             $('#editPosition').fadeOut();
//             $('.bg').fadeOut();
//         }else{
//             dcrmAlertErrer(data.msg)
//         }
//     })
// }
// // 删除职位
// function delPosition(id){
//     var data={
//         id:id
//     }
//     dcrmConfirm("您确定要删除该短信签名吗？",function(){
//         API.delPosition(data,function(data){
//              if(data&&data.code==200){
//                 dcrmAlertSuccess(data.msg)
//                 queryPosition(0,20)
//             }else{
//                 dcrmAlertErrer(data.msg)
//             }
//         })
//     })

// }

