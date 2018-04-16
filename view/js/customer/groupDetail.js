
$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_group").find("a").addClass("active");
    power();
    viewGroup();
    custList(0,20);
})
var detailId=window.location.search.split('=')[1];
function viewGroup(){
    var data={
        'id':detailId
    }
    // 显示群组列表
    MaskUtil.Loading();
    API.viewGroup(data,function(data){
        //console.log(data)
        var groupTable=data.data.data;
        var groupType=groupTable.groupType;
        var str='';
        if(groupType==1){
            groupType='静态群组'
        }else if(groupType==2){
            groupType='智能群组'
        }
        str=
            ' <tr>'+
            '    <td>'+groupTable.groupName+'</td>'+
            '    <td>'+groupType+'</td>'+
            '    <td>'+groupTable.custNum+'</td>'+
            '    <td>'+groupTable.displayReloadTime+'</td>'+
            '    <td>'+groupTable.displayCreateTime+'</td>'+
            '</tr>';
        $('#detailList').html(str);
        // 详情页筛选还原

        var filterObj=JSON.parse(data.data.data.filterExpr).items;
        window.filterExpr=data.data.data.filterExpr;
        var str=''
        if(filterObj){

            $.each(filterObj,function(i,u){
               str='<span class="qie">'+u.expr+'</span>';
                var objs=u.item;


                //console.log(objs)
                $.each(objs,function(m,n){

                    if(n.scope=='area'){
                       str+=' <span class="condition"><i>所在地区</i> → <i>'+n.val.join(',')+'</i></span> /'
                    }else{
                        var Name = n.valName;
                        Name=Name.replace(',','-');
                        var datastr='';
                        var dates=n.date;
                        if(n.scope=='event'&& dates.length>0){
                            console.log(dates);
                            datastr+='→ <i>'+dates[0]+' - '+dates[1]+'</i>'
                        }
                        str+=' <span class="condition"><i>'+n.term.name+'</i> → <i>'+Name+'</i>'+datastr+'</span> /'
                    }
                    if(n.term.attrType=='date'||n.term.attrType=='date'){

                    }

                })

            })

        }
        //如果客户人数为0。则不现实分析图表
        if(groupTable.custNum==0){
            $('#analysis').html('<p class="noperson">该群客户人数为0，无法进行人群分析</p>')
        }
        str=str.substring(0,str.length-2);
        $('#filterCondition').html(str);
        MaskUtil.RemoveLoading();
    })
}


