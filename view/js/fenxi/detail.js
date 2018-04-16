var result = "";
var tagName = "";
var sort = "";
var count =0;
var tableThead;
var basePath='';
$(function(){
    $(".page_win_btn02").on("click",function(){show_window(2)});
    $(".page_win_btn03").on("click",function(){viewmanage()});

    var w =  $(".tab_page_tbody").find("tr").width();
    var w2 =  $(".tdi_tab").width();
   if(w<w2 ){
	   $(".tab_page_tbody").css("width","100%");
	   $(".tab_page_tbody thead th").css("min-width","auto");
	   $(".tab_page_tbody thead td").css("min-width","auto");
   }


   //排序
  /* $('#detail_table').delegate('.click_th','click',function(){
	   count =1;
	   tagName = $(this).attr('data-tag_column');
	   if($(this).find('span').hasClass('sort-down')){
		   sort = 'ASC';
		   $(this).find('span').removeClass('sort-down').addClass('sort-up');
		   $(this).siblings().find('span').removeClass('sort-up').addClass('sort-down');
	   }else{
		   sort = 'DESC';
		   $(this).find('span').removeClass('sort-up').addClass('sort-down');
		   $(this).siblings().find('span').removeClass('sort-down').addClass('sort-up');
	   }
	   var pageNo = $("#page_no").val();

	   searchDetail(pageNo);
   }); */


    //初始化查询条件
    defaultSearch(generateFields,searchDetail,deepAggSearch);

    //翻页按钮颜色
    butColor();

    //搜索
    $("#search").click(function(){
    	if(ifAgg()){
    	    $("#loading_img").css({'background-position-y':'200px'});
            $("#loading_num").text('0');
            $("#detail_table").hide();
    	    $("#chart_loadbox2").fadeIn();
    	    deepAggSearch(1);
    	}else{
    	    //$("#chart_loadbox2").fadeIn(function(){load_s2('40')});
    	    searchDetail(1);
    	}
    });




    var totalPage =  Number($("#total_page").text());
      if(totalPage == 0){
    	  $("#page_no").val("0");
      }


    //向后翻页
    $("#next_page").click(function(){
        var pageNo = $("#page_no").val();
        var totalPage =  Number($("#total_page").text());
        if(pageNo<totalPage){
            pageNo++;
        }
        if(pageNo<=1){
            pageNo=1;
        }
        if(ifAgg()){
            deepAggSearch(pageNo);
        }else{
            searchDetail(pageNo);
        }
        butColor();
    });

    $("#page_no").keydown(function(e){
    	if(e.which==13){
    		var pageNo = $("#page_no").val();
            var totalPage =  Number($("#total_page").text());
            if(pageNo>totalPage){
               alert("页码数不能大于总页码数");
            }

    		if(ifAgg()){
                deepAggSearch(pageNo);
            }else{
                searchDetail(pageNo);
            }
    	}
    	butColor();
    });


    //向前翻页
    $("#pre_page").click(function(){
        var pageNo = $("#page_no").val();
        if(pageNo==1){
        	return false;
        }
        var totalPage =  Number($("#total_page").text());
        if(pageNo>1){
            pageNo--;
        }
        if(pageNo<=1){
            pageNo=1;
        }
        if(ifAgg()){
            deepAggSearch(pageNo);
        }else{
            searchDetail(pageNo);
        }
        butColor();
    });


    $(".tpttm_btnbg04").on("click",function(){
    	var queryval = buildSearchParam();
    	var str = JSON.stringify(queryval);

    	var check = ifAgg();

    	if(check){
    		location.href=basePath+'/export/exportdatajuhe?param='+encodeURI(encodeURI(str));
    	}else{
    		location.href=basePath+'/export/exportdata?param='+encodeURI(encodeURI(str));
    	}
    });

    //标签信息
    var tagsInfo=$("#tagsinfo").val();
    $('.tHead').html(creatThead());
});



