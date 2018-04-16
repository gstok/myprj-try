$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_clue").find("a").addClass("active");
    vm.workOrderList(0,20);//查询工单列表并分页
})


var vm = new Vue({
    el: "#workOrderpage",
    data: {
        pages:"",
        workTitle:'',//工单标题
        orderId:'',//工单编号
        statusName:'',//工单状态
        userName:'',//提交人
        submitTime:'',//提交时间
        returnTime:'',//返回时间
        dataNum:'',//返回线索条数
        workOrderLists:[],
        orderTitle:'线索需求',//标题
        orderDaealistShow:false,//数据清单弹窗
        workOrderBackLists:[],//数据清单列表
        columns:[],//清单表格的表头列表
        codeget:true,
        codeadd:false,
        codeupdate:false,
        codedel:false,
        isAdmin:'',//是否管理员
        SOperation:[]//线索需求功能下面的操作
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
        //工单列表
        workOrderList: function(page,size) {
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.workOrderList(data, function(data) {
                if (data.code == 200) {
                    vm.workOrderLists = data.data.pageData.list;
                    vm.pages = data.data.pageData.page;

                    if(vm.workOrderLists.length != 0){
                        if(page==0){
                            $('#workorderListpage').Paging({pagesize:20,count:vm.pages.total,toolbar:true,callback:function(page,size){
                                 vm.workOrderList(page,size);
                            }});
                        }
                    }
                }
                MaskUtil.RemoveLoading();
                 setTimeout(function(){
                    $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)
             });
        },
        //新建/编辑页面弹窗
        addWorkOrder:function(id){
            if(id){
               window.location.href = "/view/customer/workOrder/addWorkOrder.html?oid="+id;
            }else{
                window.location.href = "/view/customer/workOrder/addWorkOrder.html";
            }

        },
        //查看页面弹窗
        seepage:function(id){
            window.location.href = "/view/customer/workOrder/viewWorkOrder.html?oid="+id;
        },
        //撤回工单
        updatestatus:function(id){
            var data = {
                id:id,
                status:8
            };
            API.tjWorkOrder(data, function(data) {
                if (data.code == 200) {
                    dcrmAlertSuccess(data.msg);
                    $('.ui-paging-container').eq(0).remove();
                    vm.workOrderList(0,20);
                }else{
                    dcrmAlertError(data.msg);
                }
            })
        },
        //数据清单弹窗
        WorkOrderDatalist:function(id,page,size){
            //vm.orderId = id;

            var data = {
                "pageIndex": page,
                "pageSize": size,
                workOrderNum:id
            }
            MaskUtil.Loading();
            API.workOrderBack(data, function(data) {
                if (data.code == 200) {
                    if(data.data.column){
                        vm.columns = JSON.parse(data.data.column);
                        vm.orderDaealistShow = true;
                        vm.orderTitle = "线索需求 / 数据清单";
                        vm.workOrderBackLists = data.data.pagedata.list;
                        vm.wpages = data.data.pagedata.page;

                        console.log(vm.columns);
                        var str = '';
                        if(vm.workOrderBackLists.length != 0){

                            $.each(vm.workOrderBackLists,function(i,u){
                                var strtd = '';
                                $.each(vm.columns,function(e,f){
                                    var _k = f.key;
                                    if(_k == 'mobile'){
                                        u[_k] = '<i class="icon icon-B-mima"></i>';
                                    }
                                    strtd+='<td>'+u[_k]+'</td>';
                                });
                                str+='<tr>'+strtd+'</tr>';
                            });

                            if(page==0){
                                $('#BackListpage').Paging({pagesize:20,count:vm.wpages.total,toolbar:true,callback:function(page,size){
                                     vm.workOrderBack(page,size);
                                }});
                            }
                        }else{
                            str += '<tr><td colspan="8" class="textcenter"><i class="icon icon-icon nodata">&#xe601;</i>暂无数据</td></tr>';
                        }
                        $("#BackList tbody").html(str);
                        }else{
                            dcrmAlertError('数据清单不存在！');
                        }

                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
             });
        },
        //关闭弹窗
        cancelpage:function(){
            vm.orderDaealistShow = false;
            vm.orderTitle = "线索需求"
        },
        //删除
        deleteData:function(id){
            var that = this;
            var data = {
                id:id
            };
            dcrmConfirm("您确定要删除该需求吗？",function(){
                MaskUtil.Loading();
                API.delWorkOrder(data, function(res) {
                    if (res.code == 200) {
                        $('.ui-paging-container').eq(0).remove();
                        dcrmAlertSuccess("删除成功!");
                        that.$options.methods.workOrderList(0,20);
                    }else{
                        dcrmAlertError("删除失败!");
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        }
    }
})

