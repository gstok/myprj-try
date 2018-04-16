
var APIS= {
    //项目名字改变修改此处
    baseUrl: "",
    post: function (url, data, async, callback, errorcallback) {
        var settings = {
            type: 'POST',
            url: APIS.baseUrl + url,
            data: data,
            cache: false,
            async: async,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function () {
                return true;
            },
            success: function (res) {
                callback(res);
            }
        };
        $.ajax(settings);
    },
    //添加好友
    addByMobileNumbers: function (param, callback) {
        APIS.post("/task_server/task/addByMobileNumbers", param, false, callback);
    },
    //登录
    login: function (param, callback) {
        APIS.post("/task_server/device/login", param, false, callback);
    },
    //查询是否登录
    sessionMatch: function (param, callback) {
        APIS.post("/task_server/device/sessionMatch?account="+param, {}, false, callback);
    },
    //提交验证码
    verifyCode: function (param, callback) {
        APIS.post("/task_server/device/verifyCode", param, false, callback);
    },
    //拖动
    dragOpReply: function (param, callback) {
        APIS.post("/task_server/device/dragOpReply", param, false, callback);
    }
};

$(function(){
    var str =
        '<!--登陆-->'+
        '    <div class="xcConfirm" id="loginBox" style="display: none">'+
        '        <div class="xc_layer"></div>'+
        '        <div class="popBox">'+
        '            <div class="ttBox"><a class="clsBtn" onclick="noLogin()"></a><span class="tt">登录</span></div>'+
        '            <div class="txtBox">'+
        '                <div class="form-group">'+
        '                    <label>账号：</label>'+
        '                    <input type="text" id="account" class="form-control" onkeydown="KeyDown(event)"/>'+
        '                </div>'+
        '                <div class="form-group">'+
        '                    <label>密码：</label>'+
        '                    <input type="password" id="password" class="form-control" onkeydown="KeyDown(event)"/>'+
        '                </div>'+
        '                <div class="form-group">'+
        '                   <dl>'+
        '                       <dt>提示：</dt>'+
        '                       <dd class="more30">1.您总计勾选<span></span>个客户。</dd>'+
        '                       <dd class="more50">1.您总计勾选<span></span>个客户，但由于微信官方限制了每天发送好友请求的数量，系统会自动选取50个客户发送好友请求。</dd>'+
        '                       <dd class="batch">2.当您在其他设备登陆微信后，会导致批量添加微信好友的任务中断，您需要通过数聚客PC或App端再次登陆微信才能添加好友。'+
        '                       </dd>'+
        '                       <dd class="single">当您在其他设备登陆微信后，会导致批量添加微信好友的任务中断，您需要通过数聚客PC或App端再次登陆微信才能添加好友。'+
        '                       </dd>'+
        '                   </dl>'+
        '                </div>'+
        '            </div>'+
        '            <div class="btnArea">'+
        '                <div class="btnGroup">'+
        '                    <a class="sgBtn ok" onclick="login()">登录</a>'+
        '                    <a class="sgBtn cancel" onclick="noLogin()">取消</a>'+
        '                </div>'+
        '            </div>'+
        '        </div>'+
        '    </div>'+
        '    <!--扫码登陆-->'+
        '    <div class="xcConfirm" id="loginEwmBox" style="display: none">'+
        '        <div class="xc_layer"></div>'+
        '        <div class="popBox">'+
        '            <div class="ttBox"><a class="clsBtn" onclick="noLogin()"></a><span class="tt">扫下方二维码登录</span></div>'+
        '            <div class="txtBox" style="width:135px;margin:auto">'+
        '                <img id="qrcode" style="width:135px;margin-left: 0"/>'+
        '            </div>'+
        '            <div class="btnArea">'+
        '                <div class="btnGroup">'+
        '                    <a class="sgBtn cancel" onclick="noLogin()">取消</a>'+
        '                </div>'+
        '            </div>'+
        '        </div>'+
        '    </div>'+
        '    <!--验证码-->'+
        '    <div class="xcConfirm" id="codeBox" style="display: none">'+
        '        <div class="xc_layer"></div>'+
        '        <div class="popBox">'+
        '            <div class="ttBox"><a class="clsBtn" onclick="noLogin()"></a><span class="tt">输入验证码</span></div>'+
        '            <div class="txtBox">'+
        '            <div class="form-group">'+
        '                <label>验证码：</label>'+
        '                <input type="text" id="code" class="form-control"/>'+
        '                <input type="hidden" id="replyTo"/>'+
        '            </div>'+
        '            <h3 id="codeMsg"></h3>'+
        '        </div>'+
        '        <div class="btnArea">'+
        '            <div class="btnGroup">'+
        '                <a class="sgBtn ok" onclick="verifyCode()">提交</a>'+
        '                <a class="sgBtn cancel" onclick="noLogin()">取消</a>'+
        '            </div>'+
        '        </div>'+
        '        </div>'+
        '    </div>'+
        '    <!--拖动验证码登陆-->'+
        '    <div class="xcConfirm" id="dragBox" style="display: none">'+
        '        <div class="xc_layer"></div>'+
        '        <div class="popBox" style="height: 390px">'+
        '            <div class="ttBox"><a class="clsBtn" onclick="noLogin()"></a><span class="tt">扫下方二维码登录</span></div>'+
        '            <div class="txtBox" style="width:330px;margin:auto;height: 285px;overflow:hidden">'+
        '                <iframe id="dragframe" src="" style="width:348px;height: 302px;border: 0"></iframe>'+
        '            </div>'+
        '            <div class="btnArea">'+
        '                <div class="btnGroup">'+
        '                    <a class="sgBtn ok" onclick="drag(true)">验证成功</a>'+
        '                    <a class="sgBtn cancel" onclick="drag(false)">验证失败</a>'+
        '                </div>'+
        '            </div>'+
        '        </div>'+
        '    </div>';
        $('#WechartloginBox').html(str);
});

