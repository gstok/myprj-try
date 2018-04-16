var API={
    //项目名字改变修改此处
    baseUrl:"",
    baseApi:"/user-apis",
    post: function (url, data,async, callback, errorcallback) {
        var settings = {
            type: 'POST',
            url: API.baseApi+$.trim(url),
            data: data,
            cache: false,
            async: async,
            dataType: 'json',
            // contentType: 'application/json',
            beforeSend: function () {
                return true;
            },
            success: function (res) {
                callback(res);
                /*if(res.code == 401){
                    window.location.href = API.baseUrl+"/login.html";
                }else if(res.code == 403){
                    console.log(Global.url);
                    dcrmAlertWarning(res.msg);*/
                    /*setTimeout(function(){
                        $(".xcConfirm").hide();
                        if(_url){
                            window.location.href = API.baseUrl + _url;
                        }
                    },200);*/
                /*}else{
                    callback(res);
                }*/

            }

        };
        $.ajax(settings);
    },

    //微页面分析----区域----地图
    areaAnaly:function(param,callback){
        API.post("/pc/weChat/areaAnaly.action",param,true,callback);
    },

}
var provinceData=[],
    provinceDatauv=[],
    areaData=[],
    areaDatauv=[],
    mapdata = [],
    mapname1 = '访问次数',
    mapname2 = '访问人数';



var eventCd = GetQueryString("eventCd"),
    province = GetQueryString("province"),
    pageId = GetQueryString("pageId"),
    startDate = GetQueryString("startDate"),
    endDate = GetQueryString("endDate"),
    lock = true;//是否刷新地图
    mapAnaly();


$(function(){
    if(eventCd == 'view'){
    mapdata = ['访问次数','访问人数'];
    mapname1 = '访问次数';
    mapname2 = '访问人数';
    $(".pUV").html('访问人数');
    $(".pPV").html('访问次数').show();
}
if(eventCd == 'share'){
    mapdata = ['分享次数','分享人数'];
    mapname1 = '分享次数';
    mapname2 = '分享人数';
    $(".pUV").html('分享人数');
    $(".pPV").html('分享次数').show();
}
if(eventCd == 'submit'){
    mapdata = ['提交人数'];
    mapname2 = '提交人数';
    $(".pUV").html('提交人数');
    $(".pPV").html('提交次数').hide();
}
})
function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    };

function mapAnaly(){
    var data = {
        eventCd: eventCd,
        province: province,
        pageId: pageId,
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
                    var obj = data.data.areaData;
                    var str = '';
                    var tdstr = '';
                    if(obj.length == 0){
                        if(eventCd == 'submit'){
                            str+=' <tr><td colspan="2" style="height:345px">暂无数据</td></tr>';
                        }else{
                            str+=' <tr><td colspan="3" style="height:345px">暂无数据</td></tr>';
                        }
                    }else{
                        $(".tableDiv").addClass('tabscroll');
                        $.each(obj,function(i,u){
                            if(lock == true){
                                tdstr = '<td>'+u.province+'</td>';
                            }else{
                                tdstr = '<td>'+u.city+'</td>';
                            }
                            if(eventCd == 'submit'){
                                 str+=' <tr>'+tdstr+''+
                                '    <td>'+u.uv+'</td>'+
                                '</tr>';
                            }else{
                                  str+=' <tr>'+tdstr+''+
                                '    <td>'+u.uv+'</td>'+
                                '    <td>'+u.pv+'</td>'+
                                '</tr>';
                            }

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
                            if (!u.province && !u.city) {
                                return;
                            }
                            var arr = {
                                name: '',
                                value:'0'
                            };

                            arr.name = u.city;
                            if (u.province) {
                                arr.name = arr.name + "市";
                            }

                            arr.value = u.pv;
                            areaData.push(arr);
                            var arruv = {
                                name: '',
                                value:'0'
                            };
                            arruv.name = u.city;
                            arruv.value = u.uv;
                            areaDatauv.push(arruv);
                            var arrp = {
                                name: '',
                                value:'0'
                            };
                            arrp.name = u.province;
                            arrp.value = u.pv;
                            provinceData.push(arrp);

                            //console.log(vm.provinceData)
                            var arrpuv = {
                                name: '',
                                value:'0'
                            };
                            arrpuv.name = u.province;
                            arrpuv.value = u.uv;
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
                    //name: '访问次数',
                    name: mapname1,
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
                    //name: '访问人数',
                    name: mapname2,
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
        if(eventCd == 'submit'){
            option.series.splice(0,1);
        }
        myChart.setOption(option);
}