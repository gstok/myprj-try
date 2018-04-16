
$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_group").find("a").addClass("active");
    power();
    groupList(0,20);
});

// 群组标签列表
var groupList=function(page,size,count){
    var data = {
        "pageIndex":page,
        "pageSize":size
    };
    MaskUtil.Loading();
    API.groupList(data,function(data){

        var obj=data.data.pageData.list;
        var str='';
        if(obj.length){
            for (var i =0;i< obj.length; i++) {
                var chak = '';//查看
                var sendsms = '';//发短信
                var sendemail = '';//发邮件
                var sendflash = '';//发弹信
                //查看群组
                if (hasPermission("group", "GET")) {
                    chak = '<td class="firstTd typeblue" onclick="chakan('+isNull(obj[i].id)+')">'+isNull(obj[i].groupName)+'</td>';
                }else{
                    chak = '<td class="firstTd typeblue">'+isNull(obj[i].groupName)+'</td>';
                }
                //发短信
                if (hasPermission("sms", "SEND")) {
                    sendsms = '<a href="javascript:;" smsctrl onclick="sendPop(event,'+obj[i].id+',\''+obj[i].groupName+'\',\''+obj[i].custNum+'\',1)" data-container="body" data-toggle="popover" data-placement="top" data-content="发送短信"><i class="icon icon-552cd536f34e4"></i></a>';
                }else{
                    sendsms = '<a smsctrl><i class="icon icon-552cd536f34e4 disabled"></i></a>';
                }
                //发邮件
                if (hasPermission("email", "SEND")) {
                    sendemail = '<a href="javascript:;" onclick="sendPop(event,'+obj[i].id+',\''+obj[i].groupName+'\',\''+obj[i].custNum+'\',2)" data-container="body" data-toggle="popover" data-placement="top" data-content="发送邮件"><i class="icon icon-wsmp-sendMail"></i></a>';
                }else{
                    sendemail = '<a><i class="icon icon-wsmp-sendMail disabled"></i></a>';
                }
                //发弹信
                if (hasPermission("flash", "SEND")) {
                    sendflash = '<a href="javascript:;" onclick="sendPop(event,'+obj[i].id+',\''+obj[i].groupName+'\',\''+obj[i].custNum+'\',3)" data-container="body" data-toggle="popover" data-placement="top" data-content="发送弹信"><i class="icon icon-shouji"></i></a>';
                }else{
                    sendflash = '<a><i class="icon icon-shouji disabled"></i></a>';
                }
                var groupType=isNull(obj[i].groupType);
                if(groupType==1){
                    groupType='静态群组'
                }else if(groupType==2){
                    groupType='智能群组'
                }
            // 判断数据是否为null
                str+='<tr >'+chak+
                            '<td>'+groupType+'</td>'+
                            '<td>'+obj[i].custNum+'</td>'+
                            '<td>'+isNull(obj[i].displayreloadTime)+'</td>'+
                            '<td>'+sendsms+'<i class="shugang" smsctrl>|</i>'+
                            sendemail+'<i class="shugang">|</i>'+
                            sendflash+
                            '</td>';
                        '</tr>'
                }
                $('#groupList tbody').html(str);

                if(page==0){
                $('.ui-paging-container').eq(0).remove();
                $('#groupListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                    groupList(page,size);
                 }});
            }
        }
        else{
            var trdat = "<tr >"+
                    "<td  colspan='5' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
                    "</tr> ";
            $('#groupList tbody').html(trdat);
        }
        setTimeout(function(){
           $("[data-toggle='popover']").popover({trigger:"hover"});
            smsCtrl();
        },500);
    MaskUtil.RemoveLoading();
    });
}