//提醒用户勾选聚合项目过多
function alertUser(target){
    var flag = 0;
    $("#fields").find("input").each(function(){
        if($(this).attr("id")=="fields_last_li"){
            return;
        }
        if($(this).prop("checked")==true){
            flag++;
        }
    });

    if(flag>7){
        alert("聚合字段过多,请重新选择。");
        $(target).prop("checked",false);
    }
}
//反选时提醒用户勾选的聚合项目过多
function alertUserInvert(target){
    var flag = 0;
    $("#fields").find("input").each(function(){
        if($(this).attr("id")=="fields_last_li"){
            return;
        }
        if($(this).prop("checked")==true){
            flag++;
        }
    });
    var length = $("#fields").find("input").length-2;
    if(length-flag>7){
        alert("聚合字段过多,请重新选择。");
        $(target).prop("checked",false);
    }
    else{
        selectInvert();
    }
}


//等待效果
function load_s2(load_num){
	$("#loading_img").animate({'background-position-y':+(200-load_num)+'px'});
	$("#loading_num").text(load_num/2);
	if(load_num=='200'){
		$("#chart_loadbox2").fadeOut(1000,function(){$("#detail_table").show()});
	}
}

//发起post请求
function post(url, data, callback){
    data = JSON.stringify(data);
    var settings = {
        type: 'POST',
        url:url,
        data: data,
        async: true,
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function() { return true; },
        success: function(res) {
            callback(res);
        },
        error: function(result) {
            alert("请求出错");
        },
        complete: function() {}
    };
    $.ajax(settings);
}


//渲染查询条件
function generateFields(defaultCondition){
    var fieldsInfo = $("#tagsinfo").val();
    fieldsInfo = JSON.parse(fieldsInfo);
    var fieldsHtml="";
    var aggFields="<li style='color:#67c392'>聚合选择：</li>";
    for(var i=0;i<fieldsInfo.length;i++){
        var tagname = fieldsInfo[i].tagName;
        var defaultType = fieldsInfo[i].default_type;
        var tagColumn = fieldsInfo[i].tag_column;
        if(defaultType==1){
            fieldsHtml+= '<li data-type="'+defaultType+'" data-filedname="'+tagColumn+'" class="tab_page_schild">';
            if(tagColumn !='tag_hkdw_dbn'){
               fieldsHtml+=    '<div class="tpsc_lab">'+tagname+':</div>';
            }
            //填充默认查询条件
            if(defaultCondition && defaultCondition.param[tagColumn]){
                fieldsHtml+=    '<input type="text" class="tpsc_txt tpsc_tw01" placeholder="不限" value="'+defaultCondition.param[tagColumn]+'"/>';
            }
            else{
            	if(tagColumn !='tag_hkdw_dbn'){
            		 fieldsHtml+=    '<input type="text" class="tpsc_txt tpsc_tw01" placeholder="不限"/>';
            	}

            }
            fieldsHtml+= '</li>';
        }
        else if(defaultType==4){
            fieldsHtml+= '<li data-type="'+defaultType+'" data-filedname="'+tagColumn+'" class="tab_page_schild">';
            fieldsHtml+=    '<div class="tpsc_lab">'+tagname+':</div>';
            if(defaultCondition && defaultCondition.param[tagColumn]){
                var gte = defaultCondition.param[tagColumn].gte;
                if(gte){
                    fieldsHtml+=    '<input type="text" class="tpsc_txt tpsc_tw02" value="'+gte+'" placeholder="不限"/>';
                }else{
                    fieldsHtml+=    '<input type="text" class="tpsc_txt tpsc_tw02" placeholder="不限"/>';
                }
                fieldsHtml+=    '<div class="tpsc_lab">-</div>';
                var lt = defaultCondition.param[tagColumn].lt;
                if(lt){
                    fieldsHtml+=    '<input type="text" class="tpsc_txt tpsc_tw02" value="'+lt+'" placeholder="不限"/>';
                }else{
                    fieldsHtml+=    '<input type="text" class="tpsc_txt tpsc_tw02" placeholder="不限"/>';
                }
            }
            else{
                fieldsHtml+=    '<input type="text" class="tpsc_txt tpsc_tw02"  placeholder="不限" />';
                fieldsHtml+=    '<div class="tpsc_lab">-</div>';
                fieldsHtml+=    '<input type="text" class="tpsc_txt tpsc_tw02"   placeholder="不限"/>';
            }
            fieldsHtml+= '</li>';
        }
        //聚合勾选按钮
        if(defaultCondition && defaultCondition.fields){
            var fields = defaultCondition.fields;
            var flag = fields.indexOf(tagColumn);
            if(flag!=-1){
                aggFields+='<li><input type="checkbox" onclick="alertUser(this);" checked="true" class="tps_ckbox aggfields_input" name="'+tagColumn+'"/>'+tagname+'</li>';
            }
            else{
            	if(tagColumn !='tag_hkdw_dbn'){
            		aggFields+='<li><input type="checkbox" onclick="alertUser(this);" class="tps_ckbox aggfields_input" name="'+tagColumn+'"/>'+tagname+'</li>';
            	}
            }
        }
        else{
        	if(tagColumn !='tag_hkdw_dbn'){
        		aggFields+='<li><input type="checkbox" onclick="alertUser(this);" class="tps_ckbox aggfields_input" name="'+tagColumn+'"/>'+tagname+'</li>';
        	}

        }

    }
    //是否去重按钮

    aggFields+='<li class="tps_ckboxall" id="fields_last_li">';
    aggFields+=    '<input type="checkbox" onclick="alertUserInvert(this);" class="tps_ckbox" name=""/>反选 &nbsp;';
    aggFields+=    '<input type="checkbox" onclick="clearSelect();" class="tps_ckbox" name=""/>清空';
    aggFields+='</li>';

    var dublicate ='<li style="color:#67c392;float: left;">去重选择：</li>'
        dublicate+='<li ><input id="ifDublicate" type="checkbox" onclick="" class="class=tps_ckbox"/>手机号去重</li>';

    //算法模型
    var modelInfo = $("#modelinfo").val();
    modelInfo = JSON.parse(modelInfo);
    var modelInfoHtml="";
    for(var i in modelInfo){
        modelInfoHtml+= '<a class="alg_btn" data-id="'+modelInfo[i].id+'">'+modelInfo[i].name+'</a>';
    }
    $("#algorithm_model").html(modelInfoHtml);
    $("#query_condition").html(fieldsHtml);
    $("#fields").html(aggFields);
    $("#dublicate").html(dublicate);
}

