var isCard=window.location.search.split('&')[0].split('=')[0];
$(function(){
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_flashtouch").find("a").addClass("active");
    if(isCard=='?isCard'){//创建名片页面过来

        $('.flashSMSCard').click();
        vm.flashSMSCard()
    }else if(isCard=='?index'){//首页过来
         $('.indexList').click();
         vm.smsSendLog(0,20);
    }else{
          vm.smslist(0,20,2);//查询弹信模板列表并分页
    }


});
console.log(isCard);

//查询弹信模板列表并分页
var vm = new Vue({
    el: "#tanxinpage",
    data: {
        smsLists: [],//弹信模板列表
        pages:"",//弹信模板列表分页
        sendgroup:"",//发送群组
        recordlists:[],//发送记录列表
        sendpages:'',//发送记录列表分页
        micropageid:'',//id
        title:'',//复制的标题
        copyShow:false,//复制弹窗
        testShow:true,//测试
        filterShow:false,
        phone:'',//测试的手机号码
        errorContent:'审核失败了',
        addtitle:'',
        reasonandnum:'',//发送失败原因
    },
    methods: {
        //权限的方法
        hasPermission:Global.hasPermission,
        //弹信模板列表页
        smslist: function(page,size,type) {
            if(type == 2){
                $('.rightAdd').removeClass('hide');
                this.addtitle='+创建模板';
                var SId;//弹信模板的id
                $.each(Global.menuList, function (e, f) {
                    if (f.resName == "弹信模板") {
                        SId = f.id;
                    }
                });
            }
            if(type == 1){
                $('.rightAdd').removeClass('hide');
                this.addtitle='+创建名片';
                var SId;//弹信名片的id
                $.each(Global.menuList, function (e, f) {
                    if (f.resName == "弹信名片") {
                        SId = f.id;
                    }
                });
            }

            this.filterShow=false;
            var data = {
                "pageIndex": page,
                "pageSize": size,
                "flashType":type
            };

            MaskUtil.Loading();
            API.showTempList(data, function(data) {
                if (data.code == 200) {
                    vm.smsLists = data.data.pageData.list;
                    vm.pages = data.data.pageData.page;
                    if(vm.smsLists.length != 0){
                        if(page==0){
                            if(type==2){
                                $('.ui-paging-container').remove();
                                $('#flashListpage').Paging({pagesize:20,count:vm.pages.total,toolbar:true,callback:function(page,size){
                                    vm.smslist(page,size,type);
                                }});
                            }else{
                                $('.ui-paging-container').remove();
                                $('#flashSMSCardpage').Paging({pagesize:20,count:vm.pages.total,toolbar:true,callback:function(page,size){
                                    vm.smslist(page,size,type);
                                }});
                            }

                        }
                    }

                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();

                setTimeout(function(){
                   $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)

            });
        },
        //跳转到编辑页
        editpage:function(id,type){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/edit.html?id="+id+'&type='+type;
        },
        //跳转到新建页面
        newlyData:function(){
            if($('.rightAdd').html()=='+创建模板'){
                window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/edit.html";
            }else{
                window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/edit.html?isCard=true";
            }
            /*API.getParam({}, function(res) {
                if (res.code == 200) {
                    if($('.rightAdd').html()=='+创建模板'){
                        window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/edit.html";
                    }else{
                        window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/edit.html?isCard=true";
                    }
                } else {
                    dcrmAlertError(res.msg);
                }
            });*/
        },
        //获取群组
        getGroup:function(){
            $("#sendgroup").empty();
            $(".custNum").html("");
            var data = {
            };

            vm.sendgroup ="<option value=''>请选择</option>";
            API.microGroup(data, function(data){
                if(data.code == 200) {
                    var lists = data.data.list;
                    $.each(lists,function(i,v){
                        vm.sendgroup += "<option value='"+v.id+"' data-custNum='"+ v.custNum+"' >"+v.groupName+"</option>";
                    });
                }

            });
        },
        //发送记录列表页面
        smsSendLog:function(page,size,flashName,ideaFlashId){
            this.addtitle='';
            $('.rightAdd').addClass('hide');
            this.filterShow=true;
            var data = {
                "pageIndex": page,
                "pageSize": size,
                "flashName":flashName,
                'ideaFlashId':ideaFlashId

            }
            MaskUtil.Loading();
            API.tempSendList(data, function(data) {
                if (data.code == 200) {
                    vm.recordlists = data.data.pageData.list;
                    vm.sendpages = data.data.pageData.page;
                    if(vm.recordlists.length != 0){
                        if(page==0){
                            $("#sendrecordpage").find('.ui-paging-container').eq(0).remove();
                            $('#sendrecordpage').Paging({size:vm.sendpages.pageSize,count:vm.sendpages.total,toolbar:true,callback:function(page,size){
                                vm.smsSendLog(page,size,flashName,ideaFlashId);
                            }});
                        }
                    }

                }else{
                    dcrmAlertError(data.msg);
                }

                MaskUtil.RemoveLoading();
                setTimeout(function(){
                    $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)
            });
        },
        //审核弹信
        verifyData:function(flashType,id){
            console.log(flashType);
            var that = this;
            var data = {
                id: id
            };
            console.log(data);
            API.editTempById(data, function (res) {
                if (res.code == 200) {
                    dcrmAlertSuccess("弹信已提交审核，审核时间大概为24小时，请耐心等待！");
                    $(".popover").hide();
                    that.$options.methods.smslist(0,20,flashType);
                } else {
                    dcrmAlertError(res.msg);
                }
            });
        },

        //测试弹窗
        testPopup:function(id){
            this.micropageid = id;
            this.copyShow = true;
            this.testShow = false;
            this.phone = '';
        },
        //测试弹信
        testData:function(id){
            var that = this;
            var data = {
                id:vm.micropageid,
                phone:vm.phone
            };
            //var reg=/^((13[0,1,2,4,5,6,7,8,9]\d{8}$)|(15[0,1,2,5,6,7,8,9]\d{8}$)|(18[2,3,4,5,6,7,8]\d{8}$)|(14[5,7]\d{8})|(176\d{8})$)/;

            if(vm.phone == ''){
                dcrmAlertWarning("手机号码不能为空!");
                return false;
            }
            // else if(!reg.test(vm.phone)){
            //     dcrmAlertWarning("请输入移动或联通号码！");
            //     return false;
            // }
            MaskUtil.Loading();
            API.tempSingleSend(data, function(res) {
                if (res.code == 200) {
                    dcrmAlertSuccess(res.msg);
                    that.copyShow = false;
                }else{
                    dcrmAlertError(res.msg);
                    that.copyShow = false;
                }
                MaskUtil.RemoveLoading();
            });
        },
        //发送弹信
        sendData:function(id){
            vm.getGroup();//获取群组
            console.log(vm.sendgroup)
            setTimeout(function(){
                var txt=  '<select type="text" class="form-control" id="sendgroup">' +
                    ''+vm.sendgroup+''+
                    '</select>'+
                    '<div style="padding-left: 7px;text-align: left;font-size: 14px;line-height:50px">发送人数：<span class="custNum"></span>'+
                    /*'<div id="flashNum">您已发送<span id="totalNum"></span>条/<span id="totalMon"></span>天，剩余<span id="residueNum"></span>条可以发送。</div>'+*/
                    '</div>';
                //人数
                $("body").delegate("#sendgroup","change",function(){
                    var val = $(this).val();
                    var cus = $(this).find("option[value="+val+"]").attr("data-custNum");
                    $(".custNum").html(cus);
                })
                // 剩余条数统计
                /*var data={
                    flashSmsLogId:id
                }
                MaskUtil.Loading();
                API.timeCount(data, function(res) {
                    if (res.code == 200) {
                        $('#totalNum').html(Number(res.data.yfday));
                        $('#residueNum').html(res.data.syday)
                    }else{
                            dcrmAlertError(res.msg)
                    }
                    MaskUtil.RemoveLoading();
                });*/
                // 点击确定按钮发送
                var option = {
                    title: "发送对象",
                    onOk: function(){
                        var data = {
                            id:id,
                            groupId:$("#sendgroup").val()
                        };
                        if(data.groupId==''){
                            dcrmAlertWarning('发送群组不能为空');
                            return;
                        }
                        API.tempGroupSend(data, function(res) {
                            if (res.code == 200) {
                                dcrmAlertSuccess(res.msg);
                            }else{
                                dcrmAlertError(res.msg);
                            }
                        });
                    }
                }
                window.wxc.xcConfirm(txt, "custom", option);
            },500);
        },
        //删除
        deleteData:function(id,title){
            var that = this;
            var data = {
                id:id
            };
            dcrmConfirm("您确定要删除'"+title+"'弹信模板吗？",function(){
                MaskUtil.Loading();
                API.delTempById(data, function(res) {
                    if (res.code == 200) {
                        $('.ui-paging-container').eq(0).remove();
                        dcrmAlertSuccess("删除成功!");
                        if(that.addtitle=='+创建模板'){
                          that.$options.methods.smslist(0,20,2);
                        }else{
                          that.$options.methods.smslist(0,20,1);
                        }

                    }else{
                        dcrmAlertError(res.msg);
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        },

        //关闭弹窗
        closeData:function(){
            this.copyShow = false;
        },
        // 弹信名片
        flashSMSCard:function(){
            this.addtitle='+创建名片';
            console.log(this.addtitle);
            this.filterShow=false;
            vm.smslist(0,20,1);
        },
        // 发送记录重置
        reset:function(){
            $('.flashName').val('');
            vm.smsSendLog(0,20,'');
        },
        // 发送记录搜索
        searchSend:function(){
            var name=$('.flashName').val();
            vm.smsSendLog(0,20,name);
        },
        chakan:function(id,clickname){
            $('.flashName').val(clickname);
            vm.smsSendLog(0,20,null,id);
        },
        // 弹信失败接口
        queryFlashSendBedReason:function(id){
            var data={
                flashSmsLogId:id
            };
            API.queryFlashSendBedReason(data, function(res) {
                if (res.code == 200) {
                    if(res.data.data.length!=0){
                       vm.reason=res.data.data[0].reason;
                       var str=''
                       $.each(res.data.data,function(index,item){
                        str+='<p><span>'+item.reason+'</span><span>: '+item.totle+'人</span></p>'
                       })
                        vm.reasonandnum=str;
                   }else{
                       vm.reasonandnum='';
                   }

                }else{
                    dcrmAlertError(res.msg);
                }
            });
        }
    }
});