//删除智能群组
function delGroup(){
    var data={
        'id':detailId
    };
    dcrmConfirm('您确定要删除该群组吗',function(){
        API.delGroup(data,function(res){
            if(res.code == 200){
                dcrmAlertSuccess(res.msg);
                window.location.href = "/view/customer/group/group.html";

            }else{
                dcrmAlertError(res.msg);
            }
        })
    })
}
// 客户列表
function custList(page,size,count){
    var data={
        id:detailId,
        pageIndex:page,
        pageSize:size
    };

    MaskUtil.Loading();
    API.getGroupCustList(data,function(data){
        var pagenum=window.location.hash.split('=')[1];
         //客户表格列表
        var obj=data.data.pageData.list;
        if(obj.length){
            for (var i =0;i< obj.length; i++) {
            // 判断数据是否为null
            var allCustTag='<div class="allCustTag hide">';
            var type=obj[i].type;
            var sex=obj[i].sex;
            var sexImg='';
            var mobileNum;
            var name;
            var trdat;
            var custTag='';
            var contTag='';
            var allcontTag='<div class="allContTag hide"><p>';
            var allArr=[];
            var typeImg='';
                var weixinNiceName=isNull(obj[i].weixinNiceName);
                var wxHeadImgUri=isNull(obj[i].wxHeadImgUri);
                var weixinImg='';
                if(wxHeadImgUri){
                    weixinImg='<img class="weixinImg" src="/view/images/weixin.png" data-container="body" data-toggle="popover" data-placement="top" data-html="true" data-content="<img style=\'width:40px;height:40px;\' src=\''+wxHeadImgUri+'\'><span>'+weixinNiceName+'</span>">';
                }else{
                    weixinImg='';
                }


                var stageContent='';
                // 华坤标签
                if(obj[i].hkdwTaglist.length!=0){
                    // 如果华坤道威标签有值
                    var arr=obj[i].hkdwTaglist;
                    custTag='<p class="listP">';
                    allCustTag+='<p class="hkdwTag">';
                    if(arr.length<=2){
                        $.each(arr,function(index,item){
                            custTag+='<span class="listTag">'+item+'</span>';
                            allCustTag+='<span class="listTag">'+item+'</span>';
                        });
                        custTag+='</p>';
                        allCustTag+='</p>'
                    }else{
                        //列表页只显示2个标签
                        custTag='<p class="listP"><span class="listTag">'+arr[0]+'</span><span class="listTag">'+arr[1]+'</span></p>'
                        // 鼠标悬停，显示4个标签

                        if(arr.length>4){
                            arr=arr.splice(0, 4);
                        }
                        allCustTag+='<p class="listP">';

                        for(var j=0;j<arr.length;j++){
                            allCustTag+='<span class="listTag">'+arr[j]+'</span>'
                        }
                        allCustTag+='</p>'
                    }
                }
                // 自定义标签
                if(obj[i].customTagList.length!=0){
                    //如果自定义标签有值
                    custTag+='<p class="listP customTag">';
                    allCustTag+='<p class="customTag">'
                    var arr2=obj[i].customTagList;
                    if(arr2.length<=2){
                        $.each(arr2,function(index,item){
                            allCustTag+='<span class="listTag">'+item+'</span>'
                            custTag+='<span class="listTag">'+item+'</span>'
                        });
                        // allCustTag+='</p><i class="triangle"></i></div>'
                        custTag+='</p>'
                    }else{
                        //列表页只显示2个标签
                        custTag+='<span class="listTag">'+arr2[0]+'</span><span class="listTag">'+arr2[1]+'</span></p>'
                        // 鼠标悬停，显示4个标签
                        if(arr2.length>4){
                            arr2=arr2.splice(0, 4);
                        }

                        for(var j=0;j<arr2.length;j++){
                            allCustTag+='<span class="listTag">'+arr2[j]+'</span>'
                        }
                        allCustTag+='</p>'
                    }



                }
                // 内容标签
                if(obj[i].makingTagList.length!=0){
                    var arr3=obj[i].makingTagList;
                    var arrall=[];
                    $.each(arr3,function(index,item){
                        arrall.push(item)
                    });
                    // 列表页的 内容标签
                    contTag='<p class="listP">';
                    if(arr3.length<=2){//如果标签个数小于2，则全部显示
                        $.each(arr3,function(index,item){
                            contTag+='<span class="listTag custag">'+item+'</span>'
                        });
                        contTag+='</p>';
                    }else{
                        contTag='<p class="listP"><span class="listTag custag">'+arr3[0]+'</span><span class="listTag custag">'+arr3[1]+'</span></p>'
                    }
                    // 鼠标悬停后展示8个内容标签，4个一排
                    allCustTag+='<p class="listP">';
                    if(arrall.length<4){//如果标签个数小于4，则全部显示
                        $.each(arrall,function(index,item){
                            allCustTag+='<span class="listTag custag">'+item+'</span>'
                        })

                    }else{
                        for(var j=0;j<4;j++){
                            allCustTag+='<span class="listTag custag">'+arrall[j]+'</span>'
                        }
                    }

                }

                // 如果华坤道威标签没值
                if(obj[i].hkdwTaglist.length==0 && obj[i].customTagList.length==0 && obj[i].makingTagList.length==0){//如果华坤标签和自定义标签都为空，就不显示悬浮窗
                    allCustTag=''
                }else{//如果自定义标签没值，华坤道威标签有值。就显示悬浮窗
                    allCustTag+='</p><i class="triangle"></i></div>'
                }



            if(type=='老客户'){
                typeImg='<img src="/view/images/old.png">';
            }else if(type=='新客户'){
                typeImg='<img src="/view/images/new.png">';
            }else if(type=='流失客户'){
                typeImg='<img src="/view/images/miss.png">';
            }
            if(sex=='男'){
                sexImg='<img src="/view/images/littleman.png">';
            }else if(sex=='女'){
                sexImg='<img src="/view/images/littlewoman.png">';
            }

            if(obj[i].stageName=='新客户'){
                stageContent='<span class="spcspan icon icon-new newicon"></span>';
            }else if(obj[i].stageName=='初次接触'){
                stageContent='<span class="spcspan icon icon-chuji cheng"></span>';
            }else if(obj[i].stageName=='意向线索'){
                stageContent='<span class="spcspan icon icon-yixiang green"></span>';
            }/*else if(obj[i].stageName=='确认线索'){
                stageContent='<span class="yellow spcspan icon icon-tijiaochenggong"></span>';
            }*/else if(obj[i].stageName=='成交客户'){
                stageContent='<span class="green spcspan icon icon-jiaoyichenggong chengjiao"></span>';
            }

            // 客户来源
            var sources=isNull(obj[i].source);
            var sourceicon='';
            if(sources=='华坤道威'){
                sourceicon='<i class="icon icon-huakundaowei fontsource red"></i>'
            }else if(sources=='未知'){
                sources='';
            }else if(sources=='企业数据'){
                sourceicon='<i class="icon icon-gaiicon-5 fontsource "></i>'
            }else if(sources=='营销数据'){
                sourceicon='<i class="icon icon-gaiicon-18 fontsource "></i>'
            }

            var mobile=isNull(obj[i].mobile);
            var calltd='';//打电话
            var viewcall='';//查看拨打记录
            var chak = '';//查看
            // if(mobile.indexOf("*") > 0 ||mobile==''){
            if(mobile==''){
                 mobileNum='';
                 viewcall='<a class="cursorDefault"><i class="icon icon-jilu disabled"></i></a>';
                 calltd='<a href="javascript:;" class="cursorDefault"><i class="icon icon-boda disabled"></i></a><i class="shugang">|</i>';
            }else{
                // 如果来自华坤道威，则显示锁图标
                 if(isNull(obj[i].grantMobileStatus)==10){
                    mobileNum='<i class="icon icon-B-mima"></i>'
                 }
                viewcall='<a href="javascript:;" onclick="viewCall('+obj[i].id+')" data-container="body" data-toggle="popover" data-placement="top" data-content="查看拨打记录"><i class="icon icon-jilu"></i></a>';
                calltd='<a class="phonea" href="javascript:;" onclick="call('+obj[i].id+','+obj[i].companyId+')" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打电话"><i class="icon icon-boda"></i><b class="phonenum">'+isNull(obj[i].callCount)+'</b></a><i class="shugang">|</i>';
            }
            //查看群组详情
            if (hasPermission("group", "GET")) {
                chak = '<td class="textLeft" onclick="chakan('+obj[i].id+','+obj[i].companyId+')">';
                if(mobile==''){
                     viewcall='<a class="cursorDefault"><i class="icon icon-jilu disabled"></i></a>'
                 }else{
                    viewcall='<a href="javascript:;" onclick="viewCall('+obj[i].id+')" data-container="body" data-toggle="popover" data-placement="top" data-content="查看拨打记录"><i class="icon icon-jilu"></i></a>'
                }
            }else{
                chak = '<td class="textLeft">';
            }
            //拨打电话功能
            if (hasPermission("call", "ADD")) {
                if(mobile==''){
                    calltd='<a class="cursorDefault"><i class="icon icon-boda disabled"></i></a>'
                }else{
                    calltd='<a class="phonea" href="javascript:;" onclick="call('+obj[i].id+','+obj[i].companyId+')" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打电话"><i class="icon icon-boda"></i><b class="phonenum">'+isNull(obj[i].callCount)+'</b></a>';
                }
            }else{
                calltd='<a class="cursorDefault"><i class="icon icon-boda disabled"></i></a>'
            }
            trdat+='<tr>'+chak+
                '   <span class="qianlan">'+isNull(obj[i].name)+'</span> <p class="littleIcon">'+sexImg+typeImg+weixinImg+' </p></td>'+
                '   <td class="custTagTd">'+custTag+allCustTag+contTag+allcontTag+'</td>'+
                '   <td>'+'<i class="icon icon-B-mima"></i>'+'</td>'+
                '   <td>'+isNull(obj[i].stageName)+stageContent+'</td>'+
                '   <td>'+sourceicon+sources+'</td>'+
                '   <td>'+isNull(obj[i].userName)+'</td>'+
                '   <td class="textcenter">'+isNull(obj[i].showCrateTime)+'</td>'+
                '   <td class="textcenter">' +
                calltd +'<i class="shugang">|</i>'+
                viewcall+'</td>'+
                ' </tr>';
            }

            $('#cusList tbody').html(trdat);
            if(page==0){
                $('.ui-paging-container').eq(0).remove();
                $('#customerListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                    custList(page,size);
                 }});
            }
            $('li[data-page="'+pagenum+'"]').click();
        }else{
            trdat = "<tr >"+
                "<td  colspan='8' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
                "</tr> ";
            $('#cusList tbody').html(trdat)
        }
    });
    MaskUtil.RemoveLoading();

    $(function (){
       setTimeout(function(){
           $("[data-toggle='popover']").popover({trigger:"hover"});
           $('.custTagTd').mouseenter(function(){
                $(this).find('.allCustTag').removeClass('hide');
            }).mouseleave(function(){
                $(this).find('.allCustTag').addClass('hide');
            });
           $('.contTagTd').mouseenter(function(){
                $(this).find('.allContTag').removeClass('hide');
            }).mouseleave(function(){
                $(this).find('.allContTag').addClass('hide');
            });
        },50)
    });

}
//编辑群组
function editGroup(){
    window.location.href = "/view/customer/group/addGroup.html?oid="+detailId;
}
// 刷新
function reloadGroup(){
    var data={
        id:detailId,
        filterJson:window.filterExpr
    };
    API.refresh(data,function(data){
        if(data.code == 200){
            location=location ;
        }else{
            dcrmAlertError(data.msg)
        }
    })
}
// 查看客户
function chakan(id,companyId){
     window.location.href = "/view/customer/customer/customerDetail.html?oid="+id+'&companyId='+companyId+'&group=true';
}

