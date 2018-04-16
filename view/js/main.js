var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?6bff0e7d9e89363223a024588da7f285";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
/**
 * Created by Administrator on 2017/6/6 0006.
 */
function getUserInfo() {
    API.getUserInfo({}, function(res) {
        if (res.code == 200) {
            Global.userId = res.data.obj.id;
            Global.email = res.data.obj.email;
            Global.companyId = res.data.obj.companyId;
            Global.companyName = res.data.obj.companyName;
            Global.menuList = res.data.sysResList;
            Global.weixinId = res.data.obj.weixinId;
            Global.isAdmin = res.data.obj.isAdmin;
            localStorage.setItem("isAdmin", res.data.obj.isAdmin)
            Global.smsChannel = res.data.obj.smsChannel;
            console.log(Global.email + '////');
            // if(res.data.obj.isAdmin == 0){
            // }
            // console.log(Global.menuList);

            /********************获取个人设置资料***********************/
            var obj = res.data.obj;
            $('#setting #loginname').val(obj.loginName);
            $('#setting #username').val(obj.userName);
            $('#setting #qq').val(obj.qq);
            $('#setting #birthday').val(obj.birthday);
            $('#setting #email').val(obj.email);
            $('#setting #profession').val(obj.job);
            $('#setting #phone').val(obj.mobile);
            $("#setting input[name='sex'][value='" + obj.sex + "']").attr("checked", true);
            $('#setting #weixin').val(obj.weixinId);
            if (obj.headUrl) {
                $("#setting #head_img").attr("src", obj.headUrl);
                $("#setting #userImg").attr("src", obj.headUrl);
                $("#userImg").attr("src", res.data.obj.headUrl);
            } else {
                $("#setting #head_img").attr("src", '../images/head.png');
                $("#setting #userImg").attr("src", '../images/head.png');
                $("#userImg").attr("src", baseUrl + "/view/images/head.png");
            }
            /********************获取个人设置资料***********************/

        } else {
            dcrmAlertError("获取用户个人信息失败");
        }
    });
};


//操作按钮的权限
powers();

function smsCtrl() {
    var elements = $("*[smsctrl]");
    if (elements) {
        elements.each(function() {
            var tagName = this.tagName;
            switch (tagName.toLowerCase()) {
                case "a": //群组发送短信的小竖杠
                case "i": //群组发送短信的小竖杠
                case "button": //客户列表批量发送短信
                case "li": //菜单中短信触达
                    if (hasSmsCtrl()) {
                        $(this).addClass('hide');
                    } else {
                        $(this).removeClass('hide');
                    }
                    break;
                case "div": //设置里面的短信设置
                    if (hasSmsCtrl()) {
                        $(this).addClass('hide');
                    } else {
                        $(this).removeClass('hide');
                    }
            }
        });
    }
}

function powers() {
    API.alphaConfig(function(res) {
        if (res.code == 200) {
            Global.permissionStatus = res.data.permissionStatus;
            Global.smsCtrl = res.data.smsCtrl;
            //Global.smsCtrl = true;
            Global.smsCtrlCompanyIds = new Set();
            if (res.data.smsCtrlCompanyIds) {
                res.data.smsCtrlCompanyIds.forEach(function(value) {
                    Global.smsCtrlCompanyIds.add(value);
                })
            }
        }
    });

    if (Global.isAdmin == 1||!Global.permissionStatus) {
        return true;
    }else{
        API.selectFunction({}, function(res) {
            if (res.code == 200) {
                Global.selectFunction = res.data.data;

                Global.modulePerMap = {};
                Global.selectFunction.forEach(function(value) {
                    var set = Global.modulePerMap[value.moduleCode];
                    if (!set) {
                        set = new Set();
                        Global.modulePerMap[value.moduleCode] = set;
                    }
                    set.add(value.permissionCode);
                });

                var elements = $("*[module]");
                if (elements) {
                    elements.each(function() {
                        var module = $(this).attr("module");
                        var permissionCode = $(this).attr("permission-code");

                        var tagName = this.tagName;
                        switch (tagName.toLowerCase()) {
                            case "a":
                            case "button":
                            case "div": //角色的保存按钮---新建按钮---首页访问图表
                                if (hasPermission(module, permissionCode)) {
                                    $(this).removeClass('hide');
                                } else {
                                    $(this).addClass('hide');
                                }
                                break;
                            case "select":
                                if (hasPermission(module, permissionCode)) {
                                    $(this).attr('disabled', false);
                                } else {
                                    $(this).attr('disabled', true);
                                }
                        }
                    });
                }
            }
        });
    }

}

