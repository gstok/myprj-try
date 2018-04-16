/**
 * Created by Administrator on 2017/7/12 0012.
 */
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
};
var eventCd = GetQueryString("eventCd"),
    pageId = GetQueryString("pageId"),
    startDate = GetQueryString("startDate"),
    endDate = GetQueryString("endDate"),
    worken_token = GetQueryString("worken_token"),
    areaData = [],//地图的值---市
    provinceData = [],//地图的值---省
    cityDatas = [];//地图表格的列表
    uv1 = [],
    pv1 = [],
    xAxis1 = [],
    uv2 = [],
    pv2 = [],
    xAxis2 = [],
    province = '',
    datatitle = ['访问次数'],//地图右上角标识
    allstafftitle = '全部员工传播的微页面访问人数/次数',//全部员工柱状图
    substafftitle = '下属员工传播的微页面访问人数/次数',//下属员工柱状图
    lock = true;

$(function(){
    //$("#chart-mapjs").load('/view/marketing/micro/map/map.html');
    if(eventCd == 'view'){
        datatitle = ['访问次数'];
        allstafftitle = '全部员工传播的微页面访问人数/次数';
        substafftitle = '下属员工传播的微页面访问人数/次数';
    }
    if(eventCd == 'share'){
        datatitle = ['分享次数'];
        allstafftitle = '全部员工传播的微页面分享人数/次数';
        substafftitle = '下属员工传播的微页面分享人数/次数';
    }
    if(eventCd == 'submit'){
        datatitle = ['提交次数'];
        allstafftitle = '全部员工传播的微页面提交人数/次数';
        substafftitle = '下属员工传播的微页面提交人数/次数';
    }
    Iframe();
    //mapAnaly();
    companyUserAnaly();

});
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
                xhr.setRequestHeader("Authorization", "Bearer "+worken_token); // 请求发起前在头部附加token------
                //xhr.setRequestHeader("Cookie", "worken_token="+worken_token); // 请求发起前在头部附加token
                xhr.setRequestHeader("Worken-Device-Type", "android"); // 请求发起前在头部附加token-------
            },
            success: function (res) {
                callback(res);
            }
        };
        $.ajax(settings);
    },
    //微页面分析----员工传播访问
    companyUserAnaly:function(param,callback){
        API.post("/pc/weChat/companyUserAnaly.action",param,true,callback);
    },
};
//iframe嵌套
function Iframe(){
        var src = '/view/html5/map.html?eventCd='+eventCd+'&&province='+province+'&&pageId='+pageId+'&&startDate='+startDate+'&&endDate='+endDate+'&&worken_token='+worken_token;
        //var src = '/view/marketing/micro/map/map.html?startDate=2017-12-15&endDate=2017-12-15&eventCd=view&pageId=10';
        $("#mapIframe").attr('src',src)
    };

//员工传播访问
function companyUserAnaly(){
    var data = {
        eventCd: eventCd,
        pageId: pageId,
        province: province,
        startDate: startDate,
        endDate: endDate
    };
    API.companyUserAnaly(data,function(data){
        if(data.code == 200){
            uv1 = [];
            pv1 = [];
            xAxis1 = [];
            uv2 = [];
            pv2 = [];
            xAxis2 = [];
            var allUserData = data.data.allUserData;//全体员工
            var subData = data.data.subData;//下属员工
            $.each(allUserData,function(i,u){
                uv1.push(u.uv);
                pv1.push(u.pv);
                xAxis1.push(u.user_name);
            })
            console.log(uv1);
            console.log(pv1);
            console.log(xAxis1);
            $.each(subData,function(i,u){
                uv2.push(u.uv);
                pv2.push(u.pv);
                xAxis2.push(u.user_name);
            })
            setTimeout(function(){
                allstaff();//所有员工
                substaff();//下属员工
            },1000)
        }
        else{
            alert(data.msg);
        }
    });
};