// 图表
var sexMap = [];//性别
var ageMapX = ['未知','18岁以下','19-25岁','26-35岁','36-45岁','46-55岁','56-65岁','65岁以上'];//年龄X轴
var ageMapY = [0,0,0,0,0,0,0,0];//年龄Y轴
var marriageX = ['未知','未婚','已婚','离异'];//婚姻X轴
var marriageY = [0,0,0,0];//婚姻Y轴
var map = [];//区域
var salestageX = ['新客户','初次接触','意向线索','成交客户'];//销售阶段X轴
var salestageY = [0,0,0,0];//销售阶段Y轴
var cuscanalMapY = ['邮件','短信'];//客户接受渠道Y轴
var cuscanalYes = [];//愿意
var cuscanalNo = [];//不愿意
var levelMap = [];//会员级别
var sourceMap = [];//客户来源

// 标签分析
// 教育水平
var eduLevelMapX = ['初中及以下', '中专/高中', '专科', '本科及以上', '未知'];
var eduLevelMapY = [];

var tagMaritalMap = []; // 婚姻状况
var tagChildMap = []; // 是否有小孩
var tagCarMap = []; // 是否有车
var tagRoomMap = []; // 是否有房

// 资产指数
var assetIndexMapX = ['一级', '二级', '三级', '四级', '五级', '未知'];
var assetIndexMapY = [];