//反选按钮
function selectInvert(){
    $("#fields").find("li").each(function(){
        if($(this).attr("id")=="fields_last_li"){
            return;
        }
        var prop = $(this).children("input").prop("checked");
        if(prop==true){
            $(this).children("input").prop("checked",false);
        }
        else{
            $(this).children("input").prop("checked",true);
        }
    });
}

//清空按钮
function clearSelect(){
    $("#fields").find("li").each(function(){
        if($(this).attr("id")=="fields_last_li"){
            return;
        }
        var prop = $(this).children("input").prop("checked");
        $(this).children("input").prop("checked",false);
    });
}

//翻页按钮显示效果
function butColor(){
    var pageNo = Number($("#page_no").val());
    var totalPage =  Number($("#total_page").text());
    if(pageNo<=1){
        $("#next_page").removeClass("tpt_Lbtn_none");
        $("#pre_page").addClass("tpt_Lbtn_none");
    }else if(pageNo>=totalPage){
        $("#next_page").addClass("tpt_Lbtn_none");
        $("#pre_page").removeClass("tpt_Lbtn_none");
    }else{
        $("#next_page").removeClass("tpt_Lbtn_none");
        $("#pre_page").removeClass("tpt_Lbtn_none");
    }
}

function viewmanage(){
	//查询数据
	jQuery.ajax({
		 type : 'POST',
	     url : basePath+'/searchCond/search.json?',
	     dataType : 'json',
		 success : function(data){

			 if(data && data.code == 200) {
				 viewSearchConditionData(data);
			 }else{
				 alert("查询出错["+data.code+"]"+data.msg);
			 }
		 },
 		error:function(textStatus,errorThrown) {
			alert(JSON.stringify(textStatus));
		}
	});
}

