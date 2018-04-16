$(function(){
    $(".setli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
    $(".setli").find("ul #index_menuSet").find("a").addClass("active");
    vm.querySysRes();//获取菜单
});




var vm = new Vue({
    el: "#menupage",
    data: {
        title:'',//复制的标题
        pShow:false,//复制弹窗
        iconShow:true,//icon是否显示
        classShow:true//菜单class是否显示
    },
    methods: {
        //权限按钮
        hasPermission:function(module, code) {
            if (Global.isAdmin == 1) {
                return true;
            }
            if (!Global.permissionStatus) {
                return true;
            }
            if (Global.modulePerMap[module] && Global.modulePerMap[module].has(code)) {
                return true;
            } else {
                return false;
            }
        },
        //获取菜单
        querySysRes:function(open){
            var data = {};
            var  zNodes=[];
            MaskUtil.Loading();
            API.querySysRes(data, function(res) {
                if (res.code == 200) {
                    var obj = res.data.data;
                    $.each(obj,function(i,item){
                        if(item.resType!=4){
                            var arr = {};
                            arr.id = item.id;
                            arr.pId = item.parentId;
                            arr.name = item.resName;

                            if(i==0){
                                arr.open=true;
                            }
                            if(open && arr.id == open){
                                arr.open=true;
                            }
                            zNodes.push(arr);
                        }
                    });

                    //console.log(zNodes);

                    var setting = {
                        view: {
                            addHoverDom: addHoverDom,//是否显示添加按钮
                            removeHoverDom: removeHoverDom,
                            selectedMulti: false
                        },
                        edit: {
                            enable: true,
                            editNameSelectAll: true,
                            showRemoveBtn: showRemoveBtn,//是否显示删除按钮
                            showRenameBtn: showRenameBtn
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
                        //showLog("[ beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.selectNode(treeNode);
                        return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");

                    }
                    function removeHoverDom(treeId, treeNode) {
                        $("#addBtn_"+treeNode.tId).unbind().remove();
                    }
                    //删除
                    function onRemove(e, treeId, treeNode) {
                            var data = {
                                id:treeNode.id
                            };
                            //dcrmConfirm("确认删除 节点 -- " + treeNode.name + " 吗？",function(){
                                API.delSysRes(data, function(res) {
                                    if(res && res.code==200){
                                        dcrmAlertSuccess(res.msg);
                                        //showLog("[ onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
                                    }else{
                                        dcrmAlertError(res.msg);
                                    }
                                });
                            //});
                    }
                    /*function onRemove(e, treeId, treeNode) {
                        showLog("[ onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
                    }*/
                    function beforeEditName(treeId, treeNode) {
                        className = (className === "dark" ? "":"dark");
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        //zTree.selectNode(treeNode);

                        vm.pShow = true;

                        zTree.editName(treeNode);
                        console.log($("#"+treeNode.tId+"_span").html());
                        $("#"+treeNode.tId+"_span").find("input").blur();
                        $("input[name='resType']").prop( "checked", false );
                        var data = {
                            id:treeNode.id
                        };
                        API.getResById(data,function(data){
                            var obj = data.data.data;
                            if(data && data.code==200){
                                $("#resCode").val(obj.resCode);
                                $("#icon").val(obj.icon);
                                $("#resClass").val(obj.resClass);
                                $("#parentId").val(obj.parentId);
                                $("#resName").val(obj.resName);
                                $("input[name='resType'][value='"+obj.resType+"']").prop("checked",true);
                                $("#resUrl").val(obj.resUrl);
                                $("#appCode").val(obj.appCode);
                                $("#"+treeNode.tId+"_span").find("input").val(obj.resName).attr("readonly",true).css({
                                    "border":"transparent","background":"transparent"
                                });
                                if(obj.resType != 1){
                                    vm.iconShow = false
                                }else{
                                    vm.iconShow = true
                                }
                                if(obj.resType == 1 || obj.resType == 2){
                                    vm.classShow = true
                                }else{
                                    vm.classShow = false
                                }
                            }else{
                                dcrmAlertSuccess(data.msg);
                            }
                        });
                        return false;
                    }
                    function beforeRename(treeId, treeNode, newName, isCancel) {
                        className = (className === "dark" ? "":"dark");

                        //showLog((isCancel ? "<span style='color:red'>":"") + "[ beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
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
                                parentId:$("#parentId").val(),
                                resName:resName,
                                resCode:$("#resCode").val(),
                                icon:$("#icon").val(),
                                resClass:$("#resClass").val(),
                                resType:$('input[name="resType"]:checked').val(),
                                resUrl:$("#resUrl").val(),
                                appCode:$("#appCode").val()
                            };
                            if(resName == ''){
                                dcrmAlertWarning("节点名称不能为空!");
                                return;
                            }
                            API.updateSysRes(data,function(data){
                                //var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                if(data && data.code==200){
                                    vm.pShow = false;
                                    dcrmAlertSuccess(data.msg);
                                    vm.querySysRes(treeNode.pId);//刷新菜单
                                    //console.log(treeNode);


                                    //var znodes = data.data.data;
                                    //$("#"+treeNode.tId+"_span").html(znodes.resName);
                                    //$("#"+treeNode.tId+"_span").find("input").val(znodes.resName);
                                    }else{
                                    dcrmAlertSuccess(data.msg);
                                }
                            });
                        });
                        //showLog((isCancel ? "<span style='color:red'>":"") + "[ onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
                    }
                    function showRemoveBtn(treeId, treeNode) {
                        var sObj = $("#" + treeNode.tId + "_span");
                        if(sObj.parent().hasClass('level0')||sObj.parent().hasClass('level4')||(!hasPermission("res", "DEL"))){
                            return false;
                        }else{
                            return true;
                        }
                        //return !treeNode.isFirstNode;
                    }
                    function showRenameBtn(treeId, treeNode) {
                        var sObj = $("#" + treeNode.tId + "_span");
                        if(sObj.parent().hasClass('level0')||sObj.parent().hasClass('level4')||(!hasPermission("res", "UPDATE"))){
                            return false;
                        }else{
                            return true;
                        }
                        // return !treeNode.isLastNode;
                    }
                    /*function showLog(str) {
                        if (!log) log = $("#log");
                        log.append("<li class='"+className+"'>"+str+"</li>");
                        if(log.children("li").length > 8) {
                            log.get(0).removeChild(log.children("li")[0]);
                        }
                    }*/
                    //添加
                    function addHoverDom(treeId, treeNode) {
                        var sObj = $("#" + treeNode.tId + "_span");
                        //if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
                        if(sObj.parent().hasClass('level3')||sObj.parent().hasClass('level4')||treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0){
                            return false;
                        }
                        var addStr = '';
                        if(hasPermission("res", "ADD")){
                            addStr = "<span class='button add  res' data-power='ADD' id='addBtn_" + treeNode.tId
                            + "' title='添加' onfocus='this.blur();'></span>";
                        }else{
                            addStr = '';
                        }
                        sObj.after(addStr);
                        var btn = $("#addBtn_"+treeNode.tId);
                        //点击添加按钮，右侧弹窗显示
                        if (btn) btn.bind("click", function(){
                            var data = {
                                id:treeNode.id
                            };
                            API.getResById(data,function(data){
                                if(data && data.code==200){
                                    var obj = data.data.data;
                                    vm.pShow = true;
                                    $("#resName, #resUrl,#icon,#resClass").val("");
                                    $("input[name='resType']").prop( "checked", false );
                                    /*if(obj.resCode == null){
                                        $("#resCode").val("1");
                                    }else{
                                        $("#resCode").val(parseInt(obj.resCode)+1);
                                    }*/
                                    $("#resCode").val(obj.resCode);
                                    $("#parentId").val(obj.id);
                                    var resType;
                                    if(obj.resType == null){
                                        resType = 1;
                                    }else{
                                        resType = parseInt(obj.resType)+1;
                                    }

                                    console.log(resType);
                                    if(resType != 1){
                                        vm.iconShow = false
                                    }else{
                                        vm.iconShow = true
                                    }
                                    if(resType == 1 || resType == 2){
                                        vm.classShow = true
                                    }else{
                                        vm.classShow = false
                                    }
                                    $("input[name='resType'][value='"+resType+"']").prop("checked",true);

                                }else{
                                    dcrmAlertSuccess(data.msg);
                                }
                            });
                            // 点击弹窗确定按钮，调添加接口
                            $('.popleSure').unbind('click').click(function(){
                                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                // 插件默认的赋值不需要
                                console.log(treeNode);//被添加的当前父节点
                                var parentId = treeNode.id,
                                    resCode = $("#resCode").val(),
                                    icon = $("#icon").val(),
                                    resClass = $("#resClass").val(),
                                    resName = $('#resName').val(),
                                    resType = $('input[name="resType"]:checked').val(),
                                    resUrl = $('#resUrl').val();
                                var data={
                                    parentId:parentId,
                                    resCode:resCode,
                                    icon:icon,
                                    resClass:resClass,
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
                                        vm.querySysRes(treeNode.id);//刷新菜单
                                        //console.log(treeNode);
                                        //var znodes = data.data.data;
                                        // 添加之后，将zTree赋值。
                                        //zTree.addNodes(treeNode, {id:znodes.id, pId:znodes.parentId, name:znodes.resName});

                                    }else{
                                        dcrmAlertError(data.msg);
                                    }
                                })
                            })
                        });
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
    }
});











