$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_group").find("a").addClass("active");
});
var oid=window.location.search.split('=')[1];
if(oid){
    $('#atitle em').text(' / 编辑智能群组')
}else{
    $('#atitle em').text(' / 创建智能群组')
}
//关闭页面返回详情页
function returnBack(){
 window.location.href = "/view/customer/group/groupDetail.html?oid="+oid;
}

// 筛选器还原
if(oid){
    var data={
        id:oid
    }
    MaskUtil.Loading();
    API.viewGroup(data, function(data){
        if(data&&data.code == 200){
            var obj=JSON.parse(data.data.data.filterExpr);//获取新建上传的对象
            var qiehuo=obj.items[0].expr;//获取且或
            var groupName=data.data.data.groupName;
            $('#groupName input').val(groupName);
            $('.qiehuo span').html(qiehuo);

            var detailObj=obj.items[0].item;
            var str='';
            $('.contains').remove();

            $.each(detailObj,function(i,u){
                var scope=u.scope;//一级的val
                var attrType=u.term.attrType;//三级类型
                var cd=u.term.cd;//二级的val的值
                var name=u.term.name;//二级显示的值
                var val=u.val;//三级val的值。是个数组
                var valName=u.valName.split(',');//三级显示的值,是个字符串,转成数组

                if(scope=='area'){//区域二级选择框为多选，所以分开写
                    var firstStr=' <select name="" class="filterFirst" id="first'+i+'">'+
                                        ' <option value="">请选择</option>'+
                                        ' <option value="attr">属性</option>'+
                                        ' <option value="source">来源</option>'+
                                        ' <option value="kpi">指标</option>'+
                                        ' <option value="event">事件</option>'+
                                        ' <option value="area">所在地区</option>'+
                                        ' <option value="stage">销售阶段</option>'+
                                        ' <option value="cust_tag">客户标签</option>' +
                                    '</select>';
                    //二级还原
                    var secondStr= '<div class="filterSecond">'+
                                    '   <select name="" multiple="multiple" class="secondVal" id="second'+i+'">'+
                                    '   </select>'+
                                    '</div>';
                    var thirdStr= '   <div class="filterThird">'+
                                '          <select multiple="multiple" name="" class="thirdVal multiple" id="third'+i+'">'+
                                '          </select>'+
                                '        </div>';
                    str='<div class="contains ">'+firstStr+secondStr+thirdStr+
                            '<span class="delete newDelete"><a href="javascript:;">删除</a></span>'+
                        '</div>';


                    $('.newItem').before(str);//将筛选器插入到html中
                    // 给一级框赋值
                    $('#first'+i).val(scope);
                    // 获取省
                    MaskUtil.Loading();
                    var optionStr='';
                    API.getProvince(data,function(data){
                        var province=data.data.province;

                        $.each(province,function(index,item){
                            optionStr+='<option value='+item.code+'>'+item.name+'</option>';
                        });
                        console.log(optionStr);
                        $('#first'+i).siblings('.filterSecond').html('<select multiple="multiple" name="" class="secondVal multiple">'+optionStr+'</select>');

                        MaskUtil.RemoveLoading();
                        $('#first'+i).siblings('.filterSecond').find('.secondVal').multiselect({
                            noneSelectedText: "请选择",
                            selectedList: 1000000,
                            minWidth:150
                        });

                        $('#first'+i).siblings('.filterSecond').find('.secondVal').multiselect("refresh");

                    })
                    // 给二级框省赋值
                    var cityName=valName;
                    var provinceArr=[];
                    $.each(cityName,function(index,item){
                        provinceArr.push(item.split('-')[0])
                    })
                    $('#first'+i).siblings('.filterSecond').find('select').val( provinceArr);
                    setTimeout(function(){
                        $('#first'+i).siblings('.filterSecond').find('select').multiselect("refresh");
                    },50);

                     // 省改变获取市
                    $('#first'+i).siblings('.filterSecond').find('select').change(function(){

                        var aStr='';
                        var fCode=$(this).val();
                        if(fCode){
                            $.each(fCode,function(index,item){
                                var data={
                                     fCode:item
                                };
                                API.getCity(data,function(data){
                                    var citys=data.data.city;
                                    $.each(citys,function(index,item){
                                        aStr+='<option value='+item.code+'>'+item.name+'</option>';
                                    });
                                    $('#first'+i).siblings('.filterThird').find('select').html('<select multiple="multiple" name="" class="thirdVal multiple">'+aStr+'</select>');
                                    $(".thirdVal.multiple").multiselect({
                                        noneSelectedText: "请选择",
                                        selectedList: 1000000,
                                        minWidth:150
                                    });

                                    setTimeout(function(){
                                        $('#first'+i).siblings('.filterThird').find('select').multiselect("refresh");
                                    },50);
                                })

                            })
                        }
                    })
                    // 模拟省改变
                    $('#first'+i).siblings('.filterSecond').find('select').change();
                    // 给市赋值
                    console.log(valName);
                    $('#first'+i).siblings('.filterThird').find('select').val(valName)

                }else{//除了区域外,其他二级选项框都为单选
                    //一级还原
                    var firstStr=' <select name="" class="filterFirst" id="first'+i+'">'+
                                        ' <option value="">请选择</option>'+
                                        ' <option value="attr">属性</option>'+
                                        ' <option value="source">来源</option>'+
                                        ' <option value="kpi">指标</option>'+
                                        ' <option value="event">事件</option>'+
                                        ' <option value="area">所在地区</option>'+
                                        ' <option value="stage">销售阶段</option>'+
                                        ' <option value="cust_tag">客户标签</option>' +
                                    '</select>';
                    //二级还原
                    var secondStr= '<div class="filterSecond">'+
                                    '   <select name="" class="secondVal" id="second'+i+'">'+
                                    '   </select>'+
                                    '</div>';

                    //三级还原
                    if(attrType=='select'){

                        var thirdStr= '   <div class="filterThird">'+
                                '          <select multiple="multiple" name="" class="thirdVal multiple" id="third'+i+'">'+
                                '          </select>'+
                                '        </div>';

                    }else if(attrType=='text'){

                        var thirdStr= '  <div class="filterThird">'+
                                '          <input type="text" class="thirdVal">'+
                                '        </div>';

                    }else if(attrType=='date'){

                        var thirdStr= ' <div class="filterThird">'+
                                            '<input type="text"  class="wicon thirdstart"  placeholder="选择日期" readonly >-<input type="text"  class="wicon thirdend"  placeholder="选择日期" readonly >'+
                                        '</div>';

                    }else if(attrType=='digit'){

                        var thirdStr=' <div class="filterThird">'+
                                        '<input class="thirddigitstart" type="text">-<input class="thirddigitend" type="text">'+
                                     '</div>';
                    }

                    var eventstr='<div class="filterFourth hide">'+
                                  '      <input type="text"  class="wicon fourthstart"  placeholder="选择日期" readonly >-<input type="text"  class="wicon fourthend"  placeholder="选择日期" readonly >'+
                                  ' </div>'
                    str='<div class="contains ">'+firstStr+secondStr+thirdStr+eventstr+
                            '<span class="delete newDelete"><a href="javascript:;">删除</a></span>'+
                        '</div>';


                    $('.newItem').before(str);//将筛选器插入到html中

                    // 给一级框赋值
                    $('#first'+i).val(scope);
                    var data={
                        type:scope
                    };
                    var str2='';
                    API.getSecondFilter(data, function(data) {
                        var obj=data.data.data;
                        $.each(obj,function(index,item){
                             str2+='<option data-scope="'+item.scope+'"  attr-type="'+item.attrType+'" attr-name="'+item.name+'" value="'+item.cd+'">'+item.name+'</option>';

                        });

                        // 获取二级框所有内容
                        $('#first'+i).siblings('.filterSecond').html('<select  name="" >'+str2+'</select>');
                        // 给二级框赋值
                        $('#first'+i).siblings('.filterSecond').find('select').val(cd);
                        var secondName=cd;
                        var type=attrType;
                        var thirdStr='';

                        // 获取三级下拉框的所有值，并填充进去
                        var data={
                            cd:secondName
                        };
                        if(scope=='event'){//事件
                            $('#first'+i).siblings('.filterFourth').removeClass('hide');
                                var date=u.date;
                                $('#first'+i).siblings('.filterFourth').find('.fourthstart').val(date[0]);
                                $('#first'+i).siblings('.filterFourth').find('.fourthend').val(date[1])
                        }
                        if(type=='select'){
                            if(scope=='event'){//事件
                                API.getCustIdea(data, function(data) {
                                    var obj=data.data.data;
                                    if(obj&&obj.length>0){
                                        $.each(obj,function(index,item){
                                            thirdStr+='<option  value="'+item.id+'">'+item.name+'</option>'
                                         })
                                    }
                                })

                            }else if(scope=='stage'){//销售阶段
                                API.getCustStage(data, function(data) {
                                    var obj=data.data.data;
                                    if(obj&&obj.length>0){
                                        $.each(obj,function(index,item){
                                            thirdStr+='<option  value="'+item.id+'">'+item.name+'</option>'
                                         })
                                    }

                                })

                            }else if(scope=='source'){//客户来源
                                API.getCustsource(data, function(data) {
                                    var obj=data.data.data;
                                    if(obj&&obj.length>0){
                                        $.each(obj,function(index,item){
                                            thirdStr+='<option  value="'+item+'">'+item+'</option>'
                                         })
                                    }

                                })

                            }else if(scope=='area'){//所在地区
                                console.log($('#first'+i).siblings('.filterSecond').find('select').val())

                                var fCode=$('#first'+i).siblings('.filterSecond').find('select').val()
                                if(fCode){
                                    $.each(fCode,function(index,item){
                                        var data={
                                             fCode:item
                                        }
                                        API.getCity(data,function(data){
                                            var citys=data.data.city;
                                            $.each(citys,function(index,item){
                                               thirdStr+='<option value='+item.code+'>'+item.name+'</option>';
                                            })
                                        })
                                    })
                                }

                            }else{//客户属性等其他
                                API.getAttrVal(data, function(data) {
                                    var obj=data.data.attrVal;
                                    $.each(obj,function(index,item){
                                        thirdStr+='<option  value="'+item+'">'+item+'</option>'
                                    })
                                });
                            }

                            $('#first'+i).siblings('.filterThird').html('<select multiple="multiple" name="" class="thirdVal multiple">'+thirdStr+'</select>');

                        }

                            $(".thirdVal.multiple").multiselect({
                                noneSelectedText: "请选择",
                                selectedList: 1000000,
                                minWidth:150
                            });

                            /*$('.wicon').jeDate({
                                format:"YYYY-MM-DD",
                                isTime:false,
                                minDate:"1920-00-01 00:00:00"
                            })*/
                            /**********高级搜索************/
                            /*var _starthms = {
                                //festival:true,//农历
                                isinitVal:true,
                                ishmsVal:false,
                                format: 'YYYY-MM-DD hh:mm:ss',
                                maxDate: $.nowDate({DD:0}),
                                choosefun: function(elem,datas){
                                    _endhms.minDate = datas;
                                    _endDateshms();
                                },
                                okfun:function (elem,datas) {
                                    //alert(datas);
                                }
                            };
                            var _endhms = {
                                isinitVal:true,
                                ishmsVal:false,
                                format: 'YYYY-MM-DD hh:mm:ss',
                                maxDate: '2099-06-16 00:00:00', //×î´óÈÕÆÚ
                                choosefun: function(elem,datas){
                                    _starthms.maxDate = datas; //½«½áÊøÈÕµÄ³õÊ¼ÖµÉè¶¨Îª¿ªÊ¼ÈÕµÄ×î´óÈÕÆÚ
                                }
                            };
                            function _endDateshms() {
                                _endhms.trigger = false;
                                $(".thirdend").jeDate(_endhms);
                            }
                            $(".thirdstart").jeDate(_starthms);
                            $(".thirdend").jeDate(_endhms);
*/
                            //$(".thirdstart,.thirdend").val('');
                            /**********高级搜索************/

                        //给三级框赋值
                        if(type=='select'){
                            $('#first'+i).siblings('.filterThird').find('.thirdVal').val(val);
                            $('#first'+i).siblings('.filterThird').find('select').multiselect("refresh");
                        }else if(type=='text'){//文本类型

                            $('#first'+i).siblings('.filterThird').find('.thirdVal').val(val[0]);
                        }else if(type=='date'){//日期类型

                            $('#first'+i).siblings('.filterThird').find('.thirdstart').val(val[0]);
                            $('#first'+i).siblings('.filterThird').find('.thirdend').val(val[1]);
                        }else if(type=='digit'){//数字类型
                            console.log(val)
                            $('#first'+i).siblings('.filterThird').find('.thirddigitstart').val(val[0]);
                            $('#first'+i).siblings('.filterThird').find('.thirddigitend').val(val[1]);

                        };
                        if($('#first'+i).val()=='source'||$('#first'+i).val()=='stage'){
                            $('#first'+i).siblings('.filterSecond').hide();
                        }
                    })
                }

            });

        }
        MaskUtil.RemoveLoading();
        console.log($('.thirdVal').val())
        filterEvent()
        // $('.filterFirst').change();
        addGroup(0)
    })
}

