/**
 * Created by Administrator on 2017/6/30 0030.
 */
$(function(){
    $(".editgroup-box").remove();
    $("input[readonly='readonly']").removeProp("readonly");
    $(".tabCodebtn").prop("disabled","");
    verwid();
});
$(window).resize(function(){
    verwid();
});
function verwid(){
    var h = $(window).height();
    $(".bg").css({"height":h+"px"});
    var Wid = $(".pageBox").width();//微页面宽度
    var H = $(".urlBox").height();
    $(".urlBox").css({"padding-top":H/2+"px"});
    var sp = parseInt($("#sortable").css("padding-left"));//$("#sortable")的padding-left值
    if(Wid<750){
        $(".ui-draggable").width(Wid-sp*2);
        $("#txt,.txtcontent,#pics,.picscontent,#fgf,.fgfcontent,#tables,.tablescontent").css({"width":""});
        $(".pageBox").css({border:'none'});
    }
    var dataId = $(".txtcontent").closest(".ui-draggable").attr('data-id');
    $("#sortable").find('[data-id=' + dataId + ']').find('.txtcontent img').css({
        "max-width":$("#sortable").find('[data-id=' + dataId + ']').find(".txtcontent").width()
    });
}
var mobileReg = /^0?(13[0-9]|15[012356789]|18[0123456789]|14[57]|17[0678])[0-9]{8}$/;
//获取验证码
$(".pageBox").delegate(".tabCodebtn","click", function () {
    var btn = $(".tabCodebtn");
    var phone = $.trim($("#phone").val());
    console.log(phone);
    if ($.trim(phone) == "" || !mobileReg.test($.trim(phone))) {
        //alert("请输入正确的手机号");
        $(".bg, .warnBox").show();
        $(".warnBox p").html("请输入正确的手机号");

        return false;
    }
    var data = {
        phone:phone
    };
    $.ajax({
        type: 'post',
        url:"/pc/weChat/sendCaptcha.action",
        async: true,
        data:data,
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                $(".tabCodebtn").prop("disabled","disabled");
                var sendagin;
                var ttime = data.data.second;
                console.log(ttime);
                sendagin = setInterval(function () {
                    ttime--;
                    btn.html(ttime + "s后获取");
                    if (ttime <= 0) {
                        clearInterval(sendagin);
                        $(".tabCodebtn").prop("disabled","");
                        btn.html("获取验证码");
                    }
                }, 1000);
                var tdate = new Date();
                tdate.setTime(tdate.getTime() + (60 * 1000));
            } else {
                //alert(data.msg);
                $(".bg, .warnBox").show();
                $(".warnBox p").html(data.msg);
            }
        }
    });
});
//表单提交
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var m = $("meta[name='idea-page-id']");//获取meta里面的内容
$(".pageBox").delegate(".btn-primary","click", function () {
    var name = $.trim($("#name").val()),
        sex = $("input[name='sex']:checked").val()?$("input[name='sex']:checked").val():'',
        mobile = $.trim($("#phone").val()),//手机号码
        captcha = $.trim($("#code").val()),//验证码
        channel = GetQueryString("channel"),//访问渠道
        //formName = (GetQueryString("formName")),//表单名称
        ideaId = GetQueryString("idea_id"),//素材id
        ideaLogId = GetQueryString("idea_log_id"),//发送记录
        agentUserId = GetQueryString("agent_user_id"),//发送记录
        ideaType = GetQueryString("idea_type"),//素材来源
        ideaPageId = m.attr("content");//微页面id
    if ($.trim(captcha) == ""||$.trim(captcha).length<6) {
        //alert("请输入正确验证码");
        $(".bg, .warnBox").show();
        $(".warnBox p").html("请输入正确验证码");
        return false;
    }
    var data = {
        name:name,
        sex:sex,
        mobile : mobile,//手机号码
        captcha : captcha,//验证码
        channel : channel,//访问渠道
        //formName : formName,//表单名称
        ideaId : ideaId,//素材id
        ideaLogId : ideaLogId,//发送记录
        ideaType : ideaType,//素材来源
        agentUserId:agentUserId,//推广人
        ideaPageId:ideaPageId//微页面id
        //ideaPageId:673//微页面id
    };
    $.ajax({
        type: 'post',
        //url: API.baseUrl+" /pc/weCaht/sendCaptcha.cgi",
        url:"/pc/weChat/formSubmit.action",
        async: true,
        data:data,
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                $(".bg, .urlBox").show();
                $("#phone").val(mobile);
                $("#code").val(captcha);
                $(".btn-primary").prop("disabled","");
                var Jump;
                var time = 5;
                Jump = setInterval(function () {
                    time--;
                    $(".urlBox span").html(time);
                    if (time <= 0) {
                        clearInterval(Jump);
                        location.reload();
                    }
                }, 1000);
            } else {
                $(".bg, .warnBox").show();
                $(".warnBox p").html(data.msg);
            }
        }
    });
});
//关闭弹窗
function bgClose(){
    $(".bg, .warnBox").hide();
}