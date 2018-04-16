/**
 * Created by Administrator on 2017/6/12 0012.
 */
$(function(){
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_wechatGrouptouch").find("a").addClass("active");
    vm.explain();//问号提示
    vm.id = (vm.GetQueryString("id"));
    vm.nowday();//第一次进来默认当天
    $(".btn-groupbox .btn").on('click',function(){
        $(".btn-groupbox .btn").removeClass("active");
        $(this).addClass("active");
    });
});
var vm = new Vue({
    el: "#wechatdatapage",
    data: {
        startTime:'',//开始时间
        endTime:'',//结束时间
        xAxis:[],//X轴显示
        uv:[],//人数  数组
        pv:[],//次数  数组
        id:'',//微信群记录id
        dateType:'0',//时间类型  0：当天 1：最近7天 最近30天
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
        showMonth:function(ele){
            var start;
            var end = vm.today();
            var date = new Date(Date.parse(end));
            var endTime = date.setMonth(date.getMonth()-ele);//new Date().setMonth((new Date().getMonth()-1));
            //var endTime = date.setDate(-3);
            var d=new Date(endTime);
            //start = vm.formatDate(d).replace(/-/g, "/");
            start = vm.formatDate(d);
            return start;
        },
        //点击搜索
        search:function(){
            vm.dateType = 1;
            vm.startTime = $("#inpstart1").val();
            vm.endTime = $("#inpend1").val();
            if($("#inpstart1").val() == ''||$("#inpend1").val() == ''){
                dcrmAlertWarning('请选择时间段');
                return;
            }
            vm.wechatgroupvisit();
        },
        //点击当天
        nowday: function () {
            vm.startTime = vm.today();
            vm.endTime = vm.today();
            vm.dateType = 0;
            vm.wechatgroupvisit();
            $("#dayorhour").html("时");
        },
        //点击最近7天
        week: function () {
            vm.startTime = vm.showmanyDays(7);
            vm.endTime = vm.today();
            vm.dateType = 1;
            vm.wechatgroupvisit();
            $("#dayorhour").html("日");
        },
        //点击最近30天
        month: function () {
            vm.startTime = vm.showMonth(1);
            vm.endTime = vm.today();
            vm.dateType = 1;
            vm.wechatgroupvisit();
            $("#dayorhour").html("日");
        },

        //微信群页面访问
        wechatgroupvisit:function(){
            var data = {
                startDate:vm.startTime,
                endDate:vm.endTime,
                logIds:vm.id
            };
            MaskUtil.Loading();
            API.wechatgroupvisit(data, function(data){
                if (data.code == 200) {
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
                        if(vm.xAxis.length>30){
                            window.end = 30;
                        }
                        if(20>vm.xAxis.length>30){
                            window.end = 50;
                        }
                        if(vm.xAxis.length<20){
                            window.end = 100;
                        }
                    });

                    setTimeout(function(){
                        vm.Charts();
                    },100);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //charts图表
        Charts: function () {
            var myChart = echarts.init(document.getElementById('chart'));
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
                dataZoom: [
                        {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: window.end
                        }],
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
                        data:  vm.pv,
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
                        data:   vm.uv,
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

        }
    }
})
