/**
 * Created by Administrator on 2017/6/12 0012.
 */
$(function(){
    vm.explain();//问号提示
    var id = (vm.GetQueryString("id"));
    var type = (vm.GetQueryString("type"));
    var index= (vm.GetQueryString("index"));
    var isHasUrl = (vm.GetQueryString("isHasUrl"));
    vm.isHasUrl = isHasUrl;
    vm.id = id;
    vm.emailLogIds = id;
    console.log(index);
    vm.startTime = vm.today();//第一次进来页面查看的是当天的时间
    $('#inpstart1').val(vm.today());
    vm.endTime = vm.today();//第一次进来页面查看的是当天的时间
    $('#inpend1').val(vm.today());
    vm.startTime2 = vm.today();//第一次进来页面查看的是当天的时间
    $('#inpstart2').val(vm.today());
    vm.endTime2 = vm.today();//第一次进来页面查看的是当天的时间
    $('#inpend2').val(vm.today());
    $(".btn-groupboxD .btn").on('click',function(){
        $(".btn-groupboxD .btn").removeClass("active");
        $(this).addClass("active");
    });//页面查看
    $(".btn-groupboxA .btn").on('click',function(){
        $(".btn-groupboxA .btn").removeClass("active");
        $(this).addClass("active");
    });//页面访问
    if(id){
        $(".marketli").find("ul").show();
        $(".menuNormal").find("a").removeClass("active");
        $(".marketli").find("span").attr("class","icon icon-jiantou");
        $(".marketli").find("ul #index_emailtouch").find("a").addClass("active");
    }else{
        $(".analyli").find("ul").show();
        $(".menuNormal").find("a").removeClass("active");
        $(".analyli").find("span").attr("class","icon icon-jiantou");
        $(".analyli").find("ul #index_emailanalysis").find("a").addClass("active");
        vm.emailList();
        setTimeout(function () {
            vm.emailsendLog();
        }, 500);
        vm.isShow = true;
    }
    if(type){//如果是点击访问进来的，页面默认展示访问选项卡
        $("#accessPageBtn").click();
        setTimeout(function () {
            vm.emailvisit();//第一次进来默认当天
        }, 1800);
    }else if(index){
        if(index=='true'){
           $(".funnelpage").click();
            setTimeout(function () {
                vm.emailfunnel();
            }, 1500);
        }else{
            $(".datapage").click();
            setTimeout(function () {
                vm.emailview();//第一次进来默认当天
            }, 1800);
        }

    }else{
        setTimeout(function () {
            vm.emailview();//第一次进来默认当天
        }, 1800);
    }
    //如果没有url，那么分析跳转不显示页面访问选项卡
    if(vm.isHasUrl && vm.isHasUrl == 0){
        vm.hasurlShow = false;
    }else{
        vm.hasurlShow = true;
    }
});
var vm = new Vue({
    el: "#emaildatapage",
    data: {
        startTime:'',//查看开始时间
        endTime:'',//查看结束时间
        startTime2:'',//访问开始时间
        endTime2:'',//访问结束时间
        id:'',//页面跳转传参用
        hasurlShow:true,//是否含有url，如果含有，页面访问选项卡展示，否则不展示
        count:'',//次数
        //查看
        xAxiDs:[],//X轴显示
        uvD:[],//人数
        pvD:[],//次数
        dateTypeD:'0',//时间类型  0：当天 1：最近7天 最近30天
        //查看
        isShow:false,//是否显示搜索下拉框
        emailLists:[],//获取模板列表
        emailTit:'',//选择模板名
        ideaMailId:'',//获取发送记录请求参数 ideaSmsId
        Sendlists:[],//发送批次列表
        SendTit:'',//选择的发送批次
        emailLogIds:'',//图表请求参数  发送批次emailLogIds
        //访问
        xAxis:[],//X轴显示
        uv:[],//人数  数组
        pv:[],//次数  数组
        length:'',//表的个数
        dateType:'0',//时间类型  0：当天 1：最近7天 最近30天
        lists:[],//多个
        //漏斗
        funneldata:[],//获取到的数组
        maxnum:'',//转化漏斗里面最大的值----发送
        //funnellists: ['发送','收到','查看','访问'],
        funnellists: ['发送','收到','查看'],
        nums:[],//人数
        //rates:['100%','0%','0%','0%'],//转化率
        rates:['100%','0%','0%'],//转化率
    },
    methods: {
        //问号提示
        explain:function(){
            $('.explain').mouseenter(function () {
                $(this).find(".popover").show();
            }).mouseleave(function () {
                $(this).find(".popover").hide();
            });
        },
        GetQueryString:function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        //跳转到查看页面
        datapage:function(){
            $("#inpstart1").val('');
            $("#inpend1").val('');
            vm.todaydata();//第一次进来默认当天
            $(".btn-groupboxD").find(".btn").removeClass("active");
            $(".btn-groupboxD").find(".btn:first-child").addClass("active");//第一次进来让当天选中

        },
        //跳转到访问页面
        accesspage:function(){
            $("#inpstart2").val('');
            $("#inpend2").val('');
            vm.todayaccess();//第一次进来默认当天
            $(".btn-groupboxA").find(".btn").removeClass("active");
            $(".btn-groupboxA").find(".btn:first-child").addClass("active");//第一次进来让当天选中
        },
        //跳转到漏斗页面
        funnelpage:function(){
            setTimeout(function () {
                vm.emailfunnel();
            }, 1500);
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
        //获取今天日期
        today:function(){
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
        //获取最近7天日期
        showmanyDays:function(n){
            var start;
            var end = vm.today();
            var date = new Date(Date.parse(end));
            var endTime = date.setDate(date.getDate()-n+1);
            //var endTime = date.setDate(-3);
            var d=new Date(endTime);
            //start = vm.formatDate(d).replace(/-/g, "/");
            start = vm.formatDate(d);
            return start;
        },
        //获取最近一个月日期
        /*showMonth:function(ele){
            var start;
            var end = vm.today();
            var date = new Date(Date.parse(end));
            var endTime = date.setMonth(date.getMonth()-ele);//new Date().setMonth((new Date().getMonth()-1));
            //var endTime = date.setDate(-3);
            var d=new Date(endTime);
            //start = vm.formatDate(d).replace(/-/g, "/");
            start = vm.formatDate(d);
            return start;
        },*/
        //点击搜索
        search:function(type){


            if(type == 1){
                vm.startTime = $("#inpstart1").val();
                vm.endTime = $("#inpend1").val();
                if($("#inpstart1").val() == ''||$("#inpend1").val() == ''){
                    dcrmAlertWarning('请选择时间段');
                    return;
                }
                vm.emailview();
            }
            if(type == 2){
                vm.startTime2 = $("#inpstart2").val();
                vm.endTime2 = $("#inpend2").val();
                if($("#inpstart2").val() == ''||$("#inpend2").val() == ''){
                    dcrmAlertWarning('请选择时间段');
                    return;
                }
                vm.emailvisit();
            }

        },





        //邮件模板列表页
        emailList: function() {
            var data = {
                    status:1
                    };
            MaskUtil.Loading();
            API.emailListForAnaly(data, function(data) {
                if (data.code == 200) {
                    vm.emailLists = data.data.pageData.list;
                    vm.emailTit = data.data.pageData.list[0].id;
                    vm.ideaMailId = data.data.pageData.list[0].id;
                    console.log(vm.ideaMailId);
                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //邮件发送记录
        emailsendLog:function(){
            var data = {
                ideaMailId:vm.ideaMailId
            }
            MaskUtil.Loading();
            API.emailsendLog(data, function(data) {
                if (data.code == 200) {
                    vm.Sendlists = data.data.list;
                    if(data.data.list.length == 0){
                        vm.SendTit = "";
                        vm.emailLogIds = "";
                    }else{
                        vm.SendTit = data.data.list[0].id;
                        vm.emailLogIds = data.data.list[0].id;
                    }
                    console.log(vm.emailLogIds);
                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            })
        },
        //选择模板名
        emailTitChange: function () {
            vm.ideaMailId = vm.emailTit;
            vm.emailsendLog();
            setTimeout(function(){
                if($("#datapage").hasClass("active in")){
                    vm.emailview();
                }else if($("#accesspage").hasClass("active in")){
                    vm.emailvisit();
                }else{
                    vm.emailfunnel();
                }
            },1000)
        },
        //选择发送批次
        SendTitChange: function () {
            vm.emailLogIds = vm.SendTit;
            setTimeout(function(){
                if($("#datapage").hasClass("active in")){
                    vm.emailview();
                }else if($("#accesspage").hasClass("active in")){
                    vm.emailvisit();
                }else{
                    vm.emailfunnel();
                }
            },1000)
        },
        //查看点击当天
        todaydata:function(){
            vm.dateTypeD = 0;
            vm.startTime = vm.today();
            vm.endTime = vm.today();
            setTimeout(function () {
                vm.emailview();//第一次进来默认当天
            }, 1500);
            $("#dayorhour").html("时");
            $('#inpstart1').val(vm.today());
            $('#inpend1').val(vm.today());
        },
        //查看点击最近7天
        weekdata:function(){
            vm.dateTypeD = 1;
            vm.startTime = vm.showmanyDays(7);
            vm.endTime = vm.today();
            vm.emailview();
            $("#dayorhour").html("日");
            $('#inpstart1').val(vm.showmanyDays(7));
            $('#inpend1').val(vm.today());
        },
        //查看点击最近30天
        monthdata:function(){
            vm.dateTypeD = 1;
            vm.startTime = vm.showmanyDays(30);
            vm.endTime = vm.today();
            vm.emailview();
            $("#dayorhour").html("日");
            $('#inpstart1').val(vm.showmanyDays(30));
            $('#inpend1').val(vm.today());
        },
        //电子邮件查看
        emailview:function(){
            var data = {
                startDate:vm.startTime,
                endDate:vm.endTime,
                logIds:vm.emailLogIds

            };
            if(!vm.emailLogIds){
                if(vm.emailLogIds == ''||vm.emailLogIds == null){
                    dcrmAlertWarning("请选择发送批次");
                }
                return false;
            }
            if(data.startDate == data.endDate){
                vm.dateTypeD = 0;
            }else{
                vm.dateTypeD = 1;
            }
            MaskUtil.Loading();
            API.emailview(data, function(data){
                if(data.code == 200) {
                    vm.count = data.data.sumData.pv;
                    vm.uvD = [];
                    vm.pvD = [];
                    vm.xAxiDs = [];
                    var list = data.data.list;
                    $.each(list,function(i,u){
                        vm.uvD.push(u.uv);
                        vm.pvD.push(u.pv);
                        if(vm.dateTypeD == 0){//当天
                            vm.xAxiDs.push(u.hourCd);
                        }else{
                            vm.xAxiDs.push(u.dateCd);
                        }
                    });
                    setTimeout(function(){
                        vm.Charts();
                    },200);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //电子邮件查看图表
        Charts: function(){
            var myChart = echarts.init(document.getElementById('chart'));
            var option = {
                title : {
                    text: '历史查看趋势',
                    x:'center'
                },
                "color": [
                    "#5c7093",
                    "#7e8fe1"
                ],
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    top:'20%',
                    left: '6%',
                    right: '8%',
                    bottom: '10%',
                    containLabel: true,
                    x:0
                },
                legend: {
                    data:['人数','次数'],
                    x: '85%',
                    y: 'top'
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : vm.xAxiDs
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}'
                        }
                    }
                ],
                series : [
                    {
                        name:'人数',
                        type:'line',
                        data:vm.uvD,
                        	smooth: true,
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        }
                    },
                    {
                        name:'次数',
                        type:'line',
                        data:vm.pvD,
                        	smooth: true,
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        }
                    }
                ]
            };
            myChart.setOption(option);
        },
        //访问点击当天
        todayaccess: function () {
            vm.dateType = 0;
            vm.startTime2 = vm.today();
            vm.endTime2 = vm.today();
            vm.emailvisit();
            $("#dayorhourA").html("时");
            $('#inpstart2').val(vm.today());
            $('#inpend2').val(vm.today());
        },
        //访问点击最近7天
        weekaccess: function () {
            vm.dateType = 1;
            vm.startTime2 = vm.showmanyDays(7);
            vm.endTime2 = vm.today();
            vm.emailvisit();
            $("#dayorhourA").html("日");
            $('#inpstart2').val(vm.showmanyDays(7));
            $('#inpend2').val(vm.today());
        },
        //访问点击最近30天
        monthaccess: function () {
            vm.dateType = 1;
            vm.startTime2 = vm.showmanyDays(30);
            vm.endTime2 = vm.today();
            vm.emailvisit();
            $("#dayorhourA").html("日");
            $('#inpstart2').val(vm.showmanyDays(30));
            $('#inpend2').val(vm.today());
        },
        //电子邮件页面访问
        emailvisit: function () {
            var data = {
                startDate:vm.startTime2,
                endDate:vm.endTime2,
                logIds:vm.emailLogIds
            };
            if(!vm.emailLogIds){
                if(vm.emailLogIds == ''||vm.emailLogIds == null){
                    dcrmAlertWarning("请选择发送批次");
                }
                return false;
            }
            if(data.startDate == data.endDate){
                vm.dateType = 0;
            }else{
                vm.dateType = 1;
            }
            MaskUtil.Loading();
            API.emailvisit(data, function (data) {
                if (data.code == 200) {
                    vm.count = data.data.sumData.pv;
                    vm.pv = [];
                    vm.uv = [];
                    vm.xAxis = [];
                    vm.lists = data.data.list;
                    $.each(vm.lists,function(i,u){
                        vm.pv.push(u.pv);
                        vm.uv.push(u.uv);
                        if(vm.dateType == 0){
                            vm.xAxis.push(u.hourCd);
                        }else{
                            vm.xAxis.push(u.dateCd);
                        }
                    })

                    setTimeout(function(){
                        vm.visitCharts();
                    },200);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //电子邮件页面访问图表
        visitCharts: function () {
                var myChart = echarts.init(document.getElementById('chart-v'));
                var option = {
                    title: {
                        text: '历史访问趋势',
                        x: 'center'
                    },
                    "color": [
                        "#5c7093",
                        "#7e8fe1"
                    ],
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top:'20%',
                        left: '6%',
                        right: '8%',
                        bottom: '10%',
                        containLabel: true,
                        x:0
                    },
                    legend: {
                        data:['人数','次数'],
                        x: '85%',
                        y: 'top'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: vm.xAxis
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '人数',
                            type: 'line',
                            data:  vm.uv,
                            smooth: true,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name: '次数',
                            type: 'line',
                            data:  vm.pv,
                            smooth: true,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            }
                        }
                    ]
                };
                myChart.setOption(option);

        },
        //邮件转化漏斗
        emailfunnel: function () {
            var data = {
                logIds: vm.emailLogIds
            };
            MaskUtil.Loading();
            API.emailfunnel(data, function (data) {
                if (data.code == 200) {
                    var obj = data.data.vo;
                    vm.maxnum = obj.send;
                    vm.funneldata = [
                        {'value':100.00,name:'发送'},
                        {'value':(Number((obj.arrive)*100/(obj.send))).toFixed(2),name:'收到'},
                        {'value':(Number((obj.open)*100/(obj.send))).toFixed(2),name:'查看'}
                        //{'value':(Number((obj.view)*100/(obj.send))).toFixed(2),name:'访问'}
                    ];
                    //vm.nums = [obj.send,obj.arrive,obj.open,obj.view];
                    vm.nums = [obj.send,obj.arrive,obj.open];
                    vm.rates[1] = (Number((obj.arrive)/(obj.send)*100)).toFixed(2)+'%';
                    vm.rates[2] = (Number((obj.open)/(obj.send)*100)).toFixed(2)+'%'
                    //vm.rates[3] = (Number((obj.view)/(obj.send)*100)).toFixed(2)+'%';
                    vm.funnelCharts();
                }else{
                    dcrmAlertWarning(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //邮件转化漏斗图表
        funnelCharts: function () {
            var myChart = echarts.init(document.getElementById('funnelchart')),
                options = {
                    title : {
                        text: '人数（人）'
                    },
                    "color": [
                        "#5c7093",
                        "#7e8fe1",
                        "#8c9deb",
                        "#99bce3"
                    ],
                    tooltip : {
                        trigger: 'item',
                        //formatter: "{a} <br/>{b} : {c}%"
                        formatter: function(a){
                            return (a['name']
                            +'</br>'+(Number(a['value']*vm.maxnum/100).toFixed(0)+'人'
                            ))
                        }
                    },
                    legend: {
                        data : vm.funnellists
                    },
                    calculable : true,
                    series : [
                        {
                            name:'人数（人）',
                            type:'funnel',
                            x: '10%',
                            y: 60,
                            //x2: 80,
                            y2: 60,
                            width: '80%',
                            // height: {totalHeight} - y - y2,
                            min: 0,
                            max: 100,
                            minSize: '0%',
                            maxSize: '100%',
                            sort : 'descending', // 'ascending', 'descending'
                            gap : 10,
                            itemStyle: {
                                normal: {
                                    // color: 各异,
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    label: {
                                        show: true,
                                        position: 'inside'
                                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                    },
                                    labelLine: {
                                        show: false,
                                        length: 10,
                                        lineStyle: {
                                            // color: 各异,
                                            width: 1,
                                            type: 'solid'
                                        }
                                    }
                                },
                                emphasis: {
                                    // color: 各异,
                                    borderColor: 'red',
                                    borderWidth: 5,
                                    label: {
                                        show: true,
                                        formatter: '{b}:{c}%',//鼠标悬浮看到的百分比
                                        textStyle:{
                                            fontSize:20
                                        }
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                }
                            },
                            data:vm.funneldata
                        }
                    ]
                };
            myChart.setOption(options);
        }
    }
});


