function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

var id = GetQueryString("id");
$(function(){
    var h = $("#page-wrapper").height();
    $("#page-inner").height(h+'px');

    if(id){
        var data = {
            id:id
        };
        MaskUtil.Loading();
        API.getTaskById(data, function(res) {
            if (res.code == 200) {
                var obj = res.data.data;
                window.w_cpoint = [0,0];
                window.w_cpoint[0] = obj.locLongitude;
                window.w_cpoint[1] = obj.locLatitude;
                console.log(w_cpoint);
                $('#locTaskName').val(obj.locTaskName);
                $('#pickerInput').val(obj.locAddress);
                $('#address').html(obj.locAddress);
                $(".ui-slider-handle").html('<div class="handleNum">'+(obj.locRadius)/1000+'km</div>');
                $(".ui-slider-handle").css('left',(obj.locRadius)/20+'%');
                $(".ui-slider-range").css('width',(obj.locRadius)/20+'%');
                $("input[name='sex'][value='"+obj.tagFitler+"']").attr("checked",true);
                $('#helloMsg').val(obj.helloMsg);
                $('#lnglat').html(window.w_cpoint[0]+','+window.w_cpoint[1]);
            }else{
                dcrmAlertError(res.msg);
            }
            MaskUtil.RemoveLoading();
            loadMap();
        });
    } else {
        loadMap();
    }
});

function loadMap() {
    AMapUI.loadUI(['misc/PositionPicker','misc/PoiPicker'], function(PositionPicker,PoiPicker) {
        var map = new AMap.Map('container', {
            zoom: 16,
            scrollWheel: true,
            resizeEnable: true
        });
        var positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: map
        });

        positionPicker.on('success', function(positionResult) {
            document.getElementById('lnglat').innerHTML = positionResult.position;
            document.getElementById('address').innerHTML = positionResult.address;
            //document.getElementById('nearestJunction').innerHTML = positionResult.nearestJunction;
            //document.getElementById('nearestRoad').innerHTML = positionResult.nearestRoad;
            //document.getElementById('nearestPOI').innerHTML = positionResult.nearestPOI;
        });
        positionPicker.on('fail', function(positionResult) {
            document.getElementById('lnglat').innerHTML = ' ';
            document.getElementById('address').innerHTML = ' ';
            //document.getElementById('nearestJunction').innerHTML = ' ';
            //document.getElementById('nearestRoad').innerHTML = ' ';
            //document.getElementById('nearestPOI').innerHTML = ' ';
        });
        var onModeChange = function(e) {
            //positionPicker.setMode(e.target.value)
            positionPicker.setMode(dragMap)
        };

        var startButton = document.getElementById('start');
        //var stopButton = document.getElementById('stop');
        //var dragMapMode = document.getElementsByName('mode')[0];
        //var dragMarkerMode = document.getElementsByName('mode')[1];
        /*AMap.event.addDomListener(startButton, 'click', function() {
         positionPicker.start(map.getBounds().getSouthWest())
         })*/
        /*AMap.event.addDomListener(stopButton, 'click', function() {
         positionPicker.stop();
         })*/
        //AMap.event.addDomListener(dragMapMode, 'change', onModeChange)
        //AMap.event.addDomListener(dragMarkerMode, 'change', onModeChange);
        positionPicker.start(window.w_cpoint);
        map.panBy(0, 1);

        map.addControl(new AMap.ToolBar({
            liteStyle: true
        }));


        /**************半径**************/
        AMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 5,
                type: '餐饮服务',
                pageIndex: 1,
                city: "010", //城市
                map: map,
                panel: "panel"
            });

            var cpoint = window.w_cpoint; //中心点坐标
            placeSearch.searchNearBy('', cpoint, 300, function(status, result) {

            });
        });
        /**********************************/
        var poiPicker = new PoiPicker({
            //city:'北京',
            input: 'pickerInput'
        });

        //初始化poiPicker
        poiPickerReady(poiPicker);
        function poiPickerReady(poiPicker) {

            window.poiPicker = poiPicker;

            var marker = new AMap.Marker();

            var infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -20)
            });

            //选取了某个POI
            poiPicker.on('poiPicked', function(poiResult) {

                var source = poiResult.source,
                    poi = poiResult.item,
                    info = {
                        source: source,
                        id: poi.id,
                        name: poi.name,
                        location: poi.location.toString(),
                        address: poi.address
                    };

                $('#pickerInput').val(poi.name);
                document.getElementById('address').innerHTML = poi.address;
                marker.setMap(map);
                infoWindow.setMap(map);

                marker.setPosition(poi.location);
                infoWindow.setPosition(poi.location);

                //infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
                infoWindow.open(map, marker.getPosition());
                map.setCenter(marker.getPosition());
            });

            /*poiPicker.onCityReady(function() {
             poiPicker.suggest('美食');
             });*/

            //加载地图，调用浏览器定位服务
            if (!$('#pickerInput').val()) {
                map.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition:'RB'
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
                });
            }
        }
    });
}



function createTask(status){//status:0-暂存，1-执行, 2-返回
    if(status == 2){
        window.location.href = API.baseUrl+baseUrl+"/view/marketing/addFriends/addfriends.html";
    }else{
        $('#loginBox dl').hide();
        var locLongitude = $('#lnglat').html().split(',')[0];
        var locLatitude = $('#lnglat').html().split(',')[1];
        var _data = {
            status:status,//0-暂存，1-执行
            locTaskName:$('#locTaskName').val(),//任务名
            locLongitude:locLongitude,//经度
            locLatitude:locLatitude,//纬度
            locRadius:window.locRadius?(window.locRadius)*1000:'0',//半径
            tagFitler:$("input[name='sex']:checked").val()?$("input[name='sex']:checked").val():'',//性别
            helloMsg:$('#helloMsg').val(),
            locAddress:$('#address').html()
        };
        var param = {
            deviceSid:window.sessionid
        };
        var params = {
            id:id
        };
        if(id){
            $.extend(_data,params);
        }
        if(status == 1){
            $.extend(_data,param);
        }
        if(_data.locTaskName == ''){
            dcrmAlertWarning("任务名称不能为空！");
            return false;
        }
        if(id){
            var editcallback = function(data) {
                if (data.code == 200) {
                    window.location.href = API.baseUrl+baseUrl+"/view/marketing/addFriends/addfriends.html";
                }else if(data.code == 4001){
                    addPop(function(){
                        _data['deviceSid'] = window.sessionid;
                        API.updateTask(_data,editcallback);
                    })
                }else{
                    dcrmAlertError(data.msg);
                }
            };
            API.updateTask(_data,editcallback);
        }else{
            var createcallback = function(data) {
                if (data.code == 200) {
                    window.location.href = API.baseUrl+baseUrl+"/view/marketing/addFriends/addfriends.html";
                }else if(data.code == 4001){
                    addPop(function(){
                        _data['deviceSid'] = window.sessionid;
                        API.createTask(_data,createcallback);
                    })
                }else{
                    dcrmAlertError(data.msg);
                }
            };
            API.createTask(_data,createcallback);
        }


    }
};

$(".slierbar").slider({
    range: "min",
    value:50,
    min: 0,
    max: 100,
    slide: function (event, ui) {
        $(".ui-slider-handle").html('<div class="handleNum">'+(ui.value)/100*2+'km</div>');
        window.locRadius = (ui.value)/100*2;
    }
});