Global.hasPermission = function(module, code) {
    return hasPermission(module, code);
};

function hasPermission(module, code) {
    if (Global.isAdmin == 1) {
        return true;
    }
    if (!Global.permissionStatus) {
        return true;
    }
    if (Global.modulePerMap[module] && Global.modulePerMap[module].has(code)) {
        return true;
    } else {
        return false;
    }
}

Global.hasSmsCtrl = function() {
    return hasSmsCtrl();
};

function hasSmsCtrl() {
    if (!Global.smsCtrl) {
        return;
    }
    return Global.smsCtrlCompanyIds.has(Global.companyId)
}


//menu
var baseUrl = '';
$(function() {
    getUserInfo();
    //操作按钮的权限
    powers();
    $(".menuNormal").find("a").removeClass("active");
    $(".menuNormal").find("li span").attr("class", "icon icon-arrow");
    //收缩菜单栏
    $(".menuSet").on("click", function() {
        if ($(this).find("span").html() == "&gt;") {
            console.log("&gt;");
            menusmall();
        } else {
            console.log("&lt;");
            menuNormal();
        }
    });
    //菜单
    //加载模块列表
    var obj = Global.menuList;
    console.log(obj);
    var lists = [];
    var childlists = [];
    /*$.each(obj, function (e, f) {
        if (e == 0) {
            obj.splice(0, 1);
        }
    });*/
    $.each(obj, function(e, f) {
        if (f.resType == 1 && f.isDisplay == 1) {
            lists.push(f);
            //console.log(lists);
        }
        if (f.resType == 2 && f.isDisplay == 1) {
            childlists.push(f);
            //console.log(childlists);
        }
    });
    console.log(childlists);

    $.each(lists, function(i, u) {
        var children = [];
        $.each(childlists, function(e, k) {
            if (u.id == k.parentId) {
                children.push(k);
                u.children = children;
            }
        });
    });
    //console.log(lists);
    var html = generateHtml(lists, 0);
    var meanShtml = meanSmallHtml(lists, 0);
    $(".menu").html(html + meanShtml);
    //递归生成html列表
    function generateHtml(datas, range) {
        range = range + 1;
        var html = '';
        if (range == 1) {
            html += '<div class="menuNormal">' +
                '  <div class="menuTop">DATA<img src="/view/images/dcrm.png" alt=""/>GEEKR</div>' +
                '   <ul>';
        } else {
            html += '<ul class="menuSbox">';
        }

        for (var i in datas) {
            var data = datas[i];
            if (range == 1) {
                if (data.resName == "首页") {
                    html += '<li class="' + data.resClass + '" id="index_' + data.resClass + '" data-id="' + data.id + '"><a href="/view/index.html" class="FirstStage active indexurl"><i class="icon icon-' + data.icon + '"></i>首页</a><li>';
                } else {
                    html += '<li class="' + data.resClass + '" id="index_' + data.resClass + '" data-id="' + data.id + '">' +
                        '<a href="javascript:void(0);" class="FirstStage">' +
                        '<i class="icon icon-' + data.icon + '"></i>' + data.resName + '';
                    html += '</a>';
                }
            } else {
                var moduleurl = data.resUrl;
                if (moduleurl == '/view/customer/workOrder/workOrder.html') {
                    moduleurl = '/view/customer/workOrder/workOrderspc.html'
                }
                if (data.resName == "短信触达" || data.resName == "短信数据") {
                    html += '<li smsctrl id="index_' + data.resClass + '" data-id="' + data.id + '">' +
                        '<a href="' + moduleurl + '">' + data.resName + '</a></li>';
                } else {
                    html += '<li id="index_' + data.resClass + '" data-id="' + data.id + '">' +
                        '<a href="' + moduleurl + '">' + data.resName + '</a></li>';
                }

            }
            if (data.children && data.children.length != 0) {
                html += '<span class="icon icon-arrow"></span></a>';
                html += generateHtml(data.children, range);
                html += '</ul>';
            }
        }
        return html;
    }
    //小菜单html列表
    function meanSmallHtml(datas, range) {
        range = range + 1;
        var meanShtml = '';
        if (range == 1) {
            meanShtml += '</div>' +
                '  <div class="meanSmall"><div class="menuTop"><img src="/view/images/dcrm.png" alt=""/></div>' +
                '      <ul>';
        } else {
            meanShtml += '<ul>';
        }
        for (var i in datas) {
            var data = datas[i];
            if (range == 1) {
                if (data.resName == "首页") {
                    meanShtml += '<li class="' + data.moduleCls + '" id="index_' + data.moduleCode + '" data-id="' + data.id + '"><i class="icon icon-' + data.icon + '"></i><ul>' +
                        '<li><a href="/view/index.html" class="indexurl">首页</a></li></ul>';
                } else {
                    meanShtml += '<li class="' + data.moduleCls + '" id="index_' + data.moduleCode + '" data-id="' + data.id + '">' +

                        '<i class="icon icon-' + data.icon + '"></i>';
                }

            } else {
                var moduleurl = data.resUrl;
                if (moduleurl == '/view/customer/workOrder/workOrder.html') {
                    moduleurl = '/view/customer/workOrder/workOrderspc.html'
                }
                if (data.resName == "短信触达" || data.resName == "短信数据") {
                    meanShtml += '<li smsctrl id="index_' + data.moduleCode + '" data-id="' + data.id + '">' +
                        '<a href="' + moduleurl + '">' + data.resName + '</a></li>';
                } else {
                    meanShtml += '<li id="index_' + data.moduleCode + '" data-id="' + data.id + '">' +
                        '<a href="' + moduleurl + '">' + data.resName + '</a></li>';
                }

            }
            if (data.children && data.children.length != 0) {
                meanShtml += meanSmallHtml(data.children, range);
                meanShtml += "</ul>";
            } else {}
        }
        return meanShtml;
    }
    leftmenuEvent();
    smsCtrl();
});
//左侧菜单点击事件
function leftmenuEvent() {
    //$(".menu").on("click",".menuNormal li",function(event){
    var menuNli = $(".menuNormal li");
    menuNli.on("click", function(event) {

        if ($(this).parent().hasClass("menuSbox")) {
            var url = $(this).find("a").attr("href");
            $(".menuNormal").find("a").removeClass("active");
            $(this).find("a").addClass("active");
            window.location.href = url;
            return false;
        } else {
            var Dmenulispan = $(this).find("span").attr("class");
            $(".menuNormal").find("a").removeClass("active");
            $(this).siblings().find(".menuSbox").slideUp();
            $(this).siblings().find("span").removeClass("icon-jiantou").addClass("icon-arrow");
            $(this).siblings().find("span").css('color', '#6a778f');
            $(this).find(".FirstStage").addClass("active");
            $(this).find(".menuSbox").slideToggle();
            // console.log(Dmenulispan);
            if (Dmenulispan && Dmenulispan.indexOf("icon-jiantou") > -1) {
                $(this).find("span").removeClass("icon-jiantou").addClass("icon-arrow");
                $(this).find("span").css('color', '#6a778f')
            } else {
                $(this).find("span").removeClass("icon-arrow").addClass("icon-jiantou");
                $(this).find("span").css('color', '#fff')
            }
        }
        event.stopPropagation();
    });

    //小菜单
    var menuSli = $(".meanSmall li");
    menuSli.mouseenter(function() {
        $(this).addClass("active");
        $(this).find("ul").show();
    }).mouseleave(function() {
        $(this).removeClass("active");
        $(this).find("ul").hide();
    });
}

