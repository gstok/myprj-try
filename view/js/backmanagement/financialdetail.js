$(function(){
    $(".backli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".backli").find("span").attr("class","icon icon-jiantou");
    $(".backli").find("ul #index_financialdetail").find("a").addClass("active");
    vm.selAccounts();
});

//判断数据是否为空
function isNull(data){
    return (data == "" || data == undefined || data == null) ? "0" : data;
}
//查询列表并分页
var vm = new Vue({
    el: "#financialstatement",
    data: {
        companyName:'',//公司名称
    	isactive:true,//现行套餐显示，历史套餐隐藏
    	ison:true,//按日显示，按月隐藏
        ypeduation:[],//英普教育列表
        selAccountList:[],//账户列表
        setmeal:[],//现行套餐列表
        billList:[],//账单集合
        tcList:[],//套餐集合
        totalpay:0,//总计消费
        billStartDate:'',//账单开始日期
        billEndDate:'',//账单结束日期
        czStartDate:'',//充值初始日期
        czEndDate:'',//充值结束日期
        czList:[],//充值集合
        selectDate:'',//选择时间段
        detailId:'',
        status:'-1',//历史套餐或者现行套餐状态
        tcname:'',//使用中套餐标题
        totalrechargeMoney:0,//充值总计
        totalaccountMoney:0,//账户余额总计
        selectTime:'',//选择时间
        timeList:[],//时间集合
        nowid:'',//账户id
        changetabPage:0,//tab分页页码
    },
    methods: {
    	yesactive:function(){
    		this.isactive=true;
            this.status='-1';//现行套餐
            $('.tctabs .active a').click();
    	},
    	noactive:function(){
    		this.isactive=false;
            this.status='2';
            $('.tctabs .active a').click();
    	},
        //获取套餐列表
        getSetmeal:function(id){
            vm.nowid=id;
            var data={
                finAccountId:id,
                status:vm.status
            }
            API.queryProductDetail(data,function(data){
                if(data&&data.code==200){
                    // 附上套餐列表的数组
                    vm.setmeal=data.data.data;
                    // 获取套餐名
                    // var lock=true;//表示没有一个套餐正在被使用
                    // $.each(vm.setmeal,function(index,item){
                    //     if(item.displayStatus=='使用中'){
                    //         vm.tcname=item.productName;
                    //         lock=false;
                    //     }
                    // })
                    // // 如果没有使用中套餐，则套餐名为空
                    // if(lock){
                    //     vm.tcname='';
                    // }
                    setTimeout(function(){
                    $("[data-toggle='popover']").popover({trigger:"hover"});
                     },1000)

                    progress()

                }else{
                    dcrmAlertError(data.msg)
                }

            })
            // 获取套餐详情
            var data={
                finAccountId:id
            };

            // 获取使用中套餐列表
            API.queryUsingService(data,function(data){
                if(data&&data.code==200){
                    vm.tcList=data.data.data;
                    vm.tcname=data.data.productName;
                    var num=0;

                   for(var i=0;i<vm.tcList.length;i++){
                       num+=Number(vm.isNull0(vm.tcList[i].outMoney));

                   }
                    vm.totalpay=num;
                }else{
                    vm.tcList=[];
                    vm.totalpay=0;
                    vm.tcname='';
                }
            })
                //切换tab选项卡时，切换充值列表和账单列表，时间默认为最近三天
                // 计算最近三天的日期，是一个数组
                vm.lastnum(3);
                // 账单日期初始化
                // vm.billStartDate=vm.lastnum(3)[0];
                // vm.billEndDate=vm.lastnum(3)[2];

                $('#inpstart').val(vm.lastnum(3)[0]);
                $('#inpend').val(vm.lastnum(3)[2]);
                // 充值日期初始化
                $('#czstart').val(vm.lastnum(3)[0]);
                $('#czend').val(vm.lastnum(3)[2]);
                // 调用账单和充值查询接口
                vm.getrecharge();
                vm.getBill();

        },
        //账户统计查询
        getBill:function(){
            var selType='';
            if(this.ison){
                selType='day'
            }else{
                selType='mon'
            }
            if(vm.selectTime!=''){
                var arr=vm.lastnum(vm.selectTime)
                console.log(arr)
                var data={
                    endTime:arr[arr.length-1],
                    id:vm.nowid,
                    startTime:arr[0],
                    selType:selType,
                }
            }else{
                var data={
                    endTime:$('#inpend').val(),
                    id:vm.nowid,
                    startTime:$('#inpstart').val(),
                    selType:selType,
                }
            }
            if(vm.selectTime==""&& $('#inpstart').val()==''){
                dcrmAlertError('请选择开始时间');
                return;
            }else if(vm.selectTime==""&&$('#inpend').val()==''){
                dcrmAlertError('请选择结束时间');
                return;
            }
            API.selPayDetailByAccount(data,function(data){
                if(data&&data.code==200){
                   if(data.data.servicePay.length>0){
                        var str="";
                        $.each(data.data.servicePay,function(index,item){
                            str+='<tr >'+
                                    '<td class="firstTd typeblue"  onclick="chakan('+item.comId+')">'+item.companyName+'</td>'+
                                    '<td class="firstTd">'+item.dateCd+'</td>'+
                                    '<td class="firstTd">'+item.cust+'</td>'+
                                    '<td class="firstTd">'+item.calll+'</td>'+
                                    '<td class="firstTd">'+item.sms+'</td>'+
                                    '<td class="firstTd">'+item.flash+'</td>'+
                                    '<td class="firstTd">'+item.email+'</td>'+
                                '</tr>'
                        })
                        $('#paydetailList tbody').html(str)
                    }else{
                        trdat = "<tr >"+
                                    "<td  colspan='8' class='textcenter'><i class='icon icon-icon'></i>暂无数据</td>"+
                                    "</tr> ";
                            $('#paydetailList tbody').html(trdat)
                    }
                }else{
                    dcrmAlertError(data.msg)
                }
            })
        },
        // 充值列表
        getrecharge:function(){

            var data={
                finAccountId:vm.nowid,
                createStartTime:$('#czstart').val(),
                createEndTime:$('#czend').val()
            }
            if($('#czstart').val()==''){
                dcrmAlertError('请选择开始时间');
                return;
            }else if($('#czend').val()==''){
                dcrmAlertError('请选择结束时间');
                return;
            }
            API.queryRechargeDetail(data,function(data){
                if(data&&data.code==200){
                    if(data.data){
                        var num=0;
                            var num1=0;
                         vm.czList=data.data.data;
                        $.each(vm.czList,function(index,item){

                            num+=Number(item.rechargeMoney)
                            num1+=Number(item.accountMoney)

                        })
                        vm.totalrechargeMoney=num;
                        vm.totalaccountMoney=num1;
                    }else{
                         vm.totalrechargeMoney=0;
                        vm.totalaccountMoney=0;
                    }


                }else{
                    vm.totalrechargeMoney=0;
                    vm.totalaccountMoney=0;
                    dcrmAlertError(data.msg)
                }
            });
        },
        //获取英普教育列表和tab选项卡列表
        selAccounts:function(){
           this.detailId=window.location.search.split('&')[0].split('=')[1]
           this.companyName=unescape(window.location.search.split('&')[1].split('=')[1]);
            var data = {
                comId:this.detailId
            };
            MaskUtil.Loading();
            API.selAccounts(data,function(data){
                if(data&&data.code==200){
                    vm.ypeduation=data.data.data;
                    setTimeout(function(){
                        $('.first a').click();

                    },1000)

                    var str='';
                    $.each(vm.ypeduation,function(index,item){
                        if(index==0){
                            vm.nowid=item.id;
                            str+='<li class="active first"  ><a data-toggle="tab" onclick="vm.getSetmeal(\''+item.id+'\')"><span>'+item.id+'</span></a></li>'
                        }else if(index<3){
                            str+='<li><a class=""  data-toggle="tab" onclick="vm.getSetmeal(\''+item.id+'\')"><span>'+item.id+'</span></a></li>'
                        }

                    })
                    $('.tctabs').html(str)
                }else{
                    dcrmAlertError(data.msg)
                }

                MaskUtil.RemoveLoading();
            })


        },
        changetabRight:function(total){
            vm.changetabPage++;
            // console.log(vm.changetabPage)//当前第几页
            // console.log(Number(vm.changetabPage)*Number(total))//当前页码的开始索引
            // console.log((Number(vm.changetabPage)+1)*Number(total)-1)//当前页码的结束引
            if( vm.changetabPage<(vm.ypeduation.length/total)){
                var str='';
                $.each(vm.ypeduation,function(index,item){
                    if(index>=Number(vm.changetabPage)*Number(total)&&index<(Number(vm.changetabPage)+1)*Number(total)){
                        if(index==Number(vm.changetabPage)*Number(total)){
                            vm.nowid=item.id;
                            str+='<li class="active first"  ><a data-toggle="tab" onclick="vm.getSetmeal(\''+item.id+'\')"><span>'+item.id+'</span></a></li>'
                        }else if(index<(Number(vm.changetabPage)+1)*Number(total)){
                            str+='<li><a class=""  data-toggle="tab" onclick="vm.getSetmeal(\''+item.id+'\')"><span>'+item.id+'</span></a></li>'
                        }
                    }

                })
                $('.tctabs').html(str)

            }else{
                dcrmAlertError('已经是最后一页了')
            }
        },
        changetabLeft:function(total){
            if(vm.changetabPage>0){
                   --vm.changetabPage;
            }else{
                dcrmAlertError('已经是第一页了');
                return;
            }
            //console.log(vm.changetabPage)//当前第几页
            //console.log(Number(vm.changetabPage)*Number(total))//当前页码的开始索引
            //console.log((Number(vm.changetabPage)+1)*Number(total)-1)//当前页码的结束引
            var str='';
            if( vm.changetabPage<(vm.ypeduation.length/total)){
                 $.each(vm.ypeduation,function(index,item){
                    if(index>=Number(vm.changetabPage)*Number(total)&&index<(Number(vm.changetabPage)+1)*Number(total)){
                        if(index==Number(vm.changetabPage)*Number(total)){
                            vm.nowid=item.id;
                            str+='<li class="active first"  ><a data-toggle="tab" onclick="vm.getSetmeal(\''+item.id+'\')"><span>'+item.id+'</span></a></li>'
                        }else if(index<(Number(vm.changetabPage)+1)*Number(total)){
                            str+='<li><a class=""  data-toggle="tab" onclick="vm.getSetmeal(\''+item.id+'\')"><span>'+item.id+'</span></a></li>'
                        }
                    }

                })
                $('.tctabs').html(str)
            }


        },
        resetBill:function(){
            $('.billselect').find('input').val('');
            $('.billselect').find('select').val('');
            vm.selectTime=''
        },
        resetCz:function(){
            $('#czrecord').find('input').val('');
        },
        lastnum:function(num){
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
        },
        isNull0:function(data){
            return (data == "" || data == undefined || data == null) ? "0" : data;
        },
        changeval:function(){
            if(vm.selectTime){
                $('#inpstart').val('');
                $('#inpend').val('');
            }
        }
    }
})