//筛选器显示

filterEvent();

//筛选器保存前拼json
function addGroup(num){
    var item=[];
    var lock=true;
    $.each($('.filterFirst'),function(index,u){
        var obj= {};
        var firstval=$(u).val();
        obj.scope=$(u).parent().find('.filterSecond select option:selected').attr('data-scope');
        console.log($(u).parent().find('.filterSecond select option:selected'));
        console.log($(u).parent().find('.filterSecond select option:selected').attr('data-scope'))
        obj.op='';
        if(firstval=='area'){//地区
            obj.scope='area';
            if($(u).parent().find('.filterThird select').val()){//如果市有值，省市都传
                var provinceName=$(u).parent().find('.filterSecond select').val().join(',');
                var cityName=$(u).parent().find('.filterThird select').val();//市的值本身是个数组
                var cityEle=$(u).parent().find('.filterThird select option:selected');//所有被选中市的元素集合
                var cityStr='';//市的值拼接字符串
                $.each(cityEle,function(m,n){
                    cityStr+=$(n).html()+',';
                });
                cityStr=cityStr.substring(0,cityStr.length-1);

                obj.term={name:provinceName,cd:'city',attrType:'select'};
                obj.valName=cityName.join(',');
                obj.val=cityStr.split(',');

            }else if($(u).parent().find('.filterThird select').val()==null && $(u).parent().find('.filterSecond select').val()!=null){//市没值，只有省有值，只传省的值
                var provinceName=$(u).parent().find('.filterSecond select').val();
                var provinceStr=$(u).parent().find('.filterSecond select').val().join(',');
                var provinceEle=$(u).parent().find('.filterSecond select option:selected');//所有被选中市的元素集合
                var provinceStr='';//市的值拼接字符串
                $.each(provinceEle,function(m,n){
                    provinceStr+=$(n).html()+',';
                });
                provinceStr=provinceStr.substring(0,provinceStr.length-1);

                obj.term={name:provinceName,cd:'province',attrType:'select'};
                obj.val=provinceStr.split(',');
                obj.valName=provinceName.join(',');
            }else{//省市都没值
                 lock=false;
                 obj={};
            }
        }else{

            if(firstval=='source'){// 只有二级的情况，客户来源和销售阶段
                obj.term={name:'客户来源',cd:'source',attrType:'select'};
                obj.scope='source';
                var attrType='select'
            }else if(firstval=='stage'){
                obj.term={name:'销售阶段',cd:'stage_id',attrType:'select'};
                obj.scope='stage';
                var attrType='select'
            }else{//有三级的情况

                var attrType=$(u).parent().find('.filterSecond select option:selected').attr('attr-type');
                var name=$(u).parent().find('.filterSecond select option:selected').attr('attr-name');
                var cd=$(u).parent().find('.filterSecond select').val();
                obj.term={name:name,cd:cd,attrType:attrType};
                if(firstval=='event'){//事件
                    obj.date=[];
                    var fourthstart=$(u).parent().find('.filterFourth .fourthstart').val();
                    var fourthend=$(u).parent().find('.filterFourth .fourthend').val();
                    if(fourthstart==''||fourthend==""){
                       obj.date=[];
                    }else{
                        obj.date.push(fourthstart);
                        obj.date.push(fourthend)
                    }
                }else{
                   obj.date=[];
                }

            }
            if(attrType=='digit'){//数字区间框
                var startVal=$(u).parent().find('.filterThird .thirddigitstart').val();
                var endVal=$(u).parent().find('.filterThird .thirddigitend').val();
                var arr=[];
                if(isNaN(startVal)||isNaN(endVal)){
                    dcrmAlertError('区间框请输入数值');
                    lock=false;
                    return false;
                }else if(Number(startVal)>Number(endVal)){
                    dcrmAlertError('第一个区间框的值不能大于第二个区间框的值');
                    lock=false;
                    return false;
                }else if(!startVal||!endVal){
                    lock=false;
                }else{
                    arr.push(startVal,endVal);
                    obj.val=arr;
                    obj.valName=arr.join(',');
                }

            }else if(attrType=='date'){//日期区间框
                var startVal=$(u).parent().find('.filterThird .thirdstart').val();
                var endVal=$(u).parent().find('.filterThird .thirdend').val();
                var arr=[];
                if(startVal==''||endVal==''){
                    lock=false;
                    return false;
                }else{
                    arr.push(startVal,endVal);
                    obj.val=arr;
                    obj.valName=arr.join(',');
                }
            }else if(attrType=='text'){//文本框
                var arr=[];
                var value=$(u).parent().find('.filterThird input').val();
                if(!value){
                    lock=false;
                    return false;
                }else{
                  arr.push(value);
                  obj.val=arr;
                  obj.valName=value;
                }

            }else if(attrType=='select'){//多选下拉框
                var value=$(u).parent().find('.filterThird select').val();//多选框的值本身就是数组
                var valName=$(u).parent().find('.filterThird select option:selected');
                console.log(valName);
                var valStr='';
                $.each(valName,function(m,n){
                    valStr+=$(n).html()+',';
                })
                valStr=valStr.substring(0,valStr.length-1);

                if(value){
                    obj.val=value;
                    obj.valName=valStr;
                }else{//三级没值的情况
                    lock=false;
                    obj={};
                }
            }else if(attrType=='tag_select'){//模糊搜索框
                var value=$(u).parent().find('.filterThird .TagNamebox').val();
                console.log(value);
                if(value){
                    obj.val=value.split(",");
                    obj.valName=value;
                }else{//三级没值的情况
                    lock=false;
                    obj={};
                }
            }
        }


        if(obj!={}){
         item.push(obj)
        }
    });
    var qiehuo=$('.qiehuo span').html();


    var items=[];
    var object={};
    object.item=item;
    object.expr=qiehuo;
    items.push(object);

    var bigObject={};
    bigObject.items=items;
    bigObject.expr="且" ;


    window.filterJson=JSON.stringify(bigObject);

        if($('.moren').length!=0){
            lock=false;
        }
        if(lock){
            addOrYulan(num)
        }else{
            dcrmAlertError('筛选条件不完整')
        }



}
function addOrYulan(num){
    if(num==0){//预览
        function getCustList(page,size){
            var data={
                'filterJson':window.filterJson,
                "pageIndex":page,
                "pageSize":size
            };
            MaskUtil.Loading();
            API.getCustList(data,function(data){
                var pagenum=window.location.hash.split('=')[1];
                 //客户表格列表
                if(data.code==200){
                    var obj=data.data.pageData.list;
                    if(obj.length){
                        for (var i =0;i< obj.length; i++) {
                        // 判断数据是否为null
                        var allCustTag='<div class="allCustTag hide">';
                        var type=obj[i].type;
                        var sex=obj[i].sex;
                        var sexImg='';
                        var mobile;
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
                            weixinImg='<img class="weixinImg" src="/view/images/weixin.png" data-container="body" data-toggle="popover" data-placement="top" data-html="true" data-content="<img height=40 width=40 src=\''+wxHeadImgUri+'\'><span>'+weixinNiceName+'</span>">';
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
                        }else if(obj[i].stageName=='确认线索'){
                            stageContent='<span class="yellow spcspan icon icon-tijiaochenggong"></span>';
                        }else if(obj[i].stageName=='成交客户'){
                            stageContent='<span class="green spcspan icon icon-jiaoyichenggong chengjiao"></span>';
                        }
                        // 客户来源
                        var sources=isNull(obj[i].source);
                        var sourceicon=''
                        if(sources=='华坤道威'){
                            sourceicon='<i class="icon icon-huakundaowei fontsource red"></i>'
                        }else if(sources=='未知'){
                            sources='';
                        }else if(sources=='企业数据'){
                            sourceicon='<i class="icon icon-gaiicon-5 fontsource"></i>'
                        }else if(sources=='营销数据'){
                            sourceicon='<i class="icon icon-gaiicon-18 fontsource"></i>'
                        }
                        var mobile=isNull(obj[i].mobile);
                        if(mobile==''){
                            //如果手机号为空，则拨打电话按钮禁用状态
                             mobile='';
                             viewcall='<a class="cursorDefault "><i class="icon icon-jilu disabled"></i></a>'
                             calltd='<a href="javascript:;" class="cursorDefault"><i class="icon icon-boda disabled"></i></a><i class="shugang">|</i>'
                        }else{
                            // 如果手机号存在，则拨打电话按钮启用
                            // 如果来自华坤道威，则显示锁图标
                             if(isNull(obj[i].grantMobileStatus)==10){
                                mobile='<i class="icon icon-B-mima"></i>'
                             }
                            viewcall='<a href="javascript:;" onclick="viewCall('+obj[i].id+')" data-container="body" data-toggle="popover" data-placement="top" data-content="查看拨打记录"><i class="icon icon-jilu"></i></a>';
                             calltd='<a href="javascript:;" onclick="call('+obj[i].id+','+obj[i].companyId+')" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打"><i class="icon icon-boda"></i></a><i class="shugang">|</i>'
                        }

                        trdat+='<tr >'+
                            '   <td  class="textLeft spctd" onclick="chakan('+obj[i].id+','+obj[i].companyId+')"><span class="qianlan addGroupSpan">'+isNull(obj[i].name)+'</span> <p class="littleIcon">'+sexImg+typeImg+weixinImg+' </p></td>'+
                            '   <td class="custTagTd">'+custTag+allCustTag+contTag+allcontTag+'</td>'+
                            '   <td>'+'<i class="icon icon-B-mima"></i>'+'</td>'+
                            '   <td>'+isNull(obj[i].stageName)+stageContent+'</td>'+
                            '   <td>'+sourceicon+sources+'</td>'+
                            '   <td>'+isNull(obj[i].userName)+'</td>'+
                            '   <td class="textcenter">'+isNull(obj[i].showCrateTime)+'</td>'+
                            ' </tr>'
                        };

                        $('#cusList tbody').html(trdat);
                        if(page==0){
                            $('.ui-paging-container').eq(0).remove();
                            $('#customerListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                                getCustList(page,size);
                             }});
                        }
                        $('li[data-page="'+pagenum+'"]').click();
                    }else{
                        trdat = "<tr >"+
                            "<td  colspan='7' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
                            "</tr> ";
                        $('#cusList tbody').html(trdat)
                    }
                }else{
                   dcrmAlertError(data.msg)
                }
                MaskUtil.RemoveLoading();
            });


            $(function (){
               setTimeout(function(){
                $("[data-toggle='popover']").popover({trigger:"hover"});
                   $('.custTagTd').mouseenter(function(){
                        $(this).find('.allCustTag').removeClass('hide');
                    })
                   .mouseleave(function(){
                        $(this).find('.allCustTag').addClass('hide');
                    });
                   $('.contTagTd').mouseenter(function(){
                        $(this).find('.allContTag').removeClass('hide');
                    })
                   .mouseleave(function(){
                        $(this).find('.allContTag').addClass('hide');
                    })
                },50)
            });
        };
        getCustList(0,20)

    }else{//新建
        var groupName=$('#groupName input').val();
        if(groupName.length>50){
            dcrmAlertError('群组名称最多可输入50个汉字');
            return false;
        }else if(groupName.length==''){
            dcrmAlertError('群组名称不能为空');
            return false;
        }
        var data={
            filterJson:window.filterJson,
            groupName:groupName
        }
        if(oid){//编辑保存
            data.groupId=oid;
            API.updateGroup(data, function(data) {
                if(data.code!=200){
                    dcrmAlertError(data.msg);
                    return;
                }else{
                    dcrmAlertSuccess(data.msg);
                    setTimeout(function(){
                       window.location.href = "/view/customer/group/groupDetail.html?oid="+oid;
                    },1000)

                }
            });
        }else{//新建保存
            API.createCustGroup(data, function(data) {
                if(data.code!=200){
                    dcrmAlertError(data.msg);
                    return;
                }else{
                    dcrmAlertSuccess(data.msg);
                    setTimeout(function(){
                       window.location.href = "/view/customer/group/group.html";
                    },1000)

                }
            });
        }
    };
}






