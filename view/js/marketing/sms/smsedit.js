
$(function(){
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_smstouch").find("a").addClass("active");
    vm.power();
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var id = GetQueryString("id");
    var type = GetQueryString("type");
    vm.smsType = type;
    vm.getideaTag();//获取内容标签
    vm.chosen();
    vm.getParam();//获取客户属性
    vm.getPage();//获取微页面


    if(id){
        vm.micropageid = id;
        vm.tagShow = false;
        vm.getSignList();//获取短信签名
        setTimeout(function(){vm.getSms(id);},200);
        if(type&&type == 0){//通知
            $('#callsms').prop('checked',true);
        }else{//营销
            $('#marketsms').prop('checked',true)
        }
    }else{
        vm.newlyData();//新建页面
    }

    $('#smsSign').on('change',function(){
        var txt = $(this).val();
        console.log(txt);
        vm.smsSignTxt = $(this).find("option[value ="+txt+"]").html();
    })

    //setTimeout(function () {
        //vm.getSmsType();//短信模板类型
        //vm.getideaTag();//获取内容标签
        //vm.getSignList();//获取短信签名
    //}, 200);
})
//查询短信模板列表并分页
var vm = new Vue({
    el: "#smseditpage",
    data: {
        tagShow:true,//编辑和新增的内容标签div
        status:'',//短信状态
        styleObject:"",
        micropagetit:'',//子页面标题
        editShow:false,//自定义属性弹窗
        selfShow:true,//各个自定义属性
        cusPropertys:[],//客户属性数组
        microPages:[],//微页面数组
        cusProperty:'',//属性名称
        maxProperty:'',//该属性最大值
        nullProperty:'',//属性为空默认内容
        slinkPage:'',//短链接
        microPage:'',//微页面
        otherPage:'',//其他页
        editorTit :"插入客户属性",
        sendgroup:"<option value='0' data-custNum='0'>请选择</option>",//发送群组
        smsType:'',//短信类型
        smsName:'',//模板名称
        smsSign:'',//短信签名id
        smsSignTxt:'',//短信签名value
        content:'',//短信内容
        micropageid:'',//页面编辑时需要
        //smsTypelists:[],//短信类型列表
        ideaTaglists:[],//内容标签列表
        searchs:[],//编辑时获取的选中内容标签的值
        getSignLists:[],//短信签名列表
        ideaTag:'',//内容标签
        SOperationSms:[],//短信触达下面的操作
    },
    methods: {
        //短信触达功能下面的操作
        power:function(){
            //短信触达--编辑
            if(hasPermission("sms", "UPDATE")){
                $('.smsEdit').find('input').removeAttr("readonly");
                $('.smsEdit').find('select').removeAttr("disabled");
                $(".chosen-choices").removeClass("disabled");
                $('.cover_edit').hide();
                $(".tagDis").hide();
                $('.save').removeAttr("disabled");
            }else{
                $('.smsEdit').find('input').prop("readonly","readonly");
                $('.smsEdit').find('select').attr("disabled","disabled");
                $(".chosen-choices").addClass("disabled");
                $('.cover_edit').show();
                $(".tagDis").show();
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
        //选择短信类型
        selectType:function(type_){
            vm.getSignList();//获取短信签名
        },
        //获取短信签名
        getSignList:function(){
            if($('#callsms').prop('checked')){
                this.smsType=0
            }else if($('#marketsms').prop('checked')){
                this.smsType=1;
            }
            var data = {
                smsType:this.smsType
            };
            MaskUtil.Loading();
            API.getSignList(data, function(data){
                if(data.code == 200) {
                    vm.getSignLists = data.data.list;
                    if(vm.getSignLists.length == 0){
                        dcrmAlertWarning("无短信签名，请去设置中心设置短信签名");
                    };
                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
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
        //获取短信模板类型
        getSmsType:function(){
            var data = {
            };
            MaskUtil.Loading();
            API.getSmsType(data, function(data){
                if(data.code == 200) {
                    vm.smsTypelists = data.data.list;
                    vm.smsType = data.data.list.key;
                }
                MaskUtil.RemoveLoading();
            });
        },
        //获取客户属性
        getParam:function(){
            var data = {
            };
            MaskUtil.Loading();
            API.getParam(data, function(res) {
                if (res.code == 200) {
                    vm.cusPropertys = res.data.list;
                } else {
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            })
        },
        //获取微页面
        getPage:function(){
            var data = {
            };
            MaskUtil.Loading();
            API.getPage(data, function(res) {
                if (res.code == 200) {
                    vm.microPages = res.data.list;
                }else{
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            })
        },
        //新建页面
        newlyData:function(){
            this.tagShow = true;
            this.micropagetit ="新建短信";
            this.smsType='';//短信类型
            this.smsName='';//模板名称
            this.smsSign='';//短信签名
            this.smsSignTxt='';//短信签名
            this.content = '';//短信内容
            console.log($('input[name="smsType"]'));
            $('input[name="smsType"]').prop("checked",false);
        },
        //点击插入客户属性弹窗
        custProperty:function(){
            this.editShow = true;
            this.selfShow = true;
            this.editorTit = "插入客户属性";
        },
        //点击插入短链接弹窗
        myLink:function(){
            this.editShow = true;
            this.selfShow = false;
            this.editorTit = "插入短链接";
            this.microPage = "";
            this.otherPage = "";
        },
        //关闭弹窗
        closeEdit:function(){
            this.editShow = false;
        },
        //插入客户属性确定按钮
        custPropertySure:function(){
            if (vm.cusProperty == '') {
                dcrmAlertWarning("请选择客户属性");
                return;
            }
            if (vm.maxProperty == '') {
                dcrmAlertWarning("请输入预计该属性最大字数");
                $("#maxProperty").focus();
                return;
            }
            if (vm.nullProperty == '') {
                dcrmAlertWarning("请输入属性为空默认内容");
                $("#nullProperty").focus();
                return;
            }
            vm.editShow = false;
            vm.content += '[attr]'+ vm.cusProperty +'!'+ vm.nullProperty + '[/attr]';
        },
        //插入短链接确定按钮
        myLinkSure:function(){
            if($("#microLink").prop("checked")){
                if(vm.microPage == ""){
                    dcrmAlertWarning("请选择微页面");
                    return;
                }
                vm.slinkPage = vm.microPage;
            }
            if($("#otherLink").prop("checked")){
                if(vm.otherPage == ""){
                    dcrmAlertWarning("请输入其它页的短链接");
                    return;
                }
                vm.slinkPage = vm.otherPage;
            }
            vm.editShow = false;
            vm.content += ' [url]' + vm.slinkPage + '[/url] ';
        },
        //获取短信
        getSms:function(id){
            var that = this;
            var data = {
                id:id
            };
            MaskUtil.Loading();
            API.getSms(data, function(res) {
                if (res.code == 200) {
                    $(".tag-select").html("");
                    var obj = res.data.sms;
                    vm.status = obj.status;
                    that.micropagetit ="编辑页面";
                    that.micropageid = obj.id;//页面id
                    that.smsType = obj.smsType;//模板类型
                    that.smsName = obj.smsName;//模板名称
                    that.smsSign = isNull(obj.smsSignId);//短信签名
                    //$("#smsSign").find("option[value = '"+obj.smsSignId+"']").attr("selected",true);
                    vm.smsSignTxt = $('#smsSign').find("option[value ='"+isNull(obj.smsSignId)+"']").html();//短信预览中的签名
                    that.content = obj.content;
                    console.log(that.smsType);

                    //短信预览内容
                    /*var _con = obj.content;//内容
                    console.log(_con);
                    if(_con.indexOf("<")!=-1){
                        var _content = $(obj.content).html();//内容
                        var reg = /<(\S*?)[^>]*>/ig ;
                        _content = _content.replace(reg,"");
                        that.content = _content;
                    }else{
                        if(_con.indexOf("&nbsp;")!=-1){
                            _con=_con.replace(/[ ]|[&nbsp;]/g, ' ');
                            that.content = _con;
                            console.log(that.content);
                        }else{
                            that.content = obj.content;
                        }
                    }*/
                    //短信预览内容 end





                    if(obj.smsSignId == null){
                        obj.smsSignId == ''
                    }

                    /*******************内容标签赋值****************************/
                    var _search = obj.ideaTag;//obj.ideaTag
                    if(_search){
                        vm.searchs = _search.split(",");//后台返回的数组
                    }else{
                        vm.searchs = [];
                    }
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

                }
                MaskUtil.RemoveLoading();
            });
            setTimeout(function () {
                if(vm.status == "1"||vm.status == "2"){
                    $('.smsEdit').find('input').attr("readonly","readonly");
                    $('.smsEdit').find('select').attr("disabled","disabled");
                    $(".chosen-choices").addClass("disabled");
                    $('.cover_edit').show();
                    $(".tagDis").show();
                    $('.save').attr("disabled","disabled");
                }else{
                    $('.smsEdit').find('input').removeAttr("readonly");
                    $('.smsEdit').find('select').removeAttr("disabled");
                    $(".chosen-choices").removeClass("disabled");
                    $('.cover_edit').hide();
                    $(".tagDis").hide();
                    $('.save').removeAttr("disabled");
                }
            },200);
        },
        //保存页面
        savepage:function(){
            //获取内容标签
            var choices =$(".chosen-choices").find(".search-choice").find("span");
            var ideas = [];//内容标签数组
            $.each(choices,function(i,u){
                ideas.push($(u).html());
            });
            vm.ideaTag = ideas.join(",");
            console.log(vm.ideaTag);
            //获取内容标签 end


            //获取内容
            /*editor.sync();
            //var html=document.getElementById('addeditor_id').value;//原生API
            var html = $('.editor_sms').val();
            $("#schtmlnr").val(html);//把KindEditor产生的html代码放到schtmlnr里面，用于提交
            //获取内容 end
            console.log($("#schtmlnr").val());*/

            /****************去掉<span>和&nbsp;******************/
           /* var _con = $("#schtmlnr").val();
            var content;
            if(_con.indexOf("<")!=-1){
                var reg = /<(\S*?)[^>]*>/ig ;
                _con = _con.replace(reg,"");
                content = _con;
            }else{
                if(_con.indexOf("&nbsp;")!=-1){
                    _con=_con.replace(/[ ]|[&nbsp;]/g, ' ');
                    content = _con;
                }else{
                    content = _con;
                }
            }*/
            /****************去掉<span>和&nbsp;******************/




            var that = this;
            var data = {
                smsType:this.smsType,//短信类型
                smsName:this.smsName,//模板名称
                smsSignId:this.smsSign,//短信签名
                ideaTag:this.ideaTag,//内容标签
                content:this.content//内容
            };

            if (this.smsType == "" && this.smsType != "0") {
                dcrmAlertWarning('请选择短信类型');
                return false;
            }
            if (this.smsName == "") {
                dcrmAlertWarning('请输入短信名称');
                return false;
            }
            if (this.smsSign == "") {
                dcrmAlertWarning('请选择短信签名');
                return false;
            }
            if ($(".editor_sms").val() == "" ) {
                dcrmAlertWarning('请输入短信内容');
                return false;
            }
            if(this.micropagetit == "新建短信"){//代表新建保存
                API.createSms(data, function(data){
                    if(data.code == 200) {
                        //location = location;
                        window.location.href = API.baseUrl+baseUrl+"/view/marketing/sms/smspage.html";
                    }
                    else{
                        dcrmAlertWarning(data.msg);
                    }
                });
            }
            if(this.micropagetit == "编辑页面"){//代表编辑保存
                var param  ={
                    "id" : this.micropageid
                };
                $.extend(data,param);
                API.updateSms(data, function(data){
                    if(data.code == 200) {
                        that.isShow = true;
                        /*$('.ui-paging-container').eq(0).remove();
                         that.$options.methods.smslist(0,20);//刷新列表*/
                        window.location.href = API.baseUrl+baseUrl+"/view/marketing/sms/smspage.html";
                    }
                    else{
                        dcrmAlertWarning(data.msg);
                    }
                });
            }
        },
        //取消页面
        cancelpage:function(){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/sms/smspage.html";
        }
    }
})







