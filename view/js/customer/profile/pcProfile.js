/**
 * Created by Administrator on 2017/8/16 0016.
 */
//姓名和标签
$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul").find("a").eq(1).addClass("active");
    $(".custLabel").css({"opacity": "1.0"},500).addClass("fadeInDownBig");
    $("#custName").css({"opacity": "1.0"},500).addClass("fadeInDownBig");
});
function animateCss(animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
    });
}
//基本资料
setTimeout(function(){
    $(".basicDataBox").css({"opacity": "1.0"},500).addClass("fadeInLeftBig");
},1000);
$('.basicData').mouseenter(function () {
    $(".basicDataBox").animateCss("flipInY");
    //$(".basicDataBox").removeClass("fadeInLeftBig bounce").addClass("flipInY");
})/*.mouseleave(function () {
 $(".basicDataBox").removeClass("flipInY").addClass("bounce");
 })*/;
//购买渠道
setTimeout(function(){
    $(".buyChannelBox").animate({"opacity": "1.0"},500);
},500);
$('.buyChannel').mouseenter(function () {
    $(".buyChannelBox").removeClass("zoomIn flipInY").addClass("pulse");
}).mouseleave(function () {
    $(".buyChannelBox").removeClass("pulse").addClass("flipInY");
});
//圆点
setTimeout(function(){
    $(".pointBox1 .circle").show(2,function(){
        $(".pointBox2 .circle").show(500,function(){
            $(".pointBox3 .circle").show(500,function(){
                $(".pointBox4 .circle").show(500,function(){
                    $(".pointBox5 .circle").show(500,function(){
                        $(".pointBox6 .circle").show(500,function(){
                            $(".pointBox7 .circle").show(500);
                        });
                    });
                });
            });
        });
    });
},1800);

//商品推荐
setTimeout(function(){
    $(".recommendBox").css({"opacity": "1.0"}).addClass("zoomIn");
},1500);
$('.recommend').mouseenter(function () {
    $(".recommendBox").removeClass("zoomIn flipInX").addClass("shake");
}).mouseleave(function () {
    $(".recommendBox").removeClass("shake").addClass("flipInX");
});

//客户价值
setTimeout(function(){
    $(".customerValueBox").animate({opacity:"1.0"},500).addClass("flipInX");
},2000);
$('.customerValue').mouseenter(function () {
    $(".customerValueBox").removeClass("flipInX bounce").addClass("tada");
}).mouseleave(function () {
    $(".customerValueBox").removeClass("tada").addClass("bounce");
});
//客户活跃度
setTimeout(function(){
    $(".vitalityBox").animate({opacity:"1.0"},500).addClass("slideInRight");
},2000);
$('.vitality').mouseenter(function () {
    $(".vitalityBox").animateCss("flipInX");
    //$(".vitalityBox").removeClass("slideInRight bounceIn").addClass("flipInX");
})/*.mouseleave(function () {
    $(".vitalityBox").removeClass("flipInX").addClass("bounceIn");
})*/;
//传播指数
setTimeout(function(){
    $(".spreadBox").animate({opacity:"1.0"},500).addClass("fadeInLeft");
},2500);
$('.spread').mouseenter(function () {
    $(".spreadBox").removeClass("fadeInLeft bounceIn").addClass("pulse");
}).mouseleave(function () {
    $(".spreadBox").removeClass("pulse").addClass("bounceIn");
});
//互动情况
setTimeout(function(){
    $(".interactBox").animate({opacity:"1.0"},500).addClass("lightSpeedIn");
},2500);
$('.interact').mouseenter(function () {
    $(".interactBox").removeClass("lightSpeedIn swing").addClass("pulse");
}).mouseleave(function () {
    $(".interactBox").removeClass("pulse").addClass("swing");
});

//折线1动画
setTimeout(function(){
    $(".pointBox1 .line1Bg").animate({right:"26px"},500,function(){
        $(".pointBox1 .line2").show().animate({width:"100px"},500)
    });
},500);
//折线2动画
setTimeout(function(){
    $(".pointBox2 .line1Bg").animate({left:"43px"},500,function(){
        $(".pointBox2 .line2").show().animate({width:"85px"},500)
    });
},1000);
//折线3动画
setTimeout(function(){
    $(".pointBox3 .line1Bg").animate({left:"26px"},500,function(){
        $(".pointBox3 .line2").show().animate({width:"60px"},500)
    });
},1500);
//折线4动画
setTimeout(function(){
    $(".pointBox4 .line1Bg").animate({right:"10px"},500,function(){
        $(".pointBox4 .line2").show().animate({width:"85px"},500)
    });
},2000);
//折线5动画
setTimeout(function(){
    $(".pointBox5 .line1Bg").animate({left:"27px"},500,function(){
        $(".pointBox5 .line2").show().animate({width:"85px"},500)
    });
},2500);
//折线6动画
setTimeout(function(){
    $(".pointBox6 .line2").animate({width:"65px"},500,function(){
        $(".pointBox6 .line1Bg").animate({right:"170px"},500)
    });
},2500);
//折线7动画
setTimeout(function(){
    $(".pointBox7 .line2").animate({width:"65px"},500,function(){
        $(".pointBox7 .line1Bg").animate({left:"112px"},500)
    });
},2500);