/**
 * Created by Administrator on 2017/8/16 0016.
 */
//人物完全落下来了，灯光洒下来,阴影慢慢显示
setTimeout(function(){
    $(".shadow").show().animate({height:"30px"},500);
    $(".lighting").show().animate({height:"224px"},1000);
},1800);
//舞台动画
setTimeout(function(){
    $(".stage").removeClass("bounceInUp").addClass("bounceIn");
},500);

//购买渠道
$('.buyChannel').mouseenter(function () {
    $(".buyChannelBox").removeClass("zoomIn flipInY").addClass("pulse");
}).mouseleave(function () {
    $(".buyChannelBox").removeClass("pulse").addClass("flipInY");
});
//折线1动画
setTimeout(function(){
    $(".pointBox1 .line1Bg").animate({right:"26px"},500,function(){
        $(".pointBox1 .line2").show().animate({width:"160px"},500)
    });
},500);
//基本资料
setTimeout(function(){
    $(".basicDataBox").show().addClass("fadeInLeftBig");
},1000);
//折线2动画
setTimeout(function(){
    $(".pointBox2 .line1Bg").animate({left:"43px"},500,function(){
        $(".pointBox2 .line2").show().animate({width:"160px"},500)
    });
},1500);
//客户价值
setTimeout(function(){
    $(".customerValueBox").animate({opacity:"1.0"},500).addClass("flipInX");
},2000);
$('.customerValue').mouseenter(function () {
    $(".customerValueBox").removeClass("flipInX bounce").addClass("tada");
}).mouseleave(function () {
    $(".customerValueBox").removeClass("tada").addClass("bounce");
});
//折线3动画
setTimeout(function(){
    $(".pointBox3 .line1Bg").animate({left:"26px"},500,function(){
        $(".pointBox3 .line2").show().animate({width:"160px"},500)
    });
},2500);
//购买渠道
/*setTimeout(function(){
    $(".buyChannelBox").show().addClass("zoomIn");
},3000);*/
$('.buyChannel').mouseenter(function () {
    $(".buyChannelBox").removeClass("zoomIn flipInY").addClass("pulse");
}).mouseleave(function () {
    $(".buyChannelBox").removeClass("pulse").addClass("flipInY");
});
