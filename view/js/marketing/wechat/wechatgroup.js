var oid=window.location.search.split('=')[1];
var hash=window.location.hash;
console.log(hash);
/**
 * Created by Administrator on 2017/6/7 0007.
 */
$(function(){
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_wechatGrouptouch").find("a").addClass("active");
    if(hash=='#normal'){
        $('.normal').click();
        vm.weChatGroupList(0,20);//查询微信群列表并分页
    }else if(hash=='#send'){
        $('.indexList').click();
        vm.WeChatsendLog(0,20);
    }else if(hash=='#group'){
        $('.group').click();
        vm.queryWechatGroupList(0,20);

    }else if(hash=='#friend'){
        $('.friend').click();
        vm.friendList(0,20);
    }
    if(oid){
        $('.indexList').click();
        vm.WeChatsendLog(0,20);
    }else if(!hash){
        $('.normal').click();
        vm.weChatGroupList(0,20);//查询微信群列表并分页
    }
    //vm.WeChatsendLog(0,20);//查询发送记录列表并分页
    //vm.getideaTag();//获取内容标签
    vm.WeChatimgUrl = "http://geeker.worken.cn/wx/img";
    vm.imgId = Global.userId;
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
    });
    $(".Wfridens").on('click',function(){
        vm.type = 'user' ;
        vm.getWeChatFriends('user');
        vm.weChatGroupName = '';
    });
    $(".Wall").on('click',function(){
        vm.type = 'all' ;
        vm.getWeChatFriends('all');
        vm.weChatGroupName = '';
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
    })

})


