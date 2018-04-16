/**
 * Created by Administrator on 2017/6/8 0008.
 */
var _s = $("#sortable").width() + ($("#micro-lrmargin").html()) * 2 + 2;
var lrm = $("#micro-lrmargin").html();//页面左右边距
var count;
var countedits =[];//编辑count
var counteditDiv;//编辑页面带有count的div

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
};

var id = (GetQueryString("id"));
$(function() {
    $('.btnArea,.bigIcon,.ttBox').show();
    $('.xcConfirm .popBox').css({height:'270px'});
    $('.xcConfirm .popBox .txtBox').css({margin:'10px 20px'});
    $(".marketli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".marketli").find("span").attr("class","icon icon-jiantou");
    $(".marketli").find("ul #index_pagetouch").find("a").addClass("active");
    vm.power();

    //60秒自动保存一次
    setInterval(function () {
        vm.savepage(1);
    },60000);

    $(window).bind("scroll", function () {
        var sTop = $(window).scrollTop();
        var sTop = parseInt(sTop);
        if (sTop >= 130) {
            $(".microMenu").removeClass("absolute").addClass("fixed");
        }
        else {
            $(".microMenu").removeClass("fixed").addClass("absolute");
        }
    });

    if(id){
        vm.nowDateTime();
        vm.editpage(id);//获取微页面
        setTimeout(function () {
            counteditDiv = $("#sortable").find(".ui-draggable");
            //console.log(counteditDiv);

            $.each(counteditDiv,function(i,u){
                var countedit = $(u).attr("data-id");
                //console.log($(u).attr("data-id"));
                countedits.push(countedit);
            });
            //console.log(countedits);
            var j = 0;
            for (var i=0;i<countedits.length ;i++ ){
                if(countedits[i]>j){
                    j = countedits[i];
                }
            }
            count = j;
            console.log(count);
        },800);
    }
    else{
        vm.createHtml();//新建页面
        vm.nowTime();
        count=0;
    }

    //微页面上下左右边距
    var MlN = $("#micro-lrmargin").html();//页面左右边距
    var MBN = $("#micro-tbmargin").html();//页面上下边距
    $('.sortable').css({'padding-left':MlN + 'px','padding-right':MlN + 'px','padding-top':MBN + 'px','padding-bottom':MBN + 'px',});

    //编辑删除按钮隐藏显示
    $("body").on('mouseenter','#sortable .ui-draggable',function(){
        $(this).find(".editgroup-box").show();
    });
    $("body").on('mouseleave','#sortable .ui-draggable',function(){
        $(this).find(".editgroup-box").hide();
    });
    //图片上传按钮隐藏显示
    $('.uploadpic').mouseenter(function () {
        $(this).find(".uploadpicbox").show();
    }).mouseleave(function () {
        $(this).find(".uploadpicbox").hide();
    });
    setTimeout(function () {
        vm.sortable();
    },1000)

});

var vm = new Vue({
    el: "#newlypage",
    data: {
        micropagetit:'新建页面',
        tagShow:true,//编辑和新增的内容标签div
        ideaTaglists:[],//内容标签列表
        editorCont:'',//文本内容
        ideaTag:'',//内容标签
        searchs:[],//编辑时获取的选中内容标签的值
        title:'',//标题
        summary:'',//摘要
        authorSign:'',//作者签名
        companySign:'',//企业签名
        isCludForm:'0',//是否包含表单
        date:'',//当前日期
        datetime:'',//当前时间
        imgUrl:[],//编辑器里面的图片地址
    },
    methods: {
        //微页面功能下面的操作
        power:function(){
            //微页面---编辑
            if(hasPermission("page", "UPDATE")){
                $('.microMenu').find('input,textarea').removeAttr("readonly");
                $('.microMenu').find('select').removeAttr("disabled");
                $('.cover_edit').hide();
                $('.save').removeAttr("disabled");
            }else{
                $('.microMenu').find('input,textarea').attr("readonly","readonly");
                $('.microMenu').find('select').attr("disabled","disabled");
                $('.cover_edit').show();
                $('.save').attr("disabled","disabled");
            }
        },
        //获取当前日期
        nowTime:function(){
            var mydate = new Date();
            var str = "" + mydate.getFullYear() + "-";
            str += (mydate.getMonth()+1) + "-";
            str += mydate.getDate();
            vm.date = str;
            //console.log(vm.date);
        },
        //获取当前日期时分秒
        nowDateTime:function(){
            var mydate = new Date();
            var str = "" + mydate.getFullYear() + "-";
            str += (mydate.getMonth()+1) + "-";
            str += mydate.getDate()+" ";
            str += mydate.getHours()+":";
            str += mydate.getMinutes()+":";
            str += mydate.getSeconds();
            vm.datetime = str;
            //console.log(vm.date);
        },
        //标签事件
        chosen:function(){
            setTimeout(function(){
                $(".chosen-choices").addClass("form-control");
                $(".tag-select,.tag-selectAdd").chosen({
                    search_contains: true,//可以让chosen搜索选项的中间及末尾字符
                    disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
                });
                $(".tag-select,.tag-selectAdd").trigger("liszt:updated");//更新选项

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

        //新建页面
        createHtml:function(){
            vm.tagShow = true;
            vm.getideaTag();//获取内容标签
            vm.chosen();
            var data = {};
            MaskUtil.Loading();
            API.createHtml(data, function(res) {
                if (res.code == 200) {
                    $("#newid").val(res.data.id);
                    //console.log($("#newid").val());
                }else{
                    dcrmAlertError(res.msg);
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
        //上传封面图
        up_face:function(){
            return $('#file').click();
        },
        //上传图片
        up_controlpic:function(){
            return $('#file-control').click();
        },
        //编辑页面弹窗
        editpage:function(id){
            vm.tagShow = false;
            vm.getideaTag();//获取内容标签
            vm.chosen();
            this.micropagetit ='编辑页面';
            var that = this;
            var data = {
                id:id
            };
            MaskUtil.Loading();
            API.getHtml(data, function(res) {
                if (res.code == 200) {
                    var obj = res.data.html;
                    that.title = obj.title;//标题
                    that.summary = obj.summary;//摘要
                    that.date = obj.displayCreateTime;//日期
                    that.authorSign = obj.authorSign;//作者签名
                    that.companySign = obj.companySign;//企业签名

                    $("#face_img").attr("src",obj.coverImgUrl);//封面图片
                    var _con = $(obj.content);//微页面内容
                    console.log(_con);



                    /*******************页面边距赋值****************************/
                    var conpadLeft = parseInt(_con[0].style.paddingLeft);//$("#sortable)的style的paddingleft
                    var conpadTop = parseInt(_con[0].style.paddingTop);//$("#sortable)的style的paddingtop
                    $("#micro-tbmargin").html(conpadTop);//上下边距
                    $("#micro-lrmargin").html(conpadLeft);//左右边距
                    console.log(conpadLeft);
                    setTimeout(function(){
                        $('body #micropage-tbmargin .ui-slider-handle').animate({left: conpadTop+'%'});//上下边距
                        $('body #micropage-tbmargin .ui-slider-range').animate({width: conpadTop+'%'});//上下边距
                        $('body #micropage-lrmargin .ui-slider-handle').animate({left: conpadLeft+'%'});//左右边距
                        $('body #micropage-lrmargin .ui-slider-range').animate({width: conpadLeft+'%'});//左右边距
                    },1200)
                    /*******************页面边距赋值****************************/





                    /*******************内容赋值****************************/
                    var conclass = (_con[0].className);//$("#sortable)的class名
                    var constyle = (_con[0].style.cssText);//$("#sortable)的style
                    var contDiv = (_con[0].children[2]);
                    //console.log(contDiv);
                    $(".sortableBox #sortable").attr("class",conclass);
                    $(".sortableBox #sortable").attr("style",constyle);
                    $(".sortableBox #sortable").find("#cont").remove();
                    $(".sortableBox #sortable").append(contDiv);
                    /*******************内容赋值****************************/




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


                    $(".editgroup-box").hide();

                }else{
                    dcrmAlertError(data.msg);
                }
                MaskUtil.RemoveLoading();
            });
        },
        //拖拽事件
        sortable:function() {
            var _s = $("#sortable").width() + ($("#micro-lrmargin").width()) * 2 + 2;
            //var W = $(".page-preview").width();
            $("#cont").sortable({
                revert: true
            });
            $(".draggable").draggable({
                connectToSortable: "#cont",
                helper: "clone",
                revert: "invalid",
                start: function (e) {
                    console.log(e.target.outerText);
                    count++;
                    $(".controlsGroup .draggable").attr('data-id', count);
                    //文本
                    if(e.target.outerText == "文本"){
                        $("#textinside-margin").html('0');
                        $("#txt-bordernum").html('0');
                        $("#textoutside-margin").html('0');
                        $('#inside-margin .ui-slider-handle').css({left: '0%'});
                        $('#inside-margin .ui-slider-range').css({width: '0%'});
                        $('#txt-border .ui-slider-handle').css({left: '0%'});
                        $('#txt-border .ui-slider-range').css({width: '0%'});
                        $('#outside-margin .ui-slider-handle').css({left: '0%'});
                        $('#outside-margin .ui-slider-range').css({width: '0%'});
                        $("#colorvalborder").value = "#000";//边框颜色
                        $(".controlsGroup #txt .txtcontent").css({padding: '0', margin: '0', borderWidth: '0'});
                        //$("#editor_id").val('请编辑内容');
                        editor.html('请编辑内容');
                        //editor.html('');
                    }
                    if(e.target.outerText == "图片"){
                        //图片
                        $('.controlsGroup #pics img').attr('src', '/view/images/img-default.png');
                        $('.editPhoto img').attr('src', '/view/images/img-default.png');
                    }

                    if(e.target.outerText == "分隔符"){
                        //分隔符
                        //var FgfId = $('.editFgf').siblings().attr('data-id');//分隔符组件data-id
                        $("#fgf-size").html('1');
                        $("#fgf-topmargin").html('20');
                        $("#fgf-bottommargin").html('20');
                        $('#fgfu-size .ui-slider-handle').css({left: '1%'});
                        $('#fgfu-size .ui-slider-range').css({width: '1%'});
                        $('#fgfu-topmargin .ui-slider-handle').css({left: '20%'});
                        $('#fgfu-topmargin .ui-slider-range').css({width: '20%'});
                        $('#fgfu-bottommargin .ui-slider-handle').css({left: '20%'});
                        $('#fgfu-bottommargin .ui-slider-range').css({width: '20%'});
                        $(".fgfbox").css({padding: '20px 0'});
                        $(".fgfmodel").css({height: '1px', 'background-color': '#000'});
                    }
                    if(e.target.outerText == "表单"){
                        //表单
                        $('.editzj input').val('');
                    }

                },
                drag: function() {
                    $( ".controlsGroup #pics,.controlsGroup #txt,.controlsGroup #fgf,.controlsGroup #tables" ).css('display','none');
                },
                stop: function () {
                    if ($('#sortable .draggable').length > 0) {
                        $('#sortable .draggable').removeClass('draggable');
                        $(this).siblings('.editzj').removeClass('hide').attr('data-id', count);
                    }
                    $('#sortable').find(".editgroup-box").hide();
                    var microlrnum = $("#micro-lrmargin").html();//页面左右边距
                    var microtbnum = $("#micro-tbmargin").html();//页面上下边距
                    var txtP = $("#textoutside-margin").html();//文本组件外边距
                    $("#sortable .control").remove();
                    //微页面上下左右边距
                    $('.sortable').css({
                        'padding-left': microlrnum + 'px',
                        'padding-right': microlrnum + 'px',
                        'padding-top': microtbnum + 'px',
                        'padding-bottom': microtbnum + 'px'
                    });
                    //微页面组件的宽度
                    //$(".sortable .ui-draggable").css({"width": W - microlrnum * 2 + 'px', height: 'auto'});
                    ///$(".sortable .ui-draggable").css({"width": W + 'px', height: 'auto'});
                    $(".sortable .ui-draggable").css({"width": "", height: 'auto'});
                    //文本组件
                    var dataId = $('.editTxt').siblings().attr('data-id');//文本组件data-id
                    $("#sortable #txt").css({
                        opacity: 1.0,
                        display:'block',
                        //width: W - 2 * microlrnum + 'px',
                        //width: _s - 2 * microlrnum + 'px',
                        padding: 0,
                        margin: 0,
                        height: 'auto'
                    });
                    editor.html('请编辑内容');
                    //KindEditor.html('#editor_email', "");//清空编辑器
                    $("#sortable").find('[data-id=' + dataId + ']').find("#txt").css({width: 748 - 2 * microlrnum + 'px'});
                    /*$("#sortable").find('[data-id=' + dataId + ']').find('.txtcontent').css({
                        "width": W - microlrnum * 2 + 'px', "border-color": "#000"
                    });*/
                    $("#sortable").find('[data-id=' + dataId + ']').find('.txtcontent').css({
                        "width": 748 - 2 * microlrnum + 'px',
                        "border-color": "#000",
                        "border": "0"
                    });
                    $("#sortable").find('[data-id=' + dataId + ']').find('.txtcontent').html("请编辑内容");
                    //图片组件
                    $("#sortable").find('[data-id=' + dataId + ']').find('#pics img').attr('src', '/view/images/img-default.png');
                    $('.editPhoto img').attr('src', '/view/images/img-default.png');
                    $("#sortable #pics").css({
                        opacity: 1.0,
                        display:'block',
                        width: _s - 2 * microlrnum + 'px',
                        padding: 0,
                        margin: 0,
                        height: 'auto'
                    });
                    $("#sortable #pics .picscontent").css("width", _s - 2 * microlrnum + 'px');
                    //分隔符
                    if ($('#sortable .fgfcontent').length > 0) {
                        var FgfId = $('.editFgf').attr('data-id');//分隔符组件data-id
                        var fgftnum = $(".controlsGroup").find('[data-id=' + FgfId + ']').find("#fgf-topmargin").html();//分隔符上边距
                        var fgfbnum = $(".controlsGroup").find('[data-id=' + FgfId + ']').find("#fgf-bottommargin").html();//分隔符下边距
                        var fgfsize = $(".controlsGroup").find('[data-id=' + FgfId + ']').find("#fgf-size").html();//分隔符尺寸
                        console.log(FgfId);
                        console.log(fgftnum);
                        console.log(fgfbnum);
                        console.log(fgfsize);
                    }
                    $("#sortable #fgf").css({
                        opacity: 1.0,
                        display:'block',
                        width: _s - 2 * microlrnum + 'px',
                        paddingLeft: 0,
                        paddingRight: 0,
                        margin: 0,
                        height: 'auto'
                    });
                    $("#sortable #fgf .fgfcontent").css("width", _s - 2 * microlrnum + 'px');
                    $("#sortable").find('[data-id=' + FgfId + ']').find('#fgf').css({
                        'padding-top': fgftnum + 'px', 'padding-bottom': fgfbnum + 'px'
                    });//分隔符上下边距
                    $("#sortable").find('[data-id=' + FgfId + ']').find('.fgfcontent').css({'height': fgfsize + 'px'});//分隔符尺寸
                    //表单
                    var datatabkeId = $('.edittables').attr('data-id');
                    var html = $('.edittables .tabsSlider').html();
                    $('[data-id=' + datatabkeId + ']').find('.tablescontent').html(html);
                    $('[data-id=' + datatabkeId + ']').find('.tablescontent').parent().removeClass('hide');
                    $('[data-id=' + datatabkeId + ']').find('.tablescontent').parent().css('height', 'auto');
                    $('#sortable').find('#tables').removeClass('hide');
                    $("#sortable #tables").css({
                        opacity: 1.0,
                        display:'block',
                        //width: W + 'px',
                        padding: 0,
                        'margin-bottom':'30px',
                        height: 'auto'
                    });
                    //$("#sortable #tables .tablescontent").css("width", W + 'px');
                    $("#sortable .tabBtn").show();


                }
            });
            //编辑文本内边距
            $("#inside-margin").slider({
                range: "min",
                value:0,
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    $("#textinside-margin").html(ui.value);
                    var dataId = $('.editTxt').attr('data-id');
                    $('[data-id=' + dataId + ']').find('.txtcontent').css('padding', $("#textinside-margin").html() + 'px');
                }
            });
            //编辑文本外边距
            $("#outside-margin").slider({
                range: "min",
                value:0,
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    var microlrnum = $("#micro-lrmargin").html();//页面左右边距
                    $("#textoutside-margin").html(ui.value);
                    var dataId = $('.editTxt').attr('data-id');
                    var _W = $("#textoutside-margin").html();//文本外边距
                    //$('#sortable').find('[data-id=' + dataId + ']').find('.txtcontent').css({
                    //'margin': _W + 'px', 'width': $('[data-id=' + dataId + ']').find('#txt').width() + 2*lrm - 2*_W -2*($('[data-id=' + dataId + ']').find('#txt-bordernum').html())+ 'px'
                    //'margin': _W + 'px', 'width': 750+ 'px'
                    //});

                    $("#sortable").find('[data-id=' + dataId + ']').find("#txt").css({width: 748 - 2 * microlrnum + 'px'});
                    $("#sortable").find('[data-id=' + dataId + ']').find('.txtcontent').css({
                        'margin': _W + 'px',"width": 748 - 2 * microlrnum  - 2*_W + 'px'
                    });
                }
            });
            //编辑文本边框尺寸
            $("#txt-border").slider({
                range: "min",
                value: 0,
                min: 0,
                max: 20,
                slide: function (event, ui) {
                    $("#txt-bordernum").html(ui.value);
                    var dataId = $('.editTxt').attr('data-id');
                    $('[data-id=' + dataId + ']').find('.txtcontent').css({'border-width': $("#txt-bordernum").html() + 'px'});
                }
            });
            //编辑文本边框颜色
            $("#colorvalborder").on('change', function () {
                var dataId = $('.editTxt').attr('data-id');
                $("#sortable").find('[data-id=' + dataId + ']').find('.txtcontent').css({'border-color': $('#colorvalborder').val()});
            });
            //页面上下边距
            $("#micropage-tbmargin").slider({
                range: "min",
                value: 20,
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    $("#micro-tbmargin").html(ui.value);
                    $('.sortable').css('paddingTop', $("#micro-tbmargin").html() + 'px');
                    $('.sortable').css('paddingBottom', $("#micro-tbmargin").html() + 'px');
                }
            });
            //页面左右边距
            $("#micropage-lrmargin").slider({
                range: "min",
                value: 20,
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    $("#micro-lrmargin").html(ui.value);
                    var padnum = $("#micro-lrmargin").html();//页面左右边距
                    $('.sortable').css('paddingLeft', padnum + 'px');
                    $('.sortable').css('paddingRight', padnum + 'px');
                    //微页面组件的宽度
                    //$(".sortable .ui-draggable").css({"width": _s - padnum * 2 + 'px'});
                    $("#sortable .ui-draggable").css("width",'');
                    $("#sortable #pics").css({
                        opacity: 1.0,
                        width:748- 2*padnum + 'px',
                        padding: 0,
                        margin: 0
                    });
                    var fgfDiv = $("#sortable").find(".fgfcontent");
                    if (fgfDiv.length > 0) {
                        $("#sortable #fgf").css({opacity: 1.0,margin: 0,width:748- 2*padnum + 'px',});
                        $.each(fgfDiv, function (i, u) {
                            var fgfT = parseInt($(u).css('padding-top'));//上边距
                            var fgfB = parseInt($(u).css('padding-bottom'));//下边距
                            $(u).closest("#txt").css({'padding-top': fgfT + 'px','padding-bottom': fgfB + 'px'});
                        });
                    }


                    $("#sortable #tables").css({
                        opacity: 1.0,
                        width: 748- 2*padnum + 'px',
                        padding: 0,
                        margin: '0 0 30px 0'
                    });
                    $("#sortable #pics .picscontent,#sortable #tables .tablescontent,#sortable #fgf .fgfcontent").css("width", 748 - padnum * 2 + 'px');

                    var txtDiv = $("#sortable").find(".txtcontent");
                    if (txtDiv.length > 0) {
                        $("#sortable #txt").css({opacity: 1.0, padding: 0, margin: 0});
                        $.each(txtDiv, function (i, u) {
                            var tM = parseInt($(u).css('margin'));//外边距
                            var tP = parseInt($(u).css('padding'));//内边距
                            $(u).css({width: 748- 2*padnum - 2 * tM + 'px'});
                            $(u).closest("#txt").css({width: 748- 2*padnum + 'px'});
                        });
                    }
                }
            });
            //页面背景
            $("#colorvalmicrobg").on('change', function () {
                $('.sortable').css('backgroundColor', $('#colorvalmicrobg').val());
            });
            //分隔符尺寸
            $("#fgfu-size").slider({
                range: "min",
                value: 1,
                min: 1,
                max: 20,
                slide: function (event, ui) {
                    $("#fgf-size").html(ui.value);
                    var dataId = $('.editFgf').attr('data-id');
                    console.log(dataId);
                    $('#sortable').find('[data-id=' + dataId + ']').find(".fgfcontent").css('height', $("#fgf-size").html() + 'px');
                    $(".fgfmodel").css('height', $("#fgf-size").html() + 'px');
                }
            });
            //分隔符上边距
            $("#fgfu-topmargin").slider({
                range: "min",
                value: 20,
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    $("#fgf-topmargin").html(ui.value);
                    var _dataId = $('.editFgf').attr('data-id');
                    $('#sortable').find('[data-id=' + _dataId + ']').find('#fgf').css('paddingTop', $("#fgf-topmargin").html() + 'px');
                    $(".fgfbox").css('paddingTop', $("#fgf-topmargin").html() + 'px');
                }
            });
            //分隔符下边距
            $("#fgfu-bottommargin").slider({
                range: "min",
                value: 20,
                min: 0,
                max: 100,
                slide: function (event, ui) {
                    $("#fgf-bottommargin").html(ui.value);
                    var dataId = $('.editFgf').attr('data-id');
                    $('#sortable').find('[data-id=' + dataId + ']').find('#fgf').css('paddingBottom', $("#fgf-bottommargin").html() + 'px');
                    $(".fgfbox").css('paddingBottom', $("#fgf-bottommargin").html() + 'px');
                }
            });
            //分隔符颜色
            $(".fgf-colorval").on('change', function () {
                var dataId = $('.editFgf').attr('data-id');
                $('#sortable').find('[data-id=' + dataId + ']').find(".fgfcontent").css('background', $('.fgf-colorval').val());
                $(".fgfmodel").css('background', $('.fgf-colorval').val());
            });

            //删除
            $("body").on('click', '.delete', function () {
                $(this).closest(".ui-draggable").remove();
                $('.editzj').addClass('hide');
                editor.html('请编辑内容');
                //editor.html('');
            })
            //编辑
            $("body").on('click', '.upEdit', function () {
                count++;
                var s = $(this).attr('class').split(' ')[0];
                s = s.substring(0, s.length - 3);
                var obj = '#' + s;
                $(obj).closest("li").find('.editzj').removeClass('hide');
                $(obj).parent().siblings('.editzj').attr('data-id', count);
                var that = $(this);
                that.closest(".ui-draggable").attr('data-id', count);
                //文本
                var txthtml = $(this).closest(".ui-draggable").find(".txtcontent").html();//文本内容
                //console.log(txthtml);
                editor.html(txthtml);//文本内容
                //vm.editorCont = txthtml;
                var _inside = parseInt($(this).closest(".ui-draggable").find(".txtcontent").css('padding'));//内边距
                $("#textinside-margin").html(_inside);//内边距
                $('#inside-margin .ui-slider-handle').css({left: _inside + '%'});//内边距
                $('#inside-margin .ui-slider-range').css({width: _inside + '%'});//内边距
                var _outside = parseInt($(this).closest(".ui-draggable").find(".txtcontent").css("margin"));//外边距
                $("#textoutside-margin").html(_outside);//外边距
                $('#outside-margin .ui-slider-handle').css({left: _outside + '%'});//外边距
                $('#outside-margin .ui-slider-range').css({width: _outside + '%'});//外边距
                var _borderW = parseInt($(this).closest(".ui-draggable").find(".txtcontent").css("border-width"));//边框尺寸
                $("#txt-bordernum").html(_borderW);//边框尺寸
                $('#txt-border .ui-slider-handle').css({left: _borderW + '%'});//边框尺寸
                $('#txt-border .ui-slider-range').css({width: _borderW + '%'});//边框尺寸
                var _borderC = $(this).closest(".ui-draggable").find(".txtcontent").css("border-color");//边框颜色
                var dataidC = $(this).closest(".ui-draggable").attr('data-id');
                //console.log(_borderC);
                //console.log(dataidC);
                $('[data-id=' + dataidC + ']').find('.colorval').value = _borderC;
                //console.log($('[data-id=' + dataidC + ']').find('.colorval').val());
                //图片
                var picsrc = $(this).closest(".ui-draggable").find(".picscontent").attr('src');
                $("#control-pic").attr("src", picsrc);
                //分隔符
                var borderF = parseInt($(this).closest(".ui-draggable").find(".fgfcontent").css("height"));//分隔符尺寸
                $("#fgf-size").html(borderF);//分隔符尺寸
                $('#fgfu-size .ui-slider-handle').css({left: borderF + '%'});//分隔符尺寸
                $('#fgfu-size .ui-slider-range').css({width: borderF + '%'});//分隔符尺寸
                var marginT = parseInt($(this).closest(".ui-draggable").find(".fgfcontent").parent().css("padding-top"));//上边距
                $("#fgf-topmargin").html(marginT);//上边距
                $('#fgfu-topmargin .ui-slider-handle').css({left: marginT + '%'});//上边距
                $('#fgfu-topmargin .ui-slider-range').css({width: marginT + '%'});//上边距
                var marginB = parseInt($(this).closest(".ui-draggable").find(".fgfcontent").parent().css("padding-bottom"));//下边距
                $("#fgf-bottommargin").html(marginB);//下边距
                $('#fgfu-bottommargin .ui-slider-handle').css({left: marginB + '%'});//下边距
                $('#fgfu-bottommargin .ui-slider-range').css({width: marginB + '%'});//下边距
                var backgFgf = $(this).closest(".ui-draggable").find(".fgfcontent").css("background");//分隔符颜色
                $(".fgf-colorval").value = backgFgf;//分隔符颜色
                $(".fgfbox").css({'padding-top': marginT + 'px', 'padding-bottom': marginB + 'px'});
                $(".fgfmodel").css({'height': borderF + 'px', 'background-color': backgFgf});
            });
            //取消按钮
            $("body").on('click', '.cancel', function () {
                $(this).closest(".editzj").addClass('hide');
                editor.html('请编辑内容');
                //editor.html('');
            });
            //确定按钮
            $("body").on('click', '.sure', function () {
                $(this).closest(".editzj").addClass('hide');
            });
            //文本确定按钮
            $("body").on('click', '#txtSure', function () {
                $(this).closest(".editzj").addClass('hide');
                var html = editor.html();
                //console.log(html);
                var dataId = $('.editTxt').attr('data-id');
                $('[data-id=' + dataId + ']').find('.txtcontent').html(html);

                $("#sortable").find('[data-id=' + dataId + ']').find('.txtcontent img').css({
                    "max-width":$("#sortable").find('[data-id=' + dataId + ']').find(".txtcontent").width()
                });
                //editor.html('请编辑内容');
            });
        },
        //保存页面
        savepage:function(type){
            var choices =$(".chosen-choices").find(".search-choice").find("span");
            var ideas = [];//内容标签数组
            $.each(choices,function(i,u){
                ideas.push($(u).html());
            });
            //console.log(ideas);
            vm.ideaTag = ideas.join(",");
            console.log(vm.ideaTag);

            if($("#sortable").find(".tablescontent").length == 0){
                vm.isCludForm = 0;
            }else{
                vm.isCludForm = 1;
            }

            /********改变图片地址********/
            var datasrc = '';
            $.each($("img[src]"),function(i,u){
                datasrc = $(u).attr("src");
                console.log(datasrc);
                if(datasrc.indexOf("idea_temp") > -1){
                    datasrc =  datasrc.replace("idea_temp","idea");
                    $(u).attr("src",datasrc);
                }
            });
            /********改变图片地址 end********/

            var ideaTag = this.ideaTag,//内容标签
                title = this.title,//标题
                summary = this.summary,//摘要
                authorSign = this.authorSign,//作者签名
                companySign = this.companySign,//企业签名
                isCludForm = this.isCludForm;
            content = $(".sortableBox").html();//微页面内容
            if($.trim(title) == ""){
                dcrmAlertWarning("标题不能为空");
                return false;
            }
            if($.trim(summary) == ""){
                dcrmAlertWarning("摘要不能为空");
                return false;
            }
            if($.trim(authorSign) == ""){
                dcrmAlertWarning("作者签名不能为空");
                return false;
            }
            if($.trim(companySign) == ""){
                dcrmAlertWarning("企业签名不能为空");
                return false;
            }
            if($.trim(content) == ""){
                dcrmAlertWarning("微页面内容不能为空");
                return false;
            }



            var data = {
                ideaTag:ideaTag,//内容标签
                title:title,//标题
                summary:summary,//摘要
                authorSign:authorSign,//作者签名
                companySign:companySign,//企业签名
                isCludForm:isCludForm,//是否含有表单
                content:content//微页面内容
            };
            if(this.micropagetit == '新建页面'){//代表新建保存
                var param  ={
                    "id" : $("#newid").val()
                };
                $.extend(data,param);
            }
            if(this.micropagetit == '编辑页面'){//代表编辑保存
                var param  ={
                    "id" : id
                };
                $.extend(data,param);
            }
            API.updateHtml(data, function(data){
                if(data.code == 200) {
                    if(type){
                        dcrmAlertSuccess('系统已自动保存微页面'+vm.datetime);
                        $('.btnArea,.bigIcon,.ttBox').hide();
                        $('.xcConfirm .popBox').css({height:'118px'});
                        $('.xcConfirm .popBox .txtBox').css({margin:'43px 0 0 0'});
                        setTimeout(function () {
                            $('.xcConfirm').hide()
                        },2000)
                    }else{
                        window.location.href = API.baseUrl+baseUrl+"/view/marketing/micro/micropage.html";
                    }
                }else{
                    dcrmAlertError(data.msg);
                }
            });
        },
        //取消页面
        cancelpage:function(){
            window.location.href = API.baseUrl+baseUrl+"/view/marketing/micro/micropage.html";
        }
    }
})



//上传图片
function upData() {
    var imgPath = $("#file-control").val();
    //判断上传文件的后缀名
    var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
    if (strExtension != 'jpg' && strExtension != 'jpeg'&& strExtension != 'gif'&& strExtension != 'png') {
        dcrmAlertWarning("请选择jpg,jpeg,gif,png格式的图片");
        $("#file-control").val("");
        return;
    }
    var maxsize = 2*1024*1024;//2M
    var fileSize = 0;
    var obj_file = document.getElementById("file-control");
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
    console.log(fileSize);
    if(id){//编辑
        var data = {
            id:id
        }
    }else{//新建
        var data = {
            id:$("#newid").val()
        }
    }
    MaskUtil.Loading();
    $.ajaxFileUpload({
        type: "post",
        url: API.baseUrl+"/user-apis/pc/weChat/htmlImageUpLoad.action",
        data: data,
        dataType: 'json',
        secureuri:false,
        fileElementId:'file-control',
        async : false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            console.log(data);
            if(data.code == 200) {
                dcrmAlertSuccess(data.msg);
                $("#control-pic").attr("src",data.data.tempUrl);
                var dataId=$('.editPhoto').attr('data-id');
                $('[data-id='+dataId+']').find('.picscontent').attr("src",data.data.tempUrl);//临时地址
                $('[data-id='+dataId+']').find('.picscontent').attr("data-src",data.data.applyUrl);//提交时的地址
            }else{
                dcrmAlertError(data.msg);
            }
            MaskUtil.RemoveLoading();
        },
        error: function (data,e)//服务器响应失败处理函数
        {
            dcrmAlertError(data.msg);
            MaskUtil.RemoveLoading();
        }
    });
}
//上传封面图
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
    if(id){//编辑
        var data = {
            id:id
        }
    }else{//新建
        var data = {
            id:$("#newid").val()
        }
    }
    MaskUtil.Loading();
    $.ajaxFileUpload({
        type: "POST",
        url: API.baseUrl+"/user-apis/pc/weChat/htmlCoverImageUpLoad.action",
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
                $("#face_img").attr("src",data.data.tempUrl);
                $("#face_img").attr("data-src",data.data.applyUrl);
            }else{
                dcrmAlertError(data.msg);
            }
            MaskUtil.RemoveLoading();
        },
        error: function (data)//服务器响应失败处理函数
        {
            console.log("aaa="+data.html());
            dcrmAlertError(data.msg);
            MaskUtil.RemoveLoading();
        }
    });
}

