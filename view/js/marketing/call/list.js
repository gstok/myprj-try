var oid=window.location.search.split('=')[1];



$(function(){
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_calltouch").find("a").addClass("active");
    if(oid){
        phoneList(0,20,oid);
    }else{
        phoneList(0,20);
    }
})



function chakan(id){
    phoneList(0,20,id);
    $('#custName').val(id)
}
function reset(){
    $('.custName').val('');
    $('input').val('');
    phoneList(0,20);
}

// 电话列表
var phoneList=function(page,size,id,createUserId,resultResponseId,status,pcdisplayStartTime,displayEndTime){
    var pagenum=window.location.hash.split('=')[1];
    var data = {
        "pageIndex":page,
        "pageSize":size,
        "strCustId":id,//客户名称
        'createUserId':createUserId,//拨打人
        'status':status,//呼叫结果
        'resultResponse':resultResponseId,//沟通结果
        'pcdisplayStartTime':pcdisplayStartTime,
        'displayEndTime':displayEndTime
    };
    MaskUtil.Loading();
    API.showPhoneRecordList(data,function(data){

        var obj=data.data.pageData.list;
        var str='';
        var statusContent='';
        var callTime;
        var calltd
        // 客户名称下拉列表
        var custlist=data.data.custlist;
        var custlistStr=''
        $.each(custlist,function(index,item){
            custlistStr+='<option value="'+item.id+'">'+item.name+'</option>'
        })
       $('#custName').html(custlistStr);
       var _date = new Date(data.data.sumTime * 1000);
       var time_ = new Date(_date.getTime() - 8 * 60 * 60 * 1000).format("hh时mm分ss秒")
       $('#sumTime').html(time_);
        // 拨打人下拉列表
        var userlist=data.data.userlist;
        var userlistStr='<option value="">请选择</option>'
        $.each(userlist,function(index,item){
            userlistStr+='<option value="'+item.id+'">'+item.userName+'</option>'
        })
        $('#dail').html(userlistStr);
        // 呼叫结果下拉列表
        var statusdto=data.data.statusdto;
        var statusdtoStr='<option value="">请选择</option>'
        $.each(statusdto,function(index,item){

            statusdtoStr+='<option value="'+index+'">'+item+'</option>'
        })
         $('#callResult ').html(statusdtoStr);

        // 沟通结果下拉列表
        var resultResponse=data.data.resultResponse;
        var resultResponseStr='<option value="">请选择</option>'
        $.each(resultResponse,function(index,item){
            resultResponseStr+='<option value="'+index+'">'+item+'</option>'
        })
        $('#communicate').html(resultResponseStr);
        // 下拉框回显
        console.log(id)
        if(String(id)&&String(id).indexOf(",")!=-1){
           $('#custName').val(id.split(','));
        }else{
           $('#custName').val(id);
        }

        $('#dail').val(createUserId)
        if(resultResponseId){
         $('#communicate').val(resultResponseId)
        }

        $('#callResult').val(status);


        var $ddd = $(".selectpicker ").select2();
        if(obj.length){
            for (var i =0;i< obj.length; i++) {
                if(obj[i].callTime){
                    callTime=obj[i].callTime;

                    if( callTime<=30){
                        calltd='<td class="calltime1">'+isNull(obj[i].displayCallTime)+'</td>'
                    }
                    if(30<callTime&&callTime<=120){

                        calltd='<td class="calltime2">'+isNull(obj[i].displayCallTime)+'</td>'
                    }
                    if(120<callTime&&callTime<=600){

                        calltd='<td class="calltime3">'+isNull(obj[i].displayCallTime)+'</td>'
                    }
                    if(600<callTime&&callTime                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <=1800){

                        calltd='<td class="calltime4">'+isNull(obj[i].displayCallTime)+'</td>'
                    }
                    if(callTime>1800){
                        calltd='<td class="calltime5">'+isNull(obj[i].displayCallTime)+'</td>'
                    }
                }else{
                    calltd='<td></td>'
                }


                var endTime=obj[i].displayEndTime;
                if(endTime){
                    // endTime=endTime.split(' ')[1]
                    endTime=' / '+isNull(obj[i].displayEndTime)
                }else{
                    endTime='';
                }
                var resultResponseName=isNull(obj[i].resultResponseName);
                var statusName=isNull(obj[i].statusName)
                if(statusName=='未接通'||statusName=='未接听'){
                    resultResponseName=''
                }
                // 附上拨打录音
                var lystr='';//显示录音
                var call = '';//打电话
                var chak = '';//查看
                if(hasPermission("call", "GET")){
                    chak = '<td class="firstTd typeblue" onclick="chakan('+isNull(obj[i].custId)+')">'+isNull(obj[i].custName)+'</td>'
                }else{
                    chak = '<td class="firstTd typeblue">'+isNull(obj[i].custName)+'</td>'
                }
                //打电话---录音功能
                var Mobnum=isNull(obj[i].mobile);//联系电话
                var Telnum=isNull(obj[i].telephone);//联系电话
                var phonenum = '';
                if(obj[i].showCrateTime == null||obj[i].showCrateTime ==''){
                    phonenum = '';
                }else{
                    phonenum = isNull(obj[i].showCrateTime);
                };

                if (hasPermission("call", "ADD")) {
                    if(Mobnum==''&&Telnum == ''){
                        call='<a href="javascript:;" class="cursorDefault"><i class="icon icon-boda disabled"></i></a>'
                    }else if(Mobnum != ''&&Telnum != ''){
                        call='<a class="phonea dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" href="javascript:;"><i class="icon icon-boda" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打电话"></i>'+
                            '<b class="phonenum">'+isNull(obj[i].callCount)+'</b>'+
                            '</a>'+
                            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu">'+
                            '    <li><a href="javascript:;" onclick="call('+obj[i].custId+','+obj[i].companyId+',\''+Mobnum+'\',0)">手机号码：'+Mobnum+'</a></li>'+
                            '    <li role="separator" class="divider"></li>'+
                            '    <li><a href="javascript:;" onclick="call('+obj[i].custId+','+obj[i].companyId+',\''+Telnum+'\',1)">联系电话：'+Telnum+'</a></li>'+
                            '  </ul>';
                    }else if(Mobnum != ''&&Telnum == ''){
                        call='<a class="phonea" href="javascript:;" onclick="call('+obj[i].custId+','+obj[i].companyId+',\''+Mobnum+'\',0)" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打电话"><i class="icon icon-boda"></i><b class="phonenum">'+isNull(obj[i].callCount)+'</b></a>';
                    }else if(Mobnum == ''&&Telnum != ''){
                        call='<a class="phonea" href="javascript:;" onclick="call('+obj[i].custId+','+obj[i].companyId+',\''+Telnum+'\',1)" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打电话"><i class="icon icon-boda"></i><b class="phonenum">'+isNull(obj[i].callCount)+'</b></a>';
                    }
                    if(isNull(obj[i].recordUri)){//如果有录音记录
                    // 判断数据是否为null
                        lystr='<a href="javascript:;" class="play play'+i+'" onclick="play(\''+obj[i].recordUri+'\','+i+')"  data-container="body" data-toggle="popover" data-placement="top" data-content="播放录音"><i class="icon icon-17"></i></a>'+
                            '<a href="javascript:;" class="pause pause'+i+' hide " onclick="pause('+i+') "  data-container="body" data-toggle="popover" data-placement="top" data-content="暂停录音"><i class="icon icon-bofangzanting03"></i></a>'
                    }else{
                        lystr='';
                    }

                }else{
                    call='<a href="javascript:;" class="cursorDefault"><i class="icon icon-boda disabled"></i></a>';
                    lystr='<a href="javascript:;" class="play"><i class="icon icon-17 disabled"></i></a>';
                }

                // if(hasPermission("call", "ADD")){
                //     //call = '<a href="javascript:;" class="phonea" onclick="call('+obj[i].custId+','+obj[i].companyId+')" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打"><i class="icon icon-boda"></i><b class="phonenum">'+obj[i].callCount+'</b></a>';
                //     if(isNull(obj[i].recordUri)){//如果有录音记录
                //     // 判断数据是否为null
                //         lystr='<a href="javascript:;" class="play play'+i+'" onclick="play(\''+obj[i].recordUri+'\','+i+')"  data-container="body" data-toggle="popover" data-placement="top" data-content="播放录音"><i class="icon icon-17"></i></a>'+
                //             '<a href="javascript:;" class="pause pause'+i+' hide " onclick="pause('+i+') "  data-container="body" data-toggle="popover" data-placement="top" data-content="暂停录音"><i class="icon icon-bofangzanting03"></i></a>'
                //     }else{
                //         lystr='';
                //     }
                // }else{
                //     //call = '<a href="javascript:;" class="phonea"><i class="icon icon-boda disabled"></i><b class="phonenum">'+obj[i].callCount+'</b></a>';
                //     lystr='<a href="javascript:;" class="play"><i class="icon icon-17 disabled"></i></a>';
                // }

                str+='<tr >'+chak+
                        '<td>'+isNull(obj[i].userName)+'</td>'+
                        '<td>'+statusName+'</td>'+
                        '<td>'+resultResponseName+'</td>'+
                        calltd+
                        '<td>'+isNull(obj[i].displayStartTime)+endTime+'</td>'+
                        '<td>'+isNull(obj[i].remark)+'</td>'+
                        '<td class="textcenter pr">'+call+lystr+'</td>'+
                    '</tr>'
                }
                $('#phoneList tbody').html(str);

                if(page==0){
                $('.ui-paging-container').eq(0).remove();
                $('#phoneListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                    phoneList(page,size,id,createUserId,resultResponseId,status,pcdisplayStartTime,displayEndTime);
                 }});
                $('li[data-page="'+pagenum+'"]').click();


            }
        }
        else{
            trdat = "<tr >"+
                    "<td  colspan='7' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
                    "</tr> ";
            $('#phoneList tbody').html(trdat)
        }
        $(function (){
        setTimeout(function(){
           $("[data-toggle='popover']").popover({trigger:"hover"});

        },500)

    });
        MaskUtil.RemoveLoading();
    });
}


