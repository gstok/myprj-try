$(function() {
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_pagetouch").find("a").addClass("active");
    //vm.power();
    vm.wechatList(0,20);//查询原始页面列表并分页

    vm.WeChatimgUrl = "http://geeker.worken.cn/wx/img";
    vm.imgId = Global.userId;
    $(".forwardpage").on('click',function(){
        vm.forwardShow = true;
        vm.queryForwardList(0,20);//微转发列表
        $('.ui-paging-container').eq(0).remove();
    });
    $(".microindexpage").on('click',function(){
        vm.forwardShow = false;
    });
    $(".popBox").removeClass("testSend");

    $("#hrefTogroupTeam").on('click',function(){
        vm.type = 'TeamGroup' ;
    });
    $("#hrefToGroup").on('click',function(){
        $(".WGroups").click();
        vm.type = 'group' ;
        vm.wwwShow = true;
    });
    $(".WGroups").on('click',function(){
        vm.type = 'group' ;
        vm.getWeChatFriends('group');
        vm.weChatGroupName = '';
        $("#WGroups").find(":checkbox:checked").each(function(i,u){
            $(u).click();
        });
    });
    $(".Wfridens").on('click',function(){
        vm.type = 'user' ;
        vm.getWeChatFriends('user');
        vm.weChatGroupName = '';
        $("#Wfridens").find(":checkbox:checked").each(function(i,u){
            $(u).click();
        });
    });
    $(".Wall").on('click',function(){
        vm.type = 'all' ;
        vm.getWeChatFriends('all');
        vm.weChatGroupName = '';
        $("#Wall").find(":checkbox:checked").each(function(i,u){
            $(u).click();
        });
    });
    /*$(".WWGroups").on('click',function(){
        vm.type = 'group' ;
        vm.GetTeamGroup('group');
    });
    $(".WWfridens").on('click',function(){
        vm.type = 'user' ;
        vm.GetTeamGroup('user');
    });
    $(".WWall").on('click',function(){
        vm.type = 'all' ;
        vm.GetTeamGroup('all');
    });*/
    $(".saveGroup").on('change',function(){
        if($('.saveGroup').prop('checked')){//选中时
            vm.selected(vm.type);
            vm.GroupName(vm.type);
        }else{
            vm.weChatGroupName = '';
        }
    });
    $('body').on('click','#group .weGroupCheck',function(){
        $(this).prev(".weChatGroupCheck").click();
    });
    $('body').on('click','#group .WeFriendCheck',function(){
        $(this).prev(".WeChatFriendCheck").click();
    });
    $('body').on('click','#group .WeAllCheck',function(){
        $(this).prev(".WeChatAllCheck").click();
    });
    $('body').on('click','#Edit .weGroupCheck',function(){
        $(this).prev(".weChatGroupCheck").click();
    });
    $('body').on('click','#Edit .WeFriendCheck',function(){
        $(this).prev(".WeChatFriendCheck").click();
    });
    $('body').on('click','#Edit .WeAllCheck',function(){
        $(this).prev(".WeChatAllCheck").click();
    });
    //图片上传按钮隐藏显示
    $('.uploadimg').mouseenter(function () {
        $(this).find(".btnBG, .cancleBtn").show();
    }).mouseleave(function () {
        $(this).find(".btnBG, .cancleBtn").hide();
    });







    //新建链接上传图片裁剪
    $('#link_img').Jcrop({
        onChange: showPreview,
        onSelect: showPreview,
        aspectRatio: 1
    });

    function showPreview(coords){
        if (parseInt(coords.w) > 0){
            var rx = 80 / coords.w;
            var ry = 80 / coords.h;

            $('#linkview').css({
                width: Math.round(rx * 396) + 'px',
                height: Math.round(ry * 96) + 'px',
                marginLeft: '-' + Math.round(rx * coords.x) + 'px',
                marginTop: '-' + Math.round(ry * coords.y) + 'px'
            });
        }
    }
    //新建链接上传图片裁剪








});
var vm = new Vue({
    el: "#micropage",
    data: {
        wechatLists: [],
        WeAll:[],
        WeChatAll:[],
        pages:"",
        micropageid:'',//id
        title:'',//复制的标题
        copyShow:false,//复制的弹窗
        sendShow:false,//发送弹窗
        status_:'',//微信是否登录
        wwwShow:true,//判断是否是编辑，还是发送
        WeChatAlllists:[],//全部（微信群/好友）列表
        WeChatFriendlists:[],//微信好友列表
        weChatGroupName:'',//微信群的群组名称----input的val
        WeChatGrouplists:[],//微信群列表
        groupTeamlists:[],//微信群的群组列表
        sendWeChartTit:'',//发送信息弹窗标题
        weGroup:[],//选中的微信群----昵称
        WeChatimgUrl:'',//微信群头像地址
        imgId:'',//图片----userid
        weChatGroup:[],//选中的微信群
        weChatTeamGroup:[],//选中的微信群的群组的value
        WeFriend:[],//选中的微信好友昵称
        WeChatFriend:[],//选中的微信好友id
        forwardlists:[],//微转发列表
        forwardShow:false,//微转发的添加按钮---默认隐藏
        linkShow:false,//新建链接弹窗
        ideaTaglists:[],//内容标签列表
        linkpageShow:false,//链接页面预览
        advertShow:false,//广告列表
        myadvertLists:[],//我的广告列表
        alladvertLists:[],//我的广告列表
        addadvertShow:false,//新增广告弹窗
        adurl:'',//新增微转发---链接
        adverttitle:'',//新增微转发---标题
        summary:'',//新增微转发---摘要
        ideaTag:''//新增微转发---内容标签
    },
    methods: {
        //权限的方法
        hasPermission:Global.hasPermission,
        //二维码的div的id
        creatId: function (i){
            return "qrCode" +i
        },
        //二维码显示
        showwechat:function(id){
            $(".popover").hide();
            $("[data-id = "+id+" ]").show();
            $('#qrCode'+id).html('');
            var qrCode = new QRCode(document.getElementById("qrCode"+id), {
                width : 140,
                height : 140
            });
            var data = {
                id:id
            };
            API.createQrCode(data, function(data) {
                if (data.code == 200) {
                    if(data.data){
                        var loginUrl=data.data.data;
                        console.log(loginUrl)

                        //qrCode.makeCode('http://m.adfc.cn/qr?url='+loginUrl);
                        qrCode.makeCode(loginUrl);

                    }

                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //隐藏二维码
        hidewechat:function(){
            $(".popover").hide();
        },
        //新建页面弹窗
        newlyData:function(){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/micro/newlypage.html";
        },
        //编辑页面弹窗
        editpage:function(id){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/micro/newlypage.html?id="+id;
        },
        //微页面列表页
        wechatList: function(page,size) {
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.wechatlist(data, function(data) {
                if (data.code == 200) {
                    if(data.data){
                        vm.wechatLists = data.data.pageData.list;
                        vm.pages = data.data.pageData.page;
                        if(vm.wechatLists.length != 0){
                            if(page==0){
                                $('#wechatListpage').Paging({pagesize:20,count:vm.pages.total,toolbar:true,callback:function(page,size){
                                    vm.wechatList(page,size);
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
        //微转发列表页
        queryForwardList: function(page,size) {
            var data = {
                "pageIndex": page,
                "pageSize": size
            };
            MaskUtil.Loading();
            API.queryForwardList(data, function(data) {
                if (data.code == 200) {
                    if(data.data){
                        vm.forwardlists = data.data.pageData.list;
                        var pages = data.data.pageData.page;
                        if(vm.forwardlists.length != 0){
                            if(page==0){
                                $('#forwardlistpage').Paging({pagesize:20,count:pages.total,toolbar:true,callback:function(page,size){
                                    vm.queryForwardList(page,size);
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
        //删除
        deleteData:function(id,title){
            var that = this;
            var data = {
                id:id
            };
            dcrmConfirm("您确定要删除'"+title+"'微页面吗？",function(){
                MaskUtil.Loading();
                API.deleteHtml(data, function(res) {
                    if (res.code == 200) {
                        $('.ui-paging-container').eq(0).remove();
                        dcrmAlertSuccess("删除成功!");
                        that.$options.methods.wechatList(0,20);
                    }else{
                        dcrmAlertError("删除失败!");
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        },
        //复制弹窗
        copyPopup:function(id){
            this.micropageid = id;
            this.copyShow = true;
            vm.title = '';
        },
        //复制
        copyData:function(){
            var that = this;
            var data = {
                id:vm.micropageid,
                title:vm.title
            };
            if(vm.title == ''){
                dcrmAlertWarning("标题不能为空!");
                return false;
            }
            MaskUtil.Loading();
            API.mircocopyHtml(data, function(res) {
                if (res.code == 200) {
                    $('.ui-paging-container').eq(0).remove();
                    dcrmAlertSuccess("复制成功!");
                    that.copyShow = false;
                    that.$options.methods.wechatList(0,20);
                }else{
                    dcrmAlertError("复制失败!");
                    that.copyShow = false;
                }
                MaskUtil.RemoveLoading();
            });
        },
        //关闭弹窗
        closeData:function(){
            this.copyShow = false;
            this.sendShow = false;
            clearInterval(vm.setint);
        },
        //发送弹窗
        sendPopup:function(id){
            vm.weChatTeamGroup = [];
            $('.saveGroup').prop('checked',false);
            $("#hrefTogroupTeam").click();
            vm.micropageid = id;
            vm.sendShow = true;
            vm.getWeChatFriends('group');
            //getWeChatGroups();//获取微信群的群组
            vm.WeChatGrouplists = '';//微信群列表
            vm.WeChatFriendlists = '';//好友列表
            vm.WeChatAlllists = '';//全部列表

        },
        //获取微信群的群组列表
        getWeChatGroups:function() {
            API.getWeChatGroups({}, function (data) {
                if (data.code == 200) {
                    vm.status_ = data.data.status;
                    vm.groupTeamlists = data.data.data;//微信群的群组列表
                    /*if (vm.status_ == 1) {
                        $("#qrcode").show();
                        $('#qrcode').html('');
                        var qrcode = new QRCode(document.getElementById("qrcode"), {
                            width : 400,
                            height : 400
                        });
                        $(".sendWeChart .popBox").removeClass("testSend Send1 Send2 Send3 Send4");
                        $(".txtBox").find(".groupBox").hide();
                        $(".sendWeChartBox").find(".nav").hide();
                        clearInterval(vm.setint);
                        vm.sendWeChartTit = '扫描下方二维码登录微信';
                        vm.weChartCodeimgUrl = data.data.loginUrl;
                        var loginUrl=data.data.loginUrl.split('/')[5];
                        console.log(loginUrl);
                        qrcode.makeCode('https://login.weixin.qq.com/l/'+loginUrl);
                        vm.setint = setInterval(function () {
                            getWeChatGroups();
                        }, 500)
                    } else {*/
                        $("#qrcode").hide();
                        clearInterval(vm.setint);
                        $(".txtBox").find(".groupBox").show();
                        $(".sendWeChartBox").find(".nav").show();


                        vm.sendWeChartTit = '发送';

                        //}
                    }
                });
                //MaskUtil.RemoveLoading();
            },
        //获取微信群列表---好友列表---全部列表
        getWeChatFriends:function(type) {
            var type_ = type;
                var data = {
                    type:type
                };
                //MaskUtil.Loading();
                API.getWeChatFriends(data, function (data) {
                    if (data.code == 200) {
                        vm.status_ = data.data.status;
                        if(type == 'group'){
                            vm.WeChatGrouplists = data.data.list;//微信群列表
                        }
                        if(type == 'user'){
                            vm.WeChatFriendlists = data.data.list;//好友列表
                        }
                        if(type == 'all'){
                            vm.WeChatAlllists = data.data.list;//全部列表
                        }
                        if (vm.status_ == 1) {
                            $("#qrcode").show();
                            $('#qrcode').html('');
                            var qrcode = new QRCode(document.getElementById("qrcode"), {
                                width : 400,
                                height : 400
                            });
                            $(".sendWeChart .popBox").removeClass("testSend Send1 Send2 Send3 Send4");
                            $(".txtBox").find(".groupBox").hide();
                            $(".sendWeChartBox").find(".nav").hide();
                            clearInterval(vm.setint);
                            vm.sendWeChartTit = '扫描下方二维码登录微信';
                            vm.weChartCodeimgUrl = data.data.loginUrl;
                            var loginUrl=data.data.loginUrl.split('/')[5];
                            console.log(loginUrl);
                            qrcode.makeCode('https://login.weixin.qq.com/l/'+loginUrl);
                            vm.setint = setInterval(function () {
                                vm.getWeChatFriends(type_);
                            }, 500)
                        } else {
                            $("#qrcode").hide();
                            clearInterval(vm.setint);
                            $(".txtBox").find(".groupBox").show();
                            vm.wwwShow = true;

                            vm.sendWeChartTit = '发送';
                            if(type_ == 'group'){
                                vm.getWeChatGroups();
                            }
                            var length = data.data.list.length;
                            console.log(length);

                            switch (length) {
                                case 1:
                                case 2:
                                case 3:
                                    $(".sendWeChart .popBox").addClass("Send1");
                                    break;
                                case 4:
                                case 5:
                                case 6:
                                    $(".sendWeChart .popBox").addClass("Send2");
                                    break;
                                case 7:
                                case 8:
                                case 9:
                                    $(".sendWeChart .popBox").addClass("Send3");
                                    break;
                                case 10:
                                case 11:
                                case 12:
                                    $(".sendWeChart .popBox").addClass("");
                                    break;
                                default:
                                    $(".sendWeChart .popBox").addClass("Send4");
                                    break;
                            }
                        }
                    }
                    //MaskUtil.RemoveLoading();
                });
            },
        //编辑微信群组------获取微信群列表---好友列表---全部列表
        GetTeamGroup:function(type) {
            var type_ = type;
                var data = {
                    type:type
                };
                MaskUtil.Loading();
                API.getWeChatFriends(data, function (data) {
                    if (data.code == 200) {
                        vm.status_ = data.data.status;
                        if(type == 'group'){
                            vm.WeChatGrouplists = data.data.list;//微信群列表
                        }
                        if(type == 'user'){
                            vm.WeChatFriendlists = data.data.list;//好友列表
                            setTimeout(function(){
                                var check = $('#WWfridens').find('.WeFriendCheck');
                                console.log(check);
                                $.each(check,function(i,e){
                                    $.each(window.filterExpr,function(h,j){
                                        if($(e).val() == j){
                                            console.log($(e).val());
                                            $(e).prop("checked",true)
                                        }
                                    })
                                });
                            },500);
                        }
                        if(type == 'all'){
                            vm.WeChatAlllists = data.data.list;//全部列表
                            setTimeout(function(){
                                var check = $('#WWall').find('.WeAllCheck');
                                console.log(check);
                                $.each(check,function(i,e){
                                    $.each(window.filterExpr,function(h,i){
                                        if($(e).val() == i){
                                            console.log($(e).val());
                                            $(e).prop("checked",true)
                                        }
                                    })
                                });
                            },500);
                        }




                            $("#qrcode").hide();
                            $(".txtBox").find(".groupBox").show();
                            vm.wwwShow = false;

                            vm.sendWeChartTit = '编辑微信群组';
                            var length = data.data.list.length;
                            console.log(length);

                            switch (length) {
                                case 1:
                                case 2:
                                case 3:
                                    $(".sendWeChart .popBox").addClass("Send1");
                                    break;
                                case 4:
                                case 5:
                                case 6:
                                    $(".sendWeChart .popBox").addClass("Send2");
                                    break;
                                case 7:
                                case 8:
                                case 9:
                                    $(".sendWeChart .popBox").addClass("Send3");
                                    break;
                                case 10:
                                case 11:
                                case 12:
                                    $(".sendWeChart .popBox").addClass("");
                                    break;
                                default:
                                    $(".sendWeChart .popBox").addClass("Send4");
                                    break;
                            }

                    }
                    MaskUtil.RemoveLoading();
                });
            },
        // 勾选保存为群组
        selected:function(type){
            var _type = type;
            if($('#group .saveGroup').prop('checked')){//选中时
                vm.GroupName(_type);

            }else{//没选中
                vm.weChatGroupName = '';
            }
        },
        //群组命名
        GroupName:function (type){
            if($('#group .saveGroup').prop('checked')){//选中时
                var check;
                var _val;
            if(type == 'group'){
                check = $('#WGroups').find('.weGroupCheck:checked');//群组列表里面的checkbox
                _val = '';
            }
            if(type == 'user'){
                check = $('#Wfridens').find('.WeFriendCheck:checked');//好友列表里面的checkbox
                _val = '';
            }
            if(type == 'all'){
                check = $('#Wall').find('.WeAllCheck:checked');//全部列表里面的checkbox
                _val = '';
            }
            $.each(check,function(i,u){
                if(u.length == 1){
                    _val = $(u).val();
                }else{
                    if(i == 0){
                        if(type == 'group'){
                            _val = $(u).val()+"等"+check.length+"个微信群";
                        }
                        if(type == 'user'){
                            _val = $(u).val()+"等"+check.length+"个好友";
                        }
                        if(type == 'all'){
                            _val = $(u).val()+"等"+check.length+"个微信群/好友";
                        }

                    }
                }

            });
            vm.weChatGroupName = _val;
            }else if($('#Edit .saveGroup').prop('checked')){//选中时
                var check;
                var _val;
            if(type == 'group'){
                check = $('#WWGroups').find('.weGroupCheck:checked');//群组列表里面的checkbox
                _val = '';
            }
            if(type == 'user'){
                check = $('#WWfridens').find('.WeFriendCheck:checked');//好友列表里面的checkbox
                _val = '';
            }
            if(type == 'all'){
                check = $('#WWall').find('.WeAllCheck:checked');//全部列表里面的checkbox
                _val = '';
            }
            $.each(check,function(i,u){
                if(u.length == 1){
                    _val = $(u).val();
                }else{
                    if(i == 0){
                        if(type == 'group'){
                            _val = $(u).val()+"等"+check.length+"个微信群";
                        }
                        if(type == 'user'){
                            _val = $(u).val()+"等"+check.length+"个好友";
                        }
                        if(type == 'all'){
                            _val = $(u).val()+"等"+check.length+"个微信群/好友";
                        }

                    }
                }

            });
            vm.weChatGroupName = _val;
            }else{
                vm.weChatGroupName = '';
            }

        },
        //列表中单个checkbox点击的时候
        WWWchange:function(type){
            if($('#group .saveGroup').prop('checked')){//选中时
                console.log(type);
                var type_ = type;
                vm.selected(type_);
                vm.GroupName(type_);
            }

        },
        //编辑回显列表中单个checkbox点击的时候
        changeWWW:function(type){

            console.log(type);
            var type_ = type;
            vm.GroupName(type_);

        },
        //发送弹窗关闭
        closeSend:function(){
            this.sendShow = false;
            this.copyShow = false;
            this.addFriendShow=false;
            this.linkShow = false;
            this.linkpageShow = false;
            this.advertShow = false;
            clearInterval(vm.setint);
        },
        //添加广告弹窗关闭
        closeaddadvert:function(){
            this.advertShow = true;
            this.addadvertShow = false;
        },
        //发送按钮
        sendData:function(type){
            var _weChatGroupId_ = '';
                vm.weChatGroups = '';
                var _wechatG = [];
             if(type == 'TeamGroup'){
                vm.GroupName('group');
                _weChatGroupId_ = _wechatG;
                console.log(vm.weChatTeamGroup);
                $.each(vm.weChatTeamGroup,function(i,u){
                    $.each(JSON.parse(u).weChatGroups,function(e,f){
                        _wechatG.push(f);
                    })
                })
                console.log(_wechatG);


                if(vm.weChatTeamGroup == ''){
                    dcrmAlertWarning('请选择要发送的微信群!');
                    return false;
                }


                vm.weChatGroupName = '';
                vm.weChatGroups = '';
                window.type_ = '';

            }
            if(type == 'group'){
                vm.selected('group');
                console.log(vm.weChatGroup);

                vm.GroupName('group');
                _weChatGroupId_ = vm.weChatGroup;
                vm.weChatGroups = vm.weGroup;
                window.type_ = 1;
                if(vm.weChatGroup == ''){
                    dcrmAlertWarning('请选择要发送的微信群!');
                    return false;
                }

            }
            if(type == 'user'){
                vm.selected('user');
                /*
                console.log(vm.WeChatFriend);
                var _weChatGroupId = vm.WeChatFriend;
                vm.sendGroupId = _weChatGroupId.join("||");//发送的时候好友的id的拼接
                console.log(vm.sendGroupId);

                console.log(vm.WeFriend);
                var _weGroupId = vm.WeFriend;
                vm.weChatGroupNames = _weGroupId.join("||");//发送的时候好友的名称的拼接
                console.log(vm.weChatGroupNames);*/

                vm.GroupName('user');
                _weChatGroupId_ = vm.WeChatFriend;
                vm.weChatGroups = vm.WeFriend;
                window.type_ = 2;

                if(vm.WeChatFriend == ''){
                    dcrmAlertWarning('请选择要发送的微信好友!');
                    return false;
                }
            }
            if(type == 'all'){
                vm.selected('all');

                vm.GroupName('all');

                _weChatGroupId_ = vm.WeChatAll;
                vm.weChatGroups = vm.WeAll;
                window.type_ = 3;
                if(vm.WeChatAll == ''){
                    dcrmAlertWarning('请选择要发送的微信群或好友!');
                    return false;
                }
            }



            var data = {
                id:vm.micropageid,//模板id
                type:window.type_,
                weChatGroupId:JSON.stringify({
                    "groupList":_weChatGroupId_
                }),//发送的时候群/好友/全部的id的拼接
                weChatGroupName:vm.weChatGroupName,//发送的时候群/好友/全部的名称的拼接----input的val
                weChatGroups:JSON.stringify({
                    "weChatGroups":vm.weChatGroups
                })//多个微信群群名拼接

            };

            console.log(vm.micropageid);
            console.log(data.weChatGroupId);
            API.sendPage(data, function(res) {
                if (res.code == 200) {
                    vm.sendShow = false;
                    dcrmAlertSuccess(res.msg);
                }else{
                    dcrmAlertError(res.msg);
                }
            });
        },
        //编辑群组弹窗
        updatePoup:function(id,name,num,filterExpr){
            window.updateWeChatGroupId = id;
            vm.sendWeChartTit = '编辑微信群组';
            $("#hrefToEdit").click();
            vm.wwwShow = false;
            vm.weChatGroupName = name;
            var obj= $.parseJSON(filterExpr);
            window.filterExpr = obj.weChatGroups;
            console.log(window.filterExpr);
            $('#Edit .saveGroup').prop('checked',true);
            $("#Edit .tab-pane").removeClass('active in');
            window._weGroupId_ = '';
            vm.weChatGroups = '';
            if(num == 1){
                vm.type = 'group' ;
                window.type_ = 1;
                $(".WWGroups").click();
                $('.WWfridens,.WWall').removeAttr('href');
                $('.WWfridens,.WWall').parent('li').addClass('disabled');
                $('.WWfridens,.WWall').unbind("click");
                $('.WWGroups').parent('li').removeClass('disabled');
                $("#WWGroups").addClass("active").addClass('in');
                setTimeout(function(){
                    var check = $('#WWGroups').find('.weGroupCheck');
                    console.log(check);
                    $.each(check,function(i,e){
                        $.each(window.filterExpr,function(h,i){
                            if($(e).val() == i){
                                console.log($(e).val());
                                $(e).prop("checked",true)
                            }
                        })
                    });
                },500);
            }
            if(num == 2){
                vm.type = 'user' ;
                window.type_ = 2;
                $(".WWfridens").click();
                vm.GetTeamGroup('user');
                $('.WWGroups,.WWall').removeAttr('href');
                $('.WWGroups,.WWall').parent('li').addClass('disabled');
                $('.WWGroups,.WWall').unbind("click");
                $('.WWfridens').parent('li').removeClass('disabled');
                $("#WWfridens").addClass("active").addClass('in');
            }
            if(num == 3){
                vm.type = 'all' ;
                window.type_ = 3;
                $(".WWall").click();
                vm.GetTeamGroup('all');
                $('.WWGroups,.WWfridens').removeAttr('href');
                $('.WWGroups,.WWfridens').parent('li').addClass('disabled');
                $('.WWGroups,.WWfridens').unbind("click");
                $('.WWall').parent('li').removeClass('disabled');
                $("#WWall").addClass("active").addClass('in');

            }
        },
        //编辑群组
        updateWeChatGroups:function(){
            if(vm.weChatGroupName == ''){
                dcrmAlertWarning('群组名称不能为空！');
                return;
            }
            if(window.type_ == 1){
                window._weGroupId_ = vm.weChatGroup;
                vm.weChatGroups = vm.weGroup;
            }
            if(window.type_ == 2){
                window._weGroupId_ = vm.WeChatFriend;
                vm.weChatGroups = vm.WeFriend;
            }
            if(window.type_ == 3){
                window._weGroupId_ = vm.WeChatAll;
                vm.weChatGroups = vm.WeAll;
            }
            var data = {
                id:window.updateWeChatGroupId,//群组id
                type:window.type_,
                weChatGroupId:JSON.stringify({
                    "groupList":window._weGroupId_
                }),//发送的时候群/好友/全部的id的拼接
                weChatGroupName:vm.weChatGroupName,//发送的时候群/好友/全部的名称的拼接----input的val
                weChatGroups:JSON.stringify({
                    "weChatGroups":vm.weChatGroups
                })//多个微信群群名拼接

            };
            console.log(data);
            API.updateWeChatGroups(data, function(res) {
                if (res.code == 200) {
                    dcrmAlertSuccess(res.msg);
                    $("#hrefTogroupTeam").click();
                    vm.getWeChatGroups();//刷新列表
                }else{
                    dcrmAlertError(res.msg);
                }
            });
        },
        //删除群组
        delTeamGroup:function(id){
            var data = {
                id:id
            };
            dcrmConfirm('您确定要删除该群组吗',function(){
                API.delWeChatGroups(data,function(res){
                    if(res.code == 200){
                        dcrmAlertSuccess(res.msg);
                        $("#hrefTogroupTeam").click();
                        vm.getWeChatGroups();
                    }else{
                        dcrmAlertError(res.msg);
                    }
                })
            })
        },
        //标签事件
        chosen:function(){
            setTimeout(function(){
                $(".chosen-choices").addClass("form-control");
                $(".conTag").chosen({
                    search_contains: true,//可以让chosen搜索选项的中间及末尾字符
                    disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
                });
                $(".conTag").trigger("liszt:updated");//更新选项

                var config = {
                    '.tag-select': {},
                    '.tag-select-deselect': {
                        allow_single_deselect: true
                    },
                    '.tag-select-no-single': {
                        disable_search_threshold: 10
                    },
                    '.tag-select-no-results': {
                        no_results_text: '无选择项'
                    },
                    '.tag-select-width': {
                        width: "95%"
                    }
                }
                for (var selector in config) {
                    $(selector).chosen(config[selector]);
                }
            },200)
        },
        //获取内容标签
        getideaTag:function(){
            var data = {
            };
            MaskUtil.Loading();
            API.getFlags(data, function(data){
                if(data.code == 200) {
                    vm.ideaTaglists = data.data.list;
                    vm.ideaTag = data.data.list.id;
                }else{
                    dcrmAlertError("获取内容标签失败");
                }
                MaskUtil.RemoveLoading();
            });
        },
        //添加链接弹窗
        newlyforward:function(){
            vm.linkShow = true;
            vm.getideaTag();//获取内容标签
            vm.chosen();

        },
        //新建链接上传图片
        upData:function() {
             var imgPath = $("#file").val();
             //判断上传文件的后缀名
             var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
             if (strExtension != 'jpg' && strExtension != 'jpeg'&& strExtension != 'gif'&& strExtension != 'png') {
                    dcrmAlertWarning("请选择jpg,jpeg,gif,png格式的图片");
              $("#file").val("");
                   return;
               }
              var maxsize = 2*1024*1024;//2M
              var fileSize = 0;
              var obj_file = document.getElementById("file");
              var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
              if (isIE && !obj_file.files) {
                 var filePath = obj_file.value;
                 var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                 var file = fileSystem.GetFile (filePath);
                 fileSize = file.Size;
              }else {
                 fileSize = obj_file.files[0].size;
              }
              if(fileSize>maxsize){
                dcrmAlertWarning("照片最大尺寸为2M，请重新上传!");
                return false;
              }
               MaskUtil.Loading();
               $.ajaxFileUpload({
                   type: "POST",
                   url: API.baseUrl+"/user-apis/pc/user/headUpLoad.action",
                   data: {},
                   dataType: 'json',
                   secureuri:false,
                   fileElementId:'file',
                   async : false,
                   cache: false,
                   contentType: false,
                   processData: false,
                   success: function(data) {
                       if(data && data.code == 200) {
                         $("#file").val("");
                         console.log(data);
                           $("#link_img").attr("src",data.data.url);
                           $("#link_img").attr("data-src",data.data.name);
                       }else{
                          console.log(data);
                    dcrmAlertError(data.msg);
                   }
                       MaskUtil.RemoveLoading();
                   }
               });
        },
        up_head:function(){
          return $('#file').click();
        },
        //添加广告上传图片
        addadvertupData:function() {
             var imgPath = $("#addadvertfile").val();
             //判断上传文件的后缀名
             var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
             if (strExtension != 'jpg' && strExtension != 'jpeg'&& strExtension != 'gif'&& strExtension != 'png') {
                    dcrmAlertWarning("请选择jpg,jpeg,gif,png格式的图片");
              $("#addadvertfile").val("");
                   return;
               }
              var maxsize = 2*1024*1024;//2M
              var fileSize = 0;
              var obj_file = document.getElementById("addadvertfile");
              var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
              if (isIE && !obj_file.files) {
                 var filePath = obj_file.value;
                 var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                 var file = fileSystem.GetFile (filePath);
                 fileSize = file.Size;
              }else {
                 fileSize = obj_file.files[0].size;
              }
              if(fileSize>maxsize){
                dcrmAlertWarning("照片最大尺寸为2M，请重新上传!");
                return false;
              }
               MaskUtil.Loading();
               $.ajaxFileUpload({
                   type: "POST",
                   url: API.baseUrl+"/user-apis/pc/ideaAd/uploadAdImage.action",
                   data: {},
                   dataType: 'json',
                   secureuri:false,
                   fileElementId:'file',
                   async : false,
                   cache: false,
                   contentType: false,
                   processData: false,
                   success: function(data) {
                       if(data && data.code == 200) {
                         $("#addadvertfile").val("");
                         console.log(data);
                           $("#addadvert_img").attr("src",data.data.url);
                           $("#addadvert_img").attr("data-src",data.data.name);
                       }else{
                          console.log(data);
                    dcrmAlertError(data.msg);
                   }
                       MaskUtil.RemoveLoading();
                   }
               });
        },
        addadvertup_head:function(){
          return $('#addadvertfile').click();
        },
        //新增微转发
        saveForward: function () {
            var choices =$(".chosen-choices").find(".search-choice").find("span");
            var ideas = [];//内容标签数组
            $.each(choices,function(i,u){
                ideas.push($(u).html());
            });
            //console.log(ideas);
            vm.ideaTag = ideas.join(",");
            console.log(vm.ideaTag);
            var data = {
                adId:adId,
                url:vm.adurl,
                title:vm.adverttitle,
                summary:vm.summary,
                ideaTag:vm.ideaTag
            };
            MaskUtil.Loading();
            API.createForward(data, function(data){
                if(data.code == 200) {
                    dcrmAlertSuccess(data.msg);
                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //设置广告弹窗
        advertPop:function(){
            this.linkpageShow = false;
            this.advertShow = true;
            //这里请求我的广告的接口获取myadvertLists
            $(".alladvert").on('click',function(){
                //这里请求全部广告的接口获取alladvertLists
            });
        },
        //添加广告弹窗
        addadvertPop:function(){
            this.addadvertShow = true;
        }



    }
});

