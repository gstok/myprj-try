$(function() {
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_addFriends").find("a").addClass("active");
    vm.isAdmin = Global.isAdmin;
    vm.tasklist(0,20);//查询原始页面列表并分页
    setTimeout(function(){
        vm.getTaskList();
        vm.nearby(0,20);//附近的人列表
    },1000)
    /*$(".nearby").on('click',function(){
        $('#alltask').val('');
        vm.nearby(0,20);//附近的人列表
        $('#nearbypage .ui-paging-container').eq(0).remove();
    });*/
});

var vm = new Vue({
    el: "#addfriendsPage",
    data: {
        tasklists: [],
        nearbylists:[],//附近的人列表
        getTaskLists:[],//任务列表下拉框
    },
    methods: {
        //权限功能按钮
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
        //任务列表页
        tasklist: function(page,size) {
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.queryTaskList(data, function(data) {
                if (data.code == 200) {
                    if(data.data){
                        vm.tasklists = data.data.pageData.list;
                        var pages = data.data.pageData.page;
                        if(vm.tasklists.length != 0){
                            if(page==0){
                                $('#tasklistpage').Paging({pagesize:20,count:pages.total,toolbar:true,callback:function(page,size){
                                    vm.tasklist(page,size);
                                }});
                            }
                        }
                    }
                }else{
                    dcrmAlertError(data.msg);
                }
                setTimeout(function(){
                    $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)
                MaskUtil.RemoveLoading();
            });
        },
        //获取任务列表----下拉框
        getTaskList:function(){
            API.getTaskList({}, function(data) {
                if (data.code == 200) {
                    vm.getTaskLists = data.data.data;
                }
            })
        },
        //附近的人列表页
        nearby: function(page,size,id) {
            var data = {
                locTaskId:id,
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.queryTaskLogList(data, function(data) {
                if (data.code == 200) {
                    if(data.data){
                        vm.nearbylists = data.data.pageData.list;
                        var pages = data.data.pageData.page;
                        if(vm.nearbylists.length != 0){
                            if(page==0){
                                $('#nearbypage').Paging({pagesize:20,count:pages.total,toolbar:true,callback:function(page,size){
                                    vm.nearby(page,size,id);
                                }});
                            }
                            if($('#nearbypage .ui-paging-container').length>1){
                                $('#nearbypage .ui-paging-container').eq(0).remove();
                            }
                        }else{
                            $('#nearbypage .ui-paging-container').eq(0).remove();
                        }
                    }

                }else{
                    dcrmAlertError(data.msg);
                }
                setTimeout(function(){
                    $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)
                MaskUtil.RemoveLoading();
            });
        },
        //创建任务页面跳转
        newlytask:function(){
        	window.location.href = API.baseUrl+baseUrl+"/view/marketing/addFriends/map.html";
        },
        //启动任务
        startTask:function(id){
            $('#loginBox dl').hide();
            var _data = {
                id:id,
                deviceSid:window.sessionid
            };
            var startcallback = function(data) {
                if (data.code == 200) {
                    dcrmAlertSuccess(data.msg);
                    vm.tasklist(0,20);
                }else if(data.code == 4001){
                    addPop(function(){
                        _data['deviceSid'] = window.sessionid;
                        API.startTask(_data,startcallback);
                    })
                }else{
                    dcrmAlertError(data.msg);
                }
            };
            API.startTask(_data,startcallback);
        },
        //任务列表点击附近的人
        nearfriends:function(id){
            $(".nearby").click();
            $("#alltask").val(id);
            vm.nearby(0,20,id);
        },
        //重置
        reset:function(){
        	$('#alltask').val('');
        	vm.nearby(0,20);
            if($('#nearbypage .ui-paging-container').length>1){
                $('#nearbypage .ui-paging-container').eq(0).remove();
            }

        },
        //搜索
        search:function(){
            var searchid = $('#alltask').val();
        	vm.nearby(0,20,searchid);
            if($('#nearbypage .ui-paging-container').length>1){
                $('#nearbypage .ui-paging-container').eq(0).remove();
            }
        },
        //编辑弹窗
        viewData:function(id){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/addFriends/map.html?id="+id;
        },
        //删除
        deleteData:function(id,title){
            var that = this;
            var data = {
                id:id
            };
            dcrmConfirm("您确定要删除任务'"+title+"'吗？",function(){
                MaskUtil.Loading();
                API.delTask(data, function(res) {
                    if (res.code == 200) {
                        $('.ui-paging-container').eq(0).remove();
                        //dcrmAlertSuccess("删除成功!");
                        that.$options.methods.tasklist(0,20);
                    }else{
                        dcrmAlertError("删除失败!");
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        },


    }
});