//显示数据
function viewSearchConditionData(data){
	 $("#searchmgrtableid  tr:not(:first)").empty();//清空表格数据
	 show_window(3);

	 $.each(data.data.list, function(i, item) {
		 var defau = "";
		 if(item.defaultFlag != 1){
			 defau = "<a class='a_blue tdit_link' href='javascript:void(0);' onclick=setDefault('"+item.id+"')>设为默认</a>";
		 }
		 var rowdata = "<tr>"+
		 				"<td>"+(i+1)+"</td>" +
		 				"<td><a class='a_blue' onmouseout=closeSearchCondition() onmouseover=viewSearchCondition('"+item.id+"','"+item.conditions+"','"+item.name+"') >"+ item.name +"</a></td>"+
		 				"<td>"+ new Date(item.createDate).Format("yyyy-MM-dd hh:mm:ss")+"</td>"+
		 				"<td><a class='a_blue' onclick=applicationCondition('"+item.id+"','"+item.conditions+"')>应用</a></td>"+
		 				"<td>"+defau+"<a class='a_blue tdit_link' href='javascript:void(0);' onclick=deleteSearchCondition('"+item.id+"')>删除</a></td>"+
		 				"</tr>";

		 $("#searchmgrtableid").append(rowdata);

	 });
}
//关闭查询条件
function closeSearchCondition(){
	closeDetail();
}
//查看查询条件
function viewSearchCondition(id, vlaue,name){
	$("#searchmgrtableid2").html("");//清空表格数据
	//调用前台显示
	show_windows(id, vlaue,name);
	var data = JSON.parse(vlaue);
	var str = "";
	str += '<div style="width:550px;">';

	if(data.fieldsName.length > 0){
		str += '<p class="field_p" >聚合条件：</p>';
		for(var i = 0;i<data.fieldsName.length;i++){
			str +=' <label class="field_label1" >'+data.fieldsName[i]+'</label> &nbsp' ;

		}
	}
	str +='<div style="height:10px;"></div>'
	if(data.queryParam.length > 0){
		str += '<p class="field_p">筛选条件：</p>';
		for( var j = 0;j<data.queryParam.length;j++){
			if(data.queryParam[j].rangeParam){
				str +=' ';
				str += '<label class="field_label" style="text-align:right" >'+data.queryParam[j].fieldCnName+'</label> ' +':'+ ' <label class="field_label" style="text-align:left"  >'+data.queryParam[j].rangeParam["gte"]+'~'+data.queryParam[j].rangeParam["lt"]+'</label>';
				str +=' ';
			}
			if(data.queryParam[j].value){
				str +=' ';
				str += '<label class="field_label" style="text-align:right" >'+data.queryParam[j].fieldCnName+'</label> ' +':'+ ' <label class="field_label" style="text-align:left"  >'+data.queryParam[j].value+'</label>';
				str +=' ';
			}

		}
	}
	if(data.queryParam.length <= 0 && data.fields.length <= 0){
		str +='<h1>没有保存任何条件</h1>';
	}
	$("#searchmgrtableid2").html(str);

}
//应用查询条件
function applicationCondition(id, value){
    value = JSON.parse(value);
    handleCondition(value,generateFields,searchDetail,deepAggSearch);
    $(".top_box_user_MWtexibtn").click();
	//调用前台方法应用
}
//删除查询条件
function deleteSearchCondition(id){
	jQuery.ajax({
		 type : 'POST',
	     url : basePath+'/searchCond/delete.json?',
	     data: jQuery.param({ "id": ""+id+"" }),
	     dataType : 'json',
		 success : function(data){

			 if(data && data.code == 200) {
				 alert("删除成功！");
				 viewSearchConditionData(data);//显示数据
			 }
		 },
		error:function(textStatus,errorThrown) {
			alert(JSON.stringify(textStatus));
		}
	});
}

//设置查询条件列表中的查询条件为默认查询条件
function setDefault(id){

	jQuery.ajax({
		 type : 'POST',
	     url : basePath+'/searchCond/setdefault.json',
	     dataType : 'json',
	     data: jQuery.param({ "id": ""+id+"" }),
		 success : function(data){

			 if(data && data.code == 200) {
				 alert("设置成功！");
				 viewSearchConditionData(data);//显示数据

			 }
		 },
		error:function(textStatus,errorThrown) {
			alert(JSON.stringify(textStatus));
		}
	});

}



