/**
 * Created by Administrator on 2017/8/23 0023.
 */
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
$(function(){
    var id = GetQueryString("id");
    var type = GetQueryString("type");
    var status = GetQueryString("status");
    var companyId = GetQueryString("companyId");
    $(".exit").on("click",function(){
        if(status){
            window.location.href = "/view/customer/customer/customer.html";
        }else{
            window.location.href = "/view/customer/customer/customerDetail.html?oid="+id+"&companyId="+companyId;
        }
    });
    //舞台动画
    setTimeout(function(){
        $(".stage").show().removeClass("bounceInUp").addClass("bounceIn");
    },500);
    //人物完全落下来了，灯光洒下来,阴影慢慢显示
    setTimeout(function(){
        $(".shadow").show().animate({height:"0.64rem"},500);
        $(".lighting").show().animate({height:"2.8rem"},1000);
    },1800);

    if (self != top) {
        $(".exit").hide();
    }

    // 显示的标签
    var lables = [];
    $.ajax({
        url: "/user-apis/pc/cust/showDetails.action",
        method: "POST",
        data: {id: id},
        cache: false,
        async: true,
        dataType: 'json',
        headers: {
            platform: "PC",
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
            if (res.code === 200) {
                var dataList = res.data.commonAttrList;
                procData(dataList);

                dataList = res.data.uncommonAttrList;
                procData(dataList);

                if (res.data.hkdwTaglist) {
                    res.data.hkdwTaglist.forEach(function (value) {
                        lables.push(value);
                    });
                }
                if (res.data.customTagList) {
                    res.data.customTagList.forEach(function (value) {
                        lables.push(value);
                    });
                }
                if (res.data.makingTagList) {
                    res.data.makingTagList.forEach(function (value) {
                        lables.push(value);
                    });
                }

                if (res.data.stageName) {
                    $(".custLabel").text(res.data.stageName);
                }

                // 客户画像滚动字
                // var excludeList = ['is_has_room','asset_index','consume_index','investment_index','edu_follow','health_follow','elderly_health_follow','child_health_follow','is_buy_car','brand_prefer','music_prefer','video_prefer','digital_prefer','travel_prefer','reading_prefer','camera_prefer','shopping_prefer','consumer_character','online_goods_power','oline_purchase_action','online_website_visits','consume_frequency','browse_avg_price'];
                // var excludeSet = new Set();
                // excludeList.forEach(function (value) {
                //     excludeSet.add(value);
                // });
                var picrows = [];
                for (var k in lables) {
                    picrows.push("<span>"+lables[k]+"</span>");
                }

                //随机获取一个span
                function  getRandomPicRow(h){
                    var row_index = Math.floor(Math.random()*h.length);
                    var r = h[row_index];
                    return r;
                }
                //每隔多久加一个span
                setInterval(function(){
                    var leftleft = $(".fill-datum").width();
                    var toptop = $(".fill-datum").height();
                    $(".fill-datum").append(getRandomPicRow(picrows));
                    var spanlast = $(".fill-datum").children("span:last");
                    if(type){
                        spanlast.removeClass().addClass(fsize()).css({
                            left: Math.floor(Math.random()*leftleft)+3*leftleft/5,
                            top:Math.floor(Math.random()*toptop)-300}).animate({
                            left: -leftleft + "px",
                            top:toptop+100+"px"}, 60000,function(){
                            spanlast.remove();
                        });
                    }else{
                        spanlast.removeClass().addClass(fsize()).css({
                            left: Math.floor(Math.random()*leftleft)+leftleft,
                            top:Math.floor(Math.random()*toptop)-300}).animate({
                            left: -leftleft + "px",
                            top:toptop-50+"px"}, 20000,function(){
                            spanlast.remove();
                        });
                    }
                },500);
                //给人物里面字体设置随机大小
                function fsize(){
                    var data = ["fsize0","fsize1","fsize2","fsize3","fsize4","fsize5",
                        "fsize6","fsize7",
                        "fsize0","fsize1","fsize2","fsize3","fsize4","fsize5",
                        "fsize0","fsize1","fsize2","fsize3","fsize4","fsize5"];
                    var r = data[Math.floor(Math.random()*data.length)];
                    return r;
                }
            }
        }
    });

    function procData(dataList) {
        for (var x = 0; x < dataList.length; x++) {
            var data = dataList[x];
            if (data.attrKey === 'sex') {
                var bgImg = 'man.png';
                if (data.contentvalue === '女') {
                    bgImg = 'woman.png'
                }
                var img = 'man-bg.png';
                if (data.contentvalue === '女') {
                    img = 'woman-bg.png'
                }
                //背景
                $(".fill-datum").css({
                    background: 'url("/view/images/pcProfile/' + bgImg + '")',
                    'background-size': '50% 100%',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center top'
                });
                //男女图片
                $(".personimg").html("<img src='/view/images/pcProfile/" + img + "' alt='用户画像'/>");
            } else if (data.attrKey === 'name') {
                //客户姓名
                $("#custName").html(data.contentvalue);
            } else if (data.attrKey === 'type') {
                //客户类型
                $(".custLabel").html(data.contentvalue);
            } else if (data.attrKey === 'edu_level') {
                lables.push(data.contentvalue);
                $("#eduLevel").text(data.contentvalue);
            } else if (data.attrKey === 'marital') {
                lables.push(data.contentvalue);
                $("#marital").text(data.contentvalue);
            } else if (data.attrKey === 'is_has_child') {
                lables.push(data.contentvalue);
                $("#isHasChild").text(data.contentvalue);
            } else if (data.attrKey === 'is_has_car') {
                lables.push(data.contentvalue);
                $("#isHasCar").text(data.contentvalue);
            } else if (data.attrKey === 'is_has_room') {
                lables.push(data.contentvalue);
                $("#isHasRoom").text(data.contentvalue);
            } else if (data.attrKey === 'asset_index') {
                lables.push('资产指数' + data.contentvalue);
                $("#asset_index").text(data.contentvalue);
            } else if (data.attrKey === 'consume_index') {
                lables.push('消费指数' + data.contentvalue);
                $("#consume_index").text(data.contentvalue);
            } else if (data.attrKey === 'investment_index') {
                lables.push('投资理财指数' + data.contentvalue);
                $("#investment_index").text(data.contentvalue);
            } else if (data.attrKey === 'edu_follow') {
                if (data.contentvalue === '关注') {
                    lables.push(data.contentvalue + "教育");
                }
                $("#edu_follow").text(data.contentvalue);
            } else if (data.attrKey === 'health_follow') {
                if (data.contentvalue === '关注') {
                    lables.push(data.contentvalue + "养生");
                }
                $("#health_follow").text(data.contentvalue);
            } else if (data.attrKey === 'elderly_health_follow') {
                if (data.contentvalue === '是') {
                    lables.push("关注老人健康");
                }
                $("#elderly_health_follow").text(data.contentvalue);
            } else if (data.attrKey === 'child_health_follow') {
                if (data.contentvalue === '是') {
                    lables.push("关注儿童健康");
                }
                $("#child_health_follow").text(data.contentvalue);
            } else if (data.attrKey === 'is_buy_car') {
                if (data.contentvalue === '是') {
                    lables.push("有购车倾向");
                }
                $("#is_buy_car").text(data.contentvalue);
            } else if (data.attrKey === 'consumer_character') {
                lables.push(data.contentvalue + "消费");
                $("#consumer_character").text(data.contentvalue);
            } else if (data.attrKey === 'online_goods_power') {
                lables.push(data.contentvalue);
                $("#online_goods_power").text(data.contentvalue);
            } else if (data.attrKey === 'oline_purchase_action') {
                lables.push(data.contentvalue);
                $("#oline_purchase_action").text(data.contentvalue);
            } else if (data.attrKey === 'online_website_visits') {
                lables.push(data.contentvalue);
                $("#online_website_visits").text(data.contentvalue);
            } else if (data.attrKey === 'consume_frequency') {
                lables.push(data.contentvalue);
                $("#consume_frequency").text(data.contentvalue);
            } else if (data.attrKey === 'browse_avg_price') {
                lables.push(data.contentvalue);
                $("#browse_avg_price").text(data.contentvalue);
            } else if (data.attrKey === 'brand_prefer') {
                if (data.contentvalue.length>0){
                    var html = '';
                    var arr = data.contentvalue.split(";");
                    for (var i = 0; i < arr.length && i < 5; i++) {
                        var value = arr[i];
                        lables.push(value);
                        html = html + '<span>' + value + '</span>';
                    }
                    $("#brand_prefer").html(html);
                }
            } else if (data.attrKey === 'music_prefer') {
                // var html = '';
                // var arr = data.contentvalue.split(";");
                // for (var i = 0; i < arr.length && i < 5; i++) {
                //     var value = arr[i];
                //     html = html + '<span>' + value + '</span>';
                // }
                lables.push(data.contentvalue);
                $("#music_prefer").html(data.contentvalue);
            } else if (data.attrKey === 'video_prefer') {
                // var html = '';
                // var arr = data.contentvalue.split(";");
                // for (var i = 0; i < arr.length && i < 5; i++) {
                //     var value = arr[i];
                //     html = html + '<span>' + value + '</span>';
                // }
                lables.push(data.contentvalue);
                $("#video_prefer").html(data.contentvalue);
            } else if (data.attrKey === 'digital_prefer') {
                // var html = '';
                // var arr = data.contentvalue.split(";");
                // for (var i = 0; i < arr.length && i < 5; i++) {
                //     var value = arr[i];
                //     html = html + '<span>' + value + '</span>';
                // }
                lables.push(data.contentvalue);
                $("#digital_prefer").html(data.contentvalue);
            } else if (data.attrKey === 'travel_prefer') {
                // var html = '';
                // var arr = data.contentvalue.split(";");
                // for (var i = 0; i < arr.length && i < 5; i++) {
                //     var value = arr[i];
                //     html = html + '<span>' + value + '</span>';
                // }
                lables.push(data.contentvalue);
                $("#travel_prefer").html(data.contentvalue);
            } else if (data.attrKey === 'reading_prefer') {
                // var html = '';
                // var arr = data.contentvalue.split(";");
                // for (var i = 0; i < arr.length && i < 5; i++) {
                //     var value = arr[i];
                //     html = html + '<span>' + value + '</span>';
                // }
                lables.push(data.contentvalue);
                $("#reading_prefer").html(data.contentvalue);
            } else if (data.attrKey === 'camera_prefer') {
                // var html = '';
                // var arr = data.contentvalue.split(";");
                // for (var i = 0; i < arr.length && i < 5; i++) {
                //     var value = arr[i];
                //     html = html + '<span>' + value + '</span>';
                // }
                lables.push(data.contentvalue);
                $("#camera_prefer").html(data.contentvalue);
            } else if (data.attrKey === 'shopping_prefer') {
                // var html = '';
                // var arr = data.contentvalue.split(";");
                // for (var i = 0; i < arr.length && i < 5; i++) {
                //     var value = arr[i];
                //     html = html + '<span>' + value + '</span>';
                // }
                lables.push(data.contentvalue);
                $("#shopping_prefer").html(data.contentvalue);
            }
        }
    }
});


