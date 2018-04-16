$(function(){
    $(".setli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
    $(".setli").find("ul #index_roleSet").find("a").addClass("active");
    vm.queryMyCreateRoles();//获取角色列表
    if(window.location.search.split('&&')[0]){
      var roleId=window.location.search.split('&&')[0].split('=')[0];
      var oid=window.location.search.split('&&')[0].split('=')[1];
    }

    if(window.location.search.split('&&')[1]){
      var name=unescape(window.location.search.split('&&')[1].split('=')[1]);
    }

    console.log(roleId)
    if(roleId=='?roleId'){
        console.log(unescape(name))
        vm.roleOperation(oid,unescape(name))
        $('.indexList').click();
    }
});



var vm = new Vue({
    el: "#rolepage",
    data: {
        popTit: '',//弹窗标题
        type: '',//类型（复制--1，编辑--2）
        addroleName: '',//新建角色名称
        roleName: '',//复制-编辑角色名称
        querySceneLists: [],//场景列表
        MyCreateRoles: [],//角色列表
        roleNameid: '',//编辑-复制时需用到的角色的id---点击角色需要用到的id
        showRoleName: '',//选中的角色名称，右边h2展示，默认显示第一个
        resIds: '',//操作目录ids
        apiIds: '',//功能id
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

        //获取角色列表
        queryMyCreateRoles: function () {
            MaskUtil.Loading();
            API.queryMyCreateRoles({}, function (res) {
                if (res.code == 200) {
                    vm.MyCreateRoles = res.data.list;
                    //vm.showRoleName = res.data.list[0].roleName;
                } else {
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
                setTimeout(function () {
                    $("[data-toggle='popover']").popover({trigger: "hover"});
                }, 500)
            });
        },
        //点击角色
        roleOperation: function (id, roleName) {
            this.showRoleName = roleName;
            vm.roleNameid = id;
            vm.queryResByUserId();//获取菜单列表
            vm.querySceneList();
        },
        //弹窗操作
        popup: function () {
            var modelContent = $('#editRole');//弹窗最外层
            var contentInfo = $('#editRole .contentInfo');//弹窗内层
            frameDiv(modelContent, contentInfo);//弹窗操作
        },
        //新建角色弹窗
        addPopup: function () {
            var that = this;
            if (vm.addroleName == '') {
                dcrmAlertWarning("角色名称不能为空!");
                return false;
            }
            var data = {
                roleName: vm.addroleName
            };
            API.createRole(data, function (res) {
                if (res.code == 200) {
                    dcrmAlertSuccess("新增成功!");
                    that.addroleName = '';
                    that.queryMyCreateRoles();//刷新角色列表
                } else {
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //复制弹窗
        copyPopup: function (id, roleName) {
            this.$options.methods.popup();//弹窗操作
            this.roleNameid = id;
            this.roleName = roleName;
            this.popTit = '复制角色';
            this.type = 1;
        },
        //编辑弹窗
        editPopup: function (id, roleName) {
            this.$options.methods.popup();//弹窗操作
            this.roleNameid = id;
            this.roleName = roleName;
            this.popTit = '编辑角色';
            this.type = 2;
        },
        //复制、编辑----确定按钮
        sureData: function (type) {
            var that = this;
            var data = {
                id: vm.roleNameid,
                roleName: vm.roleName
            };
            if (vm.roleName == '') {
                dcrmAlertWarning("角色名称不能为空!");
                return false;
            }
            MaskUtil.Loading();
            if (type == 1) {//复制
                API.copyRole(data, function (res) {
                    if (res.code == 200) {
                        dcrmAlertSuccess("复制成功!");
                        that.closeData();//关闭弹窗
                        that.queryMyCreateRoles();//刷新角色列表
                    } else {
                        dcrmAlertError(res.msg);
                    }
                    MaskUtil.RemoveLoading();
                });
            }
            if (type == 2) {//编辑
                API.updateRole(data, function (res) {
                    if (res.code == 200) {
                        dcrmAlertSuccess("编辑成功!");
                        that.closeData();//关闭弹窗
                        that.queryMyCreateRoles();//刷新角色列表
                    } else {
                        dcrmAlertError(res.msg);
                    }
                    MaskUtil.RemoveLoading();
                });
            }
        },
        //删除
        deleteData: function (id, roleName) {
            var that = this;
            var data = {
                id: id
            };
            dcrmConfirm("您确定要删除角色'" + roleName + "'吗？", function () {
                MaskUtil.Loading();
                API.delRole(data, function (res) {
                    if (res.code == 200) {
                        dcrmAlertSuccess("删除成功!");
                        that.queryMyCreateRoles();//刷新角色列表
                    } else {
                        dcrmAlertError(res.msg);
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        },
        //关闭弹窗
        closeData: function () {
            $('#editRole, .bg').fadeOut();
        },
        //获取菜单列表
        queryResByUserId: function () {
            var data = {
                roleId: vm.roleNameid
            };
            var zNodes = [];
            MaskUtil.Loading();
            API.queryResByUserId(data, function (res) {
                if (res.code == 200) {
                    var obj = res.data.list;
                    var roleResList = res.data.roleResList;
                    //console.log(roleResList);
                    var roleChecked = [];
                    $.each(roleResList, function (i, u) {
                        if (u.resName == "首页") {
                            roleChecked.push(u);
                        }
                        if (u.resType == 4) {
                            roleChecked.push(u);
                        }
                    });

                    /*$.each(obj, function (e, f) {
                        if (e == 0) {
                            obj.splice(0, 1);
                        }
                    });*/
                    $.each(obj, function (i, item) {
                        if(item.resType != null){
                            var arr = {};
                            arr.id = item.id;
                            arr.code = item.resCode;
                            arr.pId = item.parentId;
                            arr.name = item.resName;
                            /*if (i == 1) {
                             arr.open = true;
                             }*/
                            zNodes.push(arr);
                        }
                    });
                    //console.log(zNodes);
                    var setting = {
                        check: {
                            enable: true,
                            check:{
                                enable :true,
                                chkDisabledInherit :true
                            }
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            beforeExpand: beforeExpand,//为展开单一路径加上的
                            onExpand: onExpand,//为展开单一路径加上的
                            onClick: onClick,//为展开单一路径加上的
                            onCheck: onCheck
                        }
                    };
                    var code;
                    var arry = [];
                    function showCode(str) {
                        if (!code) code = $("#code");
                        code.empty();
                        code.append("<li>" + str + "</li>");
                    }
                    /*********************为展开单一路径加上的********************/
                    function singlePath(newNode) {
                        if (newNode === curExpandNode) return;

                        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                            rootNodes, tmpRoot, tmpTId, i, j, n;

                        if (!curExpandNode) {
                            tmpRoot = newNode;
                            while (tmpRoot) {
                                tmpTId = tmpRoot.tId;
                                tmpRoot = tmpRoot.getParentNode();
                            }
                            rootNodes = zTree.getNodes();
                            for (i=0, j=rootNodes.length; i<j; i++) {
                                n = rootNodes[i];
                                if (n.tId != tmpTId) {
                                    zTree.expandNode(n, false);
                                }
                            }
                        } else if (curExpandNode && curExpandNode.open) {
                            if (newNode.parentTId === curExpandNode.parentTId) {
                                zTree.expandNode(curExpandNode, false);
                            } else {
                                var newParents = [];
                                while (newNode) {
                                    newNode = newNode.getParentNode();
                                    if (newNode === curExpandNode) {
                                        newParents = null;
                                        break;
                                    } else if (newNode) {
                                        newParents.push(newNode);
                                    }
                                }
                                if (newParents!=null) {
                                    var oldNode = curExpandNode;
                                    var oldParents = [];
                                    while (oldNode) {
                                        oldNode = oldNode.getParentNode();
                                        if (oldNode) {
                                            oldParents.push(oldNode);
                                        }
                                    }
                                    if (newParents.length>0) {
                                        zTree.expandNode(oldParents[Math.abs(oldParents.length-newParents.length)-1], false);
                                    } else {
                                        zTree.expandNode(oldParents[oldParents.length-1], false);
                                    }
                                }
                            }
                        }
                        curExpandNode = newNode;
                    }
                    function createNodes(maxNodesNumInLevel, maxLevel, curLevel, curPId) {
                        if (maxNodesNumInLevel<5) {
                            maxNodesNumInLevel = 5;
                        }
                        var nodes = [], num = 0;
                        while(num<3) {
                            num = parseInt(Math.random()*1024)%maxNodesNumInLevel+1;
                        }
                        for (var i=0; i<num; i++) {
                            var id = curPId ? curPId + "-" + i : "" + i, isParent = (parseInt(Math.random()*9999)%3!=0),
                                node = {id: id, pId : curPId, name : "N" + id};
                            nodes.push(node);
                            if (isParent && curLevel<maxLevel) {
                                nodes = nodes.concat(createNodes(maxNodesNumInLevel, maxLevel, curLevel+1, id));
                            }
                        }
                        return nodes;
                    }
                    var curExpandNode = null;
                    function beforeExpand(treeId, treeNode) {
                        var pNode = curExpandNode ? curExpandNode.getParentNode():null;
                        var treeNodeP = treeNode.parentTId ? treeNode.getParentNode():null;
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        for(var i=0, l=!treeNodeP ? 0:treeNodeP.children.length; i<l; i++ ) {
                            if (treeNode !== treeNodeP.children[i]) {
                                zTree.expandNode(treeNodeP.children[i], false);
                            }
                        }
                        while (pNode) {
                            if (pNode === treeNode) {
                                break;
                            }
                            pNode = pNode.getParentNode();
                        }
                        if (!pNode) {
                            singlePath(treeNode);
                        }

                    }
                    function onExpand(event, treeId, treeNode) {
                        curExpandNode = treeNode;
                    }
                    function onClick(e,treeId, treeNode) {
                        vm.apiIds = "";
                        vm.resIds = "";
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        //zTree.expandNode(treeNode, null, null, null, true);
                        zTree.checkNode(treeNode, !treeNode.checked, true);

                        if(treeNode.code == "DEL" && treeNode.checked == true) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "GET")||(u.parentId == treeNode.pId &&u.resCode == "ADD")||(u.parentId == treeNode.pId && u.resCode == "UPDATE")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), true, true );
                            }
                        }
                        if(treeNode.code == "UPDATE" && treeNode.checked == true) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "GET")||(u.parentId == treeNode.pId &&u.resCode == "ADD")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), true, true );
                            }
                        }
                        if(treeNode.code == "UPDATE" && treeNode.checked == false) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "DEL")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), false, true );
                            }
                        }
                        if(treeNode.code == "ADD" && treeNode.checked == true) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "GET")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), true, true );
                            }
                        }
                        if(treeNode.code == "GET" && treeNode.checked == false) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "DEL")||(u.parentId == treeNode.pId &&u.resCode == "ADD")||(u.parentId == treeNode.pId && u.resCode == "UPDATE")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), false, true );
                            }
                        }
                        if(treeNode.code == "ADD" && treeNode.checked == false) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "DEL")||(u.parentId == treeNode.pId && u.resCode == "UPDATE")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), false, true );
                            }
                        }
                        if(treeNode.code == "UPDATE" && treeNode.checked == false) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "DEL")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), false, true );
                            }
                        }

                        var tree = $.fn.zTree.getZTreeObj("treeDemo"),
                            nodes = tree.getCheckedNodes(true);
                        console.log(nodes);
                        if(nodes.length>0){
                            var _apiIds = '';
                            var _resIds = '';
                            for (var i = 0; i < nodes.length; i++) {
                                //nodes[i].id; //获取选中节点的值
                                $.each(obj, function (index, item) {
                                    if (nodes[i].id == item.id) {
                                        //console.log(item.resCode);
                                        if(item.resName == "首页"){
                                            _apiIds += item.id + ',';//功能
                                        }
                                        if (item.resType == 4 ) {
                                            _apiIds += item.id + ',';//功能
                                        } else {
                                            _resIds += item.id + ',';//目录
                                        }
                                    }
                                });
                                vm.apiIds = _apiIds;
                                vm.resIds = _resIds;
                            }
                        }

                        // 去掉最后一个逗号
                        vm.apiIds = (vm.apiIds.substring(vm.apiIds.length - 1) == ',') ? vm.apiIds.substring(0, vm.apiIds.length - 1) : vm.apiIds;
                        vm.resIds = (vm.resIds.substring(vm.resIds.length - 1) == ',') ? vm.resIds.substring(0, vm.resIds.length - 1) : vm.resIds;

                        console.log(vm.apiIds);
                        //console.log(vm.resIds);
                    }
                    /*********************为展开单一路径加上的********************/



                    function onCheck(e, treeId, treeNode) {
                        vm.apiIds = "";
                        vm.resIds = "";

                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");

                        console.log(treeNode);
                        if(treeNode.code == "DEL" && treeNode.checked == true) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "GET")||(u.parentId == treeNode.pId &&u.resCode == "ADD")||(u.parentId == treeNode.pId && u.resCode == "UPDATE")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), true, true );
                            }
                        }
                        if(treeNode.code == "UPDATE" && treeNode.checked == true) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "GET")||(u.parentId == treeNode.pId &&u.resCode == "ADD")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), true, true );
                            }
                        }
                        if(treeNode.code == "UPDATE" && treeNode.checked == false) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "DEL")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), false, true );
                            }
                        }
                        if(treeNode.code == "ADD" && treeNode.checked == true) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "GET")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), true, true );
                            }
                        }
                        if(treeNode.code == "GET" && treeNode.checked == false) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "DEL")||(u.parentId == treeNode.pId &&u.resCode == "ADD")||(u.parentId == treeNode.pId && u.resCode == "UPDATE")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), false, true );
                            }
                        }
                        if(treeNode.code == "ADD" && treeNode.checked == false) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "DEL")||(u.parentId == treeNode.pId && u.resCode == "UPDATE")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), false, true );
                            }
                        }
                        if(treeNode.code == "UPDATE" && treeNode.checked == false) {
                            arry = [];
                            $.each(obj, function (i, u) {
                                if ((u.parentId == treeNode.pId && u.resCode == "DEL")) {
                                    //console.log(u);
                                    arry.push(u.id);
                                }
                            });
                            //$("#"+treeNode.tId+"_check").click(AssignCheck);
                            var i = 0, l = arry.length;
                            for(i ; i < l; i ++ ) {
                                zTree.checkNode( zTree.getNodeByParam( "id",arry[i] ), false, true );
                            }
                        }

                        var tree = $.fn.zTree.getZTreeObj("treeDemo"),
                            nodes = tree.getCheckedNodes(true);//获得所有选中节点


                        if(nodes.length>0){
                            var _apiIds = '';
                            var _resIds = '';
                            for (var i = 0; i < nodes.length; i++) {
                                //nodes[i].id; //获取选中节点的值
                                $.each(obj, function (index, item) {
                                    if (nodes[i].id == item.id) {
                                        //console.log(item.resCode);
                                        if(item.resName == "首页"){
                                            _apiIds += item.id + ',';//功能
                                        }
                                        if (item.resType == 4 ) {
                                            _apiIds += item.id + ',';//功能
                                        } else {
                                            _resIds += item.id + ',';//目录
                                        }
                                    }
                                });
                                vm.apiIds = _apiIds;
                                vm.resIds = _resIds;
                            }
                        }

                        // 去掉最后一个逗号
                        vm.apiIds = (vm.apiIds.substring(vm.apiIds.length - 1) == ',') ? vm.apiIds.substring(0, vm.apiIds.length - 1) : vm.apiIds;
                        vm.resIds = (vm.resIds.substring(vm.resIds.length - 1) == ',') ? vm.resIds.substring(0, vm.resIds.length - 1) : vm.resIds;

                        console.log(vm.apiIds);
                        //console.log(vm.resIds);

                    }
                    $(document).ready(function () {
                        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                        $.each(roleChecked, function (index, item) {
                            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                            treeObj.expandAll(false);
                            var node = treeObj.getNodeByParam("id", item.id);
                            //console.log(node);
                            treeObj.selectNode(node);
                            treeObj.checkNode(node, true, true);
                        });

                        //////////////////////////////////////////////
                        //如果没有编辑权限
                        if(!hasPermission('role', 'UPDATE')){
                            var Tdemo = $('#treeDemo').find('.button.chk');
                            //console.log(Tdemo);
                            $.each(Tdemo,function(i,u){
                                $(u).removeAttr("treenode_check");
                            })
                        }
                        ///////////////////////////////////////////////
                    });
                } else {
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //场景列表
        querySceneList: function () {
            var data = {};
            MaskUtil.Loading();
            API.querySceneList(data, function (res) {
                if (res.code == 200) {
                    vm.querySceneLists = res.data.list;
                } else {
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
                setTimeout(function () {
                    $("[data-toggle='popover']").popover({trigger: "hover"});
                }, 500)

            });
        },
        //跳转url
        jumpUrl: function (id, code) {
            console.log(vm.showRoleName)
            setTimeout(function(){
             window.location.href = API.baseUrl + baseUrl + "/view/setting/datapermission/datapermission.html?sceneId=" + id + "&&sceneCd=" + code + "&&roleId=" + vm.roleNameid + "&&name=" +escape(vm.showRoleName);
            },200)

        },
        //保存
        roleData: function () {
            var data = {
                id: vm.roleNameid,//角色id
                resIds: vm.resIds,//操作目录ids
                apiIds: vm.apiIds//功能ids
            };
            $.ajax({
                type: 'POST',
                url: API.baseApi+"/pc/sysRole/roleData.action",
                data: data,
                cache: false,
                dataType: 'json',
                success: function (res) {
                    if (res.code == 200) {
                        dcrmAlertSuccess(res.msg);
                        vm.roleOperation(vm.roleNameid, vm.showRoleName);
                        vm.querySceneList();
                    } else {
                        dcrmAlertError(res.msg);
                    }
                }
            })
        }
    }
});












