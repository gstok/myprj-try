/**
 * Created by Administrator on 2017/6/12 0012.
 */
$(function(){
    $(".backli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".backli").find("span").attr("class","icon icon-jiantou");
    $(".backli").find("ul #index_financialstatement").find("a").addClass("active");
});
var allcomIds='';
var comIds='';
//获取组织
queryCompanys('allCompanyUser');
// 默认查询所有公司
var arrtime=selectNum(3);
$('#inpstart').val(arrtime[0]);
$('#inpend').val(arrtime[2]);
getTotalFin();

function queryCompanys(ele){
    var data = {
    };
    MaskUtil.Loading();
    API.queryCompanys(data,function(data){
        if(data&&data.code==200){
            var obj=data.data.list;
            var str='<option value="all" selected>全部公司用户</option>';

            $.each(obj,function(index,item){
                str+='<option value="'+item.id+'">'+item.companyName+'</option>'
                comIds+=item.id+','
            })
            allcomIds=(comIds.substring(comIds.length-1)==',')?comIds.substring(0,comIds.length-1):comIds;
            $('#'+ele).html(str);
        }else{
            dcrmAlertError(data.msg)
        }

        MaskUtil.RemoveLoading();
    })
};

// 获取消费统计
function getTotalFin(){
    $('.allcomNum').html(0);
    $('#rechargeMoney').html(0);
    $('#outPayMoney').html(0);
    $('#payOrderMoney').html(0);
    $('#outPayMoney').html(0);
   if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();

    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){//选择了全部公司
            comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }

    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }

    API.getTotalFin(data,function(data){
        if(data&&data.code==200){
            var obj=data.data;
            var servicePayMoney=data.data.servicePayMoney;
            // 公司个数
            if($.inArray("all", allCompanyUser)>-1){//选择了全部公司
                $('.allcomNum').html(allcomIds.split(',').length)
            }else if($('#allCompanyUser').val()){
               $('.allcomNum').html($('#allCompanyUser').val().length)
            }


            // 套餐订购
            $('#payOrderMoney').html(obj.payOrderMoney.toFixed(2))
            // 套餐消费
            $('#outPayMoney').html(obj.outPayMoney.toFixed(2))
            //充值
            $('#rechargeMoney').html(obj.rechargeMoney.toFixed(2))
            // 总消费
            $('#totalPayMoney').html(obj.totalPayMoney.toFixed(2))
            if(servicePayMoney.length>0){
               $.each(servicePayMoney,function(index,item){
                    if(item.serviceCd=='call'){
                        $('.callpaystrong').html(item.payMoney.toFixed(2))
                    }else if(item.serviceCd=='cust'){
                        $('.datapaystrong').html(item.payMoney.toFixed(2))
                    }else if(item.serviceCd=='email'){
                        $('.emailpaystrong').html(item.payMoney.toFixed(2))
                    }else if(item.serviceCd=='flash'){
                        $('.flashpaystrong').html(item.payMoney.toFixed(2))
                    }else if(item.serviceCd=='sms'){
                        $('.smspaystrong').html(item.payMoney.toFixed(2))
                    }
                })
            }else{
                $('.callpaystrong').html(0);
                $('.datapaystrong').html(0);
                $('.emailpaystrong').html(0);
                $('.flashpaystrong').html(0);
                $('.smspaystrong').html(0);
            }
        }else{
            dcrmAlertError(data.msg)
        }

    })
    paydetailList();
    rechargeMoney();
};
// 重置
function reset(){
    $('.filterList').find('input').val('');
    $('.filterList').find('select').val('');
    $(".selectpicker ").select2();
};
// 折线图
var myChart = echarts.init(document.getElementById('chart'));
var option = {
    title: {
        text: '充值数据图',
        x: 'center'
    },

    "color": [
        "#5c7093",
        "#7e8fe1"
    ],
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top:'20%',
        left: '6%',
        right: '8%',
        bottom: '10%',
        containLabel: false,
        x:0
    },
    legend: {
        data:[],
        x: '85%',
        y: 'top'
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['0','0','0','0','0'],//横坐标
            show:true//true为显示
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        }
    ],
    series: [
        {
            name: '消费',
            type: 'line',
            data:[0,0,0,0,0],//纵坐标
            smooth: true,
            markPoint: {//显示最大值最小值
                // data: [
                //     {type: 'max', name: '最大值'},
                //     {type: 'min', name: '最小值'}
                // ]
            },
            itemStyle : {
                normal : {
                    color:'#02cd81',
                    lineStyle:{
                        width:3,//折线宽度
                        color:'#02cd81',//改变线的颜色
                    }
                }
            },
        },

    ]
};
myChart.setOption(option);