// 消费指数
var consumeIndexMapX = ['一级', '二级', '三级', '四级', '五级', '未知'];
var consumeIndexMapY = [];

// 投资理财指数
var investmentIndexMapX = ['一级', '二级', '三级', '四级', '五级', '未知'];
var investmentIndexMapY = [];

var tagEduFollowMap = []; // 关注教育
var tagHealthFollowMap = []; // 关注养生
var tagElderlyHealthFollowMap = []; // 是否关注老人健康
var tagChildHealthFollowMap = []; // 是否关注儿童健康
var tagIsBuyCarMap = []; // 是否有购车倾向

var tagBrandPreferenceMap = []; // 品牌偏好

var tagMusicPreferMap = []; // 音乐偏好
var tagVideoPreferMap = []; // 视频偏好
var tagDigitalPreferMap = []; // 数码偏好
var tagTravelPreferMap = []; // 旅游偏好
var tagReadingPreferMap = []; // 阅读偏好
var tagCameraPreferMap = []; // 摄影偏好
var tagShoppingPreferMap = []; // 购物偏好

// 消费性格
var tagConsumerCharacterMapX = ['保守型消费', '冲动型消费', '常规型消费', '未知'];
var tagConsumerCharacterMapY = [];

// 线上消费能力
var tagOnlineGoodsPowerMapX = ['消费能力强', '消费能力中', '消费能力弱', '未知'];
var tagOnlineGoodsPowerMapY = [];

var tagOlinePurchaseActionMap = []; // 上网购物行为

// 消费类网站访问时长
var tagConlineWebsiteVisitsMapX = ['>10', '5-10', '1-5', '0', '未知'];
var tagConlineWebsiteVisitsMapY = [];

// 周期类消费频次
var tagConsumeFrequencyMapX = ['>10', '3-10', '1-3', '0', '未知'];
var tagConsumeFrequencyMapY = [];

// 浏览商品的平均价格
var tagBrowseAvgPriceMapX = ['>1000', '300-1000', '1-300', '0', '未知'];
var tagBrowseAvgPriceMapY = [];

var tagCharts = [];

function tagPie(ele, title, data) {
    if (data.length === 0) {
        var html = '<div style="font-weight: bold;text-align: center;font-size: 16px">' + title + '</div>' +
            '<div style="text-align: center;color:#999">暂无数据</div>';
        $('#' + ele).html(html);
    } else {
        var chart = echarts.init(document.getElementById(ele));
        var option = {
            title: {
                text: title,
                x: 'center',
                y: 20
            },
            "color": [
                "#5c7093",
                "#7e8fe1",
                "#8c9deb",
                "#99bce3",
                "#7dd6b8",
                "#a0e3ce",
                "#c1ebdd",
                "#cfcfcf",
                "#ebebeb"
            ],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            grid: {
                top: '0%',
                left: '0%',
                right: '0%',
                bottom: '10%',
                containLabel: true
            },
            calculable: true,
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: data
                }
            ]
        };
        chart.setOption(option);
        tagCharts.push(chart);
    }
}

function tagBar(ele, title, dataX, dataY) {
    if (dataY.length === 0) {
        var html = '<div style="font-weight: bold;text-align: center;font-size: 16px">' + title + '</div>' +
            '<div style="text-align: center;color:#999">暂无数据</div>';
        $('#' + ele).html(html);
    } else {
        var chart = echarts.init(document.getElementById(ele));
        var option = {
            title : {
                text: title,
                x:'center'
            },
            "color": [
                "#5c7093",
                "#7e8fe1",
                "#8c9deb",
                "#99bce3",
                "#7dd6b8",
                "#a0e3ce",
                "#c1ebdd",
                "#cfcfcf",
                "#ebebeb"
            ],
            tooltip : {
                trigger: 'axis'
            },
            grid: {
                top:'30%',
                left: '2%',
                right: '2%',
                bottom: '10%',
                containLabel: true,
                x:0
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    axisLabel:{
                        interval:0,
                        rotate:45,
                        margin:2,
                        textStyle:{
                            color:"#222"
                        }
                    },
                    data : dataX
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'人数',
                    type:'bar',
                    barWidth : 20,//柱图宽度
                    data:dataY,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }
                }
            ]
        };
        chart.setOption(option);
        tagCharts.push(chart);
    }

}

