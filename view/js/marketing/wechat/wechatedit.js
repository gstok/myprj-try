/**
 * Created by Administrator on 2017/7/19 0019.
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var id = (GetQueryString("id"));
$(function(){
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_wechatGrouptouch").find("a").addClass("active");
    vm.power();
    vm.getideaTag();//获取内容标签
    vm.chosen();

    if(id){
        vm.micropageid = id;
        vm.tagShow = false;
        vm.getWeChatGroup(id);
    }else{
        vm.newlyData();//新建页面
    }

    vm.WeChatimgUrl = "http://geeker.worken.cn/wx/img";
    vm.imgId = Global.userId;
    $(".popBox").removeClass("testSend");
})
//查询邮件模板列表并分页
var vm = new Vue({
    el: "#weChateditpage",
    data: {
        weChats: [],
        pages:"",
        tagShow:true,//编辑和新增的内容标签div
        sendShow:false,//发送弹窗
        testShow:false,//测试发送弹窗
        status_:'',//微信是否登录
        WeChatGrouplists:[],//微信群列表
        WeChatimgUrl:'',//微信群头像地址
        imgId:'',//图片----userid
        sendWeChartTit:'',//发送信息弹窗标题
        micropagetit:'',//页面位置指向标题
        weChartCodeimgUrl:'',//微信二维码  扫码登录
        weChatGroup:[],//选中的微信群
        weChatGroupId:'',//测试发送的微信号id
        modelName:'',//微信群模板名称
        ideaTaglists:[],//内容标签列表
        ideaTag:'',//内容标签
        searchs:[],//编辑时获取的选中内容标签的值
        inArray:true,
        content:'',//内容
        micropageid:'',//页面编辑时需要
        weChatsendlists:[],//发送记录列表
        weChatspages:'',//发送记录分页
    },
    methods: {
        //权限的方法
        hasPermission:Global.hasPermission,
        //微信群功能下面的操作
        power:function(){
            //微信群模板--编辑
            if(hasPermission('wechatGroup','UPDATE')){
                $('.emailPage').find('input').removeAttr("readonly");
                $('.emailPage').find('textarea').removeAttr("readonly");
                $('.cover_edit').hide();
                $('.save').removeAttr("disabled");
            }else{
                $('.emailPage').find('input').attr("readonly","readonly");
                $('.emailPage').find('select').attr("disabled","disabled");
                $('.cover_edit').show();
                $('.save').attr("disabled","disabled");
            }
        },
        //标签事件
        chosen:function(){
            setTimeout(function(){
                $(".chosen-choices").addClass("form-control");
                $(".tag-select, .tag-selectAdd").chosen({
                    search_contains: true,//可以让chosen搜索选项的中间及末尾字符
                    disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
                });
                $(".tag-select, .tag-selectAdd").trigger("liszt:updated");//更新选项

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
        //新建页面弹窗
        newlyData:function(){
            this.tagShow = true;
            this.micropagetit ="新建微信群";
            this.modelName = '';//微信群模板名称
            KindEditor.html('#editor_email', "");//清空编辑器

            var data = {};
            API.createWeChatGroup(data, function(res){
                if (res.code == 200) {
                    $("#newid").val(res.data.id);
                    console.log($("#newid").val());
                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //编辑页面弹窗
        getWeChatGroup:function(id){
            this.tagShow = false;
            var that = this;
            var data = {
                id:id
            };
            MaskUtil.Loading();
            API.getWeChatGroup(data, function(res) {
                if (res.code == 200) {
                    var obj = res.data.group;
                    that.micropagetit ="编辑微信群";
                    that.modelName = obj.modelName;//微信群模板名称
                    //editor.html(obj.content);//内容
                    that.content = obj.content;

                    /*******************内容标签赋值****************************/
                    var _search = obj.ideaTag;//obj.ideaTag
                    if(_search){
                        vm.searchs = _search.split(",");//后台返回的数组
                    }else{
                        vm.searchs = [];
                    }
                    console.log(vm.ideaTaglists);
                    console.log(vm.searchs);
                    if(vm.searchs.length>0){
                        $.each(vm.ideaTaglists,function(i,v){
                            var lock=true;
                            if(lock){
                                $.each(vm.searchs,function(e,f){
                                    if(v.tagName == f){
                                        lock=false;
                                    }
                                })
                                if(lock==false){
                                    $(".tag-select").append('<option  value="'+v.id+'" selected>'+v.tagName+'</option>');
                                }else{
                                    $(".tag-select").append('<option  value="'+v.id+'">'+v.tagName+'</option>');
                                }
                            }

                        })
                    }else{
                        $.each(vm.ideaTaglists,function(i,v){
                            $(".tag-select").append("<option value='"+v.id+"' >"+v.tagName+"</option>");
                        });
                    }

                    /*******************内容标签赋值****************************/

                }else{
                    dcrmAlertWarning(res.msg)
                }
                MaskUtil.RemoveLoading();
            });
        },
        //保存页面
        savepage:function(){
            //获取内容标签
            var choices =$(".chosen-choices").find(".search-choice").find("span");
            var ideas = [];//内容标签数组
            $.each(choices,function(i,u){
                ideas.push($(u).html());
            });
            //console.log(ideas);
            vm.ideaTag = ideas.join(",");
            console.log(vm.ideaTag);
            //获取内容标签 end

            editor.sync();
            var html = $('#editor_email').val();
            $("#schtmlnr").val(html);//把KindEditor产生的html代码放到schtmlnr里面，用于提交

            /****************去掉<>和&nbsp;和&emsp;******************/
            console.log($("#schtmlnr").val());
            var _con = $("#schtmlnr").val();
            var content;
            if(_con.indexOf("<")!=-1){
                var reg = /<(\S*?)[^>]*>/ig ;
                _con = _con.replace(reg,"");
                content = _con;
            }else{
                _con=_con.replace(/&nbsp;/g," ").replace(/&emsp;/g," ");
                content = _con;
            }

            /****************去掉<span>和&nbsp;和&emsp;******************/
            console.log(content);

            var that = this;
            var data = {
                modelName:this.modelName,//微信群模板名称
                ideaTag:this.ideaTag,//内容标签
                content:content//内容
            };
            if(vm.modelName == ''){
                dcrmAlertWarning('信息名称不能为空！')
                return;
            }
            if(this.micropagetit == '新建微信群'){//代表新建保存
                var param  ={
                    "id" : $("#newid").val()
                };
                $.extend(data,param);
            }
            if(this.micropagetit == '编辑微信群'){//代表编辑保存
                var param  ={
                    "id" : id
                };
                $.extend(data,param);
            }
            API.updateWeChatGroup(data, function(data){
                if(data.code == 200) {
                    window.location.href = API.baseUrl+baseUrl+"/view/marketing/wechat/wechatgroup.html";
                }else{
                    dcrmAlertError(data.msg);
                }
            });
        },
        //取消页面
        cancelpage:function(){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/wechat/wechatgroup.html";
        }
    }
})