//切换至小菜单
function menusmall() {
    $(".menuSet").animate({ left: "60px" });
    $(".menuSet").find("span").html("&lt;");
    $(".menu").animate({ width: "60px" });
    $(".menuNormal").animate({ left: "-200px" });
    //$(".meanSmall").animate({opacity:'1.0'});
    $(".meanSmall").animate({ opacity: '1.0' }).show();
    $("#page-wrapper").animate({ "margin-left": "60px" });
    $(".head").animate({ "padding-left": "60px" });
    $(".functionMenu").animate({ "left": "100px" });
}
//切换至大菜单
function menuNormal() {
    $(".menuSet").animate({ left: "200px" });
    $(".menuSet").find("span").html("&gt;");
    $(".menu").animate({ width: "200px" });
    $(".menuNormal").animate({ left: "0" });
    $(".meanSmall").hide().animate({ opacity: '0' });
    $("#page-wrapper").animate({ "margin-left": "200px" });
    $(".head").animate({ "padding-left": "200px" });
    $(".functionMenu").animate({ "left": "240px" });
}
//menu
//top
Vue.component('my-top', {
    template: '<div class="head"><div class="menuSet icon icon-shousuo1"><span>&gt;</span></div>' +
        '<div class="headTit">客户管理（新版）已上线，欢迎试用！</div>'+
        '<div class="fr">' +
        '<div class="headOff cursorPoint dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<img id="userImg" src="' + baseUrl + '/view/images/head.png">' +
        '</div>' +
        '<ul class="dropdown-menu pull-right">' +
        '<li class="top_taskLi"><a href="' + baseUrl + '/view/task/task.html">任务管理</a></li>' +
        '<li role="separator" class="divider top_taskLi"></li>' +
        '<li class="top_financeLi"><a href="' + baseUrl + '/view/Finance/Finance/list.html">财务中心</a></li>' +
        '<li role="separator" class="divider top_financeLi"></li>' +
        '<li><a href="' + baseUrl + '/view/setting/selfcustomerTag.html">标签设置</a></li>' +
        '<li role="separator" class="divider"></li>' +
        '<li><a href="' + baseUrl + '/view/setting/selfsetting.html">个人设置</a></li>' +
        '<li role="separator" class="divider"></li>' +
        '<li><a href="' + baseUrl + '/view/setting/updatepwd.html">修改密码</a></li>' +
        '<li role="separator" class="divider"></li>' +

        '<li><a href="javascript:;" onclick="logout()">退出登录</a></li></ul> </div></div>'
});
new Vue({ el: '#top' });
//top
//右上角菜单权限
function power() {
    if (hasPermission("finCenter", "GET")) {
        $('.top_financeLi').show();
    } else {
        $('.top_financeLi').hide();
    }
    if (hasPermission("task", "GET")) {
        $('.top_taskLi').show();
    } else {
        $('.top_taskLi').hide();
    }
}
$(function() {
    power();
});









