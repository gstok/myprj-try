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



        vm.micropageid = id;
        vm.tagShow = false;
        vm.getTempById(id);

});
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
        //获取弹信
        getTempById:function(id){
            var that = this;
            var data = {
                id:id
            };
            MaskUtil.Loading();
            API.getTempById(data, function(res) {
                if (res.code == 200) {
                    $("input").attr("readonly",true);
                    $(".tag-select").html("");
                    var obj = res.data.sms;
                    vm.status = obj.status;
                    that.micropagetit ="查看页面";
                    that.micropageid = obj.id;//页面id
                    that.flashType = obj.flashType;//模板类型
                    that.flashName = obj.flashName;//模板名称
                    that.flashSign = isNull(obj.flashSign);//弹信签名

                    that.content = obj.content;

                    if(obj.flashSign == null){
                        obj.flashSign == ''
                    }
                }
                MaskUtil.RemoveLoading();

            });
            //editor.readonly(true);
        },

        //取消页面
        cancelpage:function(){
            if(isCard=='?isCard'||type==1){
                window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/list.html?isCard=true";
            }else{
                window.location.href = API.baseUrl+baseUrl+"/view/marketing/FlashSMS/list.html";
            }

        }
    }
});