//根据查询条件渲染明细列表到页面
function searchDetail(pageNo){
    var param = buildSearchParam();
    param.pageNo = pageNo;

    var url = basePath+"/search/client/searchDetail.json";
    post(url,param,function(res){
        var tableHtml = generateDtail(res);
        $(".tBody").html(tableHtml);
        $("#total_size").html(res.data.totalHits);
        $("#total_page").html(res.data.totalPage);
        $("#cost_time").html(" 耗时"+(res.data.costTime?res.data.costTime:0)+"ms ");
        $("#page_no").val(res.data.pageNo);
        var totalPage =  Number($("#total_page").text());
        if(totalPage == 0){
      	  $("#page_no").val("0");
        }

      //调整table的宽度
        var w =  $(".tab_page_tbody").find("tr").width();
        var w2 =  $(".detail_div").width();
       if(w<w2 ){
    	   $(".tab_page_tbody").css("width","100%");
    	   $(".tab_page_tbody thead th").css("min-width","auto");
    	   $(".tab_page_tbody thead td").css("min-width","auto");
       }


       $(".phoneNum").on("click",function(){
    	  // showDiv();
       })

       butColor();

    });

}
//构建表头
function creatThead(){
	var fieldsInfo = $("#tagsinfo").val();
    fieldsInfo = JSON.parse(fieldsInfo);
    var thead = "";
	thead+= "   <tr>";
	thead+= "     <th>序号</th>";
	var fieldLength = fieldsInfo.length;
	for(var i=0; i<fieldLength; i++){
	    thead+='<th class="click_th" data-tag_column ="'+fieldsInfo[i].tag_column+'" >'+fieldsInfo[i].tagName+'<span class="icon_i sort-down" ></span></th>';
		/* thead+="<th  >"+fieldsInfo[i].tagName+"</th>";*/
	}
	thead+="</tr>";
	return thead;
}


//生成明细列表hmtl
function generateDtail(res){
	console.log(res);
    var tableHtml="";
    var tagsnameInfo = transTagname();
    if(res.code ==200){
        var data = res.data;
        var pageSize = data.pageSize;
        var pageNo = data.pageNo;
        var fields = data.fields;
        var fieldLength = fields.length;
        var thead = "";
        	thead+= "   <tr>";
        	thead+= "     <th>序号</th>";
        var fieldLength = fields.length;
        for(var i=0; i<fieldLength; i++){
            thead+="<th class='click_th' >"+tagsnameInfo[fields[i]]+"<span class='icon_i sort-down' ></span></th>";
        }
        thead+="</tr>";
        $(".tHead").html(thead);
        var pageList = data.pageList;
        var length;
        var orderNum = pageSize*(pageNo-1);
        var tbody='';
        console.log( pageList.length);
        if(data.pageList && pageList.length>0){
            length = pageList.length;
            for(var i=0;i<length;i++){
                var info = pageList[i];
                tbody+='<tr>'
                tbody+='<td>'+(orderNum+i+1)+'</td>';
                console.log(fieldLength);
                for(var j=0;j<fieldLength;j++){
                    var field = fields[j];
                    console.log(field);
                    if(field == 'tag_hkdw_dbn' ){
                    	if(pageList[i][field] != ''){
                    		pageList[i][field] ='<span style="color:#82d5a7;display:inline-block;cursor:pointer">点击拨打</span> &nbsp;  <span style="color:#82d5a7;display:inline-block;cursor:pointer">发送短信</span>';
                    	}else{
                    		pageList[i][field] ='<span style="color:#ccc;display:inline-block;cursor:pointer">无号码</span>';
                    	}
                    }
                    tbody+='<td>'+pageList[i][field]+'</td>';
                }
                tbody+='</tr>';
            }

        } else{
            tbody +="暂无数据</tr>"
        }

        tableHtml = tbody;
    }
    else{
        tableHtml = "<h1>"+res.msg+"</h1>";
    }

    return tableHtml;
}