//查询邮件模板列表并分页
var vm = new Vue({
    el: "#weChatpage",
    data: {
        weChats: [],
        pages:"",
        isShow:true,
        tagShow:true,//编辑和新增的内容标签div
        sendShow:false,//发送弹窗
        modelName:'',//微信群模板复制的标题
        copyShow:false,//复制弹窗
        testShow:false,//测试发送弹窗
        status_:'',//微信是否登录
        WeChatGrouplists:[],//微信群列表
        groupTeamlists:[],//微信群的群组列表
        WeChatimgUrl:'',//微信群头像地址
        imgId:'',//图片----userid
        sendWeChartTit:'',//发送信息弹窗标题
        micropagetit:'',//页面位置指向标题
        weChartCodeimgUrl:'',//微信二维码  扫码登录
        weChatTeamGroup:[],//选中的微信群的群组的value
        weTeamGroup:[],//选中的微信群的群组的群名称
        weChatGroup:[],//选中的微信群
        weChatGroupId:'',//测试发送的微信号id
        weGroup:[],//选中的微信群----昵称
        //weChatGroupNames:'',//测试发送的微信群名称拼接
        sendGroupId:'',//发送的群/好友/全部的id的拼接
        weChatGroupNames:[],//发送的群/好友/全部的名称拼接
        inArray:true,
        content:'',//内容
        micropageid:'',//页面编辑时需要
        weChatsendlists:[],//发送记录列表
        weChatspages:'',//发送记录分页
        setint:null,//定时器
        addFriendShow:false,
        queryWechatGroup:[],
        WeChatFriendlists:[],//微信好友列表
        WeChatFriend:[],//选中的微信好友id
        WeFriend:[],//选中的微信好友昵称
        WeChatAlllists:[],//全部（微信群/好友）列表
        WeChatAll:[],//选中的微信好友id
        WeAll:[],//选中的微信好友昵称
        weChatGroupName:'',//微信群的群组名称----input的val
        type:'TeamGroup',//发送的类型（TeamGroup---微信群群组  group--微信群  user--微信好友  all--全部）
        wwwShow:true,//判断是否是编辑，还是发送
        addmubanShow:true,//新建模板按钮
        addFShow:false//添加好友按钮
    },
    methods: {
        //权限的方法
        hasPermission:Global.hasPermission,
        //微信群模板列表页
        weChatGroupList: function(page,size) {
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/wechat/wechatgroup.html#normal";
            vm.addFShow = false;
            //新建模板
            if(hasPermission("wechatGroup", "ADD")){
                vm.addmubanShow = true;
            }else{
                vm.addmubanShow = false;
            }
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.weChatGroupList(data, function(data) {
                if (data.code == 200) {
                    vm.weChats = data.data.pageData.list;
                    vm.pages = data.data.pageData.page;
                    if(vm.weChats.length != 0){
                        if(page==0){
                            $('#wechatListpage').find('.ui-paging-container').eq(0).remove();
                            $('#wechatListpage').Paging({size:vm.pages.pageSize,count:vm.pages.total,toolbar:true,callback:function(page,size){
                                vm.weChatGroupList(page,size);
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
        //加好友微信群列表页
        queryWechatGroupList: function(page,size) {
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/wechat/wechatgroup.html#group";
            vm.addmubanShow = false;
            //添加好友按钮
            if(hasPermission("cust", "ADDFRIENDS")){
                vm.addFShow = true;
            }else{
                vm.addFShow = false;
            }
            var data = {
                "pageIndex": page,
                "pageSize": size
            };
            var str='';

            MaskUtil.Loading();
            API.queryWechatGroupList(data, function(data) {
                if (data.code == 200) {
                    var obj=data.data.pageData.list;
                    if(obj && obj.length){
                        for (var i =0;i< obj.length; i++) {
                            var sendnum=0;
                            var refresh='';
                            if(obj[i].verifyReqCount){
                                sendnum=obj[i].verifyReqCount
                            }
                            if(obj[i].status=='请求中断' && (hasPermission("cust", "ADDFRIENDS"))){
                                refresh='<a href="javascript:;" class="tbBtn zcBtn" onclick="vm.newlyData(null,111)">重启</a>'
                            }
                            // 判断数据是否为null
                            str+='<tr>'+
                                '<td class="firstTd  nopointer">'+isNull(obj[i].groupName)+'</td>'+
                                '<td class="">'+sendnum+'</td>'+
                                '<td class="">'+obj[i].createTime+'</td>'+
                                '<td class="">'+isNull(obj[i].status)+'</td>'+
                                '<td class="textcenter">'+refresh+'</td>'
                            '</tr>'
                        }
                        $('#weGroupList tbody').html(str);

                        if(page==0){
                            $("#weGroupListpage").find('.ui-paging-container').eq(0).remove();
                            $('#weGroupListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                                queryWechatGroupList(page,size);
                            }});
                        }

                    }
                    else{
                        trdat = "<tr >"+
                            "<td  colspan='5' class='textcenter'><i class='icon icon-icon nodata'>&#xe601;</i>暂无数据</td>"+
                            "</tr> ";
                        $('#weGroupList tbody').html(trdat)
                    }

                    if(data.msg!='操作成功'){
                        dcrmAlertError(data.msg)
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
        editpage:function(id){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/wechat/wechatedit.html?id="+id;
        },
        //跳转到新建页面
        newlyData:function(id,reset){
            $('.addFriendShow').find('.popBox').show();
            $('.addFriendShow .xc_layer').show();
            $('#qrcode1').html('');
            var qrcode1 = new QRCode(document.getElementById("qrcode1"), {
                width : 400,
                height : 400
            });

            if(vm.addmubanShow == true){
                window.location.href = API.baseUrl+baseUrl+"/view/marketing/wechat/wechatedit.html";
            }else{//创建好友
                vm.addFriendShow=true;
                $(".addFriendShow .popBox").removeClass("testSend Send1 Send2 Send3 Send4");
                vm.micropageid = id;
                getWeChatGroupInfoList();
                //MaskUtil.Loading();
                function getWeChatGroupInfoList() {
                    API.getWeChatGroupInfoList({}, function (data) {
                        if (data.code == 200) {
                            vm.status_ = data.data.status;
                            vm.WeChatGrouplists = data.data.list;
                            if (vm.status_ == 1) {
                                $(".addFriendShow .popBox").removeClass("testSend");
                                $(".txtBox").find("ul").hide();
                                clearInterval(vm.setint);
                                vm.sendWeChartTit = '扫描下方二维码登录微信';
                                vm.weChartCodeimgUrl = data.data.loginUrl;

                                var loginUrl=data.data.loginUrl.split('/')[5];
                                console.log(loginUrl)

                                qrcode1.makeCode('https://login.weixin.qq.com/l/'+loginUrl);

                                vm.setint = setInterval(function () {
                                    getWeChatGroupInfoList();
                                }, 500)
                            } else {
                                clearInterval(vm.setint);
                                $(".txtBox").find("ul").show();
                                $("#qrcode1").hide();
                                vm.sendWeChartTit = '选择要发送的微信群';
                                var length = data.data.list.length;
                                console.log(length);
                                switch (length) {
                                    case 1:
                                    case 2:
                                    case 3:
                                        $(".addFriendShow .popBox").addClass("Send1");
                                        break;
                                    case 4:
                                    case 5:
                                    case 6:
                                        $(".addFriendShow .popBox").addClass("Send2");
                                        break;
                                    case 7:
                                    case 8:
                                    case 9:
                                        $(".addFriendShow .popBox").addClass("Send3");
                                        break;
                                    case 10:
                                    case 11:
                                    case 12:
                                        $(".addFriendShow .popBox").addClass("");
                                        break;
                                    default:
                                        $(".addFriendShow .popBox").addClass("Send4");
                                        break;
                                }

                                if(reset){
                                    vm.queryWechatGroupList(0,20);
                                    vm.closeSend()
                                }

                            }
                        }
                        //MaskUtil.RemoveLoading();
                    });
                }

            }

        },
        //微信群发送记录
        WeChatsendLog:function(page,size){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/wechat/wechatgroup.html#send";
            vm.addFShow = false;
            //新建模板
            if(hasPermission("wechatGroup", "ADD")){
                vm.addmubanShow = true;
            }else{
                vm.addmubanShow = false;
            }
            var data = {
                "pageIndex": page,
                "pageSize": size
            }
            MaskUtil.Loading();
            API.WeChatsendLog(data, function(data) {
                if (data.code == 200) {
                    vm.weChatsendlists = data.data.list;
                    vm.weChatspages = data.data.page;
                    if(vm.weChatsendlists.length != 0){
                        if(page==0){
                            $("#sendrecordpage").find('.ui-paging-container').eq(0).remove();
                            $('#sendrecordpage').Paging({size:vm.weChatspages.pageSize,count:vm.weChatspages.total,toolbar:true,callback:function(page,size){
                                vm.WeChatsendLog(page,size);
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
        // 微信群好友列表
        friendList: function(page,size) {
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/wechat/wechatgroup.html#friend";
            vm.addmubanShow = false;
            //添加好友按钮
            if(hasPermission("cust", "ADDFRIENDS")){
                vm.addFShow = true;
            }else{
                vm.addFShow = false;
            }
            var data = {
                "pageIndex": page,
                "pageSize": size
            };
            MaskUtil.Loading();
            API.queryWechatFriendList(data, function(data) {
                if(data&&data.code==200){
                    var obj=data.data.pageData.list;
                    console.log(obj)
                    var str='';
                    if (data.code == 200) {
                        if(obj&&obj.length>0){
                            console.log(obj.length)
                            for (var i =0;i< obj.length; i++) {
                                // 判断数据是否为null
                                str+='<tr>'+
                                    '<td class="firstTd nopointer">'+isNull(obj[i].niceName)+'</td>'+
                                    '<td>'+obj[i].groupName+'</td>'+
                                    '<td>'+isNull(obj[i].sex)+'</td>'+
                                    '<td>'+obj[i].area+'</td>'+
                                    '</tr>'


                            }
                            $('#friendList tbody').html(str);

                            if(page==0){
                                $('#friendListpage').find('.ui-paging-container').eq(0).remove();
                                $('#friendListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
                                    vm.friendList(page,size);
                                }});
                            }
                        }else{

                            trdat = "<tr >"+
                                "<td  colspan='4' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
                                "</tr> ";
                            $('#friendList tbody').html(trdat)
                        }

                    }else{
                        dcrmAlertError(data.msg);
                    }
                    MaskUtil.RemoveLoading();
                    // setTimeout(function(){
                    //     $("[data-toggle='popover']").popover({trigger:"hover"});
                    // },800)
                }else{
                    dcrmAlertError('初始化数据失败');
                    MaskUtil.RemoveLoading();

                }
            });
        },
        //测试
        testData:function(id){
            $(".sendWeChartBox .popBox").removeClass("testSend Send1 Send2 Send3 Send4");
            this.micropageid = id;
            this.sendShow = true;
            getMyWechat();
            //MaskUtil.Loading();
            function getMyWechat(){
                API.getMyWechat({}, function(data){
                    if(data.code == 200) {
                        vm.status_ = data.data.status;
                        if(vm.status_ == 401){//未登录
                            $('#qrcode').html('');
                            var qrcode = new QRCode(document.getElementById("qrcode"), {
                                width : 400,
                                height : 400
                            });
                            $(".sendWeChart .popBox").removeClass("testSend Send1 Send2 Send3 Send4");
                            $(".txtBox").find("ul").hide();
                            clearInterval(vm.setint);
                            vm.sendWeChartTit = '扫描下方二维码登录微信';
                            //vm.weChartCodeimgUrl = data.data.loginUrl;
                            var loginUrl=data.data.value.split('/')[5];
                            console.log(loginUrl);
                            qrcode.makeCode('https://login.weixin.qq.com/l/'+loginUrl);
                            vm.setint = setInterval(function () {
                                getMyWechat();
                            }, 500)
                        }
                        if(vm.status_ == 200){//已登录
                            $("#qrcode").hide();
                            clearInterval(vm.setint);
                            $(".txtBox").find("ul").show();
                            vm.weChatGroupId = data.data.value;
                            vm.sendWeChartTit = '测试发送';
                            $(".popBox").addClass("testSend");
                        }
                    }
                    //MaskUtil.RemoveLoading();
                });
            };

        },
        //测试发送按钮点击
        testSend:function(){
            var data={
                id:vm.micropageid,
                weChatGroupId:vm.weChatGroupId
            };
            API.WechattestSend(data, function(res) {
                if (res.code == 200) {
                    dcrmAlertSuccess(res.msg);
                    vm.sendShow = false;
                }else{
                    dcrmAlertError(res.msg);
                }
            });
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
            //MaskUtil.Loading();

            //MaskUtil.Loading();

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
                                    $.each(window.filterExpr,function(h,i){
                                        if($(e).val() == i){
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
                            },1500);
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

            })
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

            })
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
            clearInterval(vm.setint);
        },
        //发送按钮
        sendData:function(type){
            var _weChatGroupId_ = '';
                vm.weChatGroups = '';
             if(type == 'TeamGroup'){
                // vm.GroupName('group');
                _weChatGroupId_ = vm.weChatTeamGroup;
                if(vm.weChatTeamGroup == ''){
                    dcrmAlertWarning('请选择要发送的微信群!');
                    return false;
                }


                vm.weChatGroupName = '';
                vm.weChatGroups = '';
                window.type_ = '';

            }
            if(type == 'group'){
                // vm.selected('group');
                console.log(vm.weChatGroup);

                // vm.GroupName('group');
                _weChatGroupId_ = vm.weChatGroup;
                vm.weChatGroups = vm.weGroup;
                window.type_ = 1;
                if(vm.weChatGroup == ''){
                    dcrmAlertWarning('请选择要发送的微信群!');
                    return false;
                }

            }
            if(type == 'user'){
                // vm.selected('user');
                /*
                console.log(vm.WeChatFriend);
                var _weChatGroupId = vm.WeChatFriend;
                vm.sendGroupId = _weChatGroupId.join("||");//发送的时候好友的id的拼接
                console.log(vm.sendGroupId);

                console.log(vm.WeFriend);
                var _weGroupId = vm.WeFriend;
                vm.weChatGroupNames = _weGroupId.join("||");//发送的时候好友的名称的拼接
                console.log(vm.weChatGroupNames);*/

                // vm.GroupName('user');
                _weChatGroupId_ = vm.WeChatFriend;
                vm.weChatGroups = vm.WeFriend;
                window.type_ = 2;

                if(vm.WeChatFriend == ''){
                    dcrmAlertWarning('请选择要发送的微信好友!');
                    return false;
                }
            }
            if(type == 'all'){
                // vm.selected('all');

                // vm.GroupName('all');

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
            API.sendWeChatGroup(data, function(res) {
                if (res.code == 200) {
                    vm.sendShow = false;
                    vm.weChatGroupList(0,20);
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
        //发送好友确认按钮
        addfriendData:function(){
            var weChatGroupId;
            console.log(vm.weChatGroup);
            var _weChatGroupId = vm.weChatGroup;
            weChatGroupId = _weChatGroupId.join(",");
            console.log(weChatGroupId);

            if(weChatGroupId == ''){
                dcrmAlertWarning('请选择微信群!');
                return false;
            }
            var data = {
                groupName:weChatGroupId
            };


            API.addWechatFriend(data,function(data){
                if (data.code == 200) {
                    dcrmAlertSuccess('操作成功')

                    // setTimeout(function(){
                    //    $('.popBox').hide();
                    //    $('.xc_layer').hide()
                    // },1000)

                }else{
                    dcrmAlertError("添加好友失败!");
                    // $('.popBox').hide();
                }
            })


        },
        //复制弹窗
        copyPopup:function(id){
            this.micropageid = id;
            this.copyShow = true;
            this.modelName = '';
        },
        //复制
        copyData:function(){
            var that = this;
            var data = {
                id:vm.micropageid,
                modelName:vm.modelName
            };
            if(vm.modelName == ''){
                dcrmAlertWarning("标题不能为空!");
                return false;
            }
            MaskUtil.Loading();
            API.copyWeChatGroup(data, function(res) {
                if (res.code == 200) {
                    $('.ui-paging-container').eq(0).remove();
                    dcrmAlertSuccess("复制成功!");
                    that.copyShow = false;
                    that.$options.methods.weChatGroupList(0,20);
                }else{
                    dcrmAlertError("复制失败!");

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
            dcrmConfirm("您确定要删除'"+title+"'微信群吗？",function(){
                MaskUtil.Loading();
                API.deleteWeChatGroup(data, function(res) {
                    if (res.code == 200) {
                        $('.ui-paging-container').eq(0).remove();
                        dcrmAlertSuccess("删除成功!");
                        that.$options.methods.weChatGroupList(0,20);
                    }else{
                        dcrmAlertError("删除失败!");
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        }
    }
})


var editor;
KindEditor.ready(function(K) {
    editor = K.create('textarea[name="content"]', {
        height : '300px',
        resizeType :1,
        allowPreviewEmoticons:false,
        allowImageUpload:true,//允许上传图片
        allowFileManager:true, //允许对上传图片进行管理
        uploadJson:'js/kindeditor-4.1.10/jsp/upload_json.jsp', //上传图片的java代码，只不过放在jsp中
        fileManagerJson:'js/kindeditor-4.1.10/jsp/file_manager_json.jsp',
        afterUpload: function(){this.sync();}, //图片上传后，将上传内容同步到textarea中
        afterCreate : function(){this.sync();},
        afterBlur: function(){this.sync();},   ////失去焦点时，将上传内容同步到textarea中
        items : [
            'fontname','fontsize', '|','forecolor', 'hilitecolor','bold', 'italic','underline',
            'removeformat','|', 'justifyleft','justifycenter', 'justifyright','insertorderedlist',
            'insertunorderedlist','|', 'emoticons','link','media','|','image',"customerProperty","myLink"]
    });
});


// 微信加好友点确定按钮关闭弹窗
$(body).on('click','.addFriendShow .popBox .sgBtn',function(){
    $(this).parents('.popBox').hide();
    $('.addFriendShow .xc_layer').hide();
});



