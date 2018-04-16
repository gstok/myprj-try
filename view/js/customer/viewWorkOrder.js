$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_clue").find("a").addClass("active");


    vm.oid=window.location.search.split('=')[1];
    vm.view(vm.oid);

})
console.log(111)
var vm = new Vue({
    el: "#workOrderpage",
    data: {
        oid:'',//地址栏截取
        titlePop:'',//项目需求名称
        companyName:'',//公司名称
        idPop:'',//需求编号
        userNamePop:'',//提交人
        showSubmitTimePop:'',//提交时间
        dataNumLimitPop:'',//数据需求量
        showStartTimePop:'',//数据单开始时间
        dayNumPop:'',//需求单有效天数
        dateRangePop:'',//数据时间范围
        remarkPop:'',//说明
        status:'',//状态
        contentLists:{},//需求标签列表
        outputFieldLists:{},//输出的标签列表
        PassShow:false,//不通过弹窗是否显示
        examShow:false,//审核信息显示
        examTime:'',//审核时间
        examMan:'',//审核人
        examSm:''//审核说明


    },
    methods: {
        view:function(id){
            var data={
                id:id
            };
            MaskUtil.Loading();
            API.viewWorkOrder(data, function (res) {
                if (res.code == 200) {
                    var obj = res.data.workOrder;
                    console.log(obj.content);
                    console.log(JSON.parse(obj.content));
                    vm.companyName = obj.companyName;
                    vm.titlePop = obj.title;
                    vm.idPop = obj.id;
                    vm.userNamePop = obj.userName;
                    vm.dataNumLimitPop = obj.dataNumLimit;
                    function add0(m){return m<10?'0'+m:m }
                    if(obj.submitTime){
                        var time = new Date(obj.submitTime);
                        var y = time.getFullYear();
                        var m = time.getMonth()+1;
                        var d = time.getDate();
                        vm.showSubmitTimePop = y+'-'+add0(m)+'-'+add0(d);//提交时间
                    }
                    if(obj.startTime){
                        var time_ = new Date(obj.startTime);
                        var y_ = time_.getFullYear();
                        var m_ = time_.getMonth()+1;
                        var d_ = time_.getDate();
                        vm.showStartTimePop = y_+'-'+add0(m_)+'-'+add0(d_);//需求单开始时间
                    }

                    vm.dateRangePop = obj.dateRange;
                    vm.dayNumPop = obj.dayNum;
                    vm.remarkPop = obj.remark;
                    vm.contentLists = JSON.parse(obj.content);
                    vm.outputFieldLists = JSON.parse(obj.outputField);

                    if(obj.auditTime){
                        var _time_ = new Date(obj.auditTime);
                        console.log(_time_);
                        var _y_ = _time_.getFullYear();
                        var _m_ = _time_.getMonth()+1;
                        var _d_ = _time_.getDate();
                        var _h_ = _time_.getHours();
                        var _m_ = _time_.getMinutes();
                        var _s_ = _time_.getSeconds();
                        vm.examTime = _y_+'-'+add0(_m_)+'-'+add0(_d_)+' '+add0(_h_)+':'+add0(_m_)+':'+add0(_s_);//审核时间
                    }

                    vm.examMan = obj.auditUserName,//审核人
                    vm.examSm = obj.auditResult//审核说明
                    if(obj.status == 0){
                        vm.status = '未提交';
                    }if(obj.status == 1){
                        vm.status = '已提交';
                    }if(obj.status == 2){
                        vm.status = '未通过';
                    }if(obj.status == 3){
                        vm.status = '已确认';
                    }if(obj.status == 4){
                        vm.status = '取数中';
                    }if(obj.status == 5){
                        vm.status = '已入库';
                    }if(obj.status == 6){
                        vm.status = '已完成';
                    }if(obj.status == 8){
                        vm.status = '已撤回';
                    }
                    if(obj.status == 2 ||obj.status == 3||obj.status == 4||obj.status == 5||obj.status == 6){
                        vm.examShow = true;
                    }else{
                        vm.examShow = false;
                    }
                } else {
                    dcrmAlertError(res.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        /*//通过
        passData: function () {
            var data = {
                id:vm.oid,
                status:3
            };
            dcrmConfirm("您确定通过该需求单吗？", function () {
                MaskUtil.Loading();
                API.tjWorkOrder(data, function (res) {
                    if (res.code == 200) {
                        dcrmAlertSuccess("操作成功!");
                        vm.status = '已确认';
                    } else {
                        dcrmAlertError(res.msg);
                    }
                    MaskUtil.RemoveLoading();
                });
            });
        },*/
        //不通过弹窗
        /*NopassPoup: function () {
            vm.PassShow = true;
        },*/
        //不通过
        /*NopassData:function(){
            var data = {
                id:vm.oid,
                status:2,
                auditResult:$("#remarkp").val()
            };
            API.tjWorkOrder(data, function (res) {
                if (res.code == 200) {
                    dcrmAlertSuccess("操作成功!");
                    vm.PassShow = false;
                    vm.view(vm.oid);
                } else {
                    dcrmAlertError(res.msg);
                }
            });
        },*/
        //确定
        cancelpage: function() {
            window.location.href = "/view/customer/workOrder/workOrder.html";
        }
    }
});