var setint = null;//定时器
var wxLoginCallback;
//添加好友弹窗----检查是否登录------------------------------------客户管理批量加微信
//执行任务弹窗----检查是否登录------------------------------------定位加好友地图执行任务
function addPop(callback){
    var wxloginName = $.cookie("wxloginName");
    if(wxloginName == ''){
        wxLoginCallback = callback;
        $("#loginBox").show();
    }else{
        APIS.sessionMatch(wxloginName, function(res) {
            if (res.status == 200) {
                window.sessionid = res.data;
                $("#loginBox").hide();
                callback&&callback();
            }else if(res.status == 404){
                wxLoginCallback = callback;
                $("#addBox").hide();
                $("#loginBox").show();
            }else{
                wxLoginCallback = callback;
                dcrmAlertError(res.message);
            }
        });
    }
}
//获取location.hostname
    function getWsHost(){
       var hostname = location.hostname;

       if(hostname === 'geeker.worken.cn'){
          return hostname+":52361"
       }else{
          return location.host;
       }
    }
    //登录
    function login(callback){
        var _data = {
            "account":$("#account").val(),
            "password":$("#password").val()
        };
        MaskUtil.Loading();
        $(".datagrid-mask-msg").html("正在登录中...");
        APIS.login(JSON.stringify(_data), function(res) {
            if (res.status == 200) {
                window.sessionid = res.data;
                console.log(res.data);
                console.log(window.sessionid);
                var url = "ws://"+getWsHost()+"/task_server/socket/bindDevice";
                //var url = "ws://"+location.hostname+":8888/task_server/socket/bindDevice";
                var socket = new WebSocket(url);
                var lock = false;
                websocket();
                var showH = function(lock){
                    if(lock){
                        $("#loginEwmBox").show();
                    }else{
                        $("#loginEwmBox").hide();
                    }
                };
                function websocket(){
                    socket.onmessage = function(data){
                        var datas = JSON.parse(data.data);
                        console.log(lock+"    "+data.data);
                        if(datas.status == 109){//登录过程

                            if(datas.message=="扫码完成,请点击确认"){
                                showH(false);
                                MaskUtil.Loading();
                                lock = false;
                            }else{
                                showH(lock);
                            }

                            $(".datagrid-mask-msg").html(datas.message);
                            /*setint = setInterval(function () {
                                websocket();
                            }, 500)*/
                        }else if(datas.status == 200){//登录成功
                            var wxloginName = _data.account;
                            $.cookie("wxloginName",wxloginName,{path:'/'});
                            showH(false);
                            clearInterval(setint);
                            /*$("#addBox").show();//添加好友
                            createTask(1);//执行任务*/
                            $("#loginBox").hide();
                            MaskUtil.RemoveLoading();
                            socket.close();
                            wxLoginCallback && wxLoginCallback();
                        }else if(datas.status == 102){//输入验证码
                            MaskUtil.RemoveLoading();
                            showH(false);
                            clearInterval(setint);
                            $("#replyTo").val(datas.replyTo);
                            $("#loginBox").hide();
                            $("#codeBox").show();
                            $("#codeMsg").html(datas.message);
                        }else if(datas.status == 104){//出现二维码
                            MaskUtil.RemoveLoading();
                            $("#loginBox").hide();
                            $("#codeBox").hide();
                            $("#loginEwmBox").show();
                            lock = true;
                            $("#qrcode").attr("src",datas.data);
                            /*setint = setInterval(function () {
                                websocket();
                            }, 500)*/
                        }else if(datas.status == 105){//出现拖动验证码
                            MaskUtil.RemoveLoading();
                            $("#loginBox").hide();
                            $("#codeBox").hide();
                            $("#loginEwmBox").hide();
                            $("#dragBox").show();
                            $("#dragframe").attr("src",datas.data);
                            window.replyTo = datas.replyTo;
                        }else
                        /*if(datas.status == -101)*/
                        {
                            $("#loginBox").hide();
                            clearInterval(setint);
                            MaskUtil.RemoveLoading();
                            dcrmAlertWarning(datas.message);
                        }
                    };
                }

                socket.onclose = function(data){
                    websocket();
                }
            }else{
                dcrmAlertError(res.message);
                MaskUtil.RemoveLoading();
            }
        });
    }
    //enter建登录
    function KeyDown(event){
      if (event.keyCode == 13)
      {
        event.returnValue=false;
        event.cancel = true;
        $("#loginBox .ok").click();
      }
    }
    //关闭登录弹窗
    function noLogin(){
        $("#loginBox,#codeBox,#SMSBox,#FPBox,#SELFBox,#loginEwmBox,#dragBox").hide();
        clearInterval(setint);
    }

    //提交验证码
    function verifyCode(){
        clearInterval(setint);
        var data = {
            code:$("#code").val(),
            replyTo:$("#replyTo").val()
        };
        APIS.verifyCode(JSON.stringify(data), function(res) {
            if (res.status == 200) {
                $("#codeBox").hide();
                $("#addBox").show();
            }else{
                dcrmAlertError(res.message);
            }
        });
    }
//拖动验证码
function drag(typ){
    clearInterval(setint);
    var data = {
        "success":typ,//拖动验证成功true/验证失败(取消)false
        "replyTo":window.replyTo//设备下发的消息id(replyTo)
    };
    APIS.dragOpReply(JSON.stringify(data), function(res) {
        if (res.status == 200) {
            $("#dragBox").hide();
            $("#addBox").show();
        }else{
            //$("#dragBox").hide();
            dcrmAlertError(res.message);
        }
    });
}