$(function(){
    $(".setli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
    $(".setli").find("ul #index_accessSet").find("a").addClass("active");

})
if(window.location.search.split('&&')[0]){
  var sceneId=window.location.search.split('&&')[0].split('=')[1];
}
if(window.location.search.split('&&')[1]){
  var sceneCd=window.location.search.split('&&')[1].split('=')[1];
}
if(window.location.search.split('&&')[2]){
  var roleId=window.location.search.split('&&')[2].split('=')[1];
}
if(window.location.search.split('&&')[3]){
  var name=window.location.search.split('&&')[3].split('=')[1];
}

queryFieldList();

function queryFieldList(){
    var data={
        roleId:roleId,
        sceneCd:sceneCd
    };
    MaskUtil.Loading();
    API.queryFieldList(data,function(data){
        if(data&&data.code==200&&data.data){
            var arr1=data.data.list;
            var arr2=data.data.roleFieldList;
            console.log(arr2);
            // 初始化列表
            if(arr1&&arr1.length){
            	var str='';
                var caozuo;
	            $.each(arr1,function(index,item){
                    var type=item.type;

                    var val=item.sceneVals;//初始值
                    var valcon='';
                    var valstr=JSON.stringify(val);
                    // 拼接值，先显示初始值
                    $.each(val,function(index,item){
                        valcon+=item.val+';';
                    });
                    // if(item.code=="is_has_child"||item.code=="is_has_room"||item.code=="is_has_car"){
                    //    if(item.val=='1;'){
                    //         valcon= '是;'
                    //    }else if(item.val=='0;'){
                    //         valcon='否;'
                    //    }else if(item.val=='是;否;'){
                    //         valcon= '0;1;'
                    //    }
                    // }
                    // 初始化隐藏
                    var isshowstr= '<input type="checkbox" name="" class="isshow" ><label for="isshow" >隐藏</label>';
                    // 初始化加密
                    var isencrypt= '<input type="checkbox" name="encrypt" class="encrypt" ><label for="encrypt" >加密</label>';
                    //arr2覆盖arr1的值
                    if(arr2.length){
                        $.each(arr2,function(i,u){

                            if(item.id==u.id){
                                // 如果用户已经设定值，则附上值
                                valcon=u.selectVal;
                                // if(u.id==8||u.id==9||u.id==10){
                                //    if(u.selectVal=='1;'){
                                //         valcon= '是;'
                                //    }else if(u.selectVal=='0;'){
                                //         valcon='否;'
                                //    }else if(u.selectVal=='0;1;'){
                                //         valcon= '是;否;'
                                //    }
                                // }

                                if(u.code=="is_has_child"||u.code=="is_has_room"||u.code=="is_has_car"){
                                   if(u.selectVal=='1;'||u.selectVal=='1；'){
                                        valcon= '是;'
                                   }else if(u.selectVal=='0;'||u.selectVal=='0；'){
                                        valcon='否;'
                                   }else if(u.selectVal=='0;1;'||u.selectVal=='0；1；'){
                                        valcon= '是;否;'
                                   }
                                }
                                // 如果用户选了隐藏，则隐藏选中，反之隐藏不选中
                                if(u.isShow==1){
                                    isshowstr='<input type="checkbox" name="" class="isshow" checked><label for="isshow" >隐藏</label>';
                                }

                                // 如果用户选了加密，则加密选中，反之加密不选中
                                if(u.isCheck==1){
                                    isencrypt= '<input type="checkbox" name="encrypt" class="encrypt" checked><label for="encrypt" >加密</label>';
                                }
                            }
                        })
                    }

                    if(type==0){

                        caozuo='<td class="caozuo">'+isshowstr+'</td>'

                    }else if(type==4){

                        caozuo=  "<td class='caozuo'>"+isshowstr+
                        "<span onclick='setDateVal(\""+item.name+"\","+valstr+","+item.id+")' class='pointer'><i class='icon icon-shezhi seticon'></i>设置字段值</span></td>";
                    }else{

                        caozuo= '<td class="caozuo">'+isshowstr+isencrypt+
                    '    </td>'
                    }



	                str+='<tr id="'+item.id+'" data-type="'+item.type+'" data-code="'+item.code+'">'+
		            '    <td class="cursorDefault">'+item.name+'</td>'+
		            '    <td class="val" data-name="'+item.name+'"><span>'+valcon+'</span></td>'+caozuo+
		            '</tr>';
	            })
	            $('#datapermissionList tbody').html(str);
                if($('.val[data-name="省份"]').length>0){
                    var str=$('.val[data-name="省份"]').find('span').html().split(';').join(',');
                    // 去掉最后一个逗号
                    str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
                    console.log(str)
                    var data={
                        nameList:str
                    }
                    API.queryCityCodeByNames(data,function(data){
                        var list=data.data.list;
                        var codeStr=''
                        $.each(list,function(i,u){
                            codeStr+=u.code+',';
                        })
                        // 去掉最后一个逗号
                        codeStr=(codeStr.substring(codeStr.length-1)==',')?codeStr.substring(0,codeStr.length-1):codeStr;
                        $('.val[data-name="省份"]').attr('data-code',codeStr)
                    })

                }
                if($('.val[data-name="城市"]').length>0){
                    var str=$('.val[data-name="城市"]').find('span').html().split(';').join(',');
                    // 去掉最后一个逗号
                    str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
                    console.log(str)
                    var data={
                        nameList:str
                    }
                    API.queryCityCodeByNames(data,function(data){
                        var list=data.data.list;
                        var codeStr=''
                        $.each(list,function(i,u){
                            codeStr+=u.code+',';
                        })
                        // 去掉最后一个逗号
                        codeStr=(codeStr.substring(codeStr.length-1)==',')?codeStr.substring(0,codeStr.length-1):codeStr;
                        $('.val[data-name="城市"]').attr('data-code',codeStr)
                    })

                }


            }else{
            	$('#datapermissionList tbody').html('<tr><td colspan="4" class="textcenter"><i class="icon icon-icon nodata"></i>暂无数据</td></tr>');
            }
        }
        MaskUtil.RemoveLoading();
    })

}



// 设置字段值
function setDateVal(name,valstr,id){
    console.log(valstr)

    // 每次都动态生成select多选。以便能完美使用插件效果。
    $('#dataselect').html(' <select id="dataVal"  multiple style="width:400px;height: 38px;" ></select>')

    // 清除下拉框选中状态
    clearInfo();
    // 渲染弹出框的左侧名字
    $('#dataKey').html(name);
    var str=''
    // 除省市区外其他的下拉框渲染
    $.each(valstr,function(index,item){
        if(item.val==0){
            item.val='是'
        }else if(item.val==1){
            item.val='否'
        }
        str+=' <option value="'+item.val+'" data-id="'+item.id+'">'+item.val+'</option>'
    })

    $('#dataVal').html(str);

    //省份渲染
    if($('#dataKey').html()=='省份'){
        var data={};
        var provincestr='';
        MaskUtil.Loading();
        API.getProvince(data,function(data){
            var obj=data.data.province;

            $.each(obj,function(index,item){
                provincestr+='<option value="'+item.name+'" data-code="'+item.code+'">'+item.name+'</option>'
            })
             MaskUtil.RemoveLoading();
        })
        $('#dataVal').html(provincestr);
    }

    // 城市渲染
    if($('#dataKey').html()=='城市'){
        // 获取省份的code,拼接数组，循环获取city
        if($('.val[data-name="省份"]').attr('data-code')){
           var cityList=$('.val[data-name="省份"]').attr('data-code');
           var citystr='';
           // $.each(cityList,function(index,item){
                var data={
                    fCode: cityList
                };

                API.getCity(data,function(data){
                    var obj=data.data.city;
                    $.each(obj,function(index,item){
                        citystr+='<option value="'+item.name+'" data-code="'+item.code+'">'+item.name+'</option>'
                    })
                })

           // })
           $('#dataVal').html(citystr);

       }else{
            dcrmAlertError('请先设置省份');
            return;
       }

    }

    // 区县渲染
    if($('#dataKey').html()=='县/区'){
        // 获取城市的code,拼接数组，循环获取县区
        if($('.val[data-name="城市"]').attr('data-code')){
            var coutryList=$('.val[data-name="城市"]').attr('data-code');
            var coutrystr='';

                var data={
                    fCode: coutryList
                };

                API.getCity(data,function(data){
                    var obj=data.data.city;
                    $.each(obj,function(index,item){
                        coutrystr+='<option value="'+item.name+'" >'+item.name+'</option>'
                    })
                })


            $('#dataVal').html(coutrystr);
        }else{
            dcrmAlertError('请先设置城市');
            return;
        }
    }

     //更新插件
     $("#dataVal").multiselect({
        noneSelectedText : "--请选择--", //当没有内容选中时候显示的文本
        checkAllText : "全选", //全选按钮显示的文本
        uncheckAllText : "全不选", //全不选按钮显示的文本
        minWidth : 300, //select框的宽度，根据option的内容长短设置
        selectedList : 100000 //当选中的内容超过n条时，显示“n已选择”
    });

    var modelContent=$('#setDate');//弹窗最外层
    var contentInfo=$('#setDate .contentInfo');//弹窗内层
    frameDiv(modelContent,contentInfo);//弹窗操作
    window.setDateValId=id;

}
/*设置字段值保存*/
function addsure(){
    console.log($('[id='+window.setDateValId+']').find('.val'))
    console.log($('#dataVal').val())
    // 获取弹出框下拉框的值，是个数组
    var dataValList=[];
    if($('#dataVal').val()){
      var dataValList=$('#dataVal').val();
    }

    var datacode='';
    var dataVal='';
    $.each(dataValList,function(index,item){
        datacode+=$('#dataVal').find('option[value="'+item+'"]').attr('data-code')+',';
        // dataVal+=(+index+1)+'.'+item+';';
        dataVal+=item+';';
        // 相应id的字段值显示修改。将下拉框选的值附在列表中
    })
    // 去掉最后一个逗号
    datacode=(datacode.substring(datacode.length-1)==',')?datacode.substring(0,datacode.length-1):datacode;
    // 将选中的字段值附在列表中
    $('[id='+window.setDateValId+']').find('.val span').html(dataVal);
    // 将选中值的code附在attr中，以便省市区调用(只有省市区需要code)
    $('[id='+window.setDateValId+']').find('.val').attr('data-code',datacode)

    $('#setDate').fadeOut();
    $('.bg').fadeOut();

}

var API1={
post: function (url, data,async, callback, errorcallback) {
        var settings = {
            type: 'POST',
            url: API.baseUrl+url,
            data: data,
            cache: false,
            async: async,
            dataType: 'json',
            contentType:"application/json",
            // contentType: 'application/json',
            beforeSend: function () {
                return true;
            },
            success: function (res) {
                if(res.code == 401){
                   window.location.href = API.baseUrl+"/login.html";
                }else{
                    callback(res);
                }

            }

        };
        $.ajax(settings);
    },
     //数据权限保存
    createRoleAccess:function(param,callback){
        API1.post(" /pc/access/createRoleAccess.action",param,true,callback);
    },
}
// 用户设置整体保存
function allsave(){
    var data={};
    var sceneBeans=[];
    var trs=$('#datapermissionList tbody tr');
    $.each(trs,function(index,item){
        var obj={};
        // 字段id
        obj.id=$(item).attr('id');
        // 是否显示
        if($(item).find('.isshow').prop('checked')){
          obj.isShow= 1
        }else{
          obj.isShow= 0;
        }
        // 是否加密
        if($(item).find('.encrypt').prop('checked')){
          obj.isCheck= 1
        }else{
          obj.isCheck= 0;
        }
        //字段值
        // if(){}
        var myselectVal=$(item).find('.val span').html();
        if($(item).attr('data-code')=="is_has_child"||$(item).attr('data-code')=="is_has_room"||$(item).attr('data-code')=="is_has_car"){
           if(myselectVal=='是;'||myselectVal=='是；'){
                obj.selectVal= '1;'
           }else if(myselectVal=='否;'||myselectVal=='否；'){
                obj.selectVal= '0;'
           }else if(myselectVal=='是;否;'||myselectVal=='是；否；'){
                obj.selectVal= '0;1;'
           }
        }else{
            obj.selectVal= myselectVal;
        }

        // 角色id  所有字段都一样
        // obj.roleId=roleId;
        // 操作类型
        obj.type=$(item).attr('data-type');
        sceneBeans.push(obj)
    });
    data.roleId=roleId;
    data.sceneId=sceneId;
    data.sceneBeans=sceneBeans;
    console.log(JSON.stringify(data))
    API1.createRoleAccess(JSON.stringify(data),function(data){
        console.log(data)
         if(data&&data.code==200){
            dcrmAlertSuccess(data.msg);
             queryFieldList();
            window.location.href = "/view/setting/role/role.html?roleId="+roleId+"&&name=" +escape(name);
         }else{
            dcrmAlertError(data.msg)
         }
    })

}
function returnback(){
    window.location.href = "/view/setting/role/role.html?roleId="+roleId+"&&name=" +escape(name);
}