/*
setTimeout(function(){
    $(".ke-icon-myImg").on("click",function(){
        return $('#file').click();
    });
},500);

//上传图片
function upDataface() {
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
    var data;
    if(id){//编辑
        data = {
            id:id
        }
    }else{//新建
        data = {
            id:$("#newid").val()
        }
    }
    MaskUtil.Loading();
    $.ajaxFileUpload({
        type: "POST",
        url: API.baseUrl+"/pc/weChat/imageUpLoad.action",
        data: data,
        dataType: 'json',
        secureuri:false,
        fileElementId:'file',
        async : false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            if(data.code == 200) {
                dcrmAlertSuccess("上传成功！");
                $("#file").val("");

                editor.sync();
                var html = $('#editor_email').val();
                $("#schtmlnr").val(html);//把KindEditor产生的html代码放到schtmlnr里面，用于提交

                KindEditor.html('#editor_email',html+'<img src="'+data.data.applyUrl+'"/>' );
                //vm.content += data.data.tempUrl;
                //$("#face_img").attr("src",data.data.tempUrl);
                //$("#face_img").attr("data-src",data.data.applyUrl);
            }else{
                dcrmAlertError(data.msg);
            }
            MaskUtil.RemoveLoading();
        },
        error: function (data)//服务器响应失败处理函数
        {
            dcrmAlertError(data.msg);
            MaskUtil.RemoveLoading();
        }
    });
}

*/


var editor;
KindEditor.ready(function(K) {
    editor = K.create('textarea[name="content"]', {
        height : '300px',
        resizeType :1,
        allowPreviewEmoticons:false,
        allowImageUpload:true,//允许上传图片
        allowFileManager:true, //允许对上传图片进行管理
        //uploadJson:'js/kindeditor-4.1.10/jsp/upload_json.jsp', //上传图片的java代码，只不过放在jsp中
        //fileManagerJson:'js/kindeditor-4.1.10/jsp/file_manager_json.jsp',
        afterUpload: function(){this.sync();}, //图片上传后，将上传内容同步到textarea中
        afterCreate : function(){this.sync();},
        afterBlur: function(){this.sync();},   ////失去焦点时，将上传内容同步到textarea中
        items : ["myLink"]
    });
});

