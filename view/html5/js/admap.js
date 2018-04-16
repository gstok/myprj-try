
var echarts;
require.config({
    paths: {
        echarts: '/view/marketing/micro/map/js'
    }
});
require(
    [
        'echarts',
        'echarts/echarts-all',
        'echarts/chart/map'
    ]
);






var provinceData=[],
    provinceDatauv=[],
    areaData=[],
    areaDatauv=[],
    mapdata = ['曝光次数','点击次数'];
    province = GetQueryString("province"),
    startDate = GetQueryString("startDate"),
    endDate = GetQueryString("endDate"),
    worken_token = GetQueryString("worken_token"),
    lock = true;//是否刷新地图

$(function(){
    mapAnaly();
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
    //地图数据
    areaAnaly:function(param,callback){
        API.post("/pc/ideaAd/areaAnaly.action",param,true,callback);
    }
};




function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    };

function mapAnaly(){
    var data = {
        province: province,
        startDate: startDate,
        endDate: endDate
    };
    //MaskUtil.Loading();
    API.areaAnaly(data, function (data) {
                if (data.code == 200) {
                     provinceData=[];
                     provinceDatauv=[];
                     areaData=[];
                     areaDatauv=[];
                    var obj = data.data.data;
                    var str = '';
                    var tdstr = '';
                    if(obj.length == 0){
                        str+=' <tr><td colspan="3" style="height:345px">暂无数据</td></tr>';
                    }else{
                        $(".tableDiv").addClass('tabscroll');
                        $.each(obj,function(i,u){
                            if(lock == true){
                                tdstr = '<td>'+u.province+'</td>';
                            }else{
                                tdstr = '<td>'+u.city+'</td>';
                            }
                              str+=' <tr>'+tdstr+''+
                            '    <td>'+u.view_uv+'</td>'+
                            '    <td>'+u.click_pv+'</td>'+
                            '</tr>';
                            });
                    }
                    if(obj == []){
                        areaData = [
                            {
                                name: '',
                                value:'0'
                            }
                        ];
                        areaDatauv = [
                            {
                                name: '',
                                value:'0'
                            }
                        ];
                        provinceData = [
                            {
                                name: '',
                                value:'0'
                            }
                        ];
                        provinceDatauv = [
                            {
                                name: '',
                                value:'0'
                            }
                        ]

                    }else{
                        $.each(obj,function(i,u){
                            var arr = {
                                name: '',
                                value:'0'
                            };
                            arr.name = u.city;
                            arr.value = u.click_pv;
                            areaData.push(arr);
                            var arruv = {
                                name: '',
                                value:'0'
                            };
                            arruv.name = u.city;
                            arruv.value = u.view_uv;
                            areaDatauv.push(arruv);
                            var arrp = {
                                name: '',
                                value:'0'
                            };
                            arrp.name = u.province;
                            arrp.value = u.click_pv;
                            provinceData.push(arrp);

                            //console.log(vm.provinceData)
                            var arrpuv = {
                                name: '',
                                value:'0'
                            };
                            arrpuv.name = u.province;
                            arrpuv.value = u.view_uv;
                            provinceDatauv.push(arrpuv);
                        });
                    }
                    $('table tbody').html(str);
                        if(lock == true){
                            setTimeout(function(){
                                map();
                            },1000);
                        }
                }else{
                    //dcrmAlertWarning(data.msg);
                }
                //MaskUtil.RemoveLoading();
            });
};




function map(){
    var myChart;
    var domMain = document.getElementById('chart-map');
        myChart = echarts.init(domMain);

        var ecConfig = require('echarts/config');
        var curIndx = 0;
        var mapType = [
            'china',
            // 23个省
            '广东', '青海', '四川', '海南', '陕西',
            '甘肃', '云南', '湖南', '湖北', '黑龙江',
            '贵州', '山东', '江西', '河南', '河北',
            '山西', '安徽', '福建', '浙江', '江苏',
            '吉林', '辽宁', '台湾',
            // 5个自治区
            '新疆', '广西', '宁夏', '内蒙古', '西藏',
            // 4个直辖市
            '北京', '天津', '上海', '重庆',
            // 2个特别行政区
            '香港', '澳门'
        ];

        myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){

            var len = mapType.length;
            var mt = mapType[curIndx % len];
            if (mt == 'china') {
                lock = false;
                // 全国选择时指定到选中的省份
                var selected = param.selected;
                for (var i in selected) {
                    if (selected[i]) {
                        province = i;
                        console.log(i);
                        console.log(province);
                        mt = 'china';
                        mapAnaly();
                        mt = i;
                        while (len--) {
                            if (mapType[len] == mt) {
                                curIndx = len;
                            }
                        }
                        break;
                    }
                }
                $("#pTH").html('城市');
                option.series[0].data = areaData;
                option.series[1].data = areaDatauv;
            }
            else {
                lock = true;
                curIndx = 0;
                province = '';
                mapAnaly();
                mt = 'china';
                $("#pTH").html('省份');
                option.series[0].data = provinceData;
                option.series[1].data = provinceDatauv;
            }
            option.series[0].mapType = mt;
            option.series[1].mapType = mt;
            //option.title.subtext = mt + ' （点击切换）';
            myChart.setOption(option, true);
        });

        option = {
            title: {
                text : '全国34个省市自治区'

            },

            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    var res = params.name+'<br/>';
                    var myseries = option.series;

                    for (var i = 0; i < myseries.length; i++) {

                        for(var j=0;j<myseries[i].data.length;j++){

                            if(myseries[i].data[j].name==params.name){

                                res+=myseries[i].name +' : '+myseries[i].data[j].value+'</br>';
                            }
                        }
                    }

                    return res;
                }
            },
            grid:{
                    x:2,
                    y:2,
                    x2:2,
                    y2:2,
                    borderWidth:0
                },

            legend: {
                orient: 'vertical',
                x:'right',
                //data:['访问次数','访问人数']
                data:mapdata
            },
            dataRange: {
                min: 0,
                max: 5000,
                color:['orange','yellow'],
                text:['高','低'],
                calculable : true
            },
            series : [
                {
                    name: '点击次数',
                    type: 'map',
                    //mapType: 'china',
                    selectedMode : 'single',
                    mapValueCalculation: "sum",
                    center: ['50%', '45%'],
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    data:provinceData
                },
                {
                    name: '曝光次数',
                    type: 'map',
                    //mapType: 'china',
                    selectedMode : 'single',
                    mapValueCalculation: "sum",
                    center: ['50%', '45%'],
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    data:provinceDatauv
                }
            ]
        };
        myChart.setOption(option);
}