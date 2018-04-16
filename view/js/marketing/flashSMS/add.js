var isCard=window.location.search.split('&')[0].split('=')[0];
if(window.location.search.split('&')[1]){
    var type=window.location.search.split('&')[1].split('=')[1];
}


$(function(){
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_flashtouch").find("a").addClass("active");

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var id = (GetQueryString("id"));
    vm.getParam();//获取客户属性
    vm.chosen();


    if(id){
        vm.micropageid = id;
        vm.tagShow = false;
        vm.getTempById(id);
    }else{
        vm.newlyData();//新建页面
    }
    if(isCard=='?isCard'||type==1){
        $('.flashSMStitle').html('名片名称*');
        vm.flashType=1;
    }else{
        $('.flashSMStitle').html('弹信名称*');
        vm.flashType=2;
    }

})
//查询弹信模板列表并分页
var vm = new Vue({
    el: "#tanxineditpage",
    data: {
        tagShow:true,//编辑和新增的内容标签div
        status:'',//弹信状态
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
        flashType:'',//弹信类型
        flashName:'',//模板名称
        flashSign:'',//弹信签名
        content:'',//弹信内容
        micropageid:'',//页面编辑时需要
        //smsTypelists:[],//弹信类型列表
        ideaTaglists:[],//内容标签列表
        searchs:[],//编辑时获取的选中内容标签的值
        getSignLists:[],//弹信签名列表
        ideaTag:'',//内容标签
        cusPropertyArr:[]
    },
    methods: {
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
        custProperty:function(){
            this.editShow = true;
            this.selfShow = true;
            this.editorTit = "插入客户属性";
        },

        //新建页面
        newlyData:function(){
            this.tagShow = true;
            this.micropagetit ="新建弹信";
            this.flashType='';//弹信类型
            this.flashName='';//模板名称
            this.flashSign='';//弹信签名
            this.content = '';//弹信内容
            KindEditor.html('.editor_sms', "");//清空编辑器
        },
        //获取弹信
        getTempById:function(id){
            var that = this;
            var data = {
                id:id
            };
            MaskUtil.Loading();
            API.getTempById(data, function(res) {
                if (res.code == 200) {
                    $(".tag-select").html("");
                    var obj = res.data.sms;
                    vm.status = obj.status;
                    that.micropagetit ="编辑页面";
                    that.micropageid = obj.id;//页面id
                    that.flashType = obj.flashType;//模板类型
                    that.flashName = obj.flashName;//模板名称
                    that.flashSign = isNull(obj.flashSign);//弹信签名
                    if(obj.attrParam){
                        that.cusPropertyArr = JSON.parse(obj.attrParam);
                    }

                    that.content = obj.content;

                    if(obj.flashSign == null){
                        obj.flashSign == ''
                    }


                }
                MaskUtil.RemoveLoading();
                jslength(that.flashSign,that.content);
                // 提示还能输入几个汉字
                var elseNum=parseInt((118-lastNum)/2);
                if(elseNum>=0){
                    $('.elseNum').html(elseNum)
                }else{
                    $('.elseNum').html(0)
                }
                console.log(that.content);
                console.log(that.flashSign);
                console.log( that.cusPropertyArr);
                console.log(lastNum);

            });
            setTimeout(function () {
                if(vm.status == "1"||vm.status == "2"){
                    $("input,select,button").prop("disabled",true);
                    editor.readonly(true);
                    $(".chosen-choices").addClass("disabled");
                    $(".tagDis").show();
                }else{
                    $("input,select,button").prop("disabled",false);
                    $(".chosen-choices").removeClass("disabled");
                    $(".tagDis").hide();
                }

            },200);
        },
        //保存页面
        savepage:function(){

            var that = this;
            var data = {
                flashType:this.flashType,//弹信类型
                flashName:this.flashName,//模板名称
                flashSign:this.flashSign,//弹信签名
                content:this.content,//内容
                attrParam:JSON.stringify(this.cusPropertyArr)//保存的预计最大长度数组
            };
            console.log(data);
            if (this.flashName == "") {
                dcrmAlertWarning('请输入弹信名称');
                return false;
            }
            if (this.flashSign == "") {
                dcrmAlertWarning('请输入弹信签名');
                return false;
            }else if (this.flashSign.length>5) {
                dcrmAlertWarning('弹信签名不能超过5个字符');
                return false;
            }
            if ($(".editor_sms").val() == "") {
                dcrmAlertWarning('请输入弹信内容');
                return false;
            }

            // 计算弹信长度
            jslength();
            if(lastNum>118){
                dcrmAlertWarning('预计弹信内容已经超过59个字符,请重新编辑');
                return false;
            }

            if( this.micropagetit =="新建弹信"){//代表新建保存
                API.createSingleTemp(data, function(data){
                    if(data.code == 200) {
                        if(isCard=='?isCard'||type==1){
                            window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/list.html?isCard=true";
                        }else{
                            window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/list.html";
                        }
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
                API.updateTempById(data, function(data){
                    if(data.code == 200) {
                        that.isShow = true;

                        if(isCard=='?isCard'||type==1){
                            window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/list.html?isCard=true";
                        }else{
                            window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/list.html";
                        }
                    }
                    else{
                        dcrmAlertWarning(data.msg);
                    }
                });
            }
        },
        //取消页面
        cancelpage:function(){
            if(isCard=='?isCard'||type==1){
                window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/list.html?isCard=true";
            }else{
                window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/list.html";
            }

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
            var cusPropertyList={
                'cusProperty':vm.cusProperty,
                'maxProperty':vm.maxProperty,
                'nullProperty':vm.nullProperty
            }
            this.cusPropertyArr.push(cusPropertyList);

            vm.editShow = false;
            vm.content += '[attr]'+ vm.cusProperty +'!'+ vm.nullProperty + '[/attr]';

            setTimeout(function(){
                jslength();
                // 提示还能输入几个汉字
                var elseNum=parseInt((118-lastNum)/2)
                if(elseNum>=0){
                    $('.elseNum').html(elseNum);
                }else{
                    $('.elseNum').html(0);
                }
            },500);

        },
        //关闭弹窗
        closeEdit:function(){
            this.editShow = false;
        }
    }
})

//文本框输入时验证字数
$('.editor_sms').on('input',function(){

    jslength();
    // 提示还能输入几个汉字
    var elseNum=parseInt((118-lastNum)/2);
    if(elseNum>=0){
        $('.elseNum').html(elseNum);
    }else{
        $('.elseNum').html(0);
    }

});
var sum=0;
var attrSum=0;
var lastNum=0;
var signSum=0;
function jslength(flashSign,editorhtml){
    var propertySum=0;
    var html='';
    $.each(vm.cusPropertyArr,function(index,item){
        var cusPropertyStr='[attr]'+item.cusProperty+'!'+item.nullProperty+'[/attr]';

        if(editorhtml){
            html=editorhtml;
        }else{
            html=$(".editor_sms").val();
        }

        if(html.indexOf(cusPropertyStr)!=-1){

            var bigNum=0;
            if(parseInt(item.maxProperty)>=item.nullProperty.length){
                bigNum=parseInt(item.maxProperty)
            }else{
                bigNum=item.nullProperty.length
            }
            propertySum+=bigNum//所有属性预计最大长度之和
        }

    });

    //匹配所有的属性内容
    var regHtml=/\[attr\].+?\[\/attr\]/g;
    var attrArr=html.match(regHtml);
    var str='';
    if(attrArr){
        $.each(attrArr,function(index,item){
            str+=item
        });
    }

    //计算全部字符数
    sum=getStringLen(html)
    //计算所有属性的整体的字符数
    attrSum=getStringLen(str)
    // 计算弹信签名的长度
    if(flashSign){
        signSum=getStringLen(flashSign);
    }else{
        signSum=getStringLen($('.flashSign').val());
    }

    //计算实际已经输入字符
    lastNum=signSum+sum-attrSum+ propertySum*2;//弹信签名+文本框总字数-属性所有字数之和+预计属性最大字数之和(全算作中文，算2个字符)

}

$('.flashSign').on('input',function(){
    jslength();
    // 提示还能输入几个汉字
    var elseNum=parseInt((118-lastNum)/2);
    if(elseNum>=0){
        $('.elseNum').html(elseNum)
    }else{
        $('.elseNum').html(0)
    }
});