// 全体员工
function allstaff(){
    /*图表*/
    var myChart = echarts.init(document.getElementById('chart_box1'));
    var option = {
            title: {
                text: allstafftitle,//图表标题
                textStyle:{
                    //文字颜色
                    color:'#000',
                    //字体风格,'normal','italic','oblique'
                    fontStyle:'normal',
                    //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                    fontWeight:'bold',
                    //字体系列
                    fontFamily:'sans-serif',
                    //字体大小
            　　　　 fontSize:14
                }
            },
            /*grid: {
                    top:'18%',
                    left: '8%',
                    right: '0%',
                    bottom: '15%',
                    containLabel: true,
                    x:0
                },*/
                grid: {
                    x:35,
                    y:35,
                    x2:5,
                    y2:30,
                    borderWidth:1
                },
            tooltip: {
                trigger: 'axis',    //提示触发类型      'item':数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                                                //'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                                                //'none':什么都不触发。
                show:true,     //是否显示提示框组件 默认为true
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },

            legend: {
                data:['次数','人数'],
                x: 'right'
            },
            dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        //xAxisIndex: [0],
                        start: 0,
                        end: 30
                    }],
            xAxis: [
                {
                    type: 'category',
                    data: xAxis1,
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
                    name:'次数',
                    type:'bar',         //bar表示柱状图
                    data:pv1,//数据
                    barWidth : 10,//柱图宽度
                    itemStyle: {    //更多柱状图样式搜索API：series-bar.itemStyle
                        emphasis: {
                            barBorderRadius: [5, 5, 0, 0],

                        },
　　　　　　　　　　　　normal: {
　　　　　　　　　　　　　　color: '#8c9deb',//改变柱状的颜色
　　　　　　　　　　　　　　borderColor:'8c9deb', //描边的颜色：默认#000
                            borderWidth:0,  //描边的宽度     默认：0
                            borderType:'solid',  //描边的类型：'dashed', 'dotted'，'solid'(默认)
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
                    name:'人数',
                    type:'line',        //line表示折线图
                    data:uv1,
                    itemStyle: {    //更多折线图线条样式搜索API：series-line.itemStyle
　　　　　　　　　　　　　　　　　　normal: {
　　　　　　　　　　　　　　　　　　　　color: '#009999',//改变折线点的颜色
　　　　　　　　　　　　　　　　　　　　lineStyle: {    //改变折线样式
　　　　　　　　　　　　　　　　　　　　　　color: '#009999', //改变折线颜色
                                        width:3,    //改变线条的粗细
　　　　　　　　　　　　　　　　　　　　},


　　　　　　　　　　　　　　　　　　}
　　　　　　　　　　　　　　　　},
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
};
// 全体员工
//下属员工
function substaff(){
    var myChart = echarts.init(document.getElementById('chart_box2'));
    var option = {
                title: {
                    text: substafftitle,//图表标题
                    textStyle:{
                        //文字颜色
                        color:'#000',
                        //字体风格,'normal','italic','oblique'
                        fontStyle:'normal',
                        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                        fontWeight:'bold',
                        //字体系列
                        fontFamily:'sans-serif',
                        //字体大小
                　　　　fontSize:14
                    }
                },
                grid: {
                    x:35,
                    y:35,
                    x2:5,
                    y2:30,
                    borderWidth:1,
                    containLabel: false
                },
                tooltip: {
                    trigger: 'axis',    //提示触发类型      'item':数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                                                    //'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                                                    //'none':什么都不触发。
                    show:true,     //是否显示提示框组件 默认为true
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },

                legend: {
                    data:['次数'],
                    x: 'right'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        //xAxisIndex: [0],
                        start: 0,
                        end: 30
                    }],
                xAxis: [
                    {
                        type: 'category',
                        data: xAxis2,
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
                    name:'次数',
                    type:'bar',         //bar表示柱状图
                    data:pv2,//数据
                    barWidth : 10,//柱图宽度
                    itemStyle: {    //更多柱状图样式搜索API：series-bar.itemStyle
                        emphasis: {
                            barBorderRadius: [5, 5, 0, 0],

                        },
　　　　　　　　　　　　normal: {
　　　　　　　　　　　　　　color: '#8c9deb',//改变柱状的颜色
　　　　　　　　　　　　　　borderColor:'8c9deb', //描边的颜色：默认#000
                            borderWidth:0,  //描边的宽度     默认：0
                            borderType:'solid',  //描边的类型：'dashed', 'dotted'，'solid'(默认)
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
};
// 下属员工