$(function(){
    var data = {
        id:detailId
    };
    API.groupAnalysis(data, function(data) {
        if (data.code == 200) {
            //性别
            $.each(data.data.sexMap,function(i,u){
                if(i == ""||i == null||i == undefined){
                    i = '未知';
                }
                var param = {
                    "value":u,
                    "name":i
                };
                sexMap.push(param);
            });
            //性别 end
            //年龄
            $.each(ageMapX,function(i,u){
                for(key in data.data.ageMap){
                    if(key == u){
                        ageMapY[i] = data.data.ageMap[key]
                    }
                }
            });
            //年龄 end
            //婚姻
            $.each(marriageX,function(i,u){
                for(key in data.data.maritalMap){
                    if(key == u){
                        marriageY[i] = data.data.maritalMap[key]
                    }
                }
            });
            //婚姻 end
            //区域
            $.each(data.data.provinceMap,function(i,u){
                var param = {
                    "name":i,
                    "value":u
                };
                map.push(param);
            });
            //区域 end
            //销售阶段
            $.each(salestageX,function(i,u){
                for(key in data.data.stageMap){
                    if(key == u){
                        salestageY[i] = data.data.stageMap[key]
                    }
                }
            });
            //销售阶段 end
            //接受渠道
            for(key in data.data.emailMap){//邮件接受
                if(key == '接受'){
                    cuscanalYes.push(data.data.emailMap[key])
                }
            }
            for(key in data.data.emailMap){//邮件不接受
                if(key == '不接受'){
                    cuscanalNo.push(-(data.data.emailMap[key]))
                }
            }
            for(key in data.data.smsMap){//短信接受
                if(key == '接受'){
                    cuscanalYes.push(data.data.smsMap[key])
                }
            }
            for(key in data.data.smsMap){//短信不接受
                if(key == '不接受'){
                    cuscanalNo.push(-(data.data.smsMap[key]))
                }
            }
            //接受渠道 end
            //会员级别
            $.each(data.data.levelMap,function(i,u){
                if(i == ""||i == null||i == undefined){
                    i = '未知';
                }
                var param = {
                    "value":u,
                    "name":i
                };
                levelMap.push(param);
            });
            //会员级别 end
            //客户来源
            $.each(data.data.sourceMap,function(i,u){
                if(i == ""||i == null||i == undefined){
                    i = '未知';
                }
                var param = [i,u];
                sourceMap.push(param);
            });
            //客户来源 end
            Charts();
        }else{

        }
    });

    API.groupTagAnalysis(data, function (data) {
        // 文化水平
        $.each(eduLevelMapX,function(i,u){
            for(key in data.data.eduLevelMap){
                if(key == u){
                    eduLevelMapY[i] = data.data.eduLevelMap[key];
                }
            }
        });
        tagBar('tagEduLevelChart', '文化水平', eduLevelMapX, eduLevelMapY);

        // 婚姻状况
        $.each(data.data.maritalMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagMaritalMap.push(param);
        });
        tagPie('tagMaritalChart', '婚姻状况', tagMaritalMap);

        // 是否有小孩
        $.each(data.data.isHasChildMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagChildMap.push(param);
        });
        tagPie('tagChildChart', '是否有小孩', tagChildMap);

        // 是否有车
        $.each(data.data.isHasCarMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagCarMap.push(param);
        });
        tagPie('tagCarChart', '是否有车', tagCarMap);

        // 是否有房
        $.each(data.data.isHasRoomMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagRoomMap.push(param);
        });
        tagPie('tagRoomChart', '是否有房', tagRoomMap);

        // 资产指数
        $.each(assetIndexMapX,function(i,u){
            for(key in data.data.assetIndexMap){
                if(key == u){
                    assetIndexMapY[i] = data.data.assetIndexMap[key];
                }
            }
        });
        tagBar('tagAssetIndexChart', '资产指数', assetIndexMapX, assetIndexMapY)

        // 消费指数
        $.each(consumeIndexMapX,function(i,u){
            for(key in data.data.consumptionIndexMap){
                if(key == u){
                    consumeIndexMapY[i] = data.data.consumptionIndexMap[key];
                }
            }
        });
        tagBar('tagConsumeIndexChart', '消费指数', consumeIndexMapX, consumeIndexMapY);

        // 投资理财指数
        $.each(investmentIndexMapX,function(i,u){
            for(key in data.data.investmentFinancialIndexMap){
                if(key == u){
                    investmentIndexMapY[i] = data.data.investmentFinancialIndexMap[key];
                }
            }
        });
        tagBar('tagInvestmentIndexChart', '投资理财指数', investmentIndexMapX, investmentIndexMapY);

        // 教育关注
        $.each(data.data.educationConcernMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagEduFollowMap.push(param);
        });
        tagPie('tagEduFollowChart', '教育关注', tagEduFollowMap);

        // 养生关注
        $.each(data.data.healthCareMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagHealthFollowMap.push(param);
        });
        tagPie('tagHealthFollowChart', '养生关注', tagHealthFollowMap);

        // 是否关注老人健康
        $.each(data.data.isElderlyHealthCareMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagElderlyHealthFollowMap.push(param);
        });
        tagPie('tagElderlyHealthFollowChart', '是否关注老人健康', tagElderlyHealthFollowMap);

        // 是否关注儿童健康
        $.each(data.data.isChildrenHealthCareMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagChildHealthFollowMap.push(param);
        });
        tagPie('tagChildHealthFollowChart', '是否关注儿童健康', tagChildHealthFollowMap);

        // 是否有购车倾向
        $.each(data.data.isCarBuyingTendencyMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagIsBuyCarMap.push(param);
        });
        tagPie('tagIsBuyCarChart', '是否有购车倾向', tagIsBuyCarMap);

        // 品牌偏好
        $.each(data.data.brandPreferenceMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagBrandPreferenceMap.push(param);
        });
        tagPie('tagBrandPreferChart', '品牌偏好', tagBrandPreferenceMap);

        // 音乐偏好
        $.each(data.data.musicPreferenceMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagMusicPreferMap.push(param);
        });
        tagPie('tagMusicPreferChart', '音乐偏好', tagMusicPreferMap);

        // 视频偏好
        $.each(data.data.videoPreferenceMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagVideoPreferMap.push(param);
        });
        tagPie('tagVideoPreferChart', '视频偏好', tagVideoPreferMap);

        // 数码偏好
        $.each(data.data.digitalPreferenceMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagDigitalPreferMap.push(param);
        });
        tagPie('tagDigitalPreferChart', '数码偏好', tagDigitalPreferMap);

        // 旅游偏好
        $.each(data.data.tourismPreferenceMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagTravelPreferMap.push(param);
        });
        tagPie('tagTravelPreferChart', '旅游偏好', tagTravelPreferMap);

        // 阅读偏好
        $.each(data.data.readPreferenceMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagReadingPreferMap.push(param);
        });
        tagPie('tagReadingPreferChart', '阅读偏好', tagReadingPreferMap);

        // 摄影偏好
        $.each(data.data.photographyPreferenceMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagCameraPreferMap.push(param);
        });
        tagPie('tagCameraPreferChart', '摄影偏好', tagCameraPreferMap);

        // 购物偏好
        $.each(data.data.shoppingPreferenceMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagShoppingPreferMap.push(param);
        });
        tagPie('tagShoppingPreferChart', '购物偏好', tagShoppingPreferMap);

        // 消费性格
        $.each(tagConsumerCharacterMapX,function(i,u){
            for(key in data.data.consumptionCharacterMap){
                if(key == u){
                    tagConsumerCharacterMapY[i] = data.data.consumptionCharacterMap[key];
                }
            }
        });
        tagBar('tagConsumerCharacterChart', '消费性格', tagConsumerCharacterMapX, tagConsumerCharacterMapY);

        // 线上消费能力
        $.each(tagOnlineGoodsPowerMapX,function(i,u){
            for(key in data.data.onlineConsumptionCapacityMap){
                if(key == u){
                    tagOnlineGoodsPowerMapY[i] = data.data.onlineConsumptionCapacityMap[key];
                }
            }
        });
        tagBar('tagOnlineGoodsPowerChart', '线上消费能力', tagOnlineGoodsPowerMapX, tagOnlineGoodsPowerMapY);

        // 上网购物行为
        $.each(data.data.onlinePurchaseBehaviorMap,function(i,u){
            if(i == ""||i == null||i == undefined){
                i = '未知';
            }
            var param = {
                "value":u,
                "name":i
            };
            tagOlinePurchaseActionMap.push(param);
        });
        tagPie('tagOlinePurchaseActionChart', '上网购物行为', tagOlinePurchaseActionMap);

        // 消费类网站访问时长
        $.each(tagConlineWebsiteVisitsMapX,function(i,u){
            for(key in data.data.consumerWebSiteAccessLongMap){
                if(key == u){
                    tagConlineWebsiteVisitsMapY[i] = data.data.consumerWebSiteAccessLongMap[key];
                }
            }
        });
        tagBar('tagConlineWebsiteVisitsChart', '消费类网站访问时长', tagConlineWebsiteVisitsMapX, tagConlineWebsiteVisitsMapY);

        // 周期内消费的频次
        $.each(tagConsumeFrequencyMapX,function(i,u){
            for(key in data.data.frequencyConsumptionInCycleMap){
                if(key == u){
                    tagConsumeFrequencyMapY[i] = data.data.frequencyConsumptionInCycleMap[key];
                }
            }
        });
        tagBar('tagConsumeFrequencyChart', '周期内消费的频次', tagConsumeFrequencyMapX, tagConsumeFrequencyMapY);

        // 浏览商品的平均价格
        $.each(tagBrowseAvgPriceMapX,function(i,u){
            for(key in data.data.browseTheAveragePriceGoodsMap){
                if(key == u){
                    tagBrowseAvgPriceMapY[i] = data.data.browseTheAveragePriceGoodsMap[key];
                }
            }
        });
        tagBar('tagBrowseAvgPriceChart', '浏览商品的平均价格', tagBrowseAvgPriceMapX, tagBrowseAvgPriceMapY);
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        for(var i = 0; i < tagCharts.length; i++) {
            tagCharts[i].resize();
        }
    });
    $(window).resize(function() {
        for(var i = 0; i < tagCharts.length; i++) {
            tagCharts[i].resize();
        }
    })
});
function Charts(){
//性别占比 饼图
var sexChart = echarts.init(document.getElementById('sexChart'));
var sexOption = {
    title : {
        text: '性别占比',
        x:'center',
        y:20
    },
    "color": [
        "#5c7093",
        "#7e8fe1",
        "#8c9deb",
        "#99bce3",
        "#7dd6b8",
        "#a0e3ce",
        "#c1ebdd",
        "#cfcfcf",
        "#ebebeb"
    ],
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    grid: {
        top:'0%',
        left: '0%',
        right: '0%',
        bottom: '10%',
        containLabel: true
    },
    calculable : true,
    series : [
        {
            name:'性别占比',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:sexMap
            /*data:[
                {value:335, name:'男'},
                {value:310, name:'女'},
                {value:1548, name:'未知'}
            ]*/
        }
    ]
};
sexChart.setOption(sexOption);
//性别占比饼图 end
//年龄占比
var ageChart = echarts.init(document.getElementById('ageChart'));
var ageOption = {
    title : {
        text: '年龄占比',
        x:'center'
    },
    "color": [
        "#5c7093",
        "#7e8fe1",
        "#8c9deb",
        "#99bce3",
        "#7dd6b8",
        "#a0e3ce",
        "#c1ebdd",
        "#cfcfcf",
        "#ebebeb"
    ],
    tooltip : {
        trigger: 'axis'
    },
    grid: {
        top:'30%',
        left: '2%',
        right: '2%',
        bottom: '10%',
        containLabel: true,
        x:0
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            axisLabel:{
                interval:0,
                rotate:45,
                margin:2,
                textStyle:{
                    color:"#222"
                }
            },
            data : ageMapX
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'人数',
            type:'bar',
            barWidth : 20,//柱图宽度
            data:ageMapY,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        }
    ]
};
ageChart.setOption(ageOption);
//年龄占比  end

