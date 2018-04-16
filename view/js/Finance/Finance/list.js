/**
 * Created by Administrator on 2017/6/7 0007.
 */

var hash = window.location.hash;
console.log(hash);
$(function(){
    /*$(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_wechatGrouptouch").find("a").addClass("active");*/

    vm.allOrderEndTime = vm.show();//查询全部已购套餐结束时间
    vm.allOrderStartTime = vm.showThreeDays();//查询全部已购套餐开始时间

    vm.createEndTime = vm.show();//查询充值记录结束时间
    vm.createStartTime = vm.showThreeDays();//查询充值记录开始时间
    console.log(vm.createEndTime);

    vm.useEndDate = vm.show();//查询消费账单结束时间
    vm.useStartDate = vm.showThreeDays();//查询消费账单开始时间

    vm.useEndDates = vm.show();//查询消费详单结束时间
    vm.useStartDates = vm.showThreeDays();//查询消费详单开始时间


    vm.queryFinAccount();//财务概览--账户余额
    vm.queryUsingOrder();//财务概览--使用中套餐

    if(!hash){
        /*vm.queryFinAccount();//财务概览--账户余额
        vm.queryUsingOrder();//财务概览--使用中套餐*/
        vm.listJump();
    }else{
        if(hash=='#listPage'){//财务概览
            $('.list').click();
            //$("#list").show();
            /*vm.queryFinAccount();//财务概览--账户余额
            vm.queryUsingOrder();//财务概览--使用中套餐*/
            vm.listJump();
        }else if(hash=='#PorderPage'){//套餐订购
            $('.package').click();
            $('.Porder').click();
            //$("#list").hide();
            //vm.queryFinAccount();//财务概览--账户余额---获取账户id
            vm.queryProductOrder();//已购套餐
            vm.queryProductForBuy();//可购买套餐
        }else if(hash=='#AllOrderPage'){//充值中心
            $('.package').click();
            $('.AllOrder').click();
            vm.queryAllOrder(0,20);//全部已购套餐
        }else if(hash=='#rechargePage'){//充值中心
            //vm.queryFinAccount();//财务概览--账户余额---获取账户id
            $('.recharge').click();
            vm.queryRechargeLog(0,20);//获取充值记录
        }else if(hash=='#billPage'){//消费记录
            $('.record').click();
            $('.bill').click();
            vm.queryFinBill(0,20);//消费账单列表
        }else if(hash=='#specificationsPage'){//消费记录
            $('.record').click();
            $('.specifications').click();
            vm.queryServiceDetail(0,20);//消费账单列表
        }
    }





    $(".payWay").on("click",function(){
        $(".payWay").removeClass("active");
        $(this).addClass("active");
        if($(".zhifubao").hasClass("active")){
            vm.payChannel = 2
        }else{
            vm.payChannel = 1
        }
    });
    $("#inpstart1, #inpend1").on("change",function(){//全部已购套餐
        vm.chooseTime1 = '0';
    });
    $("#inpstart2, #inpend2").on("change",function(){//充值记录
        vm.chooseTime2 = '0';
    });
    $("#inpstart3, #inpend3").on("change",function(){//消费账单
        vm.chooseTime3 = '0';
    });
    $("#inpstart4, #inpend4").on("change",function(){//消费详单
        vm.chooseTime4 = '0';
    });
});