//退出登录页
function logout() {
    var data = {};
    API.logout(data, function(res) {
        if (res.code == 200) {
            window.location.href = API.baseUrl + "/login.html";
        } else {
            dcrmAlertError("退出登录失败，请稍后重试!");
        }
    });
}

//获取执行人
function getExecutor(ele) {
    var data = {};

    API.getExecutor(data, function(data) {

        var obj = data.data.data;
        var str = '<option value="">请选择</option>';
        $.each(obj, function(index, item) {
            str += '<option value="' + item.id + '">' + item.userName + '</option>'
        });
        $('#' + ele).html(str)
    })

}
//获取任务类型
function getTypeId(ele) {
    var data = {};

    API.getTaskType(data, function(data) {

        var obj = data.data.data;
        var str = '<option value="">请选择</option>';
        $.each(obj, function(index, item) {

            str += '<option value="' + item.id + '">' + item.name + '</option>'
        })
        $('#' + ele).html(str)
    })
}
//获取涉及客户
function getSelectCust(ele) {
    var data = {};

    API.getSelectCust(data, function(data) {

        var obj = data.data.data;
        var str = '<option value="">请选择</option>';

        $.each(obj, function(index, item) {

            str += '<option value="' + item.id + '">' + item.name + '</option>'
        })
        $('#' + ele).html(str)
    })
}
//获取事件来源
function getEventSource(ele) {
    var data = {};

    API.getEventSource(data, function(data) {
        var obj = data.data.confCustSource;
        var str = '<option value="">请选择</option>';
        $.each(obj, function(index, item) {
            str += '<option value="' + item + '">' + item + '</option>'
        })
        $('#' + ele).html(str)
    })
}
// 获取销售阶段
function stageSelect(ele) {
    var data = {};

    API.stageSelect(data, function(data) {
        var obj = data.data.stageList;
        var str = '<option value="">请选择</option>';
        $.each(obj, function(index, item) {
            str += '<option value="' + item.id + '">' + item.name + '</option>'
        })
        $('#' + ele).html(str)
    })
}
//获取职位下拉框
function queryPositionAll(ele) {
    var data = {};

    API.queryPositionAll(data, function(data) {
        var obj = data.data.data;
        var str = '<option value="">请选择</option>';
        $.each(obj, function(index, item) {
            str += '<option value="' + item.positionName + '">' + item.positionName + '</option>'
        })
        $('#' + ele).html(str)
    })
}
//获取部门下拉框
function queryDepart(ele) {
    var data = {};

    API.queryDepart(data, function(data) {
        var obj = data.data.data;
        var str = '<option value="">请选择</option>';
        $.each(obj, function(index, item) {
            if (index != obj.length - 1) {
                str += '<option value="' + item.id + '">' + item.departName + '</option>'
            }

        })
        $('#' + ele).html(str)
    })
}
//获取直属领导下拉框
function selectExecutorUser(ele) {
    var data = {};

    API.selectExecutorUser(data, function(data) {
        var obj = data.data.data;
        var str = '<option value="">请选择</option>';
        $.each(obj, function(index, item) {
            str += '<option value="' + item.id + '">' + item.userName + '</option>'
        })
        $('#' + ele).html(str)
    })
}
//获取角色下拉框
function queryRole(ele, ul) {
    var data = {};

    API.queryRole(data, function(data) {
        var obj = data.data.list;
        var str = '<option value="">请选择</option>';
        var str2 = '<li>选择角色：</li>'
        $.each(obj, function(index, item) {
            str += '<option value="' + item.id + '">' + item.roleName + '</option>'
            str2 += '<li><input id="' + item.id + '" type="checkbox" class="checkname specheck"><span>' + item.roleName + '</span></li>'
        })
        $('#' + ele).html(str)
        $('#' + ul).html(str2)
    })
}
//表格的宽度
$(function() {
    innerW();
});
$(window).resize(function() {
    innerW();
});

function innerW() {
    var innerW = $(".page-inner").width();
    if (innerW < 1103) {
        $(".page-inner").addClass("minWind");
    } else {
        $(".page-inner").removeClass("minWind");
    }
}
// 统计字符，一个汉字算两个字符
function getStringLen(Str) {
    var i, len, code;
    if (Str == null || Str == "") return 0;
    len = Str.length;
    for (i = 0; i < Str.length; i++) {
        code = Str.charCodeAt(i);
        if (code > 255) { len++; }
    }
    return len;
}