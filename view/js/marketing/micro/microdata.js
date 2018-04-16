var oid = window.location.search.split('=')[1];
if (window.location.search.split('&')[1]) {
    var category = window.location.search.split('&')[1].split('=')[0];
}
$("#mapIframe").load(function () {
    var iframeHeight = $(this).contents().find("body").height();
    $(this).height(iframeHeight);
});
/**
 * Created by Administrator on 2017/6/12 0012.
 */
$(function () {
    vm.explain();//问号提示
    var id = (vm.GetQueryString("id"));
    vm.pageId = id;
    if (category == 'share') {
        $('.share').click();
    } else if (category == 'submit') {
        $('.submit').click();
    }
    vm.startTime = vm.today();//第一次进来页面查看的是当天的时间
    $('#inpstart1').val(vm.today());//第一次进来页面查看的是当天的时间
    vm.endTime = vm.today();//第一次进来页面查看的是当天的时间
    $('#inpend1').val(vm.today());//第一次进来页面查看的是当天的时间
    //$("#chart-mapjs").load('/view/marketing/micro/map/map.html');
    vm.Iframe();
    setTimeout(function () {
        if (category == 'share') {
            vm.share();
        } else if (category == 'submit') {
            vm.submits();
        } else {

            vm.showPageData(false);
            //viewcharts();//访问趋势
            /*setTimeout(function(){*/
            //vm.trendcharts();//访问趋势--折线图---图表
            /*},2000)*/
        }

    }, 2000);
    $(".btn-groupbox .btn").on('click', function () {
        $(".btn-groupbox .btn").removeClass("active");
        $(this).addClass("active");
    })
    if (id) {
        vm.getHtml();
        $(".marketli").find("ul").show();
        $(".menuNormal").find("a").removeClass("active");
        $(".marketli").find("span").attr("class", "icon icon-jiantou");
        $(".marketli").find("ul #index_pagetouch").find("a").addClass("active");
    } else {
        $(".analyli").find("ul").show();
        $(".menuNormal").find("a").removeClass("active");
        $(".analyli").find("span").attr("class", "icon icon-jiantou");
        $(".analyli").find("ul #index_pageanalysis").find("a").addClass("active");
        vm.wechatList();//获取微页面列表
        /*setTimeout(function () {
            vm.getHtml();//查询是否含有表单
        },2000);*/
        vm.isShow = true;
    }
    if (oid) {
        $('.selectBox select').val(oid);
        $('.selectBox select').change();
    }


    /**************************************************/
//vm.ChartsP();//饼图
//vm.trendcharts();//访问趋势--折线图---图表


    /**************************************************/


});
var vm = new Vue({
    el: "#microdatapage",
    data: {
        datapv: '访问次数',//次数
        datauv: '访问人数',//人数
        dataTitle: '人均访问数',//人均访问数
        startTime: '',//开始时间
        endTime: '',//结束时间
        visituv: '0',//人数
        visitpv: '0',//次数
        eventCd: 'view',//事件 view：查看 share：分享 submit：提交
        dateType: '0',//时间类型  0：小时----当天 1：天----最近7天 最近30天
        count: '',//总访问次数--数值  饼图
        countTit: '总访问次数',////总访问次数--标题  饼图  区分次数还是人数
        isShow: false,//是否显示搜索下拉框
        wechatLists: [],//微页面模板列表
        pageId: '',//请求参数  pageId   也用于查询是否含有表单
        wechatTit: '',//选择的模板名
        isCludeForm: '',//是否含有表单
        submitShow: false,//表单提交选项卡是否展示
        Mshow: true,//前后。。。显示
        tjShow: true,//点击提交的时候没有次数显示
        channeltit: '各投放渠道访问次数/人数和比例',//饼图的标题
        chartstit: '历史访问趋势',//折线图标题
        channelTd: '访问次数（次）',//饼图的表格title
        perCap: [],//饼图的data
        reports: [],//统计报表表格
        viewpv: [],//访问趋势--折现图---次数
        viewuv: [],//访问趋势--折现图---人数
        viewxAxis: [],//访问趋势--折现图---X轴显示
        uv1: [],//全部员工访问人数
        pv1: [],//全部员工访问次数
        xAxis1: [],//X轴显示//全部员工----横坐标
        uv2: [],//下属员工访问人数
        pv2: [],//下属员工访问次数
        xAxis2: [],//X轴显示//全部员工----横坐标
        areaData: [],//地图的值---市
        areaDatauv: [],//地图的值---市-----人数
        provinceData: [],//地图的值---省
        provinceDatauv: [],//地图的值---省-----人数
        cityDatas: [],//地图表格的列表
        province: '',//为空默认全国
        lock: true,//是否刷新地图
        allstafftext: '全部员工传播的微页面访问人数/次数',//全部员工图表text
        substafftext: '下属员工传播的微页面访问人数/次数',//全部员工图表text
        subShow: true,//提交的表格是否显示
        sublists: [],//表单提交列表
        pieBtn: '查看人数',//饼状图查看次数，查看人数切换
        pieName: '访问次数',//饼状图图表标题
        allmain: '',//登录者的序号
        submain: '',//登录者的序号
        tableTitunitshow: true,
        itleP2show: true,
    },
    methods: {
        //iframe链接地址
        Iframe: function () {
            var src = '/view/marketing/micro/map/map.html?eventCd=' + vm.eventCd + '&&province=' + vm.province + '&&pageId=' + vm.pageId + '&&startDate=' + vm.startTime + '&&endDate=' + vm.endTime;
            //var src = '/view/marketing/micro/map/map.html?startDate=2017-12-15&endDate=2017-12-15&eventCd=view&pageId=10';
            $("#mapIframe").attr('src', src)
        },
        //查询是否含有表单
        getHtml: function () {
            var data = {
                id: vm.pageId
            }
            API.getHtml(data, function (res) {
                if (res.code == 200) {
                    var obj = res.data.html;
                    vm.isCludeForm = obj.isCludeForm;//是否含有表单
                    console.log(vm.isCludeForm);
                    if (vm.isCludeForm == 0) {
                        vm.submitShow = false;
                    }
                    if (vm.isCludeForm == 1) {
                        vm.submitShow = true;
                    }
                } else {
                    dcrmAlertError(data.msg);
                }
            });
        },
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
        //获取微页面列表
        wechatList: function () {
            MaskUtil.Loading();
            API.wechatlist({}, function (data) {
                if (data.code == 200) {
                    vm.wechatLists = data.data.pageData.list;
                    vm.wechatTit = data.data.pageData.list[0].id;
                    vm.pageId = vm.wechatTit;
                    vm.getHtml();//查询是否含有表单
                }
                else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //选择模板名
        change: function () {
            vm.pageId = vm.wechatTit;
            vm.getHtml();//查询是否含有表单
            vm.showPageData(true);
        },
        showPageData: function (submit) {
            if (vm.pageId === undefined || vm.pageId === '' || vm.pageId === null) {
                dcrmAlertError("请选择微页面！");
                return;
            }
            vm.perCapitaAnaly();//饼图
            vm.trendAnaly();//访问趋势--折线图
            vm.companyUserAnaly();//柱状图
            vm.statementAnaly();//统计报表t
            //vm.mapAnaly();//地图
            vm.Iframe();
            if (submit) {
                $('.ui-paging-container').eq(0).remove();
                vm.selectSubmint(0, 20);//表单提交
            }
        },
        //饼状图切换人数次数
        pieChange: function () {
            if (vm.eventCd == 'view') {
                if (vm.pieBtn == '查看人数') {
                    vm.pieBtn = '查看次数';
                    vm.pieName = '访问人数';
                } else {
                    vm.pieBtn = '查看人数';
                    vm.pieName = '访问次数';
                }
            }
            if (vm.eventCd == 'share') {
                if (vm.pieBtn == '查看人数') {
                    vm.pieBtn = '查看次数';
                    vm.pieName = '分享人数';
                } else {
                    vm.pieBtn = '查看人数';
                    vm.pieName = '分享次数';
                }
            }
            if (vm.eventCd == 'submit') {
                vm.pieBtn = '查看人数';
                vm.pieName = '提交次数';
            }

            vm.perCapitaAnaly();//饼图
        },
        //点击访问
        see: function () {
            vm.pieName = '访问次数';
            vm.subtbShow = false;
            vm.subShow = true;
            vm.dataTitle = '人均访问数';
            vm.datapv = '访问次数';
            vm.datauv = '访问人数';
            vm.eventCd = 'view';
            vm.channeltit = '各投放渠道访问次数比例';
            vm.chartstit = '历史访问趋势';
            vm.countTit = '总访问次数';
            vm.channelTd = '访问次数（次）';
            $("#titleP1").html('微页面访问流量地域分布');
            $("#titleP2").html('员工传播访问次数/人数');
            $(".pUV").html('访问人数');
            $(".pPV").html('访问次数');
            vm.tableTitunitshow = true;
            $("#tableTitunit").html('人均访问次数');
            vm.allstafftext = '全部员工传播的微页面访问人数/次数';
            vm.substafftext = '下属员工传播的微页面访问人数/次数';
            vm.showPageData(false);
            vm.itleP2show = true;
        },
        //点击分享
        share: function () {
            vm.subtbShow = false;
            vm.subShow = true;
            vm.dataTitle = '人均分享数';

            vm.pieName = '分享次数';
            vm.datapv = '分享次数';
            vm.datauv = '分享人数';
            vm.eventCd = 'share';
            vm.channeltit = '各投放渠道分享次数/人数和比例';
            vm.chartstit = '历史分享趋势';
            vm.countTit = '总分享次数';
            vm.channelTd = '分享次数（次）';
            $("#titleP1").html('微页面分享流量地域分布');
            $("#titleP2").html('员工传播分享次数/人数');
            $(".pUV").html('分享人数');
            $(".pPV").html('分享次数');
            vm.tableTitunitshow = false;
            vm.allstafftext = '全部员工传播的微页面分享人数/次数';
            vm.substafftext = '下属员工传播的微页面分享人数/次数';
            vm.showPageData(false);
            vm.itleP2show = false;
        },
        //点击提交
        submits: function () {
            vm.subtbShow = true;
            vm.subShow = false;
            vm.pieName = '提交人数';
            vm.dataTitle = '人均提交数';
            vm.datapv = '提交次数';
            vm.datauv = '提交人数';
            vm.eventCd = 'submit';
            vm.channeltit = '各投放渠道提交人数比例';
            vm.chartstit = '历史提交趋势';
            vm.countTit = '总提交人数';
            vm.channelTd = '提交人数（人）';
            $("#titleP1").html('微页面提交流量地域分布');
            $("#titleP2").html('员工传播提交次数/人数');
            $(".pUV").html('提交人数');
            $(".pPV").html('提交次数');
            vm.tableTitunitshow = false;
            vm.itleP2show = false;

            vm.allstafftext = '全部员工传播的微页面提交人数/次数';
            vm.substafftext = '下属员工传播的微页面提交人数/次数';
            vm.showPageData(false);
        },
        //点击当天
        nowday: function () {
            vm.startTime = vm.today();
            vm.endTime = vm.today();
            vm.dateType = 0;
            vm.showPageData(true);
            $("#dayorhour").html("时");
            $('#inpstart1').val(vm.today());
            $('#inpend1').val(vm.today());
        },
        //点击最近7天
        week: function () {
            vm.startTime = vm.showmanyDays(7);
            vm.endTime = vm.today();
            vm.dateType = 1;
            vm.showPageData(true);
            $("#dayorhour").html("日");
            $('#inpstart1').val(vm.showmanyDays(7));
            $('#inpend1').val(vm.today());
        },
        //点击最近30天
        month: function () {
            vm.startTime = vm.showmanyDays(30);
            vm.endTime = vm.today();
            vm.dateType = 1;
            vm.showPageData(true);
            $("#dayorhour").html("日");
            $('#inpstart1').val(vm.showmanyDays(30));
            $('#inpend1').val(vm.today());
        },


        /**************************************************/
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
            var endTime = date.setDate(date.getDate() - (n - 1));
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
            vm.showPageData(true);
        },
        //微页面分析----人均访问+访问渠道
        perCapitaAnaly: function () {
            var data = {
                eventCd: vm.eventCd,
                pageId: vm.pageId,
                startDate: vm.startTime,
                endDate: vm.endTime
            };
            MaskUtil.Loading();
            API.perCapitaAnaly(data, function (data) {
                if (data.code == 200) {
                    vm.perCap = [];
                    var res = data.data.channelData;
                    vm.visitpv = data.data.avgData.pv;
                    vm.visituv = data.data.avgData.uv;
                    if (res.length == 0) {
                        $("#chart-p_box").show();
                        $("#chart-p_box_btn").hide();

                    } else {
                        vm.perCap = [];
                        if (vm.eventCd == 'submit') {
                            $("#chart-p_box_btn").hide();
                        } else {
                            $("#chart-p_box_btn").show();
                        }
                        $("#chart-p_box").hide();
                        $.each(res, function (i, u) {
                            if (vm.pieBtn == '查看次数' || vm.pieBtn == '提交次数'||vm.eventCd == 'submit') {
                                var obj = {
                                    value: '',
                                    name: ''
                                };
                                obj.value = u.uv;
                                obj.name = u.channel;
                                vm.perCap.push(obj);
                            } else {
                                var obj = {
                                    value: '',
                                    name: ''
                                };
                                obj.value = u.pv;
                                obj.name = u.channel;
                                vm.perCap.push(obj);
                            }
                        });
                    }

                    //console.log(vm.perCap);
                    setTimeout(function () {
                        vm.ChartsP();
                    }, 1000)

                }
                else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //访问趋势
        trendAnaly: function () {
            var data = {
                eventCd: vm.eventCd,
                pageId: vm.pageId,
                startDate: vm.startTime,
                endDate: vm.endTime,
                dateType: vm.dateType
            };
            MaskUtil.Loading();
            API.trendAnaly(data, function (data) {
                if (data.code == 200) {
                    vm.viewxAxis = [];
                    vm.viewpv = [];
                    vm.viewuv = [];
                    var obj = data.data.data;
                    $.each(obj, function (i, u) {
                        vm.viewpv.push(u.pv);
                        vm.viewuv.push(u.uv);
                        if (vm.startTime == vm.endTime) {
                            vm.viewxAxis.push(u.hourCd);
                        } else {
                            vm.viewxAxis.push(u.dateCd);
                        }
                    });
                    console.log(vm.viewpv);
                    console.log(vm.viewuv);
                    console.log(vm.viewxAxis);
                    if (vm.viewxAxis.length > 30) {
                        window.viewend = 30;
                    }
                    if (20 > vm.viewxAxis.length > 30) {
                        window.viewend = 50;
                    }
                    if (vm.viewxAxis.length < 20) {
                        window.viewend = 100;
                    }
                    setTimeout(function () {
                        if (vm.eventCd == 'submit') {
                            vm.viewchartsub();//访问趋势 ----提交
                        } else {
                            vm.viewcharts();//访问趋势
                        }
                    }, 1000)

                }
                else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //员工传播访问
        companyUserAnaly: function () {
            var data = {
                eventCd: vm.eventCd,
                pageId: vm.pageId,
                startDate: vm.startTime,
                endDate: vm.endTime,
                dateType: vm.dateType
            };
            MaskUtil.Loading();
            API.companyUserAnaly(data, function (data) {
                if (data.code == 200) {
                    vm.uv1 = [];
                    vm.pv1 = [];
                    vm.xAxis1 = [];
                    vm.uv2 = [];
                    vm.pv2 = [];
                    vm.xAxis2 = [];
                    var allUserData = data.data.allUserData;//全体员工
                    var subData = data.data.subData;//下属员工
                    if (allUserData.length == 0) {
                        $("#chart_box1_box").show();
                    } else {
                        $("#chart_box1_box").hide();
                        $.each(allUserData, function (i, u) {
                            if (u.id == Global.userId) {
                                vm.allmain = i
                            }
                            vm.uv1.push(u.uv);
                            vm.pv1.push(u.pv);
                            vm.xAxis1.push(u.user_name);
                            if (vm.xAxis1.length > 30) {
                                window.allstaffend = 30;
                            }
                            if (20 > vm.xAxis1.length > 30) {
                                window.allstaffend = 50;
                            }
                            if (vm.xAxis1.length < 20) {
                                window.allstaffend = 100;
                            }
                        })
                    }
                    if (subData.length == 0) {
                        $("#chart_box2_box").show();
                    } else {
                        $("#chart_box2_box").hide();
                        $.each(subData, function (i, u) {
                            if (u.id == Global.userId) {
                                vm.submain = i
                            }
                            vm.uv2.push(u.uv);
                            vm.pv2.push(u.pv);
                            vm.xAxis2.push(u.user_name);
                            if (vm.xAxis2.length > 30) {
                                window.substaffend = 30;
                            }
                            if (20 > vm.xAxis2.length > 30) {
                                window.substaffend = 50;
                            }
                            if (vm.xAxis2.length < 20) {
                                window.substaffend = 100;
                            }
                        })
                    }

                    setTimeout(function () {
                        vm.allstaff();//所有员工
                        vm.substaff();//下属员工
                    }, 1000)
                }
                else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //统计报表
        statementAnaly: function () {
            var data = {
                dateType: vm.dateType,
                eventCd: vm.eventCd,
                pageId: vm.pageId,
                startDate: vm.startTime,
                endDate: vm.endTime
            };
            MaskUtil.Loading();
            API.statementAnaly(data, function (data) {
                if (data.code == 200) {
                    vm.reports = data.data.data;
                }
                else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //表单提交
        selectSubmint: function (page, size) {
            var data = {
                pageId: vm.pageId,
                startDate: vm.startTime,
                endDate: vm.endTime,
                "pageIndex": page,
                "pageSize": size
            };
            MaskUtil.Loading();
            API.selectSubmint(data, function (data) {
                if (data.code == 200) {
                    vm.sublists = data.data.data.list;
                    vm.subpages = data.data.data.page;
                    if (vm.sublists.length != 0) {
                        if (page == 0) {
                            $('.ui-paging-container').eq(0).remove();
                            $('#submitCustPage').Paging({
                                pagesize: 20, count: vm.subpages.total, toolbar: true, callback: function (page, size) {
                                    vm.selectSubmint(page, size);
                                }
                            });
                        }
                    }
                }
                else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },


//饼图
        ChartsP: function () {
            var myChart = echarts.init(document.getElementById('chart-p'));
            var option = {
                noDataLoadingOption: {
                    text: '暂无数据',
                    effect: 'bubble',
                    effectOption: {
                        effect: {
                            n: 0
                        }
                    }
                },
                title: {
                    text: vm.channeltit,//各投放渠道访问次数/人数和比例
                    x: 'center'
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
                    //formatter: "{a} <br/>{b} : {c} ({d}%)"
                    formatter: "{a} <br/>{b} : {c}"
                },
                grid: {
                    top: '20%',
                    left: '6%',
                    right: '8%',
                    bottom: '10%',
                    containLabel: true,
                    borderWidth: 0,
                    x: 0
                },
                calculable: false,
                series: [
                    {
                        name: vm.pieName,
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '45%'],
                        /*data:[
                         {value:335, name:'直接访问'},
                         {value:310, name:'邮件营销'},
                         {value:234, name:'联盟广告'},
                         {value:135, name:'视频广告'},
                         {value:1548, name:'搜索引擎'}
                         ]*/
                        data: vm.perCap
                    }
                ]
            };
            myChart.setOption(option);
        },
//饼图
//访问趋势   折线图
        viewcharts: function () {
            var myChart = echarts.init(document.getElementById('viewchart'));

            var option = {
                title: {
                    text: vm.chartstit,
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
                        end: window.viewend,
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: vm.viewxAxis,
                        axisPointer: {
                            type: 'shadow'
                        }
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
                        type: 'line',        //line表示折线图
                        data: vm.viewuv,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        },
                    },
                    {
                        name: '次数',
                        type: 'line',
                        data: vm.viewpv,
                        smooth: true,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        },
                    }
                ]
            };
            myChart.setOption(option);
        },
//访问趋势
//提交趋势   折线图
        viewchartsub: function () {
            var myChart = echarts.init(document.getElementById('viewchartsub'));

            var option = {
                title: {
                    text: vm.chartstit,
                    x: 'center'
                },
                noDataLoadingOption: {
                    text: '暂无数据',
                    effect: 'bubble',
                    effectOption: {
                        effect: {
                            n: 0
                        }
                    }
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
                    data: ['人数'],
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
                        end: window.viewend,
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: vm.viewxAxis,
                        axisPointer: {
                            type: 'shadow'
                        }
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
                        type: 'line',        //line表示折线图
                        data: vm.viewuv,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        },
                    }
                ]
            };
            myChart.setOption(option);
        },
//提交趋势
// 全体员工
        allstaff: function () {
            /*图表*/
            var myChart = echarts.init(document.getElementById('chart_box1'));
            var option = {
                title: {
                    text: vm.allstafftext,//'员工传播的微页面访问人数/次数',//图表标题
                    noDataLoadingOption: {
                        text: '暂无数据',
                        effect: 'bubble',
                        effectOption: {
                            effect: {
                                n: 0
                            }
                        }
                    },
                    textStyle: {
                        //文字颜色
                        color: '#000',
                        //字体风格,'normal','italic','oblique'
                        fontStyle: 'normal',
                        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                        fontWeight: 'bold',
                        //字体系列
                        fontFamily: 'sans-serif',
                        //字体大小
                        fontSize: 14
                    }
                },
                grid: {
                    top: '18%',
                    left: '1%',
                    right: '50',
                    bottom: '12%',
                    containLabel: true,
                    x: 0,
                    borderWidth: 0
                },
                tooltip: {
                    trigger: 'axis',    //提示触发类型      'item':数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                    //'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                    //'none':什么都不触发。
                    show: true,     //是否显示提示框组件 默认为true
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },

                legend: {
                    data: ['次数', '人数'],
                    x: 'right'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: window.allstaffend,
                    }],
                xAxis: [
                    {
                        type: 'category',
                        data: vm.xAxis1,
                        axisPointer: {
                            type: 'shadow'
                        }

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        //name: '次数',
                        min: 0,
                        //max: 250,
                        //interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '次数',
                        type: 'bar',         //bar表示柱状图
                        data: vm.pv1,//数据
                        barWidth: 10,//柱图宽度
                        markPoint: {
                            data: [
                                {
                                    type: 'max', name: '最大值',
                                    itemStyle: {
                                        normal: {
                                            color: '#606cbf'
                                        }
                                    }
                                },
                                {
                                    type: 'min', name: '最小值',
                                    itemStyle: {
                                        normal: {
                                            color: '#606cbf'
                                        }
                                    }
                                }
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        },
                        itemStyle: {    //更多柱状图样式搜索API：series-bar.itemStyle
                            emphasis: {
                                barBorderRadius: [5, 5, 0, 0],

                            },
                            normal: {
                                color: function (params) {
                                    if (params.dataIndex == vm.allmain) {
                                        return 'red';
                                    }
                                    else {
                                        return '#8c9deb';
                                    }
                                },//改变柱状的颜色
                                borderColor: '#8c9deb', //描边的颜色：默认#000
                                borderWidth: 0,  //描边的宽度     默认：0
                                borderType: 'solid',  //描边的类型：'dashed', 'dotted'，'solid'(默认)
                                barBorderRadius: [5, 5, 0, 0],
                                /*
                                更多样式：
                                barBorderRadius:'10'//柱状的圆角
                                shadowBlur：图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                                shadowColor,shadowOffsetX, shadowOffsetY ：图形阴影效果
                                */
                            }
                        },
                    },
                    {
                        name: '人数',
                        type: 'line',        //line表示折线图
                        data: vm.uv1,
                        itemStyle: {    //更多折线图线条样式搜索API：series-line.itemStyle
                            normal: {
                                color: '#02cd81',//改变柱状的颜色
                                lineStyle: {    //改变折线样式
                                    color: '#02cd81', //改变折线颜色
                                    width: 3,    //改变线条的粗细
                                },
                            }
                        },
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
// 全体员工
//下属员工
        substaff: function () {
            var myChart = echarts.init(document.getElementById('chart_box2'));
            var option = {
                title: {
                    text: vm.substafftext,//'员工传播的微页面访问人数/次数',//图表标题
                    textStyle: {
                        //文字颜色
                        color: '#000',
                        //字体风格,'normal','italic','oblique'
                        fontStyle: 'normal',
                        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                        fontWeight: 'bold',
                        //字体系列
                        fontFamily: 'sans-serif',
                        //字体大小
                        fontSize: 14
                    }
                },
                grid: {
                    top: '18%',
                    left: '1%',
                    right: '50',
                    bottom: '12%',
                    containLabel: true,
                    x: 0,
                    borderWidth: 0
                },
                /*grid: {
                    top:'18%',
                    left: '1%',
                    right: '2%',
                    bottom: '15%',
                    containLabel: true,
                    x:0
                },*/
                tooltip: {
                    trigger: 'axis',    //提示触发类型      'item':数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                    //'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                    //'none':什么都不触发。
                    show: true,     //是否显示提示框组件 默认为true
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },

                legend: {
                    data: ['次数'],
                    x: 'right'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: window.substaffend,
                    }],
                xAxis: [
                    {
                        type: 'category',
                        data: vm.xAxis2,
                        axisPointer: {
                            type: 'shadow'
                        }

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        //name: '次数',
                        min: 0,
                        //max: 250,
                        //interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '次数',
                        type: 'bar',         //bar表示柱状图
                        data: vm.pv2,//数据
                        barWidth: 10,//柱图宽度
                        markPoint: {
                            data: [

                                {
                                    type: 'max', name: '最大值',
                                    itemStyle: {
                                        normal: {
                                            color: '#606cbf'
                                        }
                                    }
                                },
                                {
                                    type: 'min', name: '最小值',
                                    itemStyle: {
                                        normal: {
                                            color: '#606cbf'
                                        }
                                    }
                                }

                            ]
                        },
                        markLine: {
                            data: [
                                {
                                    type: 'average', name: '平均值',
                                    itemStyle: {
                                        normal: {
                                            color: '#606cbf'
                                        }
                                    }
                                }
                            ]
                        },
                        itemStyle: {    //更多柱状图样式搜索API：series-bar.itemStyle
                            emphasis: {
                                barBorderRadius: [5, 5, 0, 0],

                            },
                            normal: {
                                color: function (params) {
                                    if (params.dataIndex == vm.submain) {
                                        return 'red';
                                    }
                                    else {
                                        return '#8c9deb';
                                    }
                                },//改变柱状的颜色
                                borderColor: '8c9deb', //描边的颜色：默认#000
                                borderWidth: 0,  //描边的宽度     默认：0
                                borderType: 'solid',  //描边的类型：'dashed', 'dotted'，'solid'(默认)
                                barBorderRadius: [5, 5, 0, 0],
                                /*
                                更多样式：
                                barBorderRadius:'10'//柱状的圆角
                                shadowBlur：图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                                shadowColor,shadowOffsetX, shadowOffsetY ：图形阴影效果
                                */
                            }
                        },
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
// 下属员工
    }
    /**************************************************/

});







