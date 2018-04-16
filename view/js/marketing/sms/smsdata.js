if (window.location.search.split('&')[1]) {
    var isindex = window.location.search.split('&')[1].split('=')[0];
}
console.log(isindex);
/**
 * Created by Administrator on 2017/6/12 0012.
 */
$(function () {
    vm.explain();//问号提示
    var id = (vm.GetQueryString("id"));
    vm.id = id;
    vm.smsLogIds = id;

    /*****发送批次可以多选*****/
    /* $(".pcSelect").multiselect({
         multiple: true,
         noneSelectedText: "请选择发送批次",
         selectedList:1000
     });*/
    /*****发送批次可以多选*****/
    if (isindex === 'index') {
        $('.indexList').click();
        vm.funnelpage();
    }
    vm.startTime = vm.today();//第一次进来页面查看的是当天的时间
    $('#inpstart1').val(vm.today());//第一次进来页面查看的是当天的时间
    vm.endTime = vm.today();//第一次进来页面查看的是当天的时间
    $('#inpend1').val(vm.today());//第一次进来页面查看的是当天的时间

    setTimeout(function () {
        vm.smsvisit();
    }, 1800);

    $(".btn-groupbox .btn").on('click', function () {
        $(".btn-groupbox .btn").removeClass("active");
        $(this).addClass("active");
    })
    if (id) {
        $(".marketli").find("ul").show();
        $(".menuNormal").find("a").removeClass("active");
        $(".marketli").find("span").attr("class", "icon icon-jiantou");
        $(".marketli").find("ul #index_smstouch").find("a").addClass("active");
        vm.isShow = false;
    } else {
        $(".analyli").find("ul").show();
        $(".menuNormal").find("a").removeClass("active");
        $(".analyli").find("span").attr("class", "icon icon-jiantou");
        $(".analyli").find("ul #index_smsanalysis").find("a").addClass("active");
        vm.smslist();

        setTimeout(function () {
            vm.smsSendLog();
        }, 800);
        vm.isShow = true;
    }
});
var vm = new Vue({
    el: "#smsdatapage",
    data: {
        visitpv: '',//访问次数;
        visituv: '',//访问人数;
        startTime: '',//开始时间
        endTime: '',//结束时间
        id: '',//跳转到转化漏斗页面传参用
        uv: [],//访问人数
        pv: [],//访问次数
        xAxis: [],//X轴显示//----横坐标
        dateType: '0',//时间类型  0：当天 1：最近7天 最近30天
        isShow: false,//下拉框是否显示
        smslists: [],//短信模板列表
        smsTit: '',//选择的短信模板名
        ideaSmsId: '',//获取发送记录请求参数 ideaSmsId
        Sendlists: [],//短信发送批次列表
        SendTit: '',//选择的短信发送批次
        smsLogIds: '',//请求参数  发送批次smsLogIds
        funneldata: [],//获取到的数组
        maxnum: '',//转化漏斗里面最大的值----发送
        funnellists: ['发送', '收到', '访问'],
        nums: [],//人数
        rates: ['100%', '0%', '0%'],//转化率
        monthShow: true,//30天表格
        AMshow: true//前后。。。显示
    },
    methods: {
        //问号提示
        explain: function () {
            $('.explain').mouseenter(function () {
                $(this).find(".popover").show();
            }).mouseleave(function () {
                $(this).find(".popover").hide();
            });
        },
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        //获取今天的日期
        formatDate: function (now) {
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            if (month < 10) {
                month = "0" + month
            }
            var date = now.getDate();
            if (date < 10) {
                date = "0" + date
            }
            return year + "-" + month + "-" + date;
        },
        //获取今天日期
        today: function () {
            var mydate = new Date();
            var mm = mydate.getMonth() + 1;
            var dd = mydate.getDate();
            if (mm < 10) {
                mm = "0" + mm
            }
            if (dd < 10) {
                dd = "0" + dd
            }
            var str = "" + mydate.getFullYear() + "-";
            str += mm + "-";
            str += dd;
            return str;
        },
        //获取最近7天日期
        showmanyDays: function (n) {
            var start;
            var end = vm.today();
            var date = new Date(Date.parse(end));
            var endTime = date.setDate(date.getDate() - n + 1);
            //var endTime = date.setDate(-3);
            var d = new Date(endTime);
            //start = vm.formatDate(d).replace(/-/g, "/");
            start = vm.formatDate(d);
            return start;
        },
        //获取最近一个月日期
        /*showMonth: function (ele) {
            var start;
            var end = vm.today();
            var date = new Date(Date.parse(end));
            var endTime = date.setMonth(date.getMonth() - ele);//new Date().setMonth((new Date().getMonth()-1));
            //var endTime = date.setDate(-3);
            var d = new Date(endTime);
            //start = vm.formatDate(d).replace(/-/g, "/");
            start = vm.formatDate(d);
            return start;
        },*/
        //点击搜索
        search: function () {
            vm.dateType = 1;
            vm.startTime = $("#inpstart1").val();
            vm.endTime = $("#inpend1").val();
            if ($("#inpstart1").val() == '' || $("#inpend1").val() == '') {
                dcrmAlertWarning('请选择时间段');
                return;
            }
            if (vm.startTime === vm.endTime) {
                vm.dateType = 0;
            }
            vm.smsvisit();
        },
        //跳转到转化漏斗页面
        funnelpage: function () {
            setTimeout(function () {
                vm.smsfunnel();
            }, 1500);
        },
        //获取短信模板列表
        smslist: function () {
            MaskUtil.Loading();
            API.smsListForAnaly({}, function (data) {
                if (data.code == 200) {
                    vm.smslists = data.data.pageData.list;
                    if (vm.smslists.length > 0) {
                        vm.smsTit = data.data.pageData.list[0].id;
                        vm.ideaSmsId = data.data.pageData.list[0].id;
                    }
                }
                else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //获取短信发送批次列表
        smsSendLog: function () {
            var data = {
                ideaSmsId: vm.ideaSmsId
            }
            MaskUtil.Loading();
            API.smsSendLog(data, function (data) {
                if (data.code == 200) {
                    /* var str = "";
                     var result = data.data.list;
                     if (result) {
                         $.each(result, function (i, dat) {
                             str += " <option value='" + dat.id + "'>" + dat.id + "</option>";
                         });
                         $(".pcSelect").html(str);
                     } else {

                     }
                     console.log(str);*/
                    vm.Sendlists = data.data.list;
                    if (data.data.list.length > 0) {
                        vm.SendTit = data.data.list[0].id;
                        vm.smsLogIds = vm.SendTit;
                    } else {
                        vm.SendTit = "";
                        vm.smsLogIds = "";
                    }
                    console.log(vm.smsLogIds);
                }
                else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //选择模板名
        smsTitChange: function () {
            vm.ideaSmsId = vm.smsTit;
            vm.smsSendLog();
            vm.smsLogIds = vm.SendTit;
            setTimeout(function () {
                if ($("#datapage").hasClass("active in")) {
                    vm.smsvisit();
                } else {
                    vm.smsfunnel();
                }
            }, 1500)
        },
        //选择发送批次
        SendTitChange: function () {
            vm.smsLogIds = vm.SendTit;
            if ($("#datapage").hasClass("active in")) {
                vm.smsvisit();
            } else {
                vm.smsfunnel();
            }
        },
        //点击当天
        nowday: function () {
            vm.startTime = vm.today();
            vm.endTime = vm.today();
            vm.dateType = 0;
            vm.smsvisit();
            $("#dayorhour").html("时");
            $('#inpstart1').val(vm.today());
            $('#inpend1').val(vm.today());
        },
        //点击最近7天
        week: function () {
            vm.startTime = vm.showmanyDays(7);
            vm.endTime = vm.today();
            vm.dateType = 1;
            vm.smsvisit();
            $("#dayorhour").html("日");
            $('#inpstart1').val(vm.showmanyDays(7));
            $('#inpend1').val(vm.today());
        },
        //点击最近30天
        month: function () {
            vm.startTime = vm.showmanyDays(30);
            vm.endTime = vm.today();
            vm.dateType = 1;
            vm.smsvisit();
            $("#dayorhour").html("日");
            $('#inpstart1').val(vm.showmanyDays(30));
            $('#inpend1').val(vm.today());
        },
        //短信页面访问
        smsvisit: function () {
            var data = {
                startDate: vm.startTime,
                endDate: vm.endTime,
                logIds: vm.smsLogIds
            };
            if (!vm.smsLogIds) {
                if (vm.smsLogIds == '' || vm.smsLogIds == null) {
                    dcrmAlertWarning("请选择发送批次");
                }
                return false;
            }
            MaskUtil.Loading();
            API.smsvisit(data, function (data) {
                if (data.code == 200) {
                    vm.visitpv = data.data.sumData.pv;
                    vm.visituv = data.data.sumData.uv;
                    vm.uv = [];
                    vm.pv = [];
                    vm.xAxis = [];
                    vm.lists = data.data.list;
                    vm.allArr = [];

                    $.each(vm.lists, function (i, u) {
                        vm.uv.push(u.uv);
                        vm.pv.push(u.pv);
                        if (vm.dateType == 0) {
                            vm.xAxis.push(u.hourCd);
                        } else {
                            vm.xAxis.push(u.dateCd);
                        }
                        if (vm.xAxis.length > 30) {
                            window.end = 30;
                        }
                        if (20 > vm.xAxis.length > 30) {
                            window.end = 50;
                        }
                        if (vm.xAxis.length < 20) {
                            window.end = 100;
                        }

                    });
                    setTimeout(function () {
                        vm.Charts();
                    }, 200);
                } else {
                    dcrmAlertWarning(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //页面访问图表
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
                    top: '20%',
                    left: '6%',
                    right: '8%',
                    bottom: '10%',
                    containLabel: true,
                    x: 0
                },
                legend: {
                    data: ['人数', '次数'],
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
                        data: vm.uv,
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
                        data: vm.pv,
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
        //短信转化漏斗
        smsfunnel: function () {
            var data = {
                logIds: vm.smsLogIds
            };
            if (!vm.smsLogIds) {
                if (vm.smsLogIds == '' || vm.smsLogIds == null) {
                    dcrmAlertWarning("请选择发送批次");
                }
                return false;
            }
            MaskUtil.Loading();
            API.smsfunnel(data, function (data) {
                if (data.code == 200) {
                    var obj = data.data.vo;
                    vm.maxnum = obj.send;
                    vm.funneldata = [
                        {'value': 100.00, name: '发送'},
                        {'value': (Number((obj.arrive) * 100 / (obj.send))).toFixed(2), name: '收到'},
                        //{'value':(Number((obj.open)*100/(obj.send))).toFixed(2),name:'查看'},
                        {'value': (Number((obj.view) * 100 / (obj.send))).toFixed(2), name: '访问'}
                    ];

                    vm.nums = [obj.send, obj.arrive, obj.view];
                    vm.rates[1] = (Number((obj.arrive) / (obj.send) * 100)).toFixed(2) + '%';
                    //vm.rates[2] = (Number((obj.open)/(obj.send)*100)).toFixed(2)+'%';
                    vm.rates[2] = (Number((obj.view) / (obj.send) * 100)).toFixed(2) + '%';

                    setTimeout(function () {
                        vm.funnelCharts();
                    }, 200);
                } else {
                    dcrmAlertWarning(data.msg)
                }
                MaskUtil.RemoveLoading();
            });
        },
        //转化漏斗图表
        funnelCharts: function () {
            var myChart = echarts.init(document.getElementById('chart-p')),
                options = {
                    title: {
                        text: '人数（人）'
                    },
                    "color": [
                        "#5c7093",
                        "#7e8fe1",
                        "#8c9deb",
                        "#99bce3",
                        "#7dd6b8",
                        "#a0e3ce",
                        "#c1ebdd",
                        "#cfcfcf",
                        "#ebebeb"
                    ],
                    tooltip: {
                        trigger: 'item',
                        //formatter: "{a} <br/>{b} : {c}%"
                        formatter: function (a) {
                            return (a['name']
                                + '</br>' + (Number(a['value'] * vm.maxnum / 100).toFixed(0)) + '人'
                            )
                        }
                    },
                    legend: {
                        data: vm.funnellists
                    },
                    calculable: true,
                    series: [
                        {
                            name: '人数（人）',
                            type: 'funnel',
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
                            sort: 'descending', // 'ascending', 'descending'
                            gap: 10,
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
                                        formatter: '{b}:{c}%',
                                        textStyle: {
                                            fontSize: 20
                                        }
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                }
                            },
                            data: vm.funneldata
                        }
                    ]
                };
            myChart.setOption(options);
        }
    }
});
