$(function(){
    $(".customerli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".customerli").find("span").attr("class","icon icon-jiantou");
    $(".customerli").find("ul #index_group").find("a").addClass("active");
    // emailList(0,20);//查询邮件模板列表并分页
})
var oid=window.location.search.split('=')[1];
//关闭页面返回详情页
function returnBack(){
 window.location.href = "/view/customer/group/groupDetail.html?oid="+oid;
}


var filterEvent=function(){
    $('.filterFirst').on('change',function(){
    var that=$(this)
    var data={
        'filterName':that.val(),
    };

    console.log(data.filterName)
    API.getFilter(data, function(res) {
        if(res.code == 200){
           // dcrmAlertSuccess(res.msg);
           var secondStr='<option value="">请选择</option>';
           if(data.filterName==4||data.filterName==3){

            that.next().next().show();
                for(var p in res.data){
                   console.log( p)
                   secondStr+='<option value="'+p+'">'+p+'</option>';
                }

                that.next().html(secondStr);
                //第二个单选框改变
                that.next().on('change',function(){
                    var thirdStr='<option value="">请选择</option>';
                    for(var p in res.data){
                        if(that.next().val()==p){
                            console.log(res.data[p])
                            $.each(res.data[p],function(index,item){
                                console.log(item)
                                thirdStr+='<option value="'+item+'">'+item+'</option>';
                            })
                        }
                    }
                    that.next().next().html('<select name="" class="thirdContent"></select>');
                    that.next().next().find('select').html(thirdStr);
                })
           }else if(data.filterName==1){
                that.next().next().show();
                var obj=res.data.pageData;
                $.each(obj,function(index,item){
                    secondStr+='<option value="'+item.attrName+'">'+item.attrName+'</option>';
                })
                that.next().html(secondStr);
                //第二个单选框改变
                that.next().on('change',function(){
                    var thirdStr='<option value="">请选择</option>';
                    $.each(obj,function(index,item){
                        if(that.next().val()==item.attrName){
                            console.log(item.attrType)
                            if(item.attrType=='digit'||item.attrType=='text'){
                                that.next().next().html('<input type="text" class="thirdContent">');
                            }else if(item.attrType=='select'){
                                 that.next().next().html('<select name="" class="thirdContent"></select>');
                                var arr=item.attrVal.split(';');
                                // console.log(arr)
                                if(arr.length){
                                    $.each(arr,function(indexs,items){
                                      thirdStr+='<option value="'+items+'">'+items+'</option>';
                                    })
                                }else{
                                    thirdStr+='<option value="">'+请选择+'</option>';
                                }
                                that.next().next().find('select').html(thirdStr);
                            }else if(item.attrType=='date'){
                                that.next().next().html('<input type="text" class="wicon thirdContent" placeholder="选择日期" readonly>');
                            }else if(item.attrType=='boolean'){
                                that.next().next().html('<select name="" class="thirdContent"><option value="是">是</option><option value="否">否</option></select>');
                            }
                        }
                    })
                })
            }else if(data.filterName==2){
                var obj=res.data.pageData;
                $.each(obj,function(index,item){
                    secondStr+='<option value="'+item.custFrom+'">'+item.custFrom+'</option>';
                })
                 that.next().html(secondStr);
                //隐藏第三个选项
                that.next().next().hide();
            }
           // groupList(0,20);
        }else{
            dcrmAlertError(res.msg);
        }
    })
})
}

 filterEvent();