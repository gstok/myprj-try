/**
 * Created by Administrator on 2017/6/7 0007.
 */
 var oid=window.location.search.split('=')[1];

$(function(){
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_emailtouch").find("a").addClass("active");
    vm.emailList(0,20);//查询邮件模板列表并分页
    if(oid){
        //alert(oid)
        $('.indexList').click();
        vm.emailsendLog(0,20);
    }
})
//查询邮件模板列表并分页
var vm = new Vue({
    el: "#emailpage",
    data: {
        emailLists: [],
        pages:"",
        emailsendLists:[],//发送记录
        sendpages:'',//发送记录分页
        micropageid:'',//id
        mailName:'',//复制的标题
        copyShow:false,//复制弹窗
        testShow:true,//测试
        toUser:'',//测试的邮箱名
    },
    methods: {
        //权限的方法
        hasPermission:Global.hasPermission,
        //获取群组
        getGroup:function(){
            $("#sendgroup").empty();
            $(".custNum").html("");
            var data = {
            };
            MaskUtil.Loading();
            vm.sendgroup ="<option value='' data-custNum='0'>请选择</option>";
            API.microGroup(data, function(data){
                if(data.code == 200) {
                    var lists = data.data.list;
                    $.each(lists,function(i,v){
                        vm.sendgroup += "<option value='"+v.id+"' data-custNum='"+ v.custNum+"' >"+v.groupName+"</option>";
                    });
                }
                MaskUtil.RemoveLoading();
            });
        },
        //跳转到编辑页
        editpage:function(id){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/email/emailedit.html?id="+id;
        },
        //跳转到新建页面
        newlyData:function(){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/email/emailedit.html";
        },
        //邮件模板列表页
        emailList: function(page,size) {
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.emailList(data, function(data) {
                if (data.code == 200) {
                    vm.emailLists = data.data.pageData.list;
                    vm.pages = data.data.pageData.page;
                    if(vm.emailLists.length !=0){
                        if(page==0){
                            $('#emailListpage').Paging({pagesize:20,count:vm.pages.total,toolbar:true,callback:function(page,size){
                                vm.emailList(page,size);
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
        //邮件发送记录
        emailsendLog:function(page,size){
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.emailsendLog(data, function(data) {
                if (data.code == 200) {
                    vm.emailsendLists = data.data.list;
                    vm.sendpages = data.data.page;
                    if(vm.emailsendLists.length !=0){
                        if(page==0){
                            $("#sendrecordpage").find('.ui-paging-container').eq(0).remove();
                            $('#sendrecordpage').Paging({size:vm.sendpages.pageSize,count:vm.sendpages.total,toolbar:true,callback:function(page,size){
                                vm.emailsendLog(page,size);
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
        })
        },
        //测试弹窗
        testPopup:function(id){
            this.micropageid = id;
            this.copyShow = true;
            this.testShow = false;
            this.toUser = '';
        },
        //测试
        testData:function(){
            var that = this;
            var data = {
                id:vm.micropageid,
                toUser:vm.toUser
            };
            if(vm.toUser == ''){
                dcrmAlertWarning("邮箱名不能为空!");
                return false;
            }
            MaskUtil.Loading();
            API.testSendEmail(data, function(res) {
                if (res.code == 200) {
                    dcrmAlertSuccess("测试发送成功!");
                    that.copyShow = false;
                }else{
                    dcrmAlertError("测试发送失败!");
                }
                MaskUtil.RemoveLoading();
            });
        },
        //发送
        sendData:function(id){
            if(Global.email == ''){
                dcrmAlertWarning('请在个人设置填写邮箱地址!');
                return;
            }
            vm.getGroup();//获取群组
            setTimeout(function(){
                var txt=  '<select type="text" class="form-control" id="sendgroup">' +
                    ''+vm.sendgroup+''+
                    '</select>'+
                    '<div style="padding-left: 7px;text-align: left;font-size: 14px;line-height:50px">发送人数：<span class="custNum"></span></div>';
                //人数
                $("body").delegate("#sendgroup","change",function(){
                    var val = $(this).val();
                    var cus = $(this).find("option[value="+val+"]").attr("data-custNum");
                    $(".custNum").html(cus);
                })
                var option = {
                    title: "发送对象",
                    onOk: function(){
                        var data = {
                            id:id,
                            groupId:$("#sendgroup").val()
                        };
                        if($("#sendgroup").val() == ''){
                            dcrmAlertWarning('请选择群组！');
                            return;
                        }
                        API.sendEmail(data, function(res) {
                            if (res.code == 200) {
                                dcrmAlertSuccess(res.msg);
                            }else{
                                dcrmAlertError(res.msg);
                            }
                        });
                    }
                }
                window.wxc.xcConfirm(txt, "custom", option);
            },500)

        },
        //复制弹窗
        copyPopup:function(id){
            this.micropageid = id;
            this.copyShow = true;
            this.testShow = true;
            vm.mailName = '';
        },
        //复制
        copyData:function(){
            var that = this;
            var data = {
                id:vm.micropageid,
                mailName:vm.mailName
            };
            if(vm.mailName == ''){
                dcrmAlertWarning("标题不能为空!");
                return false;
            }
            MaskUtil.Loading();
            API.copyEmail(data, function(res) {
                if (res.code == 200) {
                    $('.ui-paging-container').eq(0).remove();
                    dcrmAlertSuccess("复制成功!");
                    that.copyShow = false;
                    that.$options.methods.emailList(0,20);
                }else{
                    dcrmAlertError("复制失败");
                }
                MaskUtil.RemoveLoading();
            });
        },
        //删除
        deleteData:function(id,title){
            var that = this;
            var data = {
                id:id
            };
            dcrmConfirm("您确定要删除'"+title+"'邮件模板吗？",function(){
                MaskUtil.Loading();
                API.deleteEmail(data, function(res) {
                    if (res.code == 200) {
                        $('.ui-paging-container').eq(0).remove();
                        dcrmAlertSuccess("删除成功!");
                        that.$options.methods.emailList(0,20);
                    }else{
                        dcrmAlertError("删除失败!");
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        },
        //关闭弹窗
        closeData:function(){
            this.copyShow = false;
        }
    }
})

