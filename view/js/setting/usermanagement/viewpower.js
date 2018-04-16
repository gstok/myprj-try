$(function(){
    $(".setli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
    $(".setli").find("ul #index_userSet").find("a").addClass("active");
});
var oid=window.location.search.split('=')[1];
function returnback(){
	window.location.href="/view/setting/usermanagement/usermanagement.html";
}
getUserRes();
        function getUserRes(){
            var data = {
                userId:oid
            };
            var  zNodes=[];
            MaskUtil.Loading();
            API.getUserRes(data, function(res) {
                if (res.code == 200) {
                    if(res.data){
                        var obj = res.data.data;
                        $.each(obj,function(i,item){
                            if(item.parentId){
                                var arr = {};
                                arr.id = item.id;
                                arr.pId = item.parentId;
                                arr.name = item.resName;
                                if(i==0){
                                    arr.open=true;
                                }

                                zNodes.push(arr);
                            }

                        })
                    }else{
                        alert(res.msg);
                        returnback();
                    }
                    console.log(zNodes);
                    var setting = {
                        view: {
                            addHoverDom: false,
                            removeHoverDom: false,
                            selectedMulti: false
                        },
                        edit: {
                            enable: false,
                            editNameSelectAll: true,
                            showRemoveBtn: false,
                            showRenameBtn: false
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

                    //删除之前
                    function beforeRemove(treeId, treeNode) {
                        className = (className === "dark" ? "":"dark");
                        showLog("[ beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.selectNode(treeNode);
                        return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
                    }
                    //删除
                    function onRemove(e, treeId, treeNode) {
                        var data={
                            id:treeNode.id
                        };
                        API.delSysRes(data,function(data){
                            if(data&&data.code==200){
                                dcrmAlertSuccess(data.msg);
                                showLog("[ onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
                            }else{
                                dcrmAlertSuccess(data.msg);
                            }
                        })
                    }
                    /*function onRemove(e, treeId, treeNode) {
                        showLog("[ onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
                    }*/
                    function beforeEditName(treeId, treeNode) {
                        className = (className === "dark" ? "":"dark");
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.selectNode(treeNode);
                        setTimeout(function() {
                            if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
                                setTimeout(function() {
                                    vm.pShow = true;
                                    zTree.editName(treeNode);
                                    $(".curSelectedNode").removeClass("curSelectedNode_Edit");
                                    var data = {
                                        id:treeNode.id
                                    };
                                    API.getResById(data,function(data){
                                        var obj = data.data.data;
                                        if(data && data.code==200){
                                            $("#resCode").val(obj.resCode);
                                            $("#resName").val(obj.resName);
                                            $("input[name='resType']").each(function(){
                                                if($(this).val() == obj.resType){
                                                    $(this).prop( "checked", true );
                                                }
                                            });
                                            $("#resUrl").val(obj.resUrl);
                                        }else{
                                            dcrmAlertSuccess(data.msg);
                                        }
                                    });
                                }, 0);
                            }
                        }, 0);
                        return false;
                    }
                    function beforeRename(treeId, treeNode, newName, isCancel) {
                        className = (className === "dark" ? "":"dark");
                        showLog((isCancel ? "<span style='color:red'>":"") + "[ beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
                        /*if (newName.length == 0) {
                            setTimeout(function() {
                                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                zTree.cancelEditName();
                                dcrmAlertWarning("节点名称不能为空.");
                            }, 0);
                            return false;
                        }*/
                        return true;
                    }
                    //编辑
                    function onRename(e, treeId, treeNode, isCancel) {
                        $('.popleSure').unbind('click').click(function(){
                            var resName = $("#resName").val();
                            var data = {
                                id:treeNode.id,
                                parentId:treeNode.parentId,
                                resName:resName
                            };
                            if(resName == ''){
                                dcrmAlertWarning("节点名称不能为空!");
                                return;
                            }
                            API.updateSysRes(data,function(data){
                                if(data && data.code==200){
                                    dcrmAlertSuccess(data.msg);
                                    vm.querySysRes();//刷新菜单列表
                                    //showLog((isCancel ? "<span style='color:red'>":"") + "[ onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
                                }else{
                                    dcrmAlertSuccess(data.msg);
                                }
                            });
                        });
                        //showLog((isCancel ? "<span style='color:red'>":"") + "[ onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
                    }
                    /*function showRemoveBtn(treeId, treeNode) {
                        return !treeNode.isFirstNode;
                    }
                    function showRenameBtn(treeId, treeNode) {
                        return !treeNode.isLastNode;
                    }*/
                    function showLog(str) {
                        if (!log) log = $("#log");
                        log.append("<li class='"+className+"'>"+str+"</li>");
                        if(log.children("li").length > 8) {
                            log.get(0).removeChild(log.children("li")[0]);
                        }
                    }
                    //添加
                    function addHoverDom(treeId, treeNode) {
                        var sObj = $("#" + treeNode.tId + "_span");
                        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
                        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                            + "' title='add node' onfocus='this.blur();'></span>";
                        sObj.after(addStr);
                        var btn = $("#addBtn_"+treeNode.tId);
                        //点击添加按钮，右侧弹窗显示
                        if (btn) btn.bind("click", function(){
                            vm.pShow = true;
                            clearInfo();
                            //先获取不可编辑项
                            var data = {
                                id:treeNode.id
                            };
                            API.getResById(data,function(data){
                                var obj = data.data.data;
                                if(data && data.code==200){
                                    $("#resCode").val(obj.resCode).attr("readonly",true);
                                    (obj.parentId == null) ? $("#parentId").val(" ") : $("#parentId").val(obj.parentId);
                                    $("#parentId").attr("readonly",true);
                                    alert(obj.resType);
                                    $(".addPopup input[name='resType'][value='"+obj.resType+"']").attr('checked', true);
                                    alert($(".addPopup input[name='resType'][value='"+obj.resType+"']").attr());

                                }else{
                                    dcrmAlertSuccess(data.msg);
                                }
                            });
                            // 点击弹窗确定按钮，调添加接口
                            $('.popleSure').unbind('click').click(function(){
                                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                // 插件默认的赋值不需要
                                // zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
                                console.log(treeNode);//被添加的当前父节点
                                var parentId = treeNode.id,
                                    resCode = $("#resCode").val(),
                                    resName = $('#resName').val(),
                                    resType = $('#resType').val(),
                                    resUrl = $('#resUrl').val();
                                var data={
                                    parentId:parentId,
                                    resCode:resCode,
                                    resName:resName,
                                    resType:resType,
                                    resUrl:resUrl
                                };
                                if($('#menuName').val() == ''){
                                    dcrmAlertWarning("菜单名称不能为空！");
                                    return;
                                }
                                API.createSysRes(data,function(data){
                                    if(data && data.code==200){
                                        vm.pShow = false;
                                        dcrmAlertSuccess("添加成功");
                                        vm.querySysRes();//刷新菜单
                                        //var znodes = data.data.data;
                                        // 添加之后，将zTree赋值。
                                        //zTree.addNodes(treeNode, {id:znodes.id, pId:znodes.parentId, name:znodes.menuName});
                                    }else{
                                        dcrmAlertError(data.msg);
                                    }
                                })
                            })
                        });
                    }
                    function removeHoverDom(treeId, treeNode) {
                        $("#addBtn_"+treeNode.tId).unbind().remove();
                    }
                    function selectAll() {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
                    }

                    $(document).ready(function(){
                        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                        $("#selectAll").bind("click", selectAll);
                    });
                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        }