// 点击各个指标，获取不同数据。默认充值折线图

// 充值
function rechargeMoney(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
             comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }


    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    console.log(data.startTime, data.endTime)
    getAll(data.startTime, data.endTime);
    var data1=[]

    API.rechargeAnalysis(data,function(data){
        if(data&&data.code==200){
            var objData=data.data.rechargeData;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
            console.log(arrnum)
            // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.rechargeMoney').addClass('active');
            option.title.text='充值数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);

        }else{
            dcrmAlertError(data.msg)
        }
    })
};
// 套餐订购
function payOrderMoney(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
             comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }

    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    data.payType=2


    getAll(data.startTime, data.endTime);

    API.consumAnalysis(data,function(data){
        if(data&&data.code==200){
              var objData=data.data.consumData;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
            console.log(arrnum)
            // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.payOrderMoney').addClass('active');
            option.title.text='套餐订购数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);

        }else{
            dcrmAlertError(data.msg)
        }
    })
};
// 套餐消费
function outPayMoney(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
             comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }


    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    data.payType=3


    getAll(data.startTime, data.endTime);

    API.consumAnalysis(data,function(data){
        if(data&&data.code==200){
            var objData=data.data.consumData;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
                console.log(arrnum)
                // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.outPayMoney').addClass('active');
            option.title.text='套餐消费数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);
        }else{
            dcrmAlertError(data.msg)
        }
    })
};
// 总消费
function totalPayMoney(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
            comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }

    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    data.payType=1


    getAll(data.startTime, data.endTime);

    API.consumAnalysis(data,function(data){
        if(data&&data.code==200){
            var objData=data.data.consumData;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
            console.log(arrnum)
            // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.totalPayMoney').addClass('active');
            option.title.text='消费数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);
        }else{
            dcrmAlertError(data.msg)
        }
    })
};
// 电话
function callpay(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
            comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }


    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    data.serviceCd='call'


    getAll(data.startTime, data.endTime);

    API.servAnalysis(data,function(data){
        if(data&&data.code==200){
            var objData=data.data.servicePay;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
            console.log(arrnum)
            // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.callpay').addClass('active');
            option.title.text='外呼消费数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);
        }else{
            dcrmAlertError(data.msg)
        }
    })
};
// 数据
function datapay(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
            comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }


    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    data.serviceCd='cust'

    getAll(data.startTime, data.endTime);

    API.servAnalysis(data,function(data){
        if(data&&data.code==200){
            var objData=data.data.servicePay;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
            console.log(arrnum)
            // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.datapay').addClass('active');
            option.title.text='数据消费数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);
        }else{
            dcrmAlertError(data.msg)
        }
    })
};
// 邮件
function emailpay(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
            comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }


    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    data.serviceCd='email'

    getAll(data.startTime, data.endTime);

    API.servAnalysis(data,function(data){
        if(data&&data.code==200){
            var objData=data.data.servicePay;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
            console.log(arrnum)
            // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.emailpay').addClass('active');
            option.title.text='外呼数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);
        }else{
            dcrmAlertError(data.msg)
        }
    })
};
// 弹信
function flashpay(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
            comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }

    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    data.serviceCd='flash'

    getAll(data.startTime, data.endTime);

    API.servAnalysis(data,function(data){
        if(data&&data.code==200){
            var objData=data.data.servicePay;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
            console.log(arrnum)
            // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.flashpay').addClass('active');
            option.title.text='弹信消费数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);
        }else{
            dcrmAlertError(data.msg)
        }
    })
};
// 短信
function smspay(){
    if($('#inpstart').val()==''){
        dcrmAlertError('请选择开始时间');
        return;
    }else if($('#inpend').val()==''){
        dcrmAlertError('请选择结束时间');
        return;
    }
    var allCompanyUser=$('#allCompanyUser').val();
    if(allCompanyUser){
        if($.inArray("all", allCompanyUser)>-1){
           comIds=allcomIds;
        }else{
            comIds=allCompanyUser.join(',');
        }
    }else{
        dcrmAlertError('请选择公司用户');
    }


    var data={
        comIds:comIds,
        startTime:$('#inpstart').val(),
        endTime:$('#inpend').val()
    }
    data.serviceCd='sms'

    getAll(data.startTime, data.endTime);

    API.servAnalysis(data,function(data){
        if(data&&data.code==200){
            var objData=data.data.servicePay;
            $.each(objData,function(index,item){
                $.each(arr,function(i,u){
                    if(item.dateCd==u){
                        arrnum[i]=item.money
                    }
                })
            })
            console.log(arrnum)
            // 修改折线图标题
            $('.zxttitle li').removeClass('active');
            $('.smspay').addClass('active');
            option.title.text='短信消费数据图';
            // 修改折线图数据
            option.xAxis[0].data=arr;
            option.series[0].data=arrnum;
            // 重新渲染折线图
            myChart.setOption(option);
        }else{
            dcrmAlertError(data.msg)
        }
    })
};


var arr;
var arrnum;

function getAll(value1, value2) {
    arr=[];
    arrnum=[]
    var getDate = function(str) {
        var tempDate = new Date();
        var list = str.split("-");
        tempDate.setFullYear(list[0]);
        tempDate.setMonth(list[1] - 1);
        tempDate.setDate(list[2]);
        return tempDate;
    }
    var date1 = getDate(value1);
    var date2 = getDate(value2);
    if (date1 > date2) {
        var tempDate = date1;
        date1 = date2;
        date2 = tempDate;
    }
    date1.setDate(date1.getDate());
    var dateArr = [];
    var i = 0;
    while (!(date1.getFullYear() == date2.getFullYear()
            && date1.getMonth() == date2.getMonth() && date1.getDate() == date2
            .getDate()))
    {

        var dayStr =date1.getDate().toString();
            if(dayStr.length ==1){
                dayStr="0"+dayStr;
            }
        dateArr[i] = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-"
                + dayStr;

        date1.setDate(date1.getDate() + 1);
        i++;
    }

    arr=dateArr;
    arr.push(value2)
    console.log(arr)
      $.each(arr,function(index,item){
        arrnum.push('0')
      })
}


function paydetailList(){
    var startTime=$('#inpstart').val();
    var endTime=$('#inpend').val();
    var endTimeArr=$('#inpend').val().split('-');
    endTimeArr.pop();
    var startTimeArr=$('#inpstart').val().split('-');
    startTimeArr.pop();;

    var data = {
        "comIds":comIds,
        "startTime":startTime,
        "endTime":endTime
    };

    MaskUtil.Loading();
    API.selpayForTable(data,function(data){
        if(data&&data.code==200){
            if(data.data!=null){
                var obj=data.data.servicePay;
                var serviceUserSum=data.data.serviceUserSum;
                var smsstr='<td class="firstTd">0</td>'
                var flashstr='<td class="firstTd">0</td>'
                var emailstr='<td class="firstTd">0</td>'
                var callstr='<td class="firstTd">0</td>'
                var custstr='<td class="firstTd">0</td>'
                var str='';
                if(obj.length){
                    for (var i =0;i< obj.length; i++) {
                         for (var j =0;j< serviceUserSum.length; j++) {
                            if(serviceUserSum[j].billDateCd==obj[i].billDateCd){
                                var serviceCd=serviceUserSum[j].serviceCd;
                                var astr=(serviceCd+'str')


                                if(astr=='smsstr'){
                                    smsstr='<td class="firstTd ">'+isNull(serviceUserSum[j].useNum)+'</td>';
                                }
                                else if(astr=='callstr'){
                                    callstr='<td class="firstTd ">'+isNull(serviceUserSum[j].useNum)+'</td>';
                                }
                                else if(astr=='emailstr'){
                                    emailstr='<td class="firstTd ">'+isNull(serviceUserSum[j].useNum)+'</td>';
                                }
                                else if(astr=='custstr'){
                                    custstr='<td class="firstTd ">'+isNull(serviceUserSum[j].useNum)+'</td>';
                                }
                                else if(astr=='flashstr'){
                                    flashstr='<td class="firstTd ">'+isNull(serviceUserSum[j].useNum)+'</td>';
                                }
                            }

                         }


                         var date=isNull(obj[i].billDateCd);
                         var billDateCd=isNull(obj[i].billDateCd).split('-');

                         if(billDateCd.join(',')==startTimeArr.join(',')&&billDateCd.join(',')==endTimeArr.join(',')){
                            date=startTime+'~'+endTime
                         }else if(billDateCd.join(',')==startTimeArr.join(',')&&billDateCd[1]<endTimeArr[1]){
                                //计算月份的最后一天
                                 var endDate = new Date(billDateCd);
                                 var month=endDate.getMonth();
                                 var nextMonth=++month;
                                 var nextMonthFirstDay=new Date(endDate.getFullYear(),nextMonth,1);
                                 var oneDay=1000*60*60*24;
                                 var myDate=new Date(nextMonthFirstDay-oneDay)
                                 var lastOneTime=myDate.getFullYear()+'-'+(myDate.getMonth()+1)+"-"+myDate.getDate();
                                 date=startTime+'~'+lastOneTime
                         }else if(billDateCd.join(',')==endTimeArr.join(',')&&billDateCd[1]>startTimeArr[1]){
                                date=billDateCd[0]+'-'+billDateCd[1]+'-'+1+'~'+endTime
                         }

                        str+='<tr >'+
                                        '<td class="firstTd typeblue" onclick="chakan('+isNull(obj[i].comId)+',\''+isNull(obj[i].companyName)+'\')">'+isNull(obj[i].companyName)+'</td>'+
                                        '<td class="firstTd moon">'+date+'</td>'+
                                        // '<td class="firstTd xiaofei">'+isNull(obj[i].payMoney)+'</td>'+
                                        custstr+
                                        callstr+
                                        smsstr+
                                        flashstr+
                                        emailstr+
                                    '</tr>'
                            }
                            $('#paydetailList tbody').html(str);

                    //         if(page==0){
                    //         $('.ui-paging-container').eq(0).remove();
                    //         $('#paydetailListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                    //             groupList(page,size);
                    //          }});
                    // }
                }
                else{
                    trdat = "<tr >"+
                            "<td  colspan='8' class='textcenter'><i class='icon icon-icon'></i>暂无数据</td>"+
                            "</tr> ";
                    $('#paydetailList tbody').html(trdat)
                }
            }else{
                trdat = "<tr >"+
                            "<td  colspan='8' class='textcenter'><i class='icon icon-icon'></i>暂无数据</td>"+
                            "</tr> ";
                    $('#paydetailList tbody').html(trdat)
            }

        }else{
            dcrmAlertError(data.msg)
        }


    MaskUtil.RemoveLoading();
    });
};

function chakan(id,name){
     window.location.href = "/view/backmanagement/financialdetail.html?="+id+"&str="+escape(name);
};

// 日期往前num天
function selectNum(num){
    //设置日期，当前日期的前七天
    var myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - (num-1));
    var dateArray = [];
    var dateTemp;
    var flag = 1;
    for (var i = 0; i < num; i++) {
        dateTemp = myDate.getFullYear()+'-'+(myDate.getMonth()+1)+"-"+myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
    }
    return dateArray
}

//日期推后num天
function laterDay(num){
    var t=new Date('2017-1-1');
    var iToDay=t.getDate();
    var iToMon=t.getMonth();
    var iToYear=t.getFullYear();
    var newDate = new Date(iToYear,iToMon,(iToDay+num));

    console.log(newDate.getFullYear()+'-'+(newDate.getMonth()+1)+"-"+newDate.getDate())
}
