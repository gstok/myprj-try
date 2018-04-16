$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_clue").find("a").addClass("active");
    $(function () {
        $.jeDate("#startTime",{
            format:"YYYY-MM-DD",
            isTime:false,
            minDate:"0000-00-10"
        })
    });
})
console.log(111)
var vm = new Vue({
    el: "#workOrderpage",
    data: {
        title:'',//需求标题
        dataNumLimit:'',//需求量
        startTime:'',//需求单开始时间
        dayNum:'',//需求单有效天数
        status:'',//需求状态
        userName:'',//提交人
        submitTime:'',//提交时间
        returnTime:'',//返回时间
        dataNum:'',//返回线索条数
        allTitle:'',//总标题
        oid:''
    },
    methods: {
        see:function(){

            this.oid=window.location.search.split('=')[1];

            if(this.oid){
                vm.allTitle='编辑需求';

            }else{
                vm.allTitle='创建需求';
            }
            var data={};
            // 预测基础标签项
            MaskUtil.Loading();
            API.orderCommon(data,function(data){
                if(data.code == 200){
                    var obj=data.data.list;
                    var contactStr='<span>触达方式</span>';
                    var ageStr='<span>预测年龄段</span>';
                    var sexStr='<span>预测性别</span>';
                    var culturalStr='<span>预测文化水平</span>';
                    var maritalStr='<span>预测婚姻状况</span>';
                    var elseStr='<span>其他&#12288;&#12288;</span>';

                    $.each(obj,function(index,item){

                        if(item.category=='触达方式'){
                            contactStr+='<input type="checkbox" name="" id="'+item.attrKey+'"><label for="phone">'+item.custAttrName+'</label>'
                        }else if(item.category=='预测年龄段'){
                            var ageArr=item.attrVal.split(';');
                            var optionList='<option value="">请选择</option>';

                            $.each(ageArr,function(i,u){
                                optionList+='<option value='+u+'>'+u+'</option>';
                            })

                            ageStr+='<select name="" id="'+item.attrKey+'" class="hyType">'+optionList+'</select>'
                        }else if(item.category=='预测文化水平'){
                            if(item.attrVal !=null&&item.attrVal!=''){
                                var culturalArr=item.attrVal.split(';');
                                $.each(culturalArr,function(i,u){
                                    culturalStr+='<input type="checkbox" name="" id="cultural'+i+'" class="cultural'+i+'" dataClass="cultural"><label for="cultural'+i+'" class="cultural'+i+'">'+u+'</label>'
                                })
                            }else{
                                culturalStr = '';
                            }


                        }else if(item.category=='预测性别'){
                            var sexArr=item.attrVal.split(';');
                            var optionList='<option value="">请选择</option>';

                            $.each(sexArr,function(i,u){
                                optionList+='<option value='+u+'>'+u+'</option>';
                            })

                            sexStr+='<select name="" id="'+item.attrKey+'" class="hyType">'+optionList+'</select>'

                        }else if(item.category=='预测婚姻状况'){
                            var maritalArr=item.attrVal.split(';');
                            $.each(maritalArr,function(i,u){
                                maritalStr+='<input type="checkbox" name="" id="marital'+i+'" class="marital'+i+'" dataClass="marital"><label for="marital'+i+'" class="marital'+i+'">'+u+'</label>'
                            })


                        }else if(item.category=='其他'){
                            var elseArr=item.attrVal.split(';');
                            // if(item.custAttrName=='是否有房'){
                                $.each(elseArr,function(i,u){
                                    elseStr+='<input type="checkbox" name="" id="'+item.attrKey+i+'" class="'+item.attrKey+i+'" dataClass="'+item.attrKey+'"><label for="'+item.attrKey+i+'" class="'+item.attrKey+i+'">'+u+'</label>'
                                })
                            // }


                        }else if(item.custAttrName=='预测所在地'){
                                $('#targetTop').removeClass('hide');
                        }
                    })

                }

                $('#contact').html(contactStr);
                $('#sexList').html(sexStr)
                $('#ageList').html(ageStr)
                $('#culturalList').html(culturalStr)
                $('#maritalList').html(maritalStr)
                $('#elseList').html(elseStr)
                MaskUtil.RemoveLoading();

            });

            //三级菜单
            var firstStr='<option value="">请选择</option>';
            var secondStr='';
            var thirdStr='';
            var islevel3=false;
            MaskUtil.Loading();
            API.getBigIndustry(data,function(data){
                var obj=data.data.confIndustry;
                $.each(obj,function(index,item){
                    firstStr+='<option value="'+item.id+'">'+item.name+'</option>'
                })
                $('#firstIndustry').html(firstStr);

                //一级变更，显示二级
                $('#firstIndustry').change(function(){
                    $('.twoStage').show();
                    $('#secondIndustry_ms').show();
                    var name=$(this).val();
                    secondStr='';
                    $.each(obj,function(index,item){
                        if(item.id==name){
                            if(item.category){
                                var arr=JSON.parse(item.category);
                                $.each(arr,function(i,u){
                                    secondStr+='<option value="'+u.name+'">'+u.name+'</option>'
                                });
                            }
                        }
                    })
                     $('#secondIndustry').html(secondStr);
                     //更新插件
                     $("#secondIndustry").multiselect("refresh");
                    // 显示行业标签，先隐藏
                    if(name){
                      var shh={
                        id:name
                        };

                        API.orderIndustry(shh,function(data){
                            var shhstr='';
                            var shhobj=data.data.list;
                            if(shhobj){
                                $.each(shhobj,function(m,n){
                                    shhstr+='<input type="checkbox" name="" id="'+n.attrKey+'"><label for="'+n.attrKey+'">'+n.custAttrName+'</label>'
                                })
                            }

                            $('.shh').html(shhstr);
                            $('.shh').hide();
                        })
                    }

                    // 二级细分变更,显示三级
                    $('#secondIndustry').change(function(){
                        $('.threeStage').show();
                        $('#thirdIndustry_ms').show();
                        thirdStr='';

                        var secondNameArr=$(this).val();
                        $.each(obj,function(index,item){
                            if(item.id==name){
                                if(item.category&&item.category.length!=0){
                                    console.log(item.category);
                                    var arr=JSON.parse(item.category);
                                    $.each(arr,function(e,f){
                                        if(secondNameArr){
                                            $.each(secondNameArr,function(a,b){
                                                if(b==f.name){
                                                    if(f.category&&f.category.length!=0){//三级存在
                                                        console.log(f.category);
                                                        islevel3=true;
                                                        var secondArr=f.category;
                                                        $.each(secondArr,function(g,h){
                                                         thirdStr+='<option value="'+h+'">'+h+'</option>'
                                                        });
                                                    }else{
                                                        islevel3=false;
                                                    }
                                                }
                                            })
                                        }else{
                                            thirdStr='';
                                        }

                                    })

                                    $('#thirdIndustry').html(thirdStr);
                                    $('#thirdIndustry').multiselect("refresh");
                                    //更新插件
                                    if(islevel3){
                                        //三级存在，则在选择三级后显示行业标签
                                        $('#thirdIndustry').change(function(){
                                             $('.shh').show();
                                        })
                                    }else{
                                        $('.threeStage').hide();
                                        $('#thirdIndustry_ms').hide();
                                        $('.shh').show();
                                    }

                                }

                            }
                        })

                    })

                })
                MaskUtil.RemoveLoading();
            });

            // 获取省
            var data={};
            MaskUtil.Loading();
            API.getProvince(data,function(data){
                var province=data.data.province;
                var str=''
                $.each(province,function(index,item){
                    str+='<option value='+item.code+'>'+item.name+'</option>';
                })
                $('#province').html(str);
                setTimeout(function(){
                    $("#province").multiselect("refresh");

                },50)
                MaskUtil.RemoveLoading();
            })

            // 省改变获取市
            $('#province').change(function(){
                var fCode=$(this).val();
                console.log(fCode)
                $('#city').html('');
                if(fCode){
                    var item=fCode.join(',');
                    // 去掉最后一个逗号
                    item=(item.substring(item.length-1)==',')?item.substring(0,item.length-1):item;
                   // $.each(fCode,function(index,item){
                        var data={
                             fCode:item
                        }
                        API.getCity(data,function(data){
                            var citys=data.data.city;
                            $.each(citys,function(index,item){
                               $('#city').append('<option value='+item.code+'>'+item.name+'</option>');
                            })

                            setTimeout(function(){
                                $("#city").multiselect("refresh");
                            },50)
                        })

                }else{
                    $('#city').html('');
                }

            })

            if(this.oid){
                // 编辑修改需求还原
                var bdata={
                    id:this.oid
                };
                MaskUtil.Loading();
                API.viewWorkOrder(bdata,function(data){
                    if(data && data.code == 200){
                        vm.title=data.data.workOrder.title;
                        vm.dataNumLimit=data.data.workOrder.dataNumLimit;
                        vm.dayNum=data.data.workOrder.dayNum;

                        function add0(m){return m<10?'0'+m:m }

                        var time = new Date(data.data.workOrder.startTime);
                        var y = time.getFullYear();
                        var m = time.getMonth()+1;
                        var d = time.getDate();
                        vm.startTime =  y+'-'+add0(m)+'-'+add0(d);






                        // 自定义标签回显
                        $('.customInput').val(data.data.workOrder.customTag);
                        var content=JSON.parse(data.data.workOrder.content);
                        console.log(content);
                        for(var p in content){
                            if(content[p]=='checkbox'){//如果是复选框
                                $('#'+p).attr('checked',true);

                            }else if(p=='marital'){

                                getchecked('marital');
                                getchecked('cultural');
                                getchecked('is_has_car');
                                getchecked('is_has_child');
                                getchecked('is_has_room');
                                function getchecked(arr){
                                    if(content[arr]){
                                        var arr=content[arr].split(',');
                                        $.each(arr,function(i,u){
                                            console.log($('label').length);
                                            $.each($('label'),function(index,item){
                                                if($(item).html()==u){
                                                    var labelClass=$(item).attr('class');
                                                    $('input[class="'+labelClass+'"]').attr('checked',true)
                                                }
                                            })
                                        })
                                    }

                                }


                            }else if(p=='industryId'){//如果是行业标签
                                var arr=content.industryId.split(',');
                                $('#firstIndustry').val(arr[0]);
                                $('#firstIndustry').change();

                                // 二级细分
                                if(arr.length>2){//如果有三级的情况
                                    var secondArr=arr[1].split('/');
                                    $.each(secondArr,function(i,u){
                                        $('#secondIndustry').find('option[value="'+u+'"]').attr('selected',true);
                                        $("#secondIndustry").multiselect("refresh");
                                        $('#secondIndustry').change();

                                    });

                                    // 三级细分
                                    var thirdArr=arr[2].split('/');
                                    $.each(thirdArr,function(i,u){
                                        $('#thirdIndustry').find('option[value="'+u+'"]').attr('selected',true);
                                        $("#thirdIndustry").multiselect("refresh");
                                        $('#thirdIndustry').change();


                                    })
                                }else{//如果只有二级，没有三级
                                    if(arr[1]){
                                        var secondArr=arr[1].split('/');
                                        $.each(secondArr,function(i,u){
                                            $('#secondIndustry').find('option[value="'+u+'"]').attr('selected',true);
                                            $("#secondIndustry").multiselect("refresh");
                                            $('#secondIndustry').change();

                                        })
                                    }

                                }

                                for(var a in content){
                                    if(content[a]=='checkbox'){//如果是复选框
                                        $('#'+a).attr('checked',true);
                                    }
                                }
                            }else{//如果是下拉框
                                if(p=='city'){//如果是城市

                                    if(content[p]){
                                        $('#targetTop').removeClass('hide');
                                        console.log(content[p])
                                        var code=content[p].split(',');
                                        var arr=[];

                                        $.each(code,function(index,item){
                                            //省还原
                                            if(item.indexOf("-") > 0){
                                                console.log(item.split('-')[0]);
                                                var provinceEle=$('#province').find('option[value="'+item.split('-')[0]+'"]')
                                            }else{
                                                console.log(item.split('/')[0]);
                                                var provinceEle=$('#province').find('option[value="'+item.split('/')[0]+'"]')
                                            }

                                            provinceEle.attr('selected',true);
                                            $("#province").multiselect("refresh");

                                            // 市还原
                                            arr.push(item.split('/')[0])

                                        })
                                        $('#province').change();
                                        console.log(arr)
                                        $('#city').val(arr);
                                        $("#city").multiselect("refresh");
                                    }else{
                                        $('#targetTop').addClass('hide')
                                    }

                                }else{
                                    $('#'+p).val(content[p]);
                                }

                            }
                        }
                    }else{
                        dcrmAlertWarning(data.msg);
                    }

                    MaskUtil.RemoveLoading();
                })
            }
        },
        //取消
        cancelpage: function() {
            window.location.href = "/view/customer/workOrder/workOrder.html";
        },
        //暂存
        savenow: function() {
            var param={};
            var data={};

           //获取基础标签
            // 特殊checkbox传值封装
            function getparam(elename){
                var str='';
                var eles= $('input[dataClass="'+elename+'"]');
                $.each(eles,function(i,u){
                   if( $(u).is(':checked') ){
                        var classcon=$(u).attr('class');
                        str+=$('label[class="'+classcon+'"]').html()+',';

                   }
                })

                str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
                console.log(str)
                param[elename]=str;
            }
            API.orderCommon(data,function(data){
                var arr=data.data.list;

                if(arr.length){
                    for (var i =0;i< arr.length; i++) {
                        var str='';
                        if(arr[i].custAttrName=='预测文化水平'){
                            getparam('cultural');
                        }else if(arr[i].custAttrName=='婚姻'){
                            getparam('marital')
                        }else if(arr[i].category=='其他'){
                            getparam('is_has_room');
                            getparam('is_has_car');
                            getparam('is_has_child')
                        }
                        else{
                           if(arr[i].attrType!='checkbox'){
                                var p=arr[i].attrKey;
                                param[p]=$('#'+p+'').val()

                            }else{
                                var p=arr[i].attrKey;
                                if( $(":checkbox[id='"+p+"']").is(':checked') ){
                                    param[p]='checkbox'
                                }
                            }
                        }
                    }
                }
            })
            //获取三级行业标签
            param.industryId='';
            var oneStr='';
            var twoStr='';
            var thirdStr='';

            var oneStr=$('#firstIndustry').val();
            var twoArr=$('#secondIndustry').val();
            var thirdArr=$('#thirdIndustry').val();
            if(twoArr&&thirdArr){
                if(twoArr.length==1){
                    twoStr=twoArr[0]
                }else if(twoArr.length>1){
                    twoStr=twoArr.join('/');
                }
                if(thirdArr.length==1){
                    thirdStr=thirdArr[0]
                }else if(thirdArr.length>1){
                    thirdStr=thirdArr.join('/')
                }
                param.industryId=oneStr+','+twoStr+','+thirdStr;
            }else{
                if(twoArr&&thirdArr==null){
                     if(twoArr.length==1){
                            twoStr=twoArr[0]
                        }else if(twoArr.length>1){
                            twoStr=twoArr.join('/');
                        }
                    param.industryId=oneStr+','+twoStr
                }else if(twoArr==null){
                    param.industryId=oneStr
                }
            }
            param.industryId=oneStr+','+twoStr+','+thirdStr;

            // 获取省市的值

            var allStr='';
            var provinceStr=$('#province').val();
            var cityStr=$('#city').val();

            if(cityStr){
                allStr=$('#city').val().join(',')
            }else if(provinceStr&&cityStr==null){
               allStr=$('#province').val().join(',')
            }
            param.city=allStr;

            //行业最下方
            if(oneStr){
                var adata={
                    id:oneStr
                };
                API.orderIndustry(adata,function(data){
                    var arr=data.data.list;
                    console.log(arr);
                    if(arr.length){
                        for (var i =0;i< arr.length; i++) {
                            if(arr[i].attrType!='checkbox'){
                                var p=arr[i].attrKey;
                                param[p]=$('#'+p+'').val()
                            }else{
                                var p=arr[i].attrKey;
                                if( $(":checkbox[id='"+p+"']").is(':checked') ){
                                    param[p]='checkbox'
                                }
                            }
                        }
                    }
                })
            }

            var params={
                'title':vm.title,
                'dataNumLimit':vm.dataNumLimit,//需求量
                'startTime':Date.parse($("#startTime").val()),//开始时间
                'dayNum':vm.dayNum,//需求单有效天数
                'status':0,
                'content':JSON.stringify(param),
                'customTag':$('.customInput').val()
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






            if(this.oid){//编辑暂存
                params.id=this.oid;
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
            }else{//新建暂存
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
        //提交
        savepage: function() {
             var param={};
            var data={};
            //获取基础标签
            API.orderCommon(data,function(data){
                var arr=data.data.list;
                console.log(arr);
                if(arr.length){
                    for (var i =0;i< arr.length; i++) {
                        if(arr[i].attrType!='checkbox'){
                            var p=arr[i].attrKey;
                            param[p]=$('#'+p+'').val()
                        }else{
                            var p=arr[i].attrKey;
                            if( $(":checkbox[id='"+p+"']").is(':checked') ){
                                param[p]='checkbox'
                            }

                        }
                    }
                }
            });
            //获取三级行业标签
            param.industryId='';
            var oneStr='';
            var twoStr='';
            var thirdStr='';

            var oneStr=$('#firstIndustry').val();
            var twoArr=$('#secondIndustry').val();
            var thirdArr=$('#thirdIndustry').val();
            if(twoArr&&thirdArr){
                if(twoArr.length==1){
                    twoStr=twoArr[0]
                }else if(twoArr.length>1){
                    twoStr=twoArr.join('/');
                }
                if(thirdArr.length==1){
                    thirdStr=thirdArr[0]
                }else if(thirdArr.length>1){
                    thirdStr=thirdArr.join('/')
                }
                param.industryId=oneStr+','+twoStr+','+thirdStr;
            }else{
                if(twoArr&&thirdArr==null){
                     if(twoArr.length==1){
                            twoStr=twoArr[0]
                        }else if(twoArr.length>1){
                            twoStr=twoArr.join('/');
                        }
                    param.industryId=oneStr+','+twoStr
                }else if(twoArr==null){
                    param.industryId=oneStr
                }
            }

            // 获取省市的值
            param.city='';
            var cityStr='';
            var provinceStr=$('#province').val();
            var cityStr=$('#city').val();
            if(cityStr){
                cityStr=$('#city').val().join(',')
            }else if( provinceStr&&!cityStr){
                cityStr=$('#province').val().join(',')
            }
            param.city=cityStr;

            //行业最下方
            if(oneStr){
                var adata={
                    id:oneStr
                };
                API.orderIndustry(adata,function(data){
                    var arr=data.data.list;
                    console.log(arr);
                    if(arr.length){
                        for (var i =0;i< arr.length; i++) {
                            if(arr[i].attrType!='checkbox'){
                                var p=arr[i].attrKey;
                                param[p]=$('#'+p+'').val()
                            }else{
                                var p=arr[i].attrKey;
                                if( $(":checkbox[id='"+p+"']").is(':checked') ){
                                    param[p]='checkbox'
                                }
                            }
                        }
                    }
                })
            }

            // 省市

            console.log(param);
            // 提交需求
            var params={
                'title':vm.title,
                'dataNumLimit':vm.dataNumLimit,//需求量
                'startTime':Date.parse($("#startTime").val()),//开始时间
                'dayNum':vm.dayNum,//需求单有效天数
                'status':1,
                'content':JSON.stringify(param)
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
            if(this.oid){//编辑提交
                params.id=this.oid;
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

        }
    }
});

vm.see();


