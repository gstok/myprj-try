/**
 * Created by Administrator on 2017/6/7 0007.
 */
// plugin #插入客户属性
KindEditor.lang({
    customerProperty : '插入客户属性'
});
KindEditor.plugin('customerProperty', function(K) {
    var self = this, name = 'customerProperty';
    self.clickToolbar(name, function() {
        var lang = self.lang(name + '.');
        var cusProperty = '';
        var data = {
        };
        MaskUtil.Loading();
        API.getParam(data, function(res) {

            if (res.code == 200) {
                cusProperty ="<option value=''>请选择</option>";
                $.each(res.data.list,function(i,u){
                    cusProperty+="<option value='"+u.attrKey+"' >"+u.attrName+"</option>";
                });

            }else{
                dcrmAlertError(res.msg);
            }
            MaskUtil.RemoveLoading();
        });
         var html = '<div style="padding:10px 20px;">'+
                '<div class="searchgroup">'+
                '<div class="form-group">'+
                '<label style="width:130px">属性名称</label>'+
                '<select class="form-control ke-code-type" id="cusProperty" style="width:260px">'+
                ''+cusProperty+''+
                '</select>'+
                '</div>'+
                '<div class="form-group">'+
                '<label style="width:130px">预计该属性最大字数为*</label>'+
                '<input type="text" class="form-control" id="maxProperty" style="width:260px" placeholder="请输入该属性最大值">'+
                '</div>'+
                '<div class="form-group">'+
                '<label style="width:130px">属性为空默认内容*</label>'+
                '<input type="text" class="form-control" id="nullProperty" style="width:260px" placeholder="请输入属性为空默认内容">'+
                '</div>'+
                '</div>'+
                '</div>',
            dialog = self.createDialog({
                name : name,
                width : 450,
                title : self.lang(name),
                body : html,
                yesBtn : {
                    name : self.lang('yes'),
                    click : function(e) {
                        var type = K('.ke-code-type', dialog.div).val(),
                            nullProperty = $("#nullProperty").val(),
                            cusProperty = $("#cusProperty").val(),
                            html = '[attr]'+ K.escape(cusProperty)+'!'+K.escape(nullProperty) + '[/attr]';
                        /*cls = type === '' ? '' :  ' lang-' + type,
                         html = '【 class="prettyprint' + cls + '">\n' + K.escape(cusProperty) + '】 ';*/
                        if (K.trim(cusProperty) === '') {
                            dcrmAlertWarning("请选择客户属性");
                            return;
                        }
                        if (K.trim(nullProperty) === '') {
                            dcrmAlertWarning("请输入预计该属性最大字数");
                            $("#maxProperty").focus();
                            return;
                        }
                        if (K.trim(nullProperty) === '') {
                            dcrmAlertWarning("请输入属性为空默认内容");
                            $("#nullProperty").focus();
                            return;
                        }
                        self.insertHtml(html).hideDialog().focus();
                    }
                }
            })
    });
});
// plugin #插入短连接
KindEditor.lang({
    myLink : '插入短链接'
});
KindEditor.plugin('myLink', function(K) {
    var self = this, name = 'myLink';
    self.clickToolbar(name, function() {
        var lang = self.lang(name + '.');
        var microPage = '';
        var data = {
        };
        MaskUtil.Loading();
        API.getPage(data, function(res) {
            if (res.code == 200) {
                microPage ="<option value=''>请选择</option>";
                $.each(res.data.list,function(i,u){
                    microPage+="<option value='"+u.ideaUrl+"' >"+u.title+"</option>";
                });
                console.log(microPage);
            }else{
                dcrmAlertError(res.msg);
            }
            MaskUtil.RemoveLoading();
        });
        var  html = '<div style="padding:10px 20px;">'+
                '<div class="searchgroup">'+
                '<div class="form-group" style="line-height: 40px;padding-left: 32px;">注意: 短链接有效期为90天</div>'+
                '<div id="slink">'+
                '<div class="form-group">'+
                '<input type="radio" name="slink" id="microLink" style="width:22px;float: left;margin-left: 28px;margin-top: 10px;" checked/><span style="width:80px;float: left;line-height: 34px;">微页面</span>'+
                '<label style="width:250px">'+
                '<select class="form-control" style="width:250px" id="microPage">'+
                ''+microPage+''+
                '</select>'+
                '</label>'+
                '</div>'+
                '<div class="form-group">'+
                '<input type="radio" name="slink" id="otherLink" style="width:22px;float: left;margin-left: 28px;margin-top: 10px;"/><span style="width:80px;float: left;line-height: 34px;">其它页</span>'+
                '<label style="width:250px">'+
                '<input type="text" class="form-control" id="otherPage" style="width:250px" placeholder="请输入其它页短链接">' +
                '</label>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>',
            dialog = self.createDialog({
                name : name,
                width : 450,
                title : self.lang(name),
                body : html,
                yesBtn : {
                    name : self.lang('yes'),
                    click : function(e) {
                        var type = K('.ke-code-type', dialog.div).val();
                        if($("#microLink").prop("checked")){
                            console.log("microLink");
                            var slink = $("#microPage").val(),
                                html = ' [url]' + K.escape(slink) + '[/url] ';
                            if (K.trim(slink) === '') {
                                dcrmAlertWarning("请选择微页面");
                                $("#otherPage").focus();
                                return;
                            }
                        }
                        if($("#otherLink").prop("checked")){
                            console.log("otherLink");
                            var slink = $("#otherPage").val(),
                                html = ' [url]' + K.escape(slink) + '[/url] ';
                            if (K.trim(slink) === '') {
                                dcrmAlertWarning("请输入其它页的短链接");
                                $("#otherPage").focus();
                                return;
                            }
                        }
                        /*var slink = $('input[name="slink"]:checked').parent().find('.form-control').val(),
                            html = '' + K.escape(slink) + '';*/
                        /*cls = type === '' ? '' :  ' lang-' + type,
                         html = '<pre class="prettyprint' + cls + '">\n' + K.escape(slink) + '</pre> ';*/
                        self.insertHtml(html).hideDialog().focus();
                    }
                }
            })
    });
});

// plugin #插入图片
KindEditor.lang({
    myImg : '插入图片'
});
KindEditor.plugin('myImg', function(K) {

});

