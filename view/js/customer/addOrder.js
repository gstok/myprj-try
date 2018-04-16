$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_clue").find("a").addClass("active");


    vm.oid=window.location.search.split('=')[1];

    $(function () {
        $.jeDate("#startTime",{
            format:"YYYY-MM-DD",
            isTime:false,
            minDate:"0000-00-10"
        })
    });
    vm.see();

})
console.log(111)
var vm = new Vue({
    el: "#workOrderpage",
    data: {
        title:'',//需求标题
        dataNumLimit:'',//需求量
        //startTime:'',//需求单开始时间
        dayNum:'',//需求单有效天数
        status:'',//需求状态
        userName:'',//提交人
        submitTime:'',//提交时间
        returnTime:'',//返回时间
        dataNum:'',//返回线索条数
        dateRange:'',//数据时间范围
        allTitle:'',//总标题
        oid:'',
        remark:'',//备注
        inList:[],//数据需求条件
        outLists:[],//输出的标签列表
        type:'',//0---暂存  1--提交
        oid:''//地址栏截取
    },
    methods: {
        see:function(){



            if(vm.oid){
                vm.allTitle='编辑需求';

            }else{
                vm.allTitle='创建需求';
            }
            var data={};
            // 预测基础标签项
            MaskUtil.Loading();
            API.selelAttr(data,function(data){
                if(data.code == 200){
                    vm.inList=data.data.inList;
                    vm.outLists=data.data.outList;
                    if(vm.inList.length<5){
                       $(".morearrow").hide();
                       var str = '';
                        $.each(vm.inList,function(i,u){
                            if(u.attrType == 'digit'||u.attrType == 'text'){
                                str = '<li><span>'+u.attrName+'</span><input placeholder="'+u.attrName+'" id="'+u.attrKey+'"/></li>'
                            }
                            if(u.attrType == 'select'){
                                var Arr=u.attrVal.split(';');
                                var optionList='';
                                $.each(Arr,function(e,f){
                                    optionList+='<option value="'+f+'">'+f+'</option>';
                                })
                                str = '<li><span>'+u.attrName+'</span><select name="" id="'+u.attrKey+'" class="hyType" multiple>'+optionList+'</select></li>'
                            }
                            if(u.attrType == 'date'){

                                str = '<li><span>'+u.attrName+'</span><input id="'+u.attrKey+'" class="birthDay datainp wicon" type="text" placeholder="YYYY-MM-DD" readonly="readonly"></li>';
                            }
                            $("#demandUl").append(str);
                        })
                    }else{
                        $.each(vm.inList,function(i,u){
                            $(".morearrow").show();
                            if(i<4){
                                var str = '';
                                if(u.clueAttrType == 'digit'||u.clueAttrType == 'text'){
                                    str = '<li><span>'+u.attrName+'</span><input placeholder="'+u.attrName+'" id="'+u.attrKey+'"/></li>'
                                }
                                if(u.clueAttrType == 'select'){
                                    var Arr=u.attrVal.split(';');
                                    var optionList='';
                                    $.each(Arr,function(e,f){

                                        optionList+='<option value="'+f+'">'+f+'</option>';
                                    })

                                    str = '<li><span>'+u.attrName+'</span><select name="" id="'+u.attrKey+'" class="hyType" multiple>'+optionList+'</select></li>'
                                }
                                if(u.clueAttrType == 'date'){

                                    str = '<li><span>'+u.attrName+'</span><input id="'+u.attrKey+'" class="birthDay datainp wicon" type="text" placeholder="YYYY-MM-DD" readonly="readonly"></li>';
                                }
                                $("#demandUl").append(str);
                            }else{
                                var str1 = '';
                                if(u.clueAttrType == 'digit'||u.clueAttrType == 'text'){
                                    str1 = '<li><span>'+u.attrName+'</span><input placeholder="'+u.attrName+'" id="'+u.attrKey+'"/></li>'
                                }
                                if(u.clueAttrType == 'select'){
                                    var Arr1=u.attrVal.split(';');
                                    var optionList1='';

                                    $.each(Arr1,function(e,f){
                                        optionList1+='<option value='+f+'>'+f+'</option>';
                                    })

                                    str1 = '<li><span>'+u.attrName+'</span><select name="" id="'+u.attrKey+'" class="hyType" multiple>'+optionList+'</select></li>'
                                }
                                if(u.clueAttrType == 'date'){

                                    str1= '<li><span>'+u.attrName+'</span><input id="'+u.attrKey+'" class="birthDay datainp wicon" type="text" placeholder="YYYY-MM-DD" readonly="readonly"></li>';
                                }
                                $("#demandmore").append(str1);
                            }
                        });

                    };
                    setTimeout(function(){
                        $.jeDate(".birthDay",{
                            format:"YYYY-MM-DD",
                            isTime:false,
                            minDate:"0000-00-10"
                        });
                        $('.hyType').selectpicker({
                            width:'177px',
                            multiple: true,
                            noneSelectedText: "请选择",
                            multipleSeparator:'、',
                            selectedList:1000
                        });
                    },500)
                    $.each(vm.outLists,function(i,u){
                        var str = '';
                            str+='<li><input type="checkbox" name="outLabel" dataId="'+u.attrKey+'" data-con = "'+u.type+'" checked="checked"><label>'+u.attrName+'</label></li>';
                        $(".outListUl").append(str);
                        if(vm.oid){
                            $(".outListUl").find('input:checkbox[name=outLabel]').attr("checked",false);
                        }
                    })
                }else{
                    dcrmAlertError('数据异常')
                }
                MaskUtil.RemoveLoading();
            });
            if(vm.oid){
                // 编辑修改需求还原
                var bdata={
                    id:vm.oid
                };
                MaskUtil.Loading();
                API.viewWorkOrder(bdata,function(data){
                    if(data && data.code == 200){
                        var obj = data.data.workOrder;
                        vm.title=obj.title;
                        vm.dataNumLimit = obj.dataNumLimit;//需求量
                        vm.dayNum=obj.dayNum;
                        vm.remark=obj.remark;
                        vm.dateRange = obj.dateRange;


                        function add0(m){return m<10?'0'+m:m }

                        var time = new Date(obj.startTime);
                        var y = time.getFullYear();
                        var m = time.getMonth()+1;
                        var d = time.getDate();
                        var _stime =  y+'-'+add0(m)+'-'+add0(d);
                        $("#startTime").val(_stime);


                        /*************数据需求条件赋值*************/
                        var content = JSON.parse(obj.content);
                        $.each(vm.inList,function(i,u){
                            for (p in content){
                                if(content[p].key == u.attrKey){
                                    if(u.clueAttrType == 'select'){//如果是下拉框
                                        if(content[p].value){
                                            var va_ = content[p].value.split("、");
                                            $.each(va_,function(e,f){
                                                $('#'+content[p].key).find("option[value='"+f+"']").attr("selected",true);
                                                $('#'+content[p].key).selectpicker('refresh');
                                            })
                                        }
                                    }
                                    if(u.clueAttrType == 'digit'||u.clueAttrType == 'date'||u.clueAttrType == 'text'){//如果是日期   数字
                                        var va_ = content[p].value;
                                        $('#'+content[p].key).val(va_);
                                    }

                                }
                            }
                        });

                        /*************数据需求条件赋值*************/
                        var outputField = JSON.parse(obj.outputField);
                        console.log(vm.outLists)
                        $.each(vm.outLists,function(i,u){
                            for (p in outputField){
                                if(outputField[p]){
                                    if(outputField[p].label == u.attrName){
                                        $(".outListUl").find("input:checkbox[dataId='"+u.attrKey+"']").prop("checked",true);
                                    }
                                }
                            }
                        })
                        /*************数据需求条件赋值*************/

                        /*var content=JSON.parse(obj.content);
                        console.log(content);
                        for(var p in content){
                            if(content[p]=='checkbox'){//如果是复选框
                                $('#'+p).attr('checked',true);

                            }
                        }*/
                    }else{
                        dcrmAlertWarning(data.msg);
                    }

                    MaskUtil.RemoveLoading();
                })
            }
        },
        //点击查看更多
        demandmore:function(){
            if($(".morearrow").html() == '<i class="icon icon-jiantou"></i>'){
                $(".morearrow").html('<i class="icon icon-jiantou1"></i>')
            }else{
                $(".morearrow").html('<i class="icon icon-jiantou"></i>')
            }
            $("#demandmore").slideToggle();
        },
        //提交---1    暂存----0
        savepage: function(type) {
            vm.type = type;
            var param = [];
            $.each(vm.inList,function(i,u){
                if($("#"+u.attrKey).val()){
                    var str={
                        "key": "city",
                        "value": "",
                        "label": "城市"
                    };
                    str.key = u.attrKey;
                    str.label = u.attrName;
                    if(u.clueAttrType == 'digit'||u.clueAttrType == 'date'||u.clueAttrType == 'text'){
                        str.value = $("#"+u.attrKey).val();
                    }
                    if(u.clueAttrType == 'select'){
                        console.log($("#"+u.attrKey).val());
                        if($("#"+u.attrKey).val() != ""&&$("#"+u.attrKey).val() != null){
                            str.value = $("#"+u.attrKey).val().join("、");
                        }
                    }
                    param.push(str);
                }
            });
            console.log(param);
            var lock = true;
            $.each(param,function(i,u){
                console.log(u.value);
                if(u.value !=''){
                    lock = false;
                }
            })
            if(lock){
                dcrmAlertWarning('需求条件至少一个不为空');
                return;
            }
            var pams = [];
            var checked = $('input:checkbox[name=outLabel]:checked');
            $.each(checked,function(i,u){
                var str = {
                    "key": "provice",
                    "type": "1",
                    "label": "省份"
                };
                str.key = $(u).attr('dataid');
                str.type = $(u).attr('data-con');
                str.label = $(u).next('label').html();
                pams.push(str);
            });

            console.log(param);
            // 提交需求
            var params={
                'title':vm.title,
                'dataNumLimit':vm.dataNumLimit,//需求量
                'dayNum':vm.dayNum,//需求单有效天数
                'startTime':Date.parse($("#startTime").val()),//开始时间
                'status':vm.type,
                'content':JSON.stringify(param),//需求条件
                'outputField':JSON.stringify(pams),//输出的标签
                dateRange:vm.dateRange,
                'remark':vm.remark//备注
            };
            // 需求提交前验证
            if(params.title==''){
                dcrmAlertError('项目需求名称不能为空');
                return false;
            }else if(params.title.length>50){
                dcrmAlertError('项目需求名称不能超过50个字符');
                return false;
            }else if(params.dataNumLimit == ''){
                dcrmAlertError('需求量不能为空');
                return false;
            }else if(params.startTime == ''){
                dcrmAlertError('需求单开始时间不能为空');
                return false;
            }else if(params.dayNum == ''){
                dcrmAlertError('需求单有效天数不能为空');
                return false;
            }
            if(vm.oid){//编辑提交
                params.id=vm.oid;
                API.upDateWorkOrder(params,function(data){
                    if(data.code == 200){
                        dcrmAlertSuccess(data.msg);
                        setTimeout(function(){
                          window.location.href = "/view/customer/workOrder/workOrder.html";
                        },1000)
                    }
                    else{
                        dcrmAlertError(data.msg);

                    }
                })
            }else{//新建提交
                API.createWorkOrder(params,function(data){
                    if(data.code == 200){
                        dcrmAlertSuccess(data.msg);
                        setTimeout(function(){
                            window.location.href = "/view/customer/workOrder/workOrder.html";
                        },1000)
                    }
                    else{
                        dcrmAlertError(data.msg);

                    }
                })
            }

        },
        //取消
        cancelpage: function() {
            window.location.href = "/view/customer/workOrder/workOrder.html";
        }
    }
});




