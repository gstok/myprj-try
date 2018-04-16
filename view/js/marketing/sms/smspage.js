var oid = window.location.search.split('=')[1];
/**
 * Created by Administrator on 2017/6/7 0007.
 */
$(function() {
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class", "icon icon-jiantou");
    $(".marketli").find("ul #index_smstouch").find("a").addClass("active");
    vm.smslist(0, 20); //查询短信模板列表并分页
    if (oid) {

        $('.indexList').click();
        vm.smsSendLog(0, 20);
    }
});
//查询短信模板列表并分页
var vm = new Vue({
    el: "#smspage",
    data: {
        smsLists: [], //短信模板列表
        pages: "", //短信模板列表分页
        sendgroup: "", //发送群组
        recordlists: [], //发送记录列表
        sendpages: '', //发送记录列表分页
        micropageid: '', //id
        title: '', //复制的标题
        copyShow: false, //复制弹窗
        testShow: true, //测试
        phone: '', //测试的手机号码
        errorContent: '审核失败了',
        isAdmin: '', //是否管理员
    },
    methods: {
        //权限的方法
        hasPermission: Global.hasPermission,
        //短信模板列表页
        smslist: function(page, size) {
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.smslist(data, function(data) {
                if (data.code == 200) {
                    vm.smsLists = data.data.pageData.list;
                    vm.pages = data.data.pageData.page;
                    if (vm.smsLists.length != 0) {
                        if (page == 0) {
                            $("#smsListpage").find('.ui-paging-container').eq(0).remove();
                            $('#smsListpage').Paging({
                                pagesize: 20,
                                count: vm.pages.total,
                                toolbar: true,
                                callback: function(page, size) {
                                    vm.smslist(page, size);
                                }
                            });
                        }
                    }

                } else {
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
                setTimeout(function(){
                    $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)

            });
        },
        //跳转到编辑页
        editpage: function(id, type) {
            window.location.href = API.baseUrl + baseUrl + "/view/marketing/sms/smsedit.html?id=" + id + "&&type=" + type;
            /*API.getFlags({}, function(data){
                if(data.code == 200) {
                    window.location.href = API.baseUrl+baseUrl+"/view/marketing/sms/smsedit.html?id="+id;
                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });*/
        },
        //跳转到新建页面
        newlyData: function() {
            window.location.href = API.baseUrl + baseUrl + "/view/marketing/sms/smsedit.html";
            /*API.getFlags({}, function(data){
                if(data.code == 200) {
                    window.location.href = API.baseUrl+baseUrl+"/view/marketing/sms/smsedit.html";
                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });*/

        },
        //获取群组
        getGroup: function() {
            $("#sendgroup").empty();
            $(".custNum").html("");
            var data = {};

            vm.sendgroup = "<option value=''>请选择</option>";
            API.microGroup(data, function(data) {
                if (data.code == 200) {
                    var lists = data.data.list;
                    $.each(lists, function(i, v) {
                        vm.sendgroup += "<option value='" + v.id + "' data-custNum='" + v.custNum + "' >" + v.groupName + "</option>";
                    });
                }

            });
        },
        //发送记录列表页面
        smsSendLog: function(page, size) {
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.smsSendLog(data, function(data) {
                if (data.code == 200) {
                    vm.recordlists = data.data.list;
                    vm.sendpages = data.data.page;
                    if (vm.recordlists.length != 0) {
                        if (page == 0) {
                            $("#sendrecordpage").find('.ui-paging-container').eq(0).remove();
                            $('#sendrecordpage').Paging({
                                size: vm.sendpages.pageSize,
                                count: vm.sendpages.total,
                                toolbar: true,
                                callback: function(page, size) {
                                    vm.smsSendLog(page, size);
                                }
                            });
                        }
                    }

                } else {
                    dcrmAlertError(data.msg);
                }

                MaskUtil.RemoveLoading();
                setTimeout(function() {
                    $(".emailSub").popover({ trigger: "hover" });
                }, 500)
            });
        },
        //审核
        verifyData: function(id) {
            var that = this;
            var data = {
                id: id
            };
            API.verifySms(data, function(res) {
                if (res.code == 200) {
                    dcrmAlertSuccess("消息已提交审核，审核时间大概为30分钟，请耐心等待！");
                    $(".popover").hide();
                    that.$options.methods.smslist(0, 20);
                } else {
                    dcrmAlertError(res.msg);
                }
            });
        },
        //测试弹窗
        testPopup: function(id) {
            this.micropageid = id;
            this.copyShow = true;
            this.testShow = false;
            this.phone = '';
        },
        //测试
        testData: function() {
            var that = this;
            var data = {
                id: vm.micropageid,
                phone: vm.phone
            };
            if (vm.phone == '') {
                dcrmAlertWarning("手机号码不能为空!");
                return false;
            }
            if ($.trim(vm.phone) != '' && !(/^1[34578]\d{9}$/.test(vm.phone))) {
                dcrmAlertWarning("手机号码有误，请重填");
                return false;
            }

            MaskUtil.Loading();
            API.testSend(data, function(res) {
                if (res.code == 200) {
                    dcrmAlertSuccess("测试发送成功!");
                    that.copyShow = false;
                } else {
                    dcrmAlertError("测试发送失败!");
                    that.copyShow = false;
                }
                MaskUtil.RemoveLoading();
            });
        },
        //发送
        sendData: function(id) {
            vm.getGroup(); //获取群组
            setTimeout(function() {
                var txt = '<select type="text" class="form-control" id="sendgroup">' +
                    '' + vm.sendgroup + '' +
                    '</select>' +
                    '<div style="padding-left: 7px;text-align: left;font-size: 14px;line-height:50px">发送人数：<span class="custNum"></span></div>';

                //人数
                $("body").delegate("#sendgroup", "change", function() {
                    var val = $(this).val();
                    var cus = $(this).find("option[value=" + val + "]").attr("data-custNum");
                    $(".custNum").html(cus);
                })
                var option = {
                    title: "发送对象",
                    onOk: function() {
                        var data = {
                            id: id,
                            groupId: $("#sendgroup").val()
                        };
                        API.sendSms(data, function(res) {
                            if (res.code == 200) {
                                dcrmAlertSuccess(res.msg);
                            } else {
                                dcrmAlertError(res.msg);
                            }
                        });
                    }
                }
                window.wxc.xcConfirm(txt, "custom", option);
            }, 200);

        },
        //删除
        deleteData: function(id, title) {
            var that = this;
            var data = {
                id: id
            };
            dcrmConfirm("您确定要删除'" + title + "'短信模板吗？", function() {
                MaskUtil.Loading();
                API.deleteSms(data, function(res) {
                    if (res.code == 200) {
                        $('.ui-paging-container').eq(0).remove();
                        dcrmAlertSuccess("删除成功!");
                        that.$options.methods.smslist(0, 20);
                    } else {
                        dcrmAlertError(res.msg);
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        },
        //复制弹窗
        copyPopup: function(id) {
            this.micropageid = id;
            this.copyShow = true;
            this.testShow = true;
            this.title = '';
        },
        //复制
        copyData: function() {
            var that = this;
            var data = {
                id: vm.micropageid,
                title: vm.title
            };
            if (vm.title == '') {
                dcrmAlertWarning("短信名不能为空!");
                return false;
            }
            MaskUtil.Loading();
            API.copySms(data, function(res) {
                if (res.code == 200) {
                    $('.ui-paging-container').eq(0).remove();
                    dcrmAlertSuccess("复制成功!");
                    that.copyShow = false;
                    that.$options.methods.smslist(0, 20);
                } else {
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //关闭弹窗
        closeData: function() {
            this.copyShow = false;
        }
    }
})