/**
 * Created by Administrator on 2018/3/8 0008.
 */
//筛选器显示
function filterEvent(){
    // 一级改变，显示二级
    $('.filterFirst').change(function(){

        var filterName=$(this).val();
        var data={
            type:filterName
        };
        var that=$(this);
        that.parent().find('.filterThird').html('<select  name="" ><option value="">请选择</option></select>');

        API.getSecondFilter(data, function(data) {
            // 获取二级框
            if(filterName!='area'){//如果不是省市


                that.parent().find('.filterSecond').show();
                var secondStr='<option value="">请选择</option>';
                var thirdStr=''
                var obj=data.data.data;
                $.each(obj,function(index,item){
                    secondStr+='<option data-scope="'+item.scope+'"  attr-type="'+item.attrType+'" attr-name="'+item.name+'" value="'+item.cd+'">'+item.name+'</option>';

                });
                that.parent().find('.filterSecond').html('<select  name="" >'+secondStr+'</select>');
                // 如果是客户来源或者销售阶段，则隐藏二级选择框
                if(filterName=='stage'){
                    var data={
                        cd:'销售阶段'
                    };
                    that.parent().find('.filterSecond').hide();
                    API.getCustStage(data, function(data) {
                        var obj=data.data.data;
                        if(obj&&obj.length>0){
                            $.each(obj,function(index,item){
                                thirdStr+='<option  value="'+item.id+'">'+item.name+'</option>'
                            })
                        }

                    })
                }else if(filterName=='source'){
                    var data={
                        cd:'客户来源'
                    };
                    that.parent().find('.filterSecond').hide();
                    API.getCustsource(data, function(data) {
                        var obj=data.data.data;
                        if(obj&&obj.length>0){
                            $.each(obj,function(index,item){
                                thirdStr+='<option  value="'+item+'">'+item+'</option>'
                            })
                        }

                    })
                }
                that.parent().find('.filterThird').html('<select multiple="multiple" name="" class="thirdVal multiple">'+thirdStr+'</select>');
                $(".thirdVal.multiple").multiselect({
                    noneSelectedText: "请选择",
                    selectedList: 1000000,
                    minWidth:150
                });

            }else{
                // 获取省
                that.parent().find('.filterSecond').show();
                var secondStr='';
                MaskUtil.Loading();
                API.getProvince(data,function(data){
                    var province=data.data.province;

                    $.each(province,function(index,item){
                        secondStr+='<option value='+item.code+'>'+item.name+'</option>';
                    });
                    that.parent().find('.filterSecond').html('<select multiple="multiple" name="" class="secondVal multiple">'+secondStr+'</select>');

                    MaskUtil.RemoveLoading();
                    $(".secondVal.multiple").multiselect({
                        noneSelectedText: "请选择",
                        selectedList: 1000000,
                        minWidth:150
                    });

                    $(".secondVal.multiple").multiselect("refresh");
                    // 省改变获取市
                    $(".secondVal.multiple").change(function(){
                        var thirdStr='';
                        var fCode=$(this).val()
                        if(fCode){
                            $.each(fCode,function(index,item){
                                var data={
                                    fCode:item
                                }
                                API.getCity(data,function(data){
                                    var citys=data.data.city;
                                    $.each(citys,function(index,item){
                                        thirdStr+='<option value='+item.code+'>'+item.name+'</option>';
                                    });
                                    that.parent().find('.filterThird').html('<select multiple="multiple" name="" class="thirdVal multiple">'+thirdStr+'</select>');
                                    $(".thirdVal.multiple").multiselect({
                                        noneSelectedText: "",
                                        selectedList: 1000000,
                                        minWidth:150
                                    });

                                    setTimeout(function(){
                                        that.parent().find('.filterThird select').multiselect("refresh");
                                    },50);
                                })

                            })
                        }

                    })
                })
            }

        })


    })
    // 二级改变，显示三级
    $('body').unbind('change').on('change','.filterSecond select',function(){
        // $('.filterSecond select').change(function(){
        console.log($(this).parent().siblings('.filterFirst'));
        var that=$(this).parent().siblings('.filterFirst');
        var filterName=that.val();
        var secondName=$(this).val();
        var type=that.parent().find('.filterSecond').find('option[value="'+secondName+'"]').attr('attr-type');
        var thirdStr='';

        var data={
            cd:secondName
        };
        if(filterName=='event'){//事件
            that.parent().find('.filterFourth').removeClass('hide');
        }else{
            that.parent().find('.filterFourth').addClass('hide');
        }
        if(type=='select'){
            if(filterName=='event'){//事件
                console.log(filterName);
                API.getCustIdea(data, function(data) {
                    var obj=data.data.data;
                    if(obj&&obj.length>0){
                        $.each(obj,function(index,item){
                            thirdStr+='<option  value="'+item.id+'">'+item.name+'</option>'
                        })
                    }

                })

            }
            else if(filterName=='area'){//所在地区

                var fCode= that.parent().find('.filterSecond').val()
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
                if(secondName == 'user_name'){
                    API.selectExecutorUser({},function(data){
                        if(data.code == 200){
                            //获取全部负责人
                            var userListObj=data.data.data;
                            // thirdStr = '<option value="">全部负责人</option>';
                            thirdStr = '';
                            $.each(userListObj,function(index,item){
                                if(item.id == Global.userId){
                                    thirdStr+='<option value="'+item.id+'">我的客户</option>'
                                }else{
                                    thirdStr+='<option value="'+item.id+'">'+item.userName+'</option>'
                                }
                            });
                            thirdStr+='<option value="0">未分配</option>';
                        }
                    });
                }else{
                    API.getAttrVal(data, function(data) {
                        if(data.data){
                            var obj=data.data.attrVal;
                            if(obj){
                                $.each(obj,function(index,item){
                                    thirdStr+='<option  value="'+item+'">'+item+'</option>'
                                })
                            }
                        }
                    });
                }
            }
            that.parent().find('.filterThird').html('<select multiple="multiple" name="" class="thirdVal multiple">'+thirdStr+'</select>');
        }
        else if(type=='tag_select'){//模糊搜索  华坤标签
            that.parent().find('.filterThird').html('<input type="text" class="TagNamebox" id="TagName"  placeholder="请输入标签" autocomplete="off" data-provide="typeahead"/>')

            API.getAttrVal(data, function(data) {
                if(data.data){
                    var obj=data.data.attrVal;
                    if(obj){
                        $('.TagNamebox').typeahead({
                            source: obj,
                            display: 'TagName',
                            val: 'TagName',
                            minLength: 2
                        });
                    }
                }
            });
        }
        else if(type=='text'){//文本类型

            that.parent().find('.filterThird').html('<input class="thirdVal" type="text">')

        }
        else if(type=='date'){//日期类型
            that.parent().find('.filterThird').html('<input type="text"  class="wicon thirdstart"  placeholder="选择日期" readonly >-<input type="text"  class="wicon thirdend"  placeholder="选择日期" readonly >')
        }
        else if(type=='digit'){//数字类型
            that.parent().find('.filterThird').html('<input class="thirddigitstart" type="text">-<input class="thirddigitend" type="text">')
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
        var _starthms = {
            //festival:true,//农历
            isinitVal:true,
            ishmsVal:false,
            format: 'YYYY-MM-DD',
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
            format: 'YYYY-MM-DD',
            maxDate: '2099-06-16', //×î´óÈÕÆÚ
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
        //$(".thirdstart,.thirdend").val('');


        var starthms_ = {
            //festival:true,//农历
            isinitVal:true,
            ishmsVal:false,
            format: 'YYYY-MM-DD',
            maxDate: $.nowDate({DD:0}),
            choosefun: function(elem,datas){
                endhms_.minDate = datas;
                endDateshms_();
            },
            okfun:function (elem,datas) {
                //alert(datas);
            }
        };
        var endhms_ = {
            isinitVal:true,
            ishmsVal:false,
            format: 'YYYY-MM-DD',
            maxDate: '2099-06-16', //×î´óÈÕÆÚ
            choosefun: function(elem,datas){
                starthms_.maxDate = datas; //½«½áÊøÈÕµÄ³õÊ¼ÖµÉè¶¨Îª¿ªÊ¼ÈÕµÄ×î´óÈÕÆÚ
            }
        };
        function endDateshms_() {
            endhms_.trigger = false;
            $(".fourthend").jeDate(endhms_);
        }
        $(".fourthstart").jeDate(starthms_);
        $(".fourthend").jeDate(endhms_);


        /**********高级搜索************/
    })

}