//查询邮件模板列表并分页
var vm = new Vue({
    el: "#financePage",
    data: {
        id:'',//账户id
        ProductId:'',//套餐id
        money:'',//账户余额
        totalRechargeMoney: 0, // 充值金额
        totalConsumMoney: 0, // 消费金额
        usingPName:'',//使用中套餐名称
        usingPStartTime:'',//使用中套餐开始时间
        usingPEndTime:'',//使用中套餐结束时间
        usingPVoLists:[],//使用中套餐余量明细
        outDatas:[],//套餐外计费
        totalP:0,//套餐外消费金额
        ForBuyLists:[],//可购买套餐列表
        buyPName:'',//订购弹窗套餐名称
        buyPDel:'',//订购弹窗套餐详情
        buyPDay:'',//订购弹窗套餐期限
        buyNum:'1',//订购弹窗套餐数量
        buyPStartTime:'',//订购弹窗套餐开始时间
        buyPEndTime:'',//订购弹窗套餐结束时间
        buyPShowPrice:'',//订购弹窗套餐原价
        buyPPrice : '',//订购弹窗套餐价格
        chooseTime2:'1',//充值记录搜索---------默认最近三天
        createStartTime:'',//查询充值记录开始时间
        createEndTime:'',//查询充值记录结束时间
        RechargeLogLists:[],//充值记录列表
        RShow:false,//充值弹窗
        RsureShow:false,//充值确认信息弹窗
        wxShow:false,//微信支付二维码弹窗
        count:300,//二维码有效时间300秒
        countShow:false,//倒计时是否显示
        sn:'',//微信支付返回订单号
        payChannel:'2',//充值方式
        rechargeMoney:'10',//充值金额
        POrderLists:[],//已购套餐列表
        AllOrderLists:[],//套餐详情列表
        chooseTime3:'1',//消费账单搜索---------默认最近三天
        useStartDate:'',//查询消费账单开始时间
        useEndDate:'',//查询消费账单结束时间
        queryFinBillLists:[],//消费账单列表
        chooseTime4:'1',//消费详单搜索---------默认最近三天
        useStartDates:'',//查询消费详单开始时间
        useEndDates:'',//查询消费详单结束时间
        queryServiceDetailLists:[],//消费详单列表
        serviceCd:'',//类型
        payStatus1:'',//套餐订购--查看全部已购套餐--选择订单状态
        chooseTime1:'1',//套餐订购搜索--查看全部已购套餐---------默认最近三天
        allOrderStartTime:'',//套餐订购--查看全部已购套餐---------开始时间
        allOrderEndTime:'',//套餐订购--查看全部已购套餐---------结束时间
        countTime:null,//倒计时
        beforeBuyShow:false,//购买前校验弹窗
        buyId:'',//点击购买套餐需要的参数
        beforeBuyMsg:'',//购买前检验的提示信息
        nomoneyShow:false,//余额不足时显示
        RechargeLog:0//判断是否充值成功

    },
    methods: {
        //去掉html标签
         delHtmlTag: function(str){
           return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
         },
        //财务订购选项卡
        listJump:function(){
            let hash = window.location.hash;
            window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#listPage";
            //vm.queryFinAccount();//财务概览--账户余额
            // vm.queryUsingOrder();//财务概览--使用中套餐
            if (hash !=='#listPage'){
                vm.queryUsingOrder();//财务概览--使用中套餐
            }
        },
        //套餐订购选项卡
        packageJump:function(){
            //window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#PorderPage";
            /*if(hash=='#PorderPage'){
                $('.package').click();
                $('.Porder').click();
                vm.queryProductOrder();//已购套餐
                vm.queryProductForBuy();//可购买套餐
            }else if(hash=='#AllorderPage'){//消费记录
                $('.package').click();
                $('.Allorder').click();
                vm.queryAllOrder(0,20,2);//全部已购套餐
            }*/
                $('.package').click();
                $('.POrder').click();
                vm.queryProductOrder();//已购套餐
                vm.queryProductForBuy();//可购买套餐
        },
        //已购套餐选项卡
        PorderJump:function(){
            $('.POrder').click();
            vm.queryProductOrder();//已购套餐
            vm.queryProductForBuy();//可购买套餐
        },
        //订购详情选项卡
        AllorderJump:function(){
            var end = vm.show();//查询全部已购套餐结束时间
            var start = vm.showThreeDays();//查询全部已购套餐开始时间

            $("#inpstart1").val(start),
            $("#inpend1").val(end),
            vm.allOrderEndTime = $("#inpend1").val();//查询全部已购套餐结束时间
            vm.allOrderStartTime = $("#inpstart1").val();//查询全部已购套餐开始时间
            $('.Allorder').click();
            vm.chooseTime1 = '1';
            vm.payStatus1 = '';
            vm.queryAllOrder(0,20);//全部已购套餐
        },
        //充值中心选项卡
        rechargeJump:function(){
            $(".bg,.modelContent").hide();


            var end = vm.show();//查询充值记录结束时间
            var start = vm.showThreeDays();//查询充值记录开始时间

            $("#inpstart2").val(start),
            $("#inpend2").val(end),
            vm.createEndTime = $("#inpend2").val();//查询充值记录结束时间
            vm.createStartTime = $("#inpstart2").val();//查询充值记录开始时间


            $('.recharge').click();
            vm.rechargeMoney = "10";
            vm.chooseTime2 = '1';
            vm.queryRechargeLog(0,20);//获取充值记录
        },
        //消费记录选项卡
        recordJump:function(){
            //window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#billPage";
            /*if(hash=='#billPage'){//消费记录
                $('.record').click();
                $('.bill').click();
                vm.queryFinBill(0,20);//消费账单列表
            }else if(hash=='#specificationsPage'){//消费记录
                $('.record').click();
                $('.specifications').click();
                vm.queryServiceDetail(0,20);//消费账单列表
            }*/
            $('.record').click();
            $('.bill').click();
            vm.queryFinBill(0,20);//消费账单列表
        },
        //消费账单选项卡
        billJump:function(){
            $('.bill').click();
            vm.chooseTime3 = '1';
            vm.queryFinBill(0,20);//消费账单列表
        },
        //消费详单选项卡
        specificationsJump:function(){
            vm.useEndDates = vm.show();//查询消费详单结束时间
            vm.useStartDates = vm.showThreeDays();//查询消费详单开始时间
            vm.serviceCd = '';
            vm.chooseTime4 = '1';
            $('.specifications').click();
            vm.queryServiceDetail(0,20);//消费详单列表
        },
        //财务概览--账户余额
        queryFinAccount:function(){
            //window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#listPage";
            MaskUtil.Loading();
            API.queryFinAccount({}, function(res) {
                if (res.code == 200) {
                    vm.id = res.data.data.id;
                    vm.money = (res.data.data.money).toFixed(2);
                    vm.totalRechargeMoney = (res.data.data.rechargeMoney).toFixed(2);
                    vm.totalConsumMoney = (res.data.data.consumMoney).toFixed(2);
                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //财务概览--使用中套餐
        queryUsingOrder:function(){
            MaskUtil.Loading();
            API.queryUsingOrder({}, function(res) {
                if (res.code == 200) {
                    vm.totalP = 0;
                    vm.usingPName = res.data.data.productName;//使用中套餐名称
                    vm.usingPStartTime = res.data.data.displayStartTime;//使用中套餐开始时间
                    vm.usingPEndTime = res.data.data.displayEndTime;//使用中套餐结束时间
                    vm.usingPVoLists = res.data.data.finProductOrderServiceRelVoList;//使用中套餐余量明细
                    vm.outDatas = res.data.outData;//套餐外计费

                    $.each(vm.outDatas,function(i,u){
                        if(u.outSum <= 0){
                            vm.totalP += 0
                        }else{
                            vm.totalP += (u.outSum)*(u.servicePrice);//套餐消费金额
                        }
                    })
                    setTimeout(function(){
                        var Bar = $(".allowanceBar span");
                        $.each(vm.usingPVoLists,function(i,u){
                            $.each(Bar,function(e,f){
                                var ww = 100*(u.quantity - u.useQuantity)/(u.quantity)+"%";
                                if(e == i){
                                    $(f).animate({width:ww},1000);
                                }
                            })
                        })
                    },200);

                }else if(res.code == 701){
                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //查询已购套餐
        queryProductOrder:function(){
            window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#PorderPage";
            MaskUtil.Loading();
            API.queryProductOrder({}, function(res) {
                if (res.code == 200) {
                    vm.POrderLists = res.data.data;
                }else if(res.code == 701){
                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //点击查看全部已购套餐
        /*AllOrder:function(){
            var modelContent=$('#queryAllOrderBox');//弹窗最外层
            var contentInfo=$('#queryAllOrderBox .contentInfo');//弹窗内层
            frameDiv(modelContent,contentInfo);//弹窗操作
        },*/
        //查看全部已购套餐下拉选择时间
        chooseTime:function(h){
            if(h == 1){//全部已购套餐
                vm.allOrderEndTime = vm.show();//查询全部已购套餐结束时间
                if(vm.chooseTime1 == 1){
                    vm.allOrderStartTime = vm.showThreeDays();//查询全部已购套餐开始时间
                }
                if(vm.chooseTime1 == 2){
                    vm.allOrderStartTime = vm.showMonth(1);//查询全部已购套餐开始时间
                }
                if(vm.chooseTime1 == 3){
                    vm.allOrderStartTime = vm.showMonth(3);//查询全部已购套餐开始时间
                }
            }
            if(h == 2){//充值记录
                vm.createEndTime = vm.show();//查询充值记录结束时间
                if(vm.chooseTime2 == 1){
                    vm.createStartTime = vm.showThreeDays();//查询充值记录开始时间
                }
                if(vm.chooseTime2 == 2){
                    vm.createStartTime = vm.showMonth(1);//查询充值记录开始时间
                }
                if(vm.chooseTime2 == 3){
                    vm.createStartTime = vm.showMonth(3);//查询充值记录开始时间
                }
            }
            if(h == 3){//消费账单
                vm.useEndDate = vm.show();//查询消费账单结束时间
                if(vm.chooseTime3 == 1){
                    vm.useStartDate = vm.showThreeDays();//查询消费账单开始时间
                }
                if(vm.chooseTime3 == 2){
                    vm.useStartDate = vm.showMonth(1);//查询消费账单开始时间
                }
                if(vm.chooseTime3 == 3){
                    vm.useStartDate = vm.showMonth(3);//查询消费账单开始时间
                }
            }
            if(h == 4){//消费详单
                vm.useEndDates = vm.show();//查询消费详单结束时间
                if(vm.chooseTime4 == 1){
                    vm.useStartDates = vm.showThreeDays();//查询消费详单开始时间
                }
                if(vm.chooseTime4 == 2){
                    vm.useStartDates = vm.showMonth(1);//查询消费详单开始时间
                }
                if(vm.chooseTime4 == 3){
                    vm.useStartDates = vm.showMonth(3);//查询消费详单开始时间
                }
            }
        },
        //全部已购套餐弹窗中的搜索按钮
        searchOrder:function(){
            vm.allOrderEndTime = $("#inpend1").val();//查询全部已购套餐结束时间
            vm.allOrderStartTime = $("#inpstart1").val();//查询全部已购套餐开始时间
            vm.queryAllOrder(0,20);
        },
        //全部已购套餐列表
        queryAllOrder:function(page,size){
            window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#AllOrderPage";
            var data = {
                payStatus:vm.payStatus1,
                createStartTime:$("#inpstart1").val(),
                createEndTime:$("#inpend1").val(),
                "pageIndex": page,
                "pageSize": size
            };
            //MaskUtil.Loading();
            API.queryAllOrder(data, function(res) {
                if (res.code == 200) {
                    vm.AllOrderLists = res.data.data.list;
                    vm.AllOrderPages = res.data.data.page;
                    //if(vm.AllOrderLists.length !=0){
                        if(page==0){
                            $("#queryAllOrderBoxpage").find('.ui-paging-container').eq(0).remove();
                            $('#queryAllOrderBoxpage').Paging({pagesize:vm.AllOrderPages.pageSize,count:vm.AllOrderPages.total,toolbar:true,callback:function(page,size){
                                vm.queryAllOrder(page,size);
                            }});
                        }
                    //}
                }else{
                    dcrmAlertError(res.msg);
                }
                //MaskUtil.RemoveLoading();
                setTimeout(function(){

                    $.each(vm.AllOrderLists,function(e,f){
                        $.each($("[data-toggle='popover']"),function(i,u){
                            if(i == e){
                                /*if(f.productName != '基础套餐'){
                                    var s = f.productDesc.split('(')[0];
                                    var ss = f.productDesc.split('(')[1].split(')')[0];
                                        $(u).popover(
                                            {
                                                trigger:"hover",
                                                html:true,
                                                content: ""+s+"<br/><span class='red'>("+ss+")</span>"

                                            }
                                        );
                                    }else{*/
                                        $(u).popover(
                                            {
                                                trigger:"hover",
                                                html:true,
                                                content: ""+f.productDesc+""

                                            }
                                        );
                                    //}
                                }


                        })
                    })

                },500)
            });
        },
        //购买未支付套餐
        payOrder:function(id){
            var data = {
                id:id
            };
            //MaskUtil.Loading();
            dcrmConfirm("您确定要支付吗？",function(){
                API.payOrder(data, function(res) {
                    if (res.code == 200) {
                        dcrmAlertSuccess(res.msg);
                    }else{
                        dcrmAlertError(res.msg);
                    }
                    //MaskUtil.RemoveLoading();
                });
            });
        },
        //取消未支付套餐
        cancelOrder:function(id,title){
            var data = {
                id:id
            };
            dcrmConfirm("您确定要取消'"+title+"'套餐吗？",function(){
                MaskUtil.Loading();
                API.cancelOrder(data, function(res) {
                    if (res.code == 200) {
                        console.log($("button[data-id="+id+"]"));
                        $("button[data-id="+id+"]").remove();
                        $("td[data-id="+id+"]").html("已取消");
                    }else{
                        dcrmAlertError(res.msg);
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        },
        //可购买套餐
        queryProductForBuy:function(){
            MaskUtil.Loading();
            API.queryProductForBuy({}, function(res) {
                if (res.code == 200) {
                    vm.ForBuyLists = res.data.data;
                    console.log(vm.ForBuyLists);
                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
                setTimeout(function(){
                    $.each(vm.ForBuyLists,function(e,f){
                        $.each($("[data-toggle='popover']"),function(i,u){
                            if(i == e){
                                $(u).popover(
                                    {
                                        trigger:"hover",
                                        html:true,
                                        content: ""+f.productDesc+""

                                    }
                                );
                            }
                        })
                    })
                },500)
            });
        },
        //点击购买套餐按钮
        buyProduct:function(){
            vm.beforeBuyShow = false;
            var modelContent=$('#buyproductBox');//弹窗最外层
            var contentInfo=$('#buyproductBox .contentInfo');//弹窗内层
            frameDiv(modelContent,contentInfo);//弹窗操作
            var data = {
                id:vm.buyId
            };
            MaskUtil.Loading();
            API.getProductById(data, function(res) {
                    vm.buyNum = 1;
                if (res.code == 200) {
                    if(vm.buyId == 'package-test'){
                        $(".reduceCartBtn").attr("disabled",true);
                        $("#buyNum").prop("readonly",true);
                    }else{
                        $(".reduceCartBtn").attr("disabled",false);
                        $("#buyNum").prop("readonly",false);
                    }
                        vm.ProductId = res.data.data.id;//订购弹窗套餐id
                        vm.buyPName = res.data.data.productName;//订购弹窗套餐名称
                        vm.buyPDel = res.data.data.productDesc;//订购弹窗套餐详情
                        //var _buyPDel = res.data.data.productDesc;//订购弹窗套餐详情

                        //vm.buyPDel = _buyPDel.split('(')[0];
                        //var _buyPDel1 = _buyPDel.split('(')[1];
                        //vm.buyPDel2 = _buyPDel1.split(')')[0];
                        vm.buyPDay = res.data.data.serviceDay;//订购弹窗套餐期限

                        vm.buyPStartTime = res.data.data.displayStartTime;//订购弹窗套餐开始时间



                        var dates = (vm.buyPDay)*(vm.buyNum) - 1;
                        var t = new Date(vm.buyPStartTime);
                        var iToDay=t.getDate();
                        var iToMon=t.getMonth();
                        var iToYear=t.getFullYear();
                        var newDate = new Date(iToYear,iToMon,(iToDay+dates));
                        var YY = newDate.getFullYear();
                        var MM = newDate.getMonth()+1;
                        if(MM<10){
                            MM = "0"+MM;
                        }
                        var DD = newDate.getDate();
                        if(DD<10){
                            DD = "0"+DD;
                        }
                        vm.buyPEndTime = YY+'-'+MM+"-"+DD;//订购弹窗套餐结束时间



                        vm.buyPShowPrice = res.data.data.showPrice;//订购弹窗套餐原价
                        vm.buyPPrice = res.data.data.price;//订购弹窗套餐价格


                        setTimeout(function(){
                            vm.dadechange();
                        },500);


                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //获取今天的日期
        formatDate:function(now){
            var year=now.getFullYear();
            var month=now.getMonth()+1;
            if(month<10){
                month = "0"+month
            }
            var date=now.getDate();
            if(date<10){
                date = "0"+date
            }
            return year+"-"+month+"-"+date;
        },
        //加减
        addCartNum:function () {
            vm.buyNum++;
            vm.dadechange();
        },
        reduceCartNum:function(){
            if(vm.buyNum >= 2){
                // vm.buyNum = 1
                vm.buyNum--;
                vm.dadechange();
            }


        },
        //加减时日期变化
        dadechange:function(){
            var dates = (vm.buyPDay)*(vm.buyNum) - 1;
            var t = new Date(vm.buyPStartTime);
            var iToDay=t.getDate();
            var iToMon=t.getMonth();
            var iToYear=t.getFullYear();
            var newDate = new Date(iToYear,iToMon,(iToDay+dates));
            var YY = newDate.getFullYear();
            var MM = newDate.getMonth()+1;
            if(MM<10){
                MM = "0"+MM;
            }
            var DD = newDate.getDate();
            if(DD<10){
                DD = "0"+DD;
            }
            vm.buyPEndTime = YY+'-'+MM+"-"+DD;//订购弹窗套餐结束时间





            if(vm.money<(vm.buyNum * vm.buyPPrice)){
                vm.nomoneyShow = true;
                $("#buyproductBox .addPartialSure").attr('disabled',true);
            }else{
                vm.nomoneyShow = false;
                $("#buyproductBox .addPartialSure").attr('disabled',false);
            }
        },
        //购买前校验
        beforeBuy:function(id){
            vm.buyId = id;
            API.payPrompting({}, function(res) {
                if (res.code == 200) {
                    vm.beforeBuyShow = true;
                    vm.beforeBuyMsg = res.msg;
                }else{
                    dcrmAlertError(res.msg);
                }
            });
        },

        //点击取消按钮 校验窗口关闭
        noBuy:function(){
            vm.beforeBuyShow = false
        },

        //点击立即购买
        purchasingOrder:function(){
            dcrmConfirm('您确定要支付吗？',function(){
                var data = {
                        finAccountId:vm.id,
                        finProductId:vm.ProductId,
                        nums:vm.buyNum,
                        startTime:vm.buyPStartTime
                    };
                MaskUtil.Loading();
                API.purchasingOrder(data, function(res) {
                    if (res.code == 200) {
                        dcrmAlertSuccess(res.msg);
                        setTimeout(function(){
                            $(".bg,.modelContent,.xcConfirm").fadeOut();
                            vm.queryProductOrder();//刷新已购套餐列表
                        },500);

                    }/*else if(res.code == 703){
                        dcrmAlertError(res.msg);
                        var xcConfirm=$(".xcConfirm");
                        xcConfirm.find(".sgBtn").html("请充值").on("click",function(){
                            $(".bg,.modelContent").fadeOut();
                            vm.rechargeJump();
                        })
                    }*/
                    else{
                        dcrmAlertError(res.msg);
                    }
                    MaskUtil.RemoveLoading();
                });
            })
        },
        //点击立即充值
        rechargeNow:function(){
            console.log(vm.payChannel);
            this.RShow = true;
            if(vm.payChannel == 2){
                $("a.jumpAlipay").show();
                $(".payChannel").removeClass("weixinzhifu").addClass("zhifubao");
            }else{
                $("a.jumpAlipay").hide();
                $(".payChannel").removeClass("zhifubao").addClass("weixinzhifu");
            }
        },
        //点击按钮----支付宝充值
        Alipay:function(){
            vm.recharge();
            var url = API.baseUrl+baseUrl+"/view/Finance/Finance/Alipay.html";
            window.open(url);
        },
        //充值
        recharge:function(){
            var that = this;
            var qrcode;
            if(vm.payChannel == 1){//微信
                vm.wxShow = true;
                vm.RsureShow = false;
                $('#qrcode').html('');
                qrcode = new QRCode(document.getElementById("qrcode"), {
                    width : 300,
                    height : 300
                });
            }
            var data = {
                payChannel:vm.payChannel,
                rechargeMoney:vm.rechargeMoney
            };
            MaskUtil.Loading();
            clearInterval(vm.countTime);
            vm.count = 300;
            API.rechargeAccount(data, function(res) {
                if (res.code == 200) {
                    that.RShow = false;
                    if(vm.payChannel == 2){
                        vm.sn = res.data.result.sn;
                        console.log(res.data.result.payInfo);
                         var payInfo = res.data.result.payInfo;
                         $.cookie("payInfo",payInfo);
                        vm.RsureShow = true;
                        vm.setint = setInterval(function () {
                            vm.getRechargeLogBySn();
                        }, 1000);
                    }else{
                        vm.sn = res.data.result.payInfo.sn;
                        qrcode.makeCode(res.data.result.payInfo.codeUrl);
                        vm.countShow = true;
                        var ttime = 300;
                            vm.countTime = setInterval(function () {
                            ttime--;
                            vm.count = ttime;
                            if (ttime <= 0) {
                                clearInterval(vm.countTime);
                                vm.wxShow = false;
                                vm.RsureShow = true;
                            }
                        }, 1000);
                        var tdate = new Date();
                        tdate.setTime(tdate.getTime() + (60 * 1000));

                        vm.setint = setInterval(function () {
                            vm.getRechargeLogBySn();
                        }, 1000)
                    }

                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //查询微信支付状态
        getRechargeLogBySn:function(){
            vm.RechargeLog = 0;
            var data = {
                sn:vm.sn
            };
            API.getRechargeLogBySn(data, function(res) {
                if(res.code == 200){
                    if(res.data.data == "SUCCESS" ){
                        vm.RechargeLog = 1;
                        clearInterval(vm.setint);
                        vm.countShow = false;
                        vm.wxShow = false;
                        vm.RsureShow = true;
                    }else{
                        vm.RechargeLog = 2;
                    }
                }
            })
        },
        //点击确认是否充值成功
        RechargeL:function(){
            console.log(vm.RechargeLog);
            clearInterval(vm.setint);
            vm.RsureShow = false;
            if(vm.RechargeLog == 1){
                dcrmAlertSuccess("充值成功！");
                setTimeout(function(){
                    $(".list").click();
                    vm.queryFinAccount();//获取账户余额
                },500)
            }else{
                dcrmAlertError("充值失败！");
            }
        },
        //关闭微信充值弹窗
        closeWX:function(){
            this.wxShow = false;
            this.RsureShow = true;
            clearInterval(vm.countTime);
            clearInterval(vm.setint);
        },
        //关闭充值弹窗
        closeR:function(){
            this.RShow = false;
            this.RsureShow = false;
        },
        //获取今天日期
        show:function(){
            var mydate = new Date();
            var mm = mydate.getMonth()+1;
            var dd = mydate.getDate();
            if(mm<10){
                mm = "0"+mm
            }
            if(dd<10){
                dd = "0"+dd
            }
            var str = "" + mydate.getFullYear() + "-";
            str += mm + "-";
            str += dd;
            return str;
        },
        //获取最近三天日期
        showThreeDays:function(){
            var start;
            var end = vm.show();
            var date = new Date(Date.parse(end));
            var endTime = date.setDate(date.getDate()-3+1);
            //var endTime = date.setDate(-3);
            var d=new Date(endTime);
            //start = vm.formatDate(d).replace(/-/g, "/");
            start = vm.formatDate(d);
            return start;
        },
        //获取最近一个月日期
        showMonth:function(ele){
            var start;
            var end = vm.show();
            var date = new Date(Date.parse(end));
            var endTime = date.setMonth(date.getMonth()-ele);//new Date().setMonth((new Date().getMonth()-1));
            //var endTime = date.setDate(-3);
            var d=new Date(endTime);
            //start = vm.formatDate(d).replace(/-/g, "/");
            start = vm.formatDate(d);
            return start;
        },
        //充值记录弹窗中的搜索按钮
        searchRechargeLog:function(){
            vm.createEndTime = $("#inpend2").val();//查询充值记录弹窗结束时间
            vm.createStartTime = $("#inpstart2").val();//查询充值记录弹窗开始时间
            vm.queryRechargeLog(0,20);
        },
        //获取充值记录
        queryRechargeLog:function(page,size){
            window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#rechargePage";
            var data = {
                createStartTime:vm.createStartTime,
                createEndTime:vm.createEndTime,
                "pageIndex": page,
                "pageSize": size
            };
            //MaskUtil.Loading();
            API.queryRechargeLog(data, function(res) {
                if (res.code == 200) {
                    vm.RechargeLogLists = res.data.data.list;
                    vm.RechargeLogPages = res.data.data.page;
                    //if(vm.RechargeLogPages.length !=0){
                        if(page==0){
                            $("#queryRechargeLogpage").find('.ui-paging-container').eq(0).remove();
                            $('#queryRechargeLogpage').Paging({pagesize:vm.RechargeLogPages.pageSize,count:vm.RechargeLogPages.total,toolbar:true,callback:function(page,size){
                                vm.queryRechargeLog(page,size);
                            }});
                        }
                    //}

                }else{
                    dcrmAlertError(res.msg);
                }
                //MaskUtil.RemoveLoading();
            });
        },
        //点击充值记录
        rechargeList:function(){
            var modelContent=$('#rechargeListBox');//弹窗最外层
            var contentInfo=$('#rechargeListBox .contentInfo');//弹窗内层
            frameDiv(modelContent,contentInfo);//弹窗操作
            var end = vm.show();//查询充值记录结束时间
            var start = vm.showThreeDays();//查询充值记录开始时间

            $("#inpstart2").val(start),
            $("#inpend2").val(end),
            vm.createEndTime = $("#inpend2").val();//查询充值记录结束时间
            vm.createStartTime = $("#inpstart2").val();//查询充值记录开始时间
            vm.chooseTime2 = '1';
            vm.queryRechargeLog(0,20);//获取充值记录
        },
        //消费账单列表的查询按钮
        searchFinBill:function(){
            vm.useEndDate = $("#inpend3").val();///查询消费账单结束时间
            vm.useStartDate = $("#inpstart3").val();//查询消费账单开始时间
            vm.queryFinBill(0,20);
        },
        //消费账单列表
        queryFinBill:function(page,size){
            window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#billPage";
            var data = {
                useStartDate:vm.useStartDate,
                useEndDate:vm.useEndDate,
                "pageIndex": page,
                "pageSize": size
            };
            MaskUtil.Loading();
            API.queryFinBill(data, function(res) {
                if (res.code == 200) {
                    vm.queryFinBillLists = res.data.pageData.list;
                    vm.queryFinBillPages = res.data.pageData.page;
                    if(vm.queryFinBillPages.length !=0){
                        if(page==0){
                            $("#queryFinBillPage").find('.ui-paging-container').eq(0).remove();
                            $('#queryFinBillPage').Paging({pagesize:vm.queryFinBillPages.pageSize,count:vm.queryFinBillPages.total,toolbar:true,callback:function(page,size){
                                vm.queryFinBill(page,size);
                            }});
                        }
                    }

                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //点击消费账单里面的查看详情
        getServiceDetail:function(time,serviceCd){
            vm.chooseTime4 = 0;
            vm.useStartDates = vm.useEndDates = time,
            vm.serviceCd = serviceCd;
            $('.specifications').click();
            vm.queryServiceDetail(0,20);
        },
        //消费详单列表的查询按钮
        searchServiceDetail:function(){
            vm.useEndDates = $("#inpend4").val();///查询消费详单结束时间
            vm.useStartDates = $("#inpstart4").val();//查询消费详单开始时间
            vm.queryServiceDetail(0,20);
        },
        //消费详单列表
        queryServiceDetail:function(page,size){
            window.location.href = API.baseUrl+baseUrl+"/view/Finance/Finance/list.html#specificationsPage";
            var data = {
                useStartDate:vm.useStartDates,
                useEndDate:vm.useEndDates,
                serviceCd:vm.serviceCd,
                "pageIndex": page,
                "pageSize": size
            };
            MaskUtil.Loading();
            API.queryServiceDetail(data, function(res) {
                if (res.code == 200) {
                    vm.queryServiceDetailLists = res.data.pageData.list;
                    vm.queryServiceDetailPages = res.data.pageData.page;
                    if(vm.queryServiceDetailPages.length !=0){
                        if(page==0){
                            $("#queryServiceDetailPage").find('.ui-paging-container').eq(0).remove();
                            $('#queryServiceDetailPage').Paging({pagesize:vm.queryServiceDetailPages.pageSize,count:vm.queryServiceDetailPages.total,toolbar:true,callback:function(page,size){
                                vm.queryServiceDetail(page,size);
                            }});
                        }
                    }
                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        }
    }
});






