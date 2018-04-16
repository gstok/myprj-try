/**
 * Created by Administrator on 2017/7/12 0012.
 */
 function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var id = (GetQueryString("id"));
    var worken_token = GetQueryString("worken_token");
var API={
    //项目名字改变修改此处
    baseUrl:"",
    baseApi:"/user-apis",
    post: function (url, data,async, callback, errorcallback) {
        var settings = {
            type: 'POST',
            url: API.baseApi+url,
            data: data,
            cache: false,
            async: async,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            /*beforeSend: function () {
                return true;
            },*/
            beforeSend: function (xhr) {
                // //发送ajax请求之前向http的head里面加入验证信息
                xhr.setRequestHeader("Authorization", "Bearer "+worken_token); // 请求发起前在头部附加token
                //xhr.setRequestHeader("Cookie", "worken_token="+worken_token); // 请求发起前在头部附加token
                xhr.setRequestHeader("Worken-Device-Type", "android"); // 请求发起前在头部附加token
            },
            success: function (res) {
                callback(res);
            }
        };
        $.ajax(settings);
    },
    //人群分析
    groupAnalysis:function(param,callback){
        API.post("/pc/custGroup/groupAnalysis.action",param,true,callback);
    },
};
$(function(){
    var data = {
        id:id
    }
    API.groupAnalysis(data, function(data) {
        if (data.code == 200) {
            //性别
            $.each(data.data.sexMap,function(i,u){
                if(i == ""||i == null||i == undefined){
                    i = '未知';
                }
                var param = {
                    "value":u,
                    "name":i
                };
                sexMap.push(param);
            });
            //性别 end
            //年龄
            $.each(ageMapX,function(i,u){
                for(key in data.data.ageMap){
                    if(key == u){
                        ageMapY[i] = data.data.ageMap[key]
                    }
                }
            });
            //年龄 end
            //婚姻
            $.each(marriageX,function(i,u){
                for(key in data.data.maritalMap){
                    if(key == u){
                        marriageY[i] = data.data.maritalMap[key]
                    }
                }
            });
            //婚姻 end
            //区域
            $.each(data.data.provinceMap,function(i,u){
                var param = {
                    "name":i,
                    "value":u
                };
                map.push(param);
            });
            //区域 end
            //销售阶段
            $.each(salestageX,function(i,u){
                for(key in data.data.stageMap){
                    if(key == u){
                        salestageY[i] = data.data.stageMap[key]
                    }
                }
            });
            //销售阶段 end
            //接受渠道
            for(key in data.data.emailMap){//邮件接受
                if(key == '接受'){
                    cuscanalYes.push(data.data.emailMap[key])
                }
            }
            for(key in data.data.emailMap){//邮件不接受
                if(key == '不接受'){
                    cuscanalNo.push(-(data.data.emailMap[key]))
                }
            }
            for(key in data.data.smsMap){//短信接受
                if(key == '接受'){
                    cuscanalYes.push(data.data.smsMap[key])
                }
            }
            for(key in data.data.smsMap){//短信不接受
                if(key == '不接受'){
                    cuscanalNo.push(-(data.data.smsMap[key]))
                }
            }
            //接受渠道 end
            //会员级别
            $.each(data.data.levelMap,function(i,u){
                if(i == ""||i == null||i == undefined){
                    i = '未知';
                }
                var param = {
                    "value":u,
                    "name":i
                };
                levelMap.push(param);
            });
            //会员级别 end
            //客户来源
            $.each(data.data.sourceMap,function(i,u){
                if(i == ""||i == null||i == undefined){
                    i = '未知';
                }
                var param = [i,u];
                sourceMap.push(param);
            });
            //客户来源 end
            Charts();
        }else{

        }
    });
})
var sexMap = [];//性别
var ageMapX = ['未知','18岁以下','19-25岁','26-35岁','36-45岁','46-55岁','56-65岁','65岁以上'];//年龄X轴
var ageMapY = [0,0,0,0,0,0,0,0];//年龄Y轴
var marriageX = ['未知','未婚','已婚','离异'];//婚姻X轴
var marriageY = [0,0,0,0];//婚姻Y轴
var map = [];//区域
var salestageX = ['新客户','初次接触','意向线索','成交客户'];//销售阶段X轴
var salestageY = [0,0,0,0];//销售阶段Y轴
var cuscanalMapY = ['邮件','短信'];//客户接受渠道Y轴
var cuscanalYes = [];//愿意
var cuscanalNo = [];//不愿意
var levelMap = [];//会员级别
var sourceMap = [];//客户来源