//婚姻状况占比
var marriageChart = echarts.init(document.getElementById('marriageChart'));
var marriageOption = {
    title : {
        text: '婚姻状况分布',
        x:'center'
    },
    "color": [
        "#5c7093",
        "#7e8fe1",
        "#8c9deb",
        "#99bce3",
        "#7dd6b8",
        "#a0e3ce",
        "#c1ebdd",
        "#cfcfcf",
        "#ebebeb"
    ],
    tooltip : {
        trigger: 'axis'
    },
    grid: {
        top:'30%',
        left: '2%',
        right: '2%',
        bottom: '10%',
        containLabel: true,
        x:0
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : marriageX
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'人数',
            type:'bar',
            barWidth : 30,//柱图宽度
            data:marriageY,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        }
    ]
};
marriageChart.setOption(marriageOption);
//婚姻状况占比  end

//区域分布
var mapChart = echarts.init(document.getElementById('mapChart'));
var mapOption = {
    title : {
        text: '区域分布',
        x:'center'
    },
    tooltip : {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        x:'left'
    },
    dataRange: {
        min: 0,
        max: 200,
        x: 'left',
        y: 'bottom',
        text:['高','低'],
        calculable : true
    },
    roamController: {
        show: true,
        x: 'right',
        mapTypeControl: {
            'china': true
        }
    },
    series : [
        {
            name: '区域',
            type: 'map',
            mapType: 'china',
            roam: false,
            itemStyle:{
                normal:{
                    label:{
                        show:true,
                        textStyle: {
                            color: "#5c7093"
                        }
                    },
                    areaStyle:{color:'blue'},
                    borderColor: '#fff',
                    borderWidth: 2
                },

                emphasis: {
                    borderWidth: .2,
                    borderColor: '#fff',
                    areaColor:"#5c7093",
                    textStyle: {
                        color: "#fff"
                    }

                }
            },
            data:map
        }
    ]
};
mapChart.setOption(mapOption);
//区域分布 end

//销售阶段占比
var salestageChart = echarts.init(document.getElementById('salestageChart'));
var salestageOption = {
    title : {
        text: '销售阶段占比',
        x:'center'
    },
    "color": [
        "#5c7093",
        "#7e8fe1",
        "#8c9deb",
        "#99bce3",
        "#7dd6b8",
        "#a0e3ce",
        "#c1ebdd",
        "#cfcfcf",
        "#ebebeb"
    ],
    tooltip : {
        trigger: 'axis'
    },
    grid: {
        top:'30%',
        left: '0%',
        right: '0%',
        bottom: '10%',
        containLabel: true,
        x:0
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : salestageX
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            type:'bar',
            barWidth : 30,//柱图宽度
            data:salestageY,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        }
    ]
};
salestageChart.setOption(salestageOption);
//销售阶段占比  end

//客户接受渠道偏好
var cuscanalChart = echarts.init(document.getElementById('cuscanalChart'));
var cuscanalOption = {
    title : {
        text: '客户接受渠道偏好',
        x:'center'
    },
    "color": [
        "#5c7093",
        "#7e8fe1",
        "#8c9deb",
        "#99bce3",
        "#7dd6b8",
        "#a0e3ce",
        "#c1ebdd",
        "#cfcfcf",
        "#ebebeb"
    ],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        top:'20%',
        left: '2%',
        right: '3%',
        bottom: '10%',
        containLabel: true,
        x:0
    },
    calculable : true,
    xAxis : [
        {
            type : 'value'
        }
    ],
    yAxis : [
        {
            type : 'category',
            axisTick : {show: false},
            data : cuscanalMapY
        }
    ],
    series : [
        {
            name:'愿意',
            type:'bar',
            stack: '总量',
            barWidth : 25,
            itemStyle: {normal: {
                label : {show: true}
            }},
            data:cuscanalYes
        },
        {
            name:'不愿意',
            type:'bar',
            stack: '总量',
            itemStyle: {normal: {
                label : {show: true}
            }},
            data:cuscanalNo
        }
    ]
};
cuscanalChart.setOption(cuscanalOption);
//客户接受渠道偏好  end

