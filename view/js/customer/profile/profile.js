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

    $.ajax({
        type: 'GET',
        url: "/view/json/"+id+".json",
        async: false,
        dataType: 'json',
        success: function (res) {
            //背景
            $(".fill-datum").css({
                background: 'url("/view/images/pcProfile/'+res.obj.bgImg+'")',
                'background-size':'50% 100%',
                'background-repeat': 'no-repeat',
                'background-position': 'center top'
            });
            //男女图片
            $(".personimg").html("<img src='/view/images/pcProfile/"+res.obj.img+"' alt='用户画像'/>");
            //基本资料
            $.each($('.basicData').find("dt"),function (i,ele) {
                var attrName = $(ele).attr('data-attr');
                if(res.obj.attr[attrName].indexOf("/")>-1 || attrName == 'tour'){
                    var _data = res.obj.attr[attrName].split("/");
                    //console.log(_data);
                    var str = "";
                    $.each(_data,function(e,f){
                        str+="<span>"+f+"</span>";
                        //console.log(str);
                        $(ele).parent().find("dd").html(str);
                    })
                }else{
                    $(ele).parent().find("dd").text(res.obj.attr[attrName]);
                }
            });
            //客户姓名
            $("#custName").html(res.obj.custName);
            //客户类型
            $(".custLabel").html(res.obj.custLabel);
            //客户价值
            var custVal = res.obj.custVal;
            $("#totalValue").html(custVal.totalValue);
            $("#totalRank").html(custVal.totalRank);//总排名
            $("#totalPercent").html(custVal.totalPercent);//击败了多少客户
            $("#mValue").html(custVal.mValue);//最近三个月消费
            $("#mRank").html(custVal.mRank);//最近三个月排名
            $("#mPercent").html(custVal.mPercent);//最近三个月击败了多少客户
            //购买渠道偏好
            var Chart = echarts.init(document.getElementById('Channel'));
            var Option = {
                title : {
                    text: res.obj.channelNum,
                    textStyle:{
                        color:'#ccc',
                        fontStyle:'normal',
                        fontWeight:'normal',
                        fontFamily:'sans-serif',
                        fontSize:20
                    },
                    subtext: '购买总次数',
                    subtextStyle:{
                        color:'#ccc',
                        fontStyle:'normal',
                        fontWeight:'normal',
                        fontFamily:'sans-serif',
                        fontSize:12
                    },
                    x:'center',
                    y:'38%'
                },
                "color": [
                    "#fe9e6d",
                    "#8becfe",
                    "#1ad9a1",
                    "#99bce3",
                    "#7dd6b8",
                    "#a0e3ce",
                    "#c1ebdd",
                    "#cfcfcf",
                    "#ebebeb"
                ],
                tooltip : {
                    show:false,
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable : true,
                series : [
                    {
                        name:'会员级别',
                        type:'pie',
                        radius : ['40%', '60%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : true
                                },
                                labelLine : {
                                    show : true,
                                    normal:{
                                        length:2,
                                        length2:6
                                    }
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '14',
                                        fontWeight : 'normal'
                                    }
                                }
                            }
                        },
                        data:res.obj.channelData
                    }
                ]
            };
            Chart.setOption(Option);
            //购买渠道偏好  end
            //商品推荐
            $(".recommend").slide({mainCell:".bd ul",effect:"leftLoop",autoPlay:true});
            for(var i=1;i<4;i++){
                $(".recommend"+i).find("img").attr("src",'/view/images/pcProfile/'+res.obj.recommend[i-1].img+'');
                $(".recommend"+i).find("p").html(res.obj.recommend[i-1].title);
            }
            //客户活跃度
            var dataX = res.obj.vitalityDataX[0];
            var dataY = res.obj.vitalityDataY[0];
            $(".vitalityNum span").html(res.obj.vitalityNum);
            $(".vitalityChange .li").on("click",function(){
                if($(this).hasClass("li1")){
                    dataX = res.obj.vitalityDataX[0];
                    dataY = res.obj.vitalityDataY[0];
                }
                if($(this).hasClass("li2")){
                    dataX = res.obj.vitalityDataX[1];
                    dataY = res.obj.vitalityDataY[1];
                }
                if($(this).hasClass("li3")){
                    dataX = res.obj.vitalityDataX[2];
                    dataY = res.obj.vitalityDataY[2];
                }
                $(".vitalityChange .li").removeClass("on");
                $(this).addClass("on");
                vitality();
            });
            vitality();
            function vitality(){
                var vitalityChart = echarts.init(document.getElementById('vitalityChannel'));
                var vitalityOption = {
                    "color": [
                        "#0f6c94"
                    ],
                    grid: {
                        top:'10%',
                        left: '-9%',
                        right: '9%',
                        bottom: '10%',
                        containLabel: true,
                        x:0
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : dataX
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            splitLine: {
                                lineStyle: {//改变y轴上网格线的颜色
                                    color: ['#394f95']
                                }
                            }

                        }
                    ],
                    series : [
                        {
                            name:'活跃度',
                            type:'line',
                            smooth:true,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: ['#3388c9'],
                                        width: 1,
                                        type: 'solid'
                                    },
                                    areaStyle:{
                                        normal:'default'
                                    }
                                }
                            },
                            data:dataY
                        }
                    ]
                };
                vitalityChart.setOption(vitalityOption);
            }
            //客户活跃度  end
            //客户传播指数
            $("#spread").html(res.obj.spread);
            var top3 = $(".spreadCont").find("li");
            $.each(top3,function(i,u){
                $(u).find("img").attr("src",'/view/images/pcProfile/'+res.obj.spreadData[i].img+'');
                $(u).find(".p").html(res.obj.spreadData[i].title);
            });
            //互动情况
            $("#interactNum").html(res.obj.interactNum);
            var dt = $(".interact").find("dt");
            var span = $(".interact dl").find("span");
            $.each(dt,function(i,u){
                $(u).html(res.obj.interactData[i].title);
            });
            $.each(span,function(e,f){
                $(f).css({
                    width:res.obj.interactData[e].num
                });
            });
            //人物
            var  attrSpan = res.obj.attr;
            var picrows = [];
            var rows = [];
            // attrSpan.car = attrSpan.car+'车';
            attrSpan.character = attrSpan.character+'消费';
            // attrSpan.child = attrSpan.child+'子女';
            // attrSpan.house = attrSpan.house+'房';
            attrSpan.online = '线上消费能力'+attrSpan.online;
            attrSpan.time = '网站访问时长'+attrSpan.time;
            attrSpan.tour = attrSpan.tour+'旅游';
            $.each(attrSpan,function(i,u){
                rows.push(u);
            });
            for(var s in attrSpan){

                if(s!='age'&&s!='sex'&s!='married'&&s!='car'&&s!='child'&&s!='house'){
                    picrows.push("<span>"+attrSpan[s]+"</span>");
                }

            }
            console.log(picrows)
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
            //购买路径
            $.fn.extend({
                animateCss: function (animationName) {
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    this.addClass('animated ' + animationName).one(animationEnd, function() {
                        $(this).removeClass('animated ' + animationName);
                    });
                }
            });
            var chart = {
                _init : function(){
                    var that = this;
                    if(type){
                        this.dotList = [
                            {x:54,y:194},
                            {x:284,y:185},
                            {x:500,y:144},
                            {x:700,y:190},
                            {x:867,y:183},
                            {x:1090,y:140},
                            {x:1320,y:163},
                            {x:1535,y:200},
                            {x:1758,y:154}
                        ];
                    }else{
                        this.dotList = [
                            {x:'-0.55rem',y:'1rem'},
                            {x:'-0.55rem',y:'4rem'},
                            {x:'-0.55rem',y:'7rem'},
                            {x:'-0.55rem',y:'10rem'},
                            {x:'-0.55rem',y:'13rem'},
                            {x:'-0.55rem',y:'16rem'},
                            {x:'-0.55rem',y:'19rem'},
                            {x:'-0.55rem',y:'22rem'},
                            {x:'-0.55rem',y:'25rem'}
                        ];
                    }

                    $(".box").html("");
                    that._play();
                    /*var h = $(window).scrollTop();
                     $(window).scroll(function(){
                     if(h>200){
                     that._play();
                     }else{
                     $(".box").html("");
                     }
                     });*/
                },

                _play : function(){
                    var that = this;

                    if(type){
                        $(".box").html("");
                    }else{
                        $(".box").html("<div class='bg'></div>");
                    }
                    $("<div class='mask'></div>").appendTo(".box");
                    setTimeout(function(){
                        var dotList = that.dotList;
                        $(".mask").animate({"width":0},1500);

                        for(var i = 0;i < dotList.length;i++){
                            that._showDot(i);
                            that._showMsg(i);
                        }

                        setTimeout(function(){
                            $(".dot").mouseenter(function () {
                                $(".dot").removeClass("on");
                                $(this).addClass("on");
                                $(this).animateCss("bounceIn");
                            }).mouseleave(function () {
                                $(this).removeClass("on");
                            });
                        },2500);
                    },2900);
                },
                _showDot : function (i) {
                    var dotList = this.dotList;
                    var dotTimer = setTimeout(function () {
                        //var $dot = $("<div class='dot "+ (i==2 ? "dot_on" : "") +"'><img src='/view/images/pcProfile/"+ data[window.index].media[i].icon +"'/></div>").css({"left":dotList[i].x,"top":dotList[i].y}).appendTo(".box");
                        if(type){
                            var $dot = $("<div class='dot'><img src='/view/images/pcProfile/"+ res.obj.media[8-i].icon +"'/></div>").css({"left":dotList[i].x,"top":dotList[i].y}).appendTo(".box");
                        }else{
                            var $dot = $("<div class='dot'><img src='/view/images/pcProfile/"+ res.obj.media[i].icon +"'/></div>").appendTo(".box");
                        }

                            //var $dot = $("<div class='dot'><img src='/view/images/pcProfile/"+ res.obj.media[i].icon +"'/></div>").css({"left":dotList[i].x,"top":dotList[i].y}).appendTo(".box");

                        $dot.fadeIn("500").animateCss("bounceIn");
                    },1500+i*100);
                },
                _showMsg : function(i){
                    var dotList = this.dotList;
                    var msgTimer = setTimeout(function () {
                        if(type){
                            var $msg = $("<div class='msg'><p class='time'>"+ res.obj.media[8-i].date +"</p><p class='desc'>"+ res.obj.media[8-i].desc +"</p><div class='zheLine'></div></div>").appendTo(".box");
                        }else{
                            var $msg = $("<div class='zheLine'></div><div class='msg'><p class='time'>"+ res.obj.media[i].date +"</p><p class='desc'>"+ res.obj.media[i].desc +"</p></div>").appendTo(".box");
                        }

                            //var $msg = $("<div class='msg'><p class='time'>"+ res.obj.media[i].date +"</p><p class='desc'>"+ res.obj.media[i].desc +"</p><div class='zheLine'></div></div>").appendTo(".box");

                        $msg.addClass("r" + (i+1));
                        $msg.fadeIn("500");
                    },1500+i*100);
                }
            }._init();
        },
        error:function() {
            alert("获取客户画像失败");
        }
    });
});


