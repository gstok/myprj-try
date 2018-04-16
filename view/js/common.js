/**
 * Created by admin on 2017/6/6.
 */
//全局变量信息
var Global ={
    //用户id
    userId:"",
    //邮件地址
    email:'',
    //用户信息
    userInfo:"",
    //用户cookie
    workenToken:"",
    //菜单
    menuList:[],
    //微信id
    weixinId:'',
    //是否是管理员
    isAdmin:'',
    //权限code
    selectFunction:[]
};

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

$.ajaxSetup({
    error: function (XMLHttpRequest, textStatus, errorThrown){
        if(XMLHttpRequest.status==500){
            window.location.href=API.baseUrl+"/";
            return false;
        }
    }
});

//获取cookie
$.getCookie = function(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        // var c = ca[i].trim();
        var c = ca[i];
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
};
//数组去重
function unique(arr){
    var newArr = [arr[0]];
    for(var i=1;i<arr.length;i++){
        if(newArr.indexOf(arr[i]) == -1){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

//Vue.config.productionTip = false;
//页面加载效果
var MaskUtil = (function(){

    var $mask,$maskMsg;

    var defMsg = '页面正在加载 ...';

    function init(){
        if(!$mask){
            $mask = $("<div class=\"datagrid-mask mymask\"></div>").appendTo("body");
        }
        if(!$maskMsg){
            $maskMsg = $("<div class=\"datagrid-mask-msg mymask\">"+defMsg+"</div>")
                .appendTo("body").css({'font-size':'14px'});
        }
        $mask.css({width:"100%",height:$(document).height()});
        var scrollTop = $(document.body).scrollTop();

        $maskMsg.css({
            left:( $(document.body).outerWidth(true)-164) / 2 +100+($(".DG_seaAndnew").width())/2
            ,top:( ($(window).height() - 45) / 2 ) + scrollTop
        });

    }

    return {
        Loading:function(msg){
            init();
            $mask.show();
            $maskMsg.html(msg||defMsg).show();
        }
        ,RemoveLoading:function(){
            $mask.hide();
            $maskMsg.hide();
        }
    }

}());
var body =  $("body");
var bodyHeight = body.height();
var bodyWidth = body.width();
var addSysHeight = "";
var addSysWidth = "";
var contentDiv =''; //传过来的内容层
var thisDiv ='';//传过来的弹窗最外层

//弹窗公共操作部分
function frameDiv(obj,content){
    $(".bg").fadeIn();
    $(obj).fadeIn();
    addSysHeight =$(obj).height();
    addSysWidth = $(obj).width();
    resizeDiv(obj,content);//改变窗口大小*/
    contentDiv = content;//传过来的内容层
    thisDiv = obj;//传过来的弹窗最外层
    //拖动高度改变弹窗高度
    $(window).resize(function(){
        bodyHeight = body.height();
        bodyWidth = body.width();
        resizeDiv(thisDiv,contentDiv);//改变窗口大小
    });
    //关闭按钮关闭弹窗
    $(".MotalTit span").on("click",function(){
        $(".bg").fadeOut();
        $(thisDiv).fadeOut();
    });
    //取消按钮关闭弹窗
    $(".cancelBtn,#viewSureBtn").on("click",function(){
        $(".bg,.modelContent").fadeOut();
    });
}

//动态改变弹出窗的位置
function resizeDiv(obj,content){
    if(addSysHeight < bodyHeight){
        $(obj).css({
            height:addSysHeight,
            top:'50%',
            marginTop:-addSysHeight/2-25+"px",
        });
    }else if(addSysHeight > bodyHeight  && bodyHeight >400){
        $(obj).css({
            height:bodyHeight - 160+ 'px',
            top:'0',
            marginTop:"80px"
        });
    }
    $(content).css({height:$(obj).height()-50+'px'})
}
// 关闭和取消弹出层按钮
$('.closePropup,.cancelPropup').click(function(){
    $('.popup-inner').addClass('hide');
    $('.firstTopTitle').removeClass('hide');
    $('#page-inner').removeClass('hide');
});



//清空文本
function clearInput(){
    $("input[type='text'],input[type='password']").val("");
}
//清空弹出框内容
function clearInfo(){
    $('.modelContent input').val("");
    $('.modelContent select').val("");
    $('.modelContent textarea').val('')
}
//判断数据是否为空
function isNull(data){
    return (data == "" || data == undefined || data == null) ? "" : data;
}



/*var _url = $.cookie("url");
console.log(_url);*/
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
            headers: {
                platform: "PC"
            },
            beforeSend: function () {
                return true;
            },
            success: function (res) {
                if(res.code == 401){
                    window.location.href = API.baseUrl+"/login.html";
                }else if(res.code == 403){
                    console.log(Global.url);
                    dcrmAlertWarning(res.msg);
                    /*setTimeout(function(){
                     $(".xcConfirm").hide();
                     if(_url){
                     window.location.href = API.baseUrl + _url;
                     }
                     },200);*/
                }else{
                    callback(res);
                }

            }

        };
        $.ajax(settings);
    },
    get: function (url, data, callback, errorcallback) {
        var settings = {
            type: 'GET',
            url: API.baseApi+$.trim(url),
            data: data,
            cache: false,
            dataType: 'json',
            headers: {
                platform: "PC"
            },
            beforeSend: function () {
                return true;
            },
            success: function (res) {
                callback(res);
            }

        };
        $.ajax(settings);
    },

    //权限
    selectFunction:function(param,callback){
        API.post("/pc/user/selectFunction.action",param,false,callback);
    },
    alphaConfig: function (callback) {
        API.post("/common/alphaConfig.action", null, false, callback);
    },



    /************************     营销      *****************************/
    //获取内容标签
    getFlags:function(param,callback){
        API.post("/common/getFlags.action",param,false,callback);
    },
    //获取群组
    microGroup:function(param,callback){
        API.post("/common/getGroup.action",param,false,callback);
        //API.get("/setting/get.json",param,callback);
    },
    //获取客户属性
    getParam:function(param,callback){
        API.post("/common/getParam.action",param,false,callback);
    },
    //获取微页面
    getPage:function(param,callback){
        API.post("/common/getPage.action",param,false,callback);
    },
    //获取微页面列表
    wechatlist:function(param,callback){
        API.post(" /pc/weChat/htmlList.action",param,true,callback);
        //API.get("/setting/mark.json",param,callback);
    },
    //微转发列表
    queryForwardList:function(param,callback){
        API.post(" /pc/forward/queryForwardList.action",param,true,callback);
    },
    //获取微页面列表二维码图片
    createQrCode:function(param,callback){
        API.post("/pc/weChat/createQrCode.action",param,true,callback);
    },
    //微页面列表复制
    mircocopyHtml:function(param,callback){
        API.post(" /pc/weChat/copyHtml.action",param,true,callback);
    },
    //微页面列表发送
    sendPage:function(param,callback){
        API.post("/pc/weChat/sendPage.action",param,true,callback);
    },
    //微页面列表删除
    deleteHtml:function(param,callback){
        API.post(" /pc/weChat/deleteHtml.action",param,true,callback);
    },
    //微页面暂存
    createRecord:function(param,callback){
        API.post("/pc/weChat/createRecord.action",param,true,callback);
    },
    //新增微转发
    createForward:function(param,callback){
        API.post("/pc/forward/createForward.action",param,true,callback);
    },
    //微页面访问   折线图
    micropagevist:function(param,callback){
        API.post(" /pc/weChat/pagevist.action",param,true,callback);
    },
    //微页面渠道   饼状图
    pagechannel:function(param,callback){
        API.post("/pc/weChat/pagechannel.action",param,true,callback);
    },
    //投放列表


    //创建微页面
    createHtml:function(param,callback){
        API.post("/pc/weChat/createHtml.action",param,true,callback);
    },
    //获取微页面
    getHtml:function(param,callback){
        API.post("/pc/weChat/getHtml.action",param,false,callback);
    },
    //编辑微页面
    updateHtml:function(param,callback){
        API.post("/pc/weChat/updateHtml.action",param,true,callback);
    },




    //短信模板列表
    smslist:function(param,callback){
        API.post("/pc/sms/smsList.action",param,true,callback);
        //API.get("/setting/shortmessage.json",param,callback);
    },
    //分析模块获取短信模板列表
    smsListForAnaly:function(param,callback){
        API.post("/pc/sms/smsListForAnaly.action",param,true,callback);
        //API.get("/setting/shortmessage.json",param,callback);
    },
    //创建短信模板
    createSms:function(param,callback){
        API.post("/pc/sms/createSms.action",param,true,callback);
    },
    //复制短信
    copySms:function(param,callback){
        API.post("/pc/sms/copySms.action",param,true,callback);
    },
    //编辑短信模板
    updateSms:function(param,callback){
        API.post("/pc/sms/updateSms.action",param,true,callback);
    },
    //发送短信
    sendSms:function(param,callback){
        API.post("/pc/sms/sendSms.action",param,true,callback);
    },
    //获取短信模板类型
    getSmsType:function(param,callback){
        API.post("/pc/sms/getSmsType.action",param,true,callback);
    },
    //编辑短信弹窗
    getSms:function(param,callback){
        API.post("/pc/sms/getSms.action",param,false,callback);
    },
    //短信提交审核
    verifySms:function(param,callback){
        API.post("/pc/sms/verifySms.action",param,true,callback);
    },
    //短信测试发送
    testSend:function(param,callback){
        API.post("/pc/sms/testSend.action",param,true,callback);
    },
    //获取短信签名
    getSignList:function(param,callback){
        API.post("/pc/sms/getSignList.action",param,false,callback);
    },
    //删除短信
    deleteSms:function(param,callback){
        API.post("/pc/sms/deleteSms.action",param,true,callback);
    },
    //短信发送记录
    smsSendLog:function(param,callback){
        API.post("/pc/sms/sendLog.action",param,true,callback);
    },
    //短信数据分析  访问
    smsvisit:function(param,callback){
        API.post("/pc/sms/smsvisit.action",param,false,callback);
    },
    //短信数据分析  转化漏斗
    smsfunnel:function(param,callback){
        API.post("/pc/sms/smsfunnel.action",param,false,callback);
    },



    //邮件模板列表
    emailList:function(param,callback){
        API.post("/pc/email/emailList.action",param,true,callback);
        //API.get("/setting/email.json",param,callback);
    },
    //邮件模板列表---分析用
    emailListForAnaly:function(param,callback){
        API.post("/pc/email/emailListForAnaly.action",param,true,callback);
        //API.get("/setting/email.json",param,callback);
    },
    //新建邮件模板保存
    createEmail:function(param,callback){
        API.post("/pc/email/createEmail.action",param,true,callback);
    },
    //复制邮件
    copyEmail:function(param,callback){
        API.post("/pc/email/copyEmail.action",param,true,callback);
    },
    //删除邮件
    deleteEmail:function(param,callback){
        API.post("/pc/email/deleteEmail.action",param,true,callback);
    },
    //编辑邮件展示
    getEmail:function(param,callback){
        API.post("/pc/email/getEmail.action",param,false,callback);
    },
    //编辑电子邮件保存
    updateEmail:function(param,callback){
        API.post("/pc/email/updateEmail.action",param,true,callback);
    },
    //测试发送电子邮件
    testSendEmail:function(param,callback){
        API.post("/pc/email/testSend.action",param,true,callback);
    },
    //发送电子邮件
    sendEmail:function(param,callback){
        API.post("/pc/email/sendEmail.action",param,true,callback);
    },
    //电子邮件 发送记录
    emailsendLog:function(param,callback){
        API.post("/pc/email/sendLog.action",param,true,callback);
    },
    //电子邮件 发送记录-----分析页面
    AnalyemailsendLog:function(param,callback){
        API.post("/pc/email/sendLog.action",param,false,callback);
    },
    //电子邮件数据分析  查看
    emailview:function(param,callback){
        API.post("/pc/email/emailview.action",param,true,callback);
    },
    //电子邮件数据分析  页面访问
    emailvisit:function(param,callback){
        API.post("/pc/email/emailvisit.action",param,true,callback);
    },
    //电子邮件数据分析  转化漏斗
    emailfunnel:function(param,callback){
        API.post("/pc/email/emailfunnel.action",param,true,callback);
    },


    // 加好友微信群好友列表
    queryWechatFriendList:function(param,callback){
        API.post(" /pc/wechatFriend/queryWechatFriendList.action",param,true,callback);
    },
    //加好友微信群列表
    queryWechatGroupList:function(param,callback){
        API.post("  /pc/wechatFriend/queryWechatGroupList.action",param,true,callback);
    },
    //添加微信好友
    addWechatFriend:function(param,callback){
        API.post(" /pc/wechatFriend/addWechatFriend.action",param,true,callback);
    },

    //微信群列表
    weChatGroupList:function(param,callback){
        API.post("/pc/weChat/weChatGroupList.action",param,true,callback);
    },
    //新建微信群
    createWeChatGroup:function(param,callback){
        API.post("/pc/weChat/createWeChatGroup.action",param,true,callback);
    },
    //修改微信群
    updateWeChatGroup:function(param,callback){
        API.post("/pc/weChat/updateWeChatGroup.action",param,true,callback);
    },
    //删除微信群
    deleteWeChatGroup:function(param,callback){
        API.post("/pc/weChat/deleteWeChatGroup.action",param,true,callback);
    },
    //复制微信群
    copyWeChatGroup:function(param,callback){
        API.post("/pc/weChat/copyWeChatGroup.action",param,true,callback);
    },
    //微信群发送
    sendWeChatGroup:function(param,callback){
        API.post("/pc/weChat/sendWeChatGroup.action",param,true,callback);
    },
    //微信群发送弹窗-----编辑微信群
    updateWeChatGroups:function(param,callback){
        API.post("/pc/weChat/updateWeChatGroups.action",param,true,callback);
    },
    //微信群发送弹窗-----删除微信群
    delWeChatGroups:function(param,callback){
        API.post("/pc/weChat/delWeChatGroups.action",param,true,callback);
    },
    //编辑微信群 页面展示
    getWeChatGroup:function(param,callback){
        API.post("/pc/weChat/getWeChatGroup.action",param,false,callback);
    },
    //获取微信群列表
    getWeChatGroupInfoList:function(param,callback){
        API.post("/pc/weChat/getWeChatGroupInfoList.action",param,true,callback);
    },
    //查询微信群的群组-----------微信群弹窗发送里面的群组
    getWeChatGroups:function(param,callback){
        API.post(" /pc/weChat/getWeChatGroups.action",param,true,callback);
    },
    //获取微信好友列表
    getWeChatFriends:function(param,callback){
        API.post("/pc/weChat/getWeChatFriends.action",param,true,callback);
    },
    //微信群发送记录
    WeChatsendLog:function(param,callback){
        API.post("/pc/weChat/sendLog.action",param,true,callback);
    },
    //微信群测试发送获取个人信息
    getMyWechat:function(param,callback){
        API.post("/pc/weChat/getMyWechat.action",param,true,callback);
    },
    //微信群测试发送
    WechattestSend:function(param,callback){
        API.post("/pc/weChat/testSend.action",param,true,callback);
    },
    //微信群数据分析   访问
    wechatgroupvisit:function(param,callback){
        API.post("/pc/weChat/wechatgroupvisit.action",param,true,callback);
    },
    /*----------------- 电话营销----------------*/
    showPhoneRecordList:function(param,callback){
        API.post(" /pc/eventCall/queryPhoneRecordList.action",param,false,callback);
    },
    /*----------------- 弹信营销----------------*/
    //弹信模板列表
    showTempList:function(param,callback){
        API.post(" /pc/flashSms/queryTempList.action",param,true,callback);
    },
    //弹信发送记录列表
    tempSendList:function(param,callback){
        API.post("/pc/flashSms/tempSendList.action",param,true,callback);
    },
    //弹信测试发送
    tempSingleSend:function(param,callback){
        API.post("/pc/flashSms/tempSingleSend.action",param,true,callback);
    },
    //新增弹信模板
    createSingleTemp:function(param,callback){
        API.post("/pc/flashSms/createSingleTemp.action",param,true,callback);
    },
    //获取弹信模板类型
    createSingleTemp:function(param,callback){
        API.post("/pc/flashSms/createSingleTemp.action",param,true,callback);
    },
    //查看弹信名片
    tempGroupSend:function(param,callback){
        API.post("  /pc/flashSms/getFlashCardList.action",param,true,callback);
    },
    //编辑弹信模板
    updateTempById:function(param,callback){
        API.post("/pc/flashSms/updateTempById.action",param,true,callback);
    },
    //获取弹信签名
    getFlashSignatureList:function(param,callback){
        API.post(" /pc/flashSms/getFlashSignatureList.action",param,true,callback);
    },
    //删除弹信
    delTempById:function(param,callback){
        API.post(" /pc/flashSms/delTempById.action",param,true,callback);
    },
    //获取弹信
    getTempById:function(param,callback){
        API.post(" /pc/flashSms/getTempById.action",param,true,callback);
    },
    //审核弹信
    editTempById:function(param,callback){
        API.post(" /pc/flashSms/editTempById.action",param,true,callback);
    },
    //弹信群发送
    tempGroupSend:function(param,callback){
        API.post("/pc/flashSms/tempGroupSend.action",param,true,callback);
    },
    //弹信失败统计
    queryFlashSendBedReason:function(param,callback){
        API.post("/pc/flashSms/queryFlashSendBedReason.action",param,true,callback);
    },
    /*----------------- 微信加好友----------------*/
    //所有好友列表
    showWechatFriendList:function(param,callback){
        API.post(" /pc/wechatFrind/showWechatFriendList.action",param,true,callback);
    },
    //所有微信群列表
    showWechatGroupList:function(param,callback){
        API.post(" /pc/wechatFrind/showWechatGroupList.action",param,true,callback);
    },
    /*----------------- 首页----------------*/
    // 用户登录
    login:function(param,callback){
        API.post("/login.action",param,true,callback);
    },
    // 同意协议
    isAgreeDisclaimer:function(param,callback){
        API.post("/common/isAgreeDisclaimer.action",param,true,callback);
    },
    //退出登录
    logout:function(param,callback){
        API.post("/logOut.action",param,true,callback);
    },
    //个人设置-获取用户信息
    getUserInfo:function(param,callback){
        API.post("/pc/user/selectById.action",param,false,callback);
    },
    //添加客户标签
    addCustom:function(param,callback){
        API.post("/pc/custTag/insertCustTage.action ",param,true,callback);
    },
    //删除客户标签
    deleteCustom:function(param,callback){
        API.post("/pc/custTag/delCustom.action",param,true,callback);
    },
    //客户标签列表
    customList:function(param,callback){
        API.post(" /pc/custTag/list.action",param,true,callback);
    },
    //客户阶段修改
    updateStage:function(param,callback){
        API.post(" /pc/cust/updateStage.action",param,true,callback);
    },
    //获取所有标签
    getAllTag:function(param,callback){
        API.post(" /pc/cust/allTag.action",param,false,callback);
    },
    // //退出群组
    // deleteGroup:function(param,callback){
    //     API.post("/pc/cust/deleteGroup.action",param,true,callback);
    // },
    //更新群组
    updateGroupTag:function(param,callback){
        API.post("/pc/cust/updateGroupTag.action",param,false,callback);
    },

    //任务统计
    hTask:function(param,callback){
        API.post("/pc/custTask/hTask.action",param,true,callback);
    },
    //客户统计
    stageCount:function(param,callback){
        API.post("/pc/cust/stageCount.action",param,true,callback);
    },
    //最新短信
    lastSms:function(param,callback){
        API.post("/pc/ideasms/lastSms.action",param,true,callback);
    },
    //最新邮件
    lastEmail:function(param,callback){
        API.post("/pc/email/lastEmail.action",param,true,callback);
    },
    //微信群营销统计
    wgTop5:function(param,callback){
        API.post("/pc/wgLog/wgTop5.action",param,true,callback);
    },
    //弹信营销统计
    fslogtop5:function(param,callback){
        API.post("/pc/fslog/fslogtop5.action",param,true,callback);
    },
    //本周热门微页面
    topideaPage:function(param,callback){
        API.post("/pc/ideaPage/topideaPage.action",param,true,callback);
    },
    //新增客户
    homeCustTotle:function(param,callback){
        API.post(" /pc/cust/homeCustTotle.action",param,false,callback);
    },
    //新增微信好友
    wechatFriendTotle:function(param,callback){
        API.post(" /pc/weChat/wechatFriendTotle.action",param,false,callback);
    },

    /*----------------- 工单----------------*/

    //工单列表
    workOrderList:function(param,callback){
        API.post("/pc/workOrder/workOrderList.action",param,true,callback);
    },
    //创建工单
    createWorkOrder:function(param,callback){
        API.post("/pc/workOrder/createWorkOrder.action",param,true,callback);
    },
    //查看工单详情
    orderSee:function(param,callback){
        API.post(" /pc/workOrder/showDetails.action",param,true,callback);
    },
    //工单基础标签
    orderCommon:function(param,callback){
        API.post("/pc/workOrder/basicsLable.action",param,false,callback);
    },
    //工单行业标签
    orderIndustry:function(param,callback){
        API.post("/pc/workOrder/industryLabel.action",param,false,callback);
    },
    //工单需求字段和输出字段
    selelAttr:function(param,callback){
        API.post("/pc/workOrder/selelAttr.action",param,false,callback);
    },
    // 三级菜单
    getBigIndustry:function(param,callback){
        API.post("/common/getBigIndustry.action",param,false,callback);
    },
    // 详情页提交工单
    tjWorkOrder:function(param,callback){
        API.post("/pc/workOrder/updateStatus.action",param,true,callback);
    },
    // 工单详情回显
    viewWorkOrder:function(param,callback){
        API.post("/pc/workOrder/selectById.action",param,true,callback);
    },
    // 修改工单
    upDateWorkOrder:function(param,callback){
        API.post(" /pc/workOrder/update.action",param,true,callback);
    },
    // 删除工单
    delWorkOrder:function(param,callback){
        API.post(" /pc/workOrder/deleteByid.action",param,true,callback);
    },
    // 数据清单
    workOrderBack:function(param,callback){
        API.post("/pc/workOrder/workOrderBack.action",param,true,callback);
    },
    // 获取省
    getProvince:function(param,callback){
        API.post(" /common/getProvince.action",param,false,callback);
    },
    // 获取市
    getCity:function(param,callback){
        API.post("/common/getCity.action",param,false,callback);
    },
    /*----------------- 客户----------------*/
    //客户列表
    custList:function(param,callback){
        API.post("/pc/cust/list.action",param,false,callback);
    },
    //新建客户-客户属性获取
    custSelectById:function(param,callback){
        API.post("/pc/cust/selectById.action",param,false,callback);
    },
    //添加客户
    addCustomer:function(param,callback){
        API.post("/pc/cust/insert.action",param,true,callback);
    },
    //修改客户
    editCustomer:function(param,callback){
        API.post("/pc/cust/update.action",param,true,callback);
    },
    //客户详情
    viewCustomer:function(param,callback){
        API.post("/pc/cust/showDetails.action",param,true,callback);
    },
    //删除客户
    deleteCustomer:function(param,callback){
        API.post("/pc/cust/delete.action",param,true,callback);
    },
    //获取事件
    getEventName:function(param,callback){
        API.post("/pc/confEvent/seleName.action",param,true,callback);
    },
    //获取事件来源
    getEventSource:function(param,callback){
        API.post("/pc/cust/toaddEvent.action",param,true,callback);
    },
    //添加客户事件
    addEvent:function(param,callback){
        API.post("/pc/cust/addEvent.action",param,true,callback);
    },
    //接触时间
    contactTime:function(param,callback){
        API.post("/pc/cust/contactTime.action",param,true,callback);
    },
    //获取所有群组
    getGroup:function(param,callback){
        API.post("/pc/cust/custGroup.action",param,false,callback);
    },
    //获取单个任务
    oneTask:function(param,callback){
        API.post("/pc/custTask/oneTask.action",param,true,callback);
    },
    //获取单个订单
    oneOrder:function(param,callback){
        API.post("/pc/custOder/oneOrder.action",param,true,callback);
    },
    //获取所有订单
    allOrder:function(param,callback){
        API.post("/pc/custOder/list.action",param,true,callback);
    },
    //获取所有客户事件
    getCustEvent:function(param,callback){
        API.post("/pc/cust/getCustEvent.action",param,true,callback);
    },
    //获取活跃度
    getLiveness:function(param,callback){
        API.post("/pc/cust/getLiveness.action",param,true,callback);
    },
    //标签修改
    changeCusTag:function(param,callback){
        API.post(" /pc/cust/addCustTag.action",param,true,callback);
    },
    //  //获取内容标签
    // getContTag:function(param,callback){
    //     API.post("/pc/custTag/addCustom.action",param,true,callback);
    // },
    /*----------------- 任务类型----------------*/
    // 任务类型修改
    updateTaskType:function(param,callback){
        API.post("/pc/taskType/update.action",param,true,callback);
    },
    //任务类型列表
    taskTypeList:function(param,callback){
        API.post("/pc/taskType/list.action",param,true,callback);
    },
    //任务类型删除
    delStatustype:function(param,callback){
        API.post("/pc/taskType/delStatus.action",param,true,callback);
    },
    //任务类型添加
    addTaskType:function(param,callback){
        API.post("/pc/taskType/insert.action",param,true,callback);
    },
    //查看任务类型
    viewTaskType:function(param,callback){
        API.post(" /pc/taskType/selectById.action",param,true,callback);
    },
    //禁用任务类型
    updateStatus:function(param,callback){
        API.post(" /pc/taskType/updateStatus.action",param,true,callback);
    },
    /*----------------- 内容标签----------------*/

    //内容标签列表
    contentTagList:function(param,callback){
        API.post("/pc/contentTag/list.action",param,true,callback);
    },
    //内容标签删除
    delContentTag:function(param,callback){
        API.post(" /pc/contentTag/delete.action",param,true,callback);
    },
    //内容标签添加
    addContentTag:function(param,callback){
        API.post("/pc/contentTag/insert.action",param,true,callback);
    },
    //查看内容标签
    viewContentTag:function(param,callback){
        API.post("/pc/contentTag/selectById.action",param,true,callback);
    },
    // 内容标签禁用设置
    contentTagDisable:function(param,callback){
        API.post(" /pc/contentTag/disable.action",param,true,callback);
    },
    // 内容标签启用设置
    contentTagEnable:function(param,callback){
        API.post("/pc/contentTag/enable.action",param,true,callback);
    },
    // 修改内容标签
    updateContentTag:function(param,callback){
        API.post("/pc/contentTag/update.action",param,true,callback);
    },

    /*----------------- 客户属性----------------*/
    // 客户属性列表
    cusAttrList:function(param,callback){
        API.post("/pc/pcConfCustAttr/list.action",param,true,callback);
    },
    // 修改客户属性
    editAttribute:function(param,callback){
        API.post("/pc/pcConfCustAttr/update.action",param,true,callback);
    },
    // 新建客户属性
    addcusAttribute:function(param,callback){
        API.post("/pc/pcConfCustAttr/insert.action",param,true,callback);
    },
    // 客户属性详情
    viewAttribute:function(param,callback){
        API.post("/pc/pcConfCustAttr/selectById.action",param,true,callback);
    },

    //客户属性启用设置
    attributeEnable:function(param,callback){
        API.post("/pc/pcConfCustAttr/enable.action",param,true,callback);
    },
    //客户属性禁用设置
    attributeDisable:function(param,callback){
        API.post("/pc/pcConfCustAttr/disable.action",param,true,callback);
    },
    //客户属性常用设置
    attributeStatus:function(param,callback){
        API.post("/pc/pcConfCustAttr/updateScop.action",param,true,callback);
    },
    //客户属性删除
    delcusAttribute:function(param,callback){
        API.post("/pc/pcConfCustAttr/delete.action",param,true,callback);
    },

    /*----------------- 客户来源----------------*/
    // 客户来源修改
    updateCustSource:function(param,callback){
        API.post(" /pc/custSource/update.action",param,true,callback);
    },
    // 客户来源列表
    cusSourceList:function(param,callback){
        API.post("/pc/custSource/list.action",param,true,callback);
    },
    //客户来源详情
    viewCustSource:function(param,callback){
        API.post(" /pc/custSource/selectById.action",param,true,callback);
    },
    // 客户来源删除
    delCusSource:function(param,callback){
        API.post(" /pc/custSource/delete.action",param,true,callback);
    },
    // 客户来源添加
    addCusSource:function(param,callback){
        API.post(" /pc/custSource/insert.action",param,true,callback);
    },
    // 客户来源启用设置
    cusSourceEnable:function(param,callback){
        API.post(" /pc/custSource/enable.action",param,true,callback);
    },
    // 客户来源禁用设置
    cusSourceDisable:function(param,callback){
        API.post("/pc/custSource/disable.action",param,true,callback);
    },

    /*----------------- 客户标签----------------*/
    // 客户标签列表
    custTagList:function(param,callback){
        API.post("  /pc/custTag/list.action",param,true,callback);
    },
    // 客户标签修改
    updateCustTag:function(param,callback){
        API.post("/pc/custTag/update.action",param,true,callback);
    },

    // 客户标签删除
    delCustTag:function(param,callback){
        API.post(" /pc/custTag/delete.action",param,true,callback);
    },
    // 客户标签新建
    addCustTag:function(param,callback){
        API.post("/pc/custTag/insert.action",param,true,callback);
    },
    // 客户标签禁用设置
    custTagDisable:function(param,callback){
        API.post("/pc/custTag/disable.action",param,true,callback);
    },
    // 客户标签启用设置
    custTagEnable:function(param,callback){
        API.post("/pc/custTag/enable.action",param,true,callback);
    },
    //客户标签详情
    viewCustTag:function(param,callback){
        API.post("/pc/custTag/selectById.action",param,true,callback);
    },
    /*----------------- 客户事件----------------*/
    //客户事件列表
    custEventList:function(param,callback){
        API.post("/pc/confEvent/list.action",param,true,callback);
    },
    //启用禁用客户事件
    updateCustEvent:function(param,callback){
        API.post(" /pc/confEvent/updateStatus.action",param,true,callback);
    },
    //伪删除客户事件
    delStatus:function(param,callback){
        API.post("/pc/confEvent/delStatus.action",param,true,callback);
    },
    //添加客户事件
    addCustEvent:function(param,callback){
        API.post("/pc/confEvent/insert.action",param,true,callback);
    },
    //编辑客户事件
    editCustEvent:function(param,callback){
        API.post("/pc/confEvent/update.action",param,true,callback);
    },

    //客户事件详情
    viewCustEvent:function(param,callback){
        API.post("/pc/confEvent/selectById.action",param,true,callback);
    },
    /*----------------- 短信设置----------------*/
    // 删除签名
    delSmsSign:function(param,callback){
        API.post("/pc/confSmsSignature/delete.action",param,true,callback);
    },
    // 新建签名
    addSmsSign:function(param,callback){
        API.post(" /pc/confSmsSignature/insert.action",param,true,callback);
    },
    // 短信列表
    smsSignList:function(param,callback){
        API.post(" /pc/confSmsSignature/list.action",param,true,callback);
    },

    /*----------------- 个人设置----------------*/

    //个人设置保存
    mySetting:function(param,callback){
        API.post(" /pc/user/update.action",param,true,callback);
    },
    //个人资料详情
    /*myInformation:function(param,callback){
     API.post("/pc/user/selectById.action",param,true,callback);
     },*/

    /*----------------- 任务管理----------------*/
    //任务列表
    custTaskList:function(param,callback){
        API.post(" /pc/custTask/custTaskList.action",param,true,callback);
    },
    //任务详情
    getCustTaskdetail:function(param,callback){
        API.post("/pc/custTask/getCustTaskdetail.action",param,true,callback);
    },
    //创建任务
    creatCustTask:function(param,callback){
        API.post(" /pc/custTask/creatCustTask.action",param,true,callback);
    },
    //删除任务
    delectCustTask:function(param,callback){
        API.post(" /pc/custTask/delectCustTask.action",param,true,callback);
    },
    //完成任务
    completeCustTask:function(param,callback){
        API.post("/pc/custTask/completeCustTask.action",param,true,callback);
    },
    //编辑任务
    editCustTask:function(param,callback){
        API.post("/pc/custTask/updateCustTask.action",param,true,callback);
    },
    //执行人下拉
    getExecutor:function(param,callback){
        API.post("/public/selectAllUser.action ",param,true,callback);
    },
    //涉及客户下拉
    getSelectCust:function(param,callback){
        API.post("/public/selectCust.action",param,false,callback);
    },
    //任务类型下拉
    getTaskType:function(param,callback){
        API.post("/public/taskTypeList.action",param,true,callback);
    },
    //修改密码
    updateUserPwd:function(param,callback){
        API.post(" /pc/user/updateLoginNameAndLoginPwd.action",param,true,callback);
    },
    //超过30天修改密码
    updatePwdByLoginName:function(param,callback){
        API.post(" /pc/user/updatePwdByLoginName.action",param,true,callback);
    },
    /*----------------- 群组管理----------------*/
    //群组列表
    groupList:function(param,callback){
        API.post(" /pc/custGroup/list.action",param,true,callback);
    },
    //群组详情
    viewGroup:function(param,callback){
        API.post(" /pc/custGroup/CustGroupDetail.action",param,true,callback);
    },

    //群组一级筛选条件
    getFilter:function(param,callback){
        API.post("/pc/custGroup/getFirstFilter.action",param,true,callback);
    },
    //群组二级筛选条件
    getSecondFilter:function(param,callback){
        API.post(" /pc/custGroup/getSecondFilter.action",param,false,callback);
    },
    //群组三级事件属性值
    getCustIdea:function(param,callback){
        API.post(" /pc/custGroup/getCustIdea.action",param,false,callback);
    },
    //群组三级销售阶段值
    getCustStage:function(param,callback){
        API.post("/pc/custGroup/getCustStage.action",param,false,callback);
    },
    //群组三级客户来源
    getCustsource:function(param,callback){
        API.post("/pc/custGroup/getCustsource.action",param,false,callback);
    },

    //群组三级客户属性值
    getAttrVal:function(param,callback){
        API.post(" /pc/custGroup/getAttrVal.action",param,false,callback);
    },
    //删除群组
    delGroup:function(param,callback){
        API.post("/pc/custGroup/delectGroup.action",param,true,callback);
    },
    //预览群组
    getCustList:function(param,callback){
        API.post("/pc/custGroup/getCustList.action",param,false,callback);
    },
    //新建群组
    createCustGroup:function(param,callback){
        API.post(" /pc/custGroup/createCustGroup.action",param,true,callback);
    },
    //编辑群组
    updateGroup:function(param,callback){
        API.post("/pc/custGroup/updateGroup.action",param,true,callback);
    },
    //群组详情获取列表
    getGroupCustList:function(param,callback){
        API.post("/pc/custGroup/getGroupCustList.action",param,false,callback);
    },
    //人群分析
    groupAnalysis:function(param,callback){
        API.post("/pc/custGroup/groupAnalysis.action",param,true,callback);
    },
    //刷新群组列表
    refresh:function(param,callback){
        API.post("/pc/custGroup/refresh.action",param,true,callback);
    },
    // 群组标签分析
    groupTagAnalysis: function (param, callback) {
        API.post("/pc/custGroup/groupAttrAnalysis.action",param,true,callback);
    },

    // 获取销售阶段
    stageSelect:function(param,callback){
        API.post("/common/stageSelect.action",param,true,callback);
    },

    // 获取pas详细信息
    geekerDefaut:function(param,callback){
        API.post("/apis/menutagsearch/geekerDefaut.json",param,false,callback);
    },
    // 设默认值
    setdefault:function(param,callback){
        API.post("/pc/searchCond/setdefault.action",param,true,callback);
    },
    // 删除
    del:function(param,callback){
        API.post("/pc/searchCond/delete.action",param,true,callback);
    },
    // 部门管理
    queryDepartment:function(param,callback){
        API.post("/pc/confDepartment/queryDepartment.action",param,false,callback);
    },
    // 新建部门
    createDepartment:function(param,callback){
        API.post("/pc/confDepartment/createDepartment.action",param,true,callback);
    },
    // 编辑部门
    updateDepartment:function(param,callback){
        API.post("/pc/confDepartment/updateDepartment.action",param,true,callback);
    },

    // 删除部门
    delDepartment:function(param,callback){
        API.post("/pc/confDepartment/delDepartment.action",param,true,callback);
    },
    // 职位列表
    queryPosition:function(param,callback){
        API.post("/pc/confPosition/queryPosition.action",param,true,callback);
    },

    // 新建职位
    addPosition:function(param,callback){
        API.post("/pc/confPosition/createPosition.action",param,true,callback);
    },
    // 编辑职位
    updatePosition:function(param,callback){
        API.post("/pc/confPosition/updatePosition.action",param,true,callback);
    },
    // 删除职位
    delPosition:function(param,callback){
        API.post("/pc/confPosition/delPosition.action",param,true,callback);
    },

    //设置-----查询菜单
    querySysRes:function(param,callback){
        API.post("/pc/sysRes/querySysRes.action",param,true,callback);
    },
    //设置-----添加菜单
    createSysRes:function(param,callback){
        API.post("/pc/sysRes/createSysRes.action",param,true,callback);
    },
    //设置-----添加菜单弹窗
    getResById:function(param,callback){
        API.post("/pc/sysRes/getResById.action",param,true,callback);
    },
    //设置-----编辑菜单
    updateSysRes:function(param,callback){
        API.post("/pc/sysRes/updateSysRes.action",param,true,callback);
    },
    //设置-----删除菜单
    delSysRes:function(param,callback){
        API.post("/pc/sysRes/delSysRes.action",param,true,callback);
    },
    // 用户列表
    queryUserList:function(param,callback){
        API.post("/pc/user/queryUserList.action",param,true,callback);
    },
    // 新增用户
    createUser:function(param,callback){
        API.post("/pc/user/createUser.action",param,true,callback);
    },
    //查看用户
    UserInfo:function(param,callback){
        API.post("/pc/user/getUserInfo.action",param,true,callback);
    },
    // 编辑用户
    updateUser:function(param,callback){
        API.post("/pc/user/updateUser.action",param,true,callback);
    },
    // 编辑用户回显
    sgetUserInfo:function(param,callback){
        API.post("/pc/user/getUserInfo.action",param,true,callback);
    },
    // 删除用户
    delUser:function(param,callback){
        API.post("/pc/user/delUser.action",param,true,callback);
    },
    // 查看操作日志
    queryUserLoginLog:function(param,callback){
        API.post("/pc/user/queryUserLoginLog.action",param,true,callback);
    },
    // 获取职位下拉框
    queryPositionAll:function(param,callback){
        API.post("/pc/confPosition/queryPositionAll.action",param,false,callback);
    },
    // 获取部门下拉框
    queryDepart:function(param,callback){
        API.post("/pc/confDepartment/getDepByUser.action",param,true,callback);
    },
    // 获取数据权限列表
    queryFieldList:function(param,callback){
        API.post("/pc/access/queryFieldList.action",param,false,callback);
    },
    // 获取角色下拉框
    queryRole:function(param,callback){
        API.post("/pc/sysRole/queryMyCreateRoles.action",param,true,callback);
    },
    // 权限分配
    createUserRole:function(param,callback){
        API.post("/pc/user/createUserRole.action",param,true,callback);
    },
    // 场景列表
    querySceneList:function(param,callback){
        API.post(" /pc/access/querySceneList.action",param,true,callback);
    },
    // 数据权限保存
    // createRoleAccess:function(param,callback){
    //     API.post(" /pc/access/createRoleAccess.action",param,true,callback);
    // },
    // 获取当前部门
    getDepByUser:function(param,callback){
        API.post("/pc/confDepartment/getDepByUser.action",param,false,callback);
    },
    // 获取当前部门
    getSelData:function(param,callback){
        API.post("/pc/user/getSelData.action",param,true,callback);
    },
    // 获取下属角色
    queryMyCreateRoles:function(param,callback){
        API.post("/pc/sysRole/queryMyCreateRoles.action",param,true,callback);
    },
    // 新增角色
    createRole:function(param,callback){
        API.post("/pc/sysRole/createRole.action",param,true,callback);
    },
    // 复制角色
    copyRole:function(param,callback){
        API.post("/pc/sysRole/copyRole.action",param,true,callback);
    },
    // 编辑角色
    updateRole:function(param,callback){
        API.post("/pc/sysRole/updateRole.action",param,true,callback);
    },
    // 删除角色
    delRole:function(param,callback){
        API.post("/pc/sysRole/delRole.action",param,true,callback);
    },
    // 获取菜单列表----角色权限
    queryResByUserId:function(param,callback){
        API.post("/pc/resource/queryResByUserId.action",param,false,callback);
    },
    // 根据模块code加api-----角色权限
    queryApiByModuleCode:function(param,callback){
        API.post("/pc/resource/queryApiByModuleCode.action",param,true,callback);
    },
    // 保存功能权限----角色权限
    /*roleData:function(param,callback){
     API.post("/pc/sysRole/roleData.action",param,true,callback);
     },*/
    // 查看权限
    getUserRes:function(param,callback){
        API.post("/pc/user/getUserRes.action",param,true,callback);
    },
    // 保存沟通结果
    saveStatus:function(param,callback){
        API.post("/pc/eventCall/saveStatus.action",param,true,callback);
    },
    // 打电话
    callPhone:function(param,callback){
        API.post("/pc/eventCall/callPhone.action",param,true,callback);
    },
    // 打电话
    timeCount:function(param,callback){
        API.post(" /pc/flashSms/timeCount.action",param,true,callback);
    },
    // 查询拨打状态
    callLog:function(param,callback){
        API.post(" /pc/eventCall/callLog.action",param,false,callback);
    },
    // 查询省市区code
    queryCityCodeByNames:function(param,callback){
        API.post("/common/queryCityCodeByNames.action",param,false,callback);
    },
    //查询账户余额
    queryFinAccount:function(param,callback){
        API.post("/pc/finAccount/queryFinAccount.action",param,true,callback);
    },
    //查询已购套餐
    queryProductOrder:function(param,callback){
        API.post("/pc/finProductOrder/queryProductOrder.action",param,true,callback);
    },
    //查询套餐详情
    queryAllOrder:function(param,callback){
        API.post("/pc/finProductOrder/queryAllOrder.action",param,true,callback);
    },
    //可购买套餐
    queryProductForBuy:function(param,callback){
        API.post("/pc/finProductOrder/queryProductForBuy.action",param,true,callback);
    },
    //查看套餐详情
    getProductById:function(param,callback){
        API.post("/pc/finProductOrder/getProductById.action",param,true,callback);
    },
    //购买套餐前校验
    payPrompting:function(param,callback){
        API.post("/pc/finProductOrder/payPrompting.action",param,true,callback);
    },
    //购买套餐
    purchasingOrder:function(param,callback){
        API.post("/pc/finProductOrder/purchasingOrder.action",param,true,callback);
    },
    //财务概览--使用中套餐
    queryUsingOrder:function(param,callback){
        API.post("/pc/finProductOrder/queryUsingOrder.action",param,true,callback);
    },
    //购买未支付套餐
    payOrder:function(param,callback){
        API.post("/pc/finProductOrder/payOrder.action",param,true,callback);
    },
    //取消未支付套餐
    cancelOrder:function(param,callback){
        API.post("/pc/finProductOrder/cancelOrder.action",param,true,callback);
    },
    //充值记录
    queryRechargeLog:function(param,callback){
        API.post("/pc/finAccount/queryRechargeLog.action",param,true,callback);
    },
    //充值
    rechargeAccount:function(param,callback){
        API.post("/pc/finAccount/rechargeAccount.action",param,false,callback);
    },
    //消费账单
    queryFinBill:function(param,callback){
        API.post("/pc/finService/queryFinBill.action",param,true,callback);
    },
    //消费详单
    queryServiceDetail:function(param,callback){
        API.post("/pc/finService/queryServiceDetail.action",param,true,callback);
    },
    //查询微信支付状态
    getRechargeLogBySn:function(param,callback){
        API.post("/pc/finAccount/getRechargeLogBySn.action",param,true,callback);
    },
    //客户-----全部销售阶段
    stageSelect:function(param,callback){
        API.post("/common/stageSelect.action",param,true,callback);
    },
    //客户-----全部来源
    getCustSoure:function(param,callback){
        API.post("/common/getCustSource.action",param,true,callback);
    },
    //客户-----全部负责人
    selectExecutorUser:function(param,callback){
        API.post("/public/selectExecutorUser.action",param,false,callback);
    },
    //客户批量发送-----获取短信列表
    getSmsList:function(param,callback){
        API.post("/pc/sms/getSmsList.action",param,true,callback);
    },
    //客户批量发送-----获取邮件列表
    getEmailList:function(param,callback){
        API.post("/pc/email/getEmailList.action",param,true,callback);
    },
    //客户批量发送-----获取弹信列表
    getFlashList:function(param,callback){
        API.post("/pc/flashSms/getFlashList.action",param,true,callback);
    },
    //客户批量发送-----发送短信
    smsBatchSend:function(param,callback){
        API.post("/pc/sms/smsBatchSend.action",param,true,callback);
    },
    //客户批量发送-----发送邮件
    emailBatchSend:function(param,callback){
        API.post("/pc/email/emailBatchSend.action",param,true,callback);
    },
    //客户批量发送-----发送弹信
    flashBatchSend:function(param,callback){
        API.post("/pc/flashSms/flashBatchSend.action",param,true,callback);
    },
    //客户批量发送-----批量分配
    custAllotment:function(param,callback){
        API.post(" /pc/cust/custAllotment.action",param,true,callback);
    },
    //客户批量操作-----批量加微信好友
    addWechatFriends:function(param,callback){
        API.post(" /pc/wechatFriend/addWechatFriends.action",param,true,callback);
    },
    //财务后台
    //财务消费统计
    getTotalFin:function(param,callback){
        API.post("/pc/backstageFin/getTotalFin.action",param,true,callback);
    },
    // 获取组织下拉框
    queryCompanys:function(param,callback){
        API.post("/common/queryCompanys.action",param,false,callback);
    },
    // 充值折线图
    rechargeAnalysis:function(param,callback){
        API.post("/pc/backstageFin/rechargeAnalysis.action",param,true,callback);
    },
    // 消费折线图
    consumAnalysis:function(param,callback){
        API.post("/pc/backstageFin/consumAnalysis.action",param,true,callback);
    },
    // 科目折线图
    servAnalysis:function(param,callback){
        API.post("/pc/backstageFin/servAnalysis.action",param,true,callback);
    },
    // 按月份统计表格
    selpayForTable:function(param,callback){
        API.post("/pc/backstageFin/selpayForTable.action",param,true,callback);
    },
    // 账户总览
    selAccounts:function(param,callback){
        API.post("  /pc/backstageFin/selAccounts.action",param,true,callback);
    },
    // 套餐订购详情
    queryProductDetail:function(param,callback){
        API.post("/pc/backstageFin/queryProductDetail.action",param,true,callback);
    },
    // 使用中套餐消费情况
    queryUsingService:function(param,callback){
        API.post(" /pc/backstageFin/queryUsingService.action",param,true,callback);
    },
    // 充值记录
    queryRechargeDetail:function(param,callback){
        API.post(" /pc/backstageFin/queryRechargeDetail.action",param,true,callback);
    },
    // 账户统计查询
    selPayDetailByAccount:function(param,callback){
        API.post("/pc/backstageFin/selPayDetailByAccount.action",param,true,callback);
    },

    //新建用户----查询财务账户
    getFinAccount:function(param,callback){
        API.post("/pc/user/getFinAccount.action",param,true,callback);
    },
    //新建用户----新建财务账户
    createFinAccount:function(param,callback){
        API.post("/pc/finAccount/createFinAccount.action",param,true,callback);
    },



    /*****************************分析1.4************************************/
    //首页---访问提交
    homeSubmitAnaly:function(param,callback){
        API.post("/pc/weChat/homeSubmitAnaly.action",param,true,callback);
    },
    //微页面分析----人均访问+访问渠道
    perCapitaAnaly:function(param,callback){
        API.post("/pc/weChat/perCapitaAnaly.action",param,true,callback);
    },
    //微页面分析----访问趋势---折现图
    trendAnaly:function(param,callback){
        API.post(" /pc/weChat/trendAnaly.action",param,true,callback);
    },
    //微页面分析----员工传播访问
    companyUserAnaly:function(param,callback){
        API.post(" /pc/weChat/companyUserAnaly.action",param,true,callback);
    },
    //微页面分析----统计报表
    statementAnaly:function(param,callback){
        API.post(" /pc/weChat/statementAnaly.action",param,true,callback);
    },
    //微页面分析----表单提交
    selectSubmint:function(param,callback){
        API.post("/pc/weChat/selectSubmint.action",param,true,callback);
    },
    //微页面分析----区域----地图
    areaAnaly:function(param,callback){
        API.post("/pc/weChat/areaAnaly.action",param,true,callback);
    },
    //客户电话录音
    lastRecordings:function(param,callback){
        API.post("/pc/eventCall/lastRecordings.action",param,false,callback);
    },





    /******************1.5定位加好友*********************/
    //任务列表
    queryTaskList:function(param,callback){
        API.post("/pc/wxLocTask/queryTaskList.action",param,false,callback);
    },
    //创建任务
    createTask:function(param,callback){
        API.post("/pc/wxLocTask/createTask.action",param,false,callback);
    },
    //启动任务
    startTask:function(param,callback){
        API.post("/pc/wxLocTask/startTask.action",param,false,callback);
    },
    //附近的人
    queryTaskLogList:function(param,callback){
        API.post("/pc/wxLocTask/queryTaskLogList.action",param,false,callback);
    },
    //任务列表---下拉框
    getTaskList:function(param,callback){
        API.post("/pc/wxLocTask/getTaskList.action",param,false,callback);
    },
    //查看任务
    getTaskById:function(param,callback){
        API.post("/pc/wxLocTask/getTaskById.action",param,false,callback);
    },
    //编辑任务
    updateTask:function(param,callback){
        API.post("/pc/wxLocTask/updateTask.action",param,false,callback);
    },
    //删除任务
    delTask:function(param,callback){
        API.post("/pc/wxLocTask/delTask.action",param,false,callback);
    },





    //批量删除
    custAllDel:function(param,callback){
        API.post(" /pc/cust/custAllDel.action",param,false,callback);
    },

}