// 查询电话列表
function searchPhone(){
    var id='';
    if($('#custName').val()){
      id=$('#custName').val().join(',');
    }

    var createUserId=$('#dail').val();
    var resultResponse=$('#communicate').val();
    var status=$('#callResult').val();
    var pcdisplayStartTime = $('#inpstart').val();
    var displayEndTime = $('#inpend').val();
    console.log(id)
    phoneList(0,20,id,createUserId,resultResponse,status,pcdisplayStartTime,displayEndTime);

}

var flag=true;
// 打电话
function call(id,companyId,mobile,isTelephone){
    console.log($.cookie('uuid'+Global.userId))
    // 如果window.uuid存在，则说明该用户已打过电话，则要先判断上次拨打电话是否已经结束。
    if($.cookie('uuid'+Global.userId)){
        var param={
            uuid:$.cookie('uuid'+Global.userId)
        }
        API.callLog(param,function(data){
            if(data.data.calllog.status==1||data.data.calllog.status==4){
                flag=true;
            }else{
                //flag=false; //不能打电话

            }
        })
    }
    if(flag){
        dcrmConfirm('您是否拨打电话',function(){
            //为true时可以打电话
                //打电话
                var data={
                    custId:id,
                    custMobile:mobile,
                    isTelephone:isTelephone
                }
                API.callPhone(data,function(data){
                    if(data.code == 200){
                        var results=data.data.result;
                        var str='<option value="">请选择</option>'
                        $.each(results,function(index,item){
                            str+='<option value="'+index+'">'+item+'</option>'
                        })
                        $('#resultResponse').html(str);
                        $('#callTime').html(data.data.callTime)
                        window.uuid=data.data.uuid;
                        $.cookie('uuid'+Global.userId, data.data.uuid, {expires: 7, path: '/'});

                        $('.calling').removeClass('hide')
                                $('.numseconds').text('5');
                                var wait=5;
                                timeOut();
                                function timeOut(){
                                    if(wait==0){
                                        //在原页面 显示拨打记录弹窗
                                        $('.calling').addClass('hide')
                                        clearInfo();
                                        var modelContent=$('#writeCall');//弹窗最外层
                                        var contentInfo=$('#writeCall .contentInfo');//弹窗内层
                                        frameDiv(modelContent,contentInfo);//弹窗操作
                                        window.phoneid=id
                                        //打开客户详情新页面
                                        window.open("/view/customer/customer/customerPhoneDetail.html?oid="+id+"&companyId="+companyId);
                                    }else{
                                        setTimeout(function(){
                                            wait--;
                                            $('.numseconds').text(wait);
                                            timeOut();
                                        },1000)
                                    }
                                }
                    }else{
                        dcrmAlertError(data.msg)
                    }
                })


        })
    }else{
        dcrmAlertWarning('电话正在呼叫中')
    }
}
//拨打记录保存
function addCall(){
    var data={
        uuid:window.uuid,
        remark:$('#remark').val(),
        resultResponse:$('#resultResponse').val()
    }

    API.saveStatus(data,function(data){
        if(data.code == 200){
            dcrmAlertSuccess(data.msg)
            $('#writeCall').fadeOut();
            $('.bg').fadeOut();
        }else{
            dcrmAlertError(data.msg)
        }
    })
}
//拨打记录保存
function addCall(){
    var data={
        uuid:window.uuid,
        remark:$('#remark').val(),
        resultResponse:$('#resultResponse').val()
    }

    API.saveStatus(data,function(data){
        if(data.code == 200){
            dcrmAlertSuccess(data.msg)
            $('#writeCall').fadeOut();
            $('.bg').fadeOut();
            var createUserId=$('#dail').val();
            var resultResponse=$('#communicate').val();
            var status=$('#callResult').val();
            console.log(window.id)
            phoneList(0,20,window.id,createUserId,resultResponse,status);
        }else{
            dcrmAlertError(data.msg)
        }
    })
}


//查看拨打记录
function viewCall(id){
    window.location.href = "/view/marketing/call/callMarketList.html?oid="+id;
}

var audio=document.getElementById("audio");

function play(url,i){
    if( audio.src!=url){
        audio.src=url;
    }
    audio.volume = 0.5; //
    audio.play(); // 播放
    // 其他的暂停按钮隐藏
    $('.pause').addClass('hide')
    $('.play').removeClass('hide')
    // 当前的暂停按钮显示

    $('.play'+i).siblings('.pause').removeClass('hide')
    $('.play'+i).addClass('hide')
    audio.addEventListener('ended', function () {
       pause(i)
    }, false);
};

function pause(i){
    audio.pause();

    $('.pause'+i).addClass('hide')
    $('.pause'+i).siblings('.play').removeClass('hide')
};