//编辑器里面上传图片
setTimeout(function(){
    $(".ke-icon-myImg").on("click",function(){
        return $('#fileEdit').click();
    });
},500);

function upDataEdit() {
    var imgPath = $("#fileEdit").val();
    //判断上传文件的后缀名
    var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
    if (strExtension != 'jpg' && strExtension != 'jpeg'&& strExtension != 'gif'&& strExtension != 'png') {
        dcrmAlertWarning("请选择jpg,jpeg,gif,png格式的图片");
        $("#fileEdit").val("");
        return;
    }
    var maxsize = 2*1024*1024;//2M
    var fileSize = 0;
    var obj_file = document.getElementById("fileEdit");
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
    console.log(fileSize);
    if(id){//编辑
        var data = {
            id:id
        }
    }else{//新建
        var data = {
            id:$("#newid").val()
        }
    }
    MaskUtil.Loading();
    $.ajaxFileUpload({
        type: "post",
        url: API.baseUrl+"/pc/weChat/htmlImageUpLoad.action",
        data: data,
        dataType: 'json',
        secureuri:false,
        fileElementId:'fileEdit',
        async : false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            console.log(data);
            if(data.code == 200) {
                dcrmAlertSuccess(data.msg);
                $("#fileEdit").val("");
                editor.sync();
                var html = $('#editor_id').val();
                $("#schtmlnr").val(html);//把KindEditor产生的html代码放到schtmlnr里面，用于提交
                KindEditor.html('#editor_id',html+'<img src="'+data.data.tempUrl+'" data-src="'+data.data.applyUrl+'"/>' );//tempUrl是临时地址  applyUrl是提交时的地址


                editor.sync();
                var newhtml = $('#editor_id').val();
                console.log(newhtml);
                console.log($(newhtml));
                $.each($(newhtml),function(i,u){
                    if(u.localName == "img"){
                        if(u.width>378){
                            u.width = 378
                        }
                    }
                })


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

var editor;
KindEditor.ready(function(K) {
    editor = K.create('#editor_id',{
        width : '380px',
        height:'260px',
        resizeType :1,
        allowPreviewEmoticons:false,
        allowImageUpload:true,//允许上传图片
        allowFileManager:true, //允许对上传图片进行管理
        //uploadJson:'js/kindeditor-4.1.10/jsp/upload_json.jsp', //上传图片的java代码，只不过放在jsp中
        //fileManagerJson:'js/kindeditor-4.1.10/jsp/file_manager_json.jsp',
        afterUpload: function(){this.sync();}, //图片上传后，将上传内容同步到textarea中
        afterCreate : function(){this.sync();},
        afterBlur: function(){this.sync();},   ////失去焦点时，将上传内容同步到textarea中
        items : [
            'fontname','fontsize', '|','forecolor', 'hilitecolor','bold', 'italic','underline',
            'removeformat','|', 'justifyleft','justifycenter', 'justifyright','insertorderedlist',
            'insertunorderedlist','|', 'emoticons','link','media','|','myImg']
    });
});