//会员级别分布
var levelChart = echarts.init(document.getElementById('levelChart'));
var levelOption = {
    title : {
        text: '会员级别分布',
        x:'center'
    },
    "color": [
        "#5c7093",
        "#7e8fe1",
        "#8c9deb",
        "#99bce3",
        "#7dd6b8",
        "#a0e3ce",
        "#c1ebdd",
        "#cfcfcf",
        "#ebebeb"
    ],
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    calculable : true,
    series : [
        {
            name:'会员级别',
            type:'pie',
            radius : ['50%', '70%'],
            itemStyle : {
                normal : {
                    label : {
                        show : true
                    },
                    labelLine : {
                        show : true
                    }
                },
                emphasis : {
                    label : {
                        show : true,
                        position : 'center',
                        textStyle : {
                            fontSize : '16',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            data:levelMap
        }
    ]
};
levelChart.setOption(levelOption);
//会员级别分布  end

//客户来源
$('#sourceChart').highcharts({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    "colors": [
        "#5c7093",
        "#7e8fe1",
        "#8c9deb",
        "#99bce3",
        "#7dd6b8",
        "#a0e3ce",
        "#c1ebdd",
        "#cfcfcf",
        "#ebebeb"
    ],
    title: {
        text: '客户来源',
        align: 'center',
        verticalAlign: 'top',
        y: 20,
        style : {
            'fontSize' : '18px',
            'font-weight': 'bold'
        }
    },
    tooltip: {
        headerFormat: '{series.name}<br>',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0px 0 0 white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '60%']
        }
    },
    series: [{
        type: 'pie',
        name: '客户来源',
        innerSize: '50%',
        data: sourceMap
    }]
});

}
//客户来源  end

var flag=true;
// 打电话
function call(id,companyId){
    console.log($.cookie('uuid'+Global.userId));
    // 如果window.uuid存在，则说明该用户已打过电话，则要先判断上次拨打电话是否已经结束。
    if($.cookie('uuid'+Global.userId)){
        var param={
            uuid:$.cookie('uuid'+Global.userId)
        };
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
                    custId:id
                };
                API.callPhone(data,function(data){
                    if(data.code == 200){
                        var results=data.data.result;
                        var str='<option value="">请选择</option>';
                        $.each(results,function(index,item){
                            str+='<option value="'+index+'">'+item+'</option>'
                        });
                        $('#resultResponse').html(str);
                        $('#callTime').html(data.data.callTime);
                        window.uuid=data.data.uuid;
                        $.cookie('uuid'+Global.userId, data.data.uuid, {expires: 7, path: '/'});

                        $('.calling').removeClass('hide');
                                $('.numseconds').text('5');
                                var wait=5;
                                timeOut();
                                function timeOut(){
                                    if(wait==0){
                                        //在原页面 显示拨打记录弹窗
                                        $('.calling').addClass('hide');
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
    };

    API.saveStatus(data,function(data){
        if(data.code == 200){
            dcrmAlertSuccess(data.msg);
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
    };

    API.saveStatus(data,function(data){
        if(data.code == 200){
            dcrmAlertSuccess(data.msg);
            $('#writeCall').fadeOut();
            $('.bg').fadeOut();
        }else{
            dcrmAlertError(data.msg)
        }
    })
}
//查看拨打记录
function viewCall(id){
    window.location.href = "/view/marketing/call/callMarketList.html?oid="+id;
}