function Charts(){
//性别占比 饼图
var sexChart = echarts.init(document.getElementById('sexChart'));
var sexOption = {
    title : {
        text: '性别占比',
        x:'center',
        y:20
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
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    grid: {
        top:'0%',
        left: '0%',
        right: '0%',
        bottom: '10%',
        containLabel: true
    },
    calculable : true,
    series : [
        {
            name:'性别占比',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:sexMap
            /*data:[
                {value:335, name:'男'},
                {value:310, name:'女'},
                {value:1548, name:'未知'}
            ]*/
        }
    ]
};
sexChart.setOption(sexOption);
//性别占比饼图 end
//年龄占比
var ageChart = echarts.init(document.getElementById('ageChart'));
var ageOption = {
    title : {
        text: '年龄占比',
        x:'center'
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
    tooltip : {
        trigger: 'axis'
    },
    grid: {
        top:'30%',
        left: '2%',
        right: '2%',
        bottom: '10%',
        containLabel: true,
        x:0
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ageMapX
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'人数',
            type:'bar',
            barWidth : 20,//柱图宽度
            data:ageMapY,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        }
    ]
};
ageChart.setOption(ageOption);
//年龄占比  end

//婚姻状况占比
var marriageChart = echarts.init(document.getElementById('marriageChart'));
var marriageOption = {
    title : {
        text: '婚姻状况分布',
        x:'center'
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
    tooltip : {
        trigger: 'axis'
    },
    grid: {
        top:'30%',
        left: '2%',
        right: '2%',
        bottom: '10%',
        containLabel: true,
        x:0
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : marriageX
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'人数',
            type:'bar',
            barWidth : 30,//柱图宽度
            data:marriageY,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        }
    ]
};
marriageChart.setOption(marriageOption);
//婚姻状况占比  end

//区域分布
var mapChart = echarts.init(document.getElementById('mapChart'));
var mapOption = {
    title : {
        text: '区域分布',
        x:'center'
    },
    tooltip : {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        x:'left'
    },
    dataRange: {
        min: 0,
        max: 200,
        x: 'left',
        y: 'bottom',
        text:['高','低'],
        calculable : true
    },
    roamController: {
        show: true,
        x: 'right',
        mapTypeControl: {
            'china': true
        }
    },
    series : [
        {
            name: '区域',
            type: 'map',
            mapType: 'china',
            roam: false,
            itemStyle:{
                normal:{
                    label:{
                        show:true,
                        textStyle: {
                            color: "#5c7093"
                        }
                    },
                    areaStyle:{color:'blue'},
                    borderColor: '#fff',
                    borderWidth: 2,
                },

                emphasis: {
                    borderWidth: .2,
                    borderColor: '#fff',
                    areaColor:"#5c7093",
                    textStyle: {
                        color: "#fff"
                    }

                }
            },
            data:map
        }
    ]
};
mapChart.setOption(mapOption);
//区域分布 end

//销售阶段占比
var salestageChart = echarts.init(document.getElementById('salestageChart'));
var salestageOption = {
    title : {
        text: '销售阶段占比',
        x:'center'
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
    tooltip : {
        trigger: 'axis'
    },
    grid: {
        top:'30%',
        left: '0%',
        right: '0%',
        bottom: '10%',
        containLabel: true,
        x:0
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : salestageX
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            type:'bar',
            barWidth : 30,//柱图宽度
            data:salestageY,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        }
    ]
};
salestageChart.setOption(salestageOption);
//销售阶段占比  end

//客户接受渠道偏好
var cuscanalChart = echarts.init(document.getElementById('cuscanalChart'));
var cuscanalOption = {
    title : {
        text: '客户接受渠道偏好',
        x:'center'
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
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        top:'20%',
        left: '2%',
        right: '3%',
        bottom: '10%',
        containLabel: true,
        x:0
    },
    calculable : true,
    xAxis : [
        {
            type : 'value'
        }
    ],
    yAxis : [
        {
            type : 'category',
            axisTick : {show: false},
            data : cuscanalMapY
        }
    ],
    series : [
        {
            name:'愿意',
            type:'bar',
            stack: '总量',
            barWidth : 25,
            itemStyle: {normal: {
                label : {show: true}
            }},
            data:cuscanalYes
        },
        {
            name:'不愿意',
            type:'bar',
            stack: '总量',
            itemStyle: {normal: {
                label : {show: true}
            }},
            data:cuscanalNo
        }
    ]
};
cuscanalChart.setOption(cuscanalOption);
//客户接受渠道偏好  end

//会员级别分布
var levelChart = echarts.init(document.getElementById('levelChart'));
var levelOption = {
    title : {
        text: '会员级别分布',
        x:'center'
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
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    calculable : true,
    series : [
        {
            name:'会员级别',
            type:'pie',
            radius : ['50%', '70%'],
            itemStyle : {
                normal : {
                    label : {
                        show : true
                    },
                    labelLine : {
                        show : true
                    }
                },
                emphasis : {
                    label : {
                        show : true,
                        position : 'center',
                        textStyle : {
                            fontSize : '16',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            data:levelMap
        }
    ]
};
levelChart.setOption(levelOption);
//会员级别分布  end

//客户来源
$('#sourceChart').highcharts({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    "colors": [
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
    title: {
        text: '客户来源',
        align: 'center',
        verticalAlign: 'top',
        y: 20,
        style : {
            'fontSize' : '18px',
            'font-weight': 'bold'
        }
    },
    tooltip: {
        headerFormat: '{series.name}<br>',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0px 0 0 white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '60%']
        }
    },
    series: [{
        type: 'pie',
        name: '客户来源',
        innerSize: '50%',
        data: sourceMap
    }]
});

}
//客户来源  end