//组合其他参数，构建查询条件接口需要的参数
function buildSearchParam(){
    var fields = buildFields();
    var searchParam={
        "pageNo":1, //页码
        "pageSize":15, //每页数据大小
        "fields":fields.fieldsList, //查询字段
        "fieldsName":fields.fieldsName,
        "queryParam":buildQueryParam(), //查询参数
        "sorts":buildSort()
    }
    return searchParam;
}
//构建排序
function buildSort(){
	if(count ==0){
		return null;
	}else{
		var data = [{
			"fieldName":tagName,
            "fieldType":0,
            "sortType":sort,
		}];
		return data;
	}
}

//构建布尔组合的查询条件
function buildQueryParam(){
    var fieldsToCn = transTagname();
    var queryParam=new Array();
    $("#query_condition li").each(function(){
        var searchType=$(this).attr("data-type");
        var param;
        if(searchType==1){
            var value=$(this).children("input").val();
            if(!value){
                return;
            }
            var fieldName = $(this).attr("data-filedname");
            param = {
                "boolType":0,
                "fieldName":fieldName,
                "searchType":searchType,
                "value":value,
                "fieldCnName":fieldsToCn[fieldName]
            }
        }
        else if(searchType==4){
            var gt = $(this).children("input").eq(0).val();
            var lte = $(this).children("input").eq(1).val();
            if(!(gt || lte)){
                return;
            }
            var fieldName = $(this).attr("data-filedname");
            param = {
                "boolType":0,
                "fieldName":fieldName,
                "searchType":searchType,
                "fieldCnName":fieldsToCn[fieldName],
                "rangeParam":{
                    "gte":gt,
                    "lt":lte
                }
            }
        }
        queryParam.push(param);
    });

    //添加是否去重参数
    var ifDublicate =0;
    //searchType等于零为精确查询
    var param1={};
    var param={};
    if($("#ifDublicate").is(":checked")){
        param1 = {
            "boolType":0,
            "fieldName":"tag_is_distinct_flg",
            "searchType":0,
            "value":1,
            "fieldCnName":"是否去重"
        };
    }else{
        param1 = {
            "boolType":1,
            "fieldName":"tag_is_distinct_flg",
            "searchType":0,
            "value":1,
            "fieldCnName":"是否去重"
        };
    }


    queryParam.push(param1);
    return queryParam;
}

//构建需要显示的聚合字段参数
function buildFields(){
    var fields ={};
    var fieldsList = new Array();
    var fieldsName = new Array();
    $("#fields").find("input").each(function(){
        if($(this).parent().attr("id")=="fields_last_li"){
            return;
        }
        if($(this).prop("checked")==true){
            fieldsList.push($(this).attr("name"));
            fieldsName.push($(this).parent().text());
        }
    });
    fields.fieldsList = fieldsList;
    fields.fieldsName = fieldsName;
    return fields;
}

//获取默认查询条件,传递生成查询条件的函数，生成默认的查询页面
function defaultSearch(serachPanel,searchDetail,deepAggSearch){
    var url=basePath+"/searchCond/getdefault.json"
    var data = {};
    //调用接口获取默认查询参数
    post(url,data,function(res){
        if(res.code==200 && res.data.sc){
            var conditions = res.data.sc.conditions;
            conditions = JSON.parse(conditions)
            handleCondition(conditions,serachPanel,searchDetail,deepAggSearch)
        }else{
            handleCondition(null,serachPanel,searchDetail,deepAggSearch)
        }
    });
}
//处理默认条件的得到的数据，转换成前端容易处理的方式
function handleCondition(conditions,serachPanel,searchDetail,deepAggSearch){
    if(!conditions){
        serachPanel();
        searchDetail(1);
        return;
    }else{
        var queryParams = conditions.queryParam;
        var queryParamMap = {};
        //封装查询参数，方便根据参数名取出参数值
        for(var queryParam in queryParams){
            var param = queryParams[queryParam];
            var paramName = param.fieldName;
            var type = param.searchType;
            if(type == 1){
                queryParamMap[paramName]=param.value;
            }else if(type ==4){
                queryParamMap[paramName]={
                    "gte":param.rangeParam.gte,
                    "lt":param.rangeParam.lt
                }
            }
        }
        conditions.param = queryParamMap;
        serachPanel(conditions);
        if(conditions.fields && conditions.fields.length!=0){
            deepAggSearch(1);
        }
        else{
            searchDetail(1);
        }

    }
}