//发送弹窗
    function sendPop(event,id,name,custNum,num){
        if(event){
            event.stopPropagation();
        }
        $("#SMSBox").show();
        $("#SMScont").hide();
        $("#GroupName").html(name);
        $("#SMSnum").html(custNum);
        $("#smsId").val('');

        if(num == 1){
            $("#SMSBox .tt").html("发短信");
            $("#SMSmb").html("短信模板");
            $("#SMSnr").html("短信内容");
            getSMS();//获取短信模板
            $("#sendBtn").unbind("click").on("click",function(){
                selfsendData(id,name,1);
            })
        }
        if(num == 2){
            $("#SMSBox .tt").html("发邮件");
            $("#SMSmb").html("邮件模板");
            $("#SMSnr").html("邮件内容");
            getEmail();//获取邮件模板
            $("#sendBtn").unbind("click").on("click",function(){
                selfsendData(id,name,2);
            })
        }
        if(num == 3){
            $("#SMSBox .tt").html("发弹信");
            $("#SMSmb").html("弹信模板");
            $("#SMSnr").html("弹信内容");
            getflash();//获取弹信模板
            $("#sendBtn").unbind("click").on("click",function(){
                selfsendData(id,name,3);
            })
        }
        $("body").delegate("#SMSsel","change",function(){
            var val = $(this).val();
                var _id = $(this).find("option[value='"+val+"']").attr("data-id");
                console.log(_id);
                $("#smsId").val(_id);
            if(val == ''){
                $("#SMScont").hide();
            }else{
                $("#SMScont").show().html(val);
            }
        });
    }
    //获取短信模板
    function getSMS(){
        $("#SMSsel").empty();
        SMSlist ="<option value=''>请选择</option>";
        API.getSmsList({}, function(data){
            if(data.code == 200) {
                var lists = data.data.data;
                $.each(lists,function(i,v){
                    SMSlist += "<option value='"+v.content+"' data-id='"+v.id+"'>"+v.smsName+"</option>";
                });
            }
            $("#SMSsel").html(SMSlist);
        });
    }
    //获取邮件模板
    function getEmail(){
        $("#SMSsel").empty();
        SMSlist ="<option value=''>请选择</option>";
        API.getEmailList({}, function(data){
            if(data.code == 200) {
                var lists = data.data.data;
                $.each(lists,function(i,v){
                    SMSlist += "<option value='"+v.content+"' data-id='"+v.id+"'>"+v.mailName+"</option>";
                });
            }
            $("#SMSsel").html(SMSlist);
        });
    }
    //获取弹信模板
    function getflash(){
        $("#SMSsel").empty();
        SMSlist ="<option value=''>请选择</option>";
        API.getFlashList({}, function(data){
            if(data.code == 200) {
                var lists = data.data.data;
                $.each(lists,function(i,v){
                    SMSlist += "<option value='"+v.content+"' data-id='"+v.id+"'>"+v.flashName+"</option>";
                });
            }
            $("#SMSsel").html(SMSlist);
        });
    }
    //发送
    function selfsendData(id,name,ele){
        var sel = $("#smsId").val();

        if(sel == ''){
            if(ele == 1){
                dcrmAlertWarning("请选择短信模板！");
            }
            if(ele == 2){
                dcrmAlertWarning("请选择邮件模板！");
            }
            if(ele == 3){
                dcrmAlertWarning("请选择弹信模板！");
            }
            return;
        }

       /* var data = {
                commonId:$("#SMSsel").val(),
                custIdList:id,
                groupName:name,
                isSelAll:"0",
                filterJson:window.filterJson
            };*/

            var data = {
                id:sel,
                groupId:id
            };

        if(ele == 1){
            API.sendSms(data, function(res) {
                if (res.code == 200) {
                    $("#SMSBox").hide();
                    dcrmAlertSuccess(res.msg);
                }else{
                    dcrmAlertError(res.msg);
                }
            });
        }
        if(ele == 2){
            API.sendEmail(data, function(res) {
                if (res.code == 200) {
                    $("#SMSBox").hide();
                    dcrmAlertSuccess(res.msg);
                }else{
                    dcrmAlertError(res.msg);
                }
            });
        }
        if(ele == 3){
            API.tempGroupSend(data, function(res) {
                if (res.code == 200) {
                    $("#SMSBox").hide();
                    dcrmAlertSuccess(res.msg);
                }else{
                    dcrmAlertError(res.msg);
                }
            });
        }
    }
    //关闭弹窗
    function noPop(){
        $("#SMSBox").hide();
    }
// 新建智能群组
function addIntelligentGroup(){
   window.location.href = "/view/customer/group/addGroup.html";
}
//筛选器



// function yulan(){
// 	alert('预览')
// }

// function delIntelligentGroup(id){
//     alert('删除'+id)
// }
// 查看智能群组
function chakan(id){
  window.location.href = "/view/customer/group/groupDetail.html?oid="+id;
}