//生成聚合查询html页面
function deepAggSearch(pageNo){
    var param = buildSearchParam();
    param.pageNo = pageNo;
    var url = basePath+"/search/client/deepAggSearch.json";
    post(url,param,function(res){
    	result = res.data.list;
    	console.log(result);
        var tableHtml = buildDeepAggHtml(res);

        $(".tBody").html(tableHtml);
        $("#total_size").html(res.data.totalHits);
        $("#total_page").html(res.data.totalPage);
        $("#cost_time").html(" 耗时"+(res.data.costTime?res.data.costTime:0)+"ms ");
        $("#page_no").val(res.data.pageNo);
   	    load_s2('200');
   	    butColor();
    });

}
//构建聚合查询html页面
function buildDeepAggHtml(res){
    var html="";
    var mapping = transTagname();
    var num = 1;
    if(res.code==200){
        if(res.data.pageList){

            var thead="<tr>";
                thead+=   "<th>序号</th>";
            data = res.data;
            var pageSize = data.pageSize;
            var pageNo = data.pageNo;
            var fields = data.fields;
            for(var i in fields){
                thead+="<th>"+mapping[fields[i]]+"</th>";
            }
            thead+=     "<th>总数</th>";
            thead+="</tr>";
            var tbody="";
            var orderNum = pageSize*(pageNo-1);

            for(var i in data.pageList){
                tbody+="<tr>";
                var list = data.pageList[i];
                tbody+='<td>'+(orderNum+Number(i)+1)+'</td>';
                console.log(list);
                for(var i in fields){
                	 if( list.tag_hkdw_dbn!= undefined){
                         	if(list.tag_hkdw_dbn!= ''){
                         		list.tag_hkdw_dbn ='<span style="color:#82d5a7;display:inline-block;cursor:pointer">点击拨打</span> &nbsp;  <span style="color:#82d5a7;display:inline-block;cursor:pointer">发送短信</span>';
                         	}else{
                         		list.tag_hkdw_dbn ='<span style="color:#ccc;display:inline-block;cursor:pointer">无号码</span>';
                         	}
                     }
                    if(fields[i].indexOf("msu")==0){
                        tbody+=    '<td>'+parseInt(list[fields[i]])+'</td>';
                    }
                    else{
                        tbody+=    '<td>'+list[fields[i]]+'</td>';
                    }
                }
                tbody+='<td>'+list["count"]+'</td>';
                tbody+='</tr>';
            }
            $(".tHead").html(thead);
            html = tbody;
        }
        else{
            html+="<h1>暂无数据</h1>";
        }
    }
    else{
        html+="<h1>"+res.msg+"</h1>";
    }
    return html;
}

//递归构建聚合列表html,depth为fields的长度
function generateAggHtml(aggregations,depth,fields,mappings){
    var flag=0;
    var tmpList;
    var data = {};
    data.head="<th>序号</th>";
    data.body="";
    if(flag <= depth-1){
        return data;
    }
    var key = fields[flag];
    head.push(mappings(key));
    var buckets = aggregations[key].buckets;
    for(var bucket in buckets){
        tmpList.push(buckets[i].key);
        generateAggHtml(buckets[i],body,head);
    }
    body.push(tmpList);
}

//构造一个对象，以字段名为键，以中文名值为值
function transTagname(){
    var fieldsInfo = JSON.parse($("#tagsinfo").val());
    var fields ={};
    for(var i in fieldsInfo){
        fields[fieldsInfo[i].tag_column]=fieldsInfo[i].tagName;
    }
    return fields;
}


//判断是聚合还是明细
function ifAgg(){
    var ifAgg=0;
    var fieldsLength = $("#fields").find("input").length;
    $("#fields").find("input").each(function(){
        if($(this).parent().attr("id")=="fields_last_li"){
            return;
        }
        if($(this).prop("checked")==true){
            ifAgg++;
        }
    });
    if(ifAgg>0 && ifAgg<fieldsLength-2){
        return true;
    }
    else{
        return false;
    }
}