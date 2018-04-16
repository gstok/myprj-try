var SMSlist ="";//批量发短信，短信列表

$(function(){
	$(".customerli").find("ul").show();
	$(".menuNormal").find("a").removeClass("active");
	$(".customerli").find("span").attr("class","icon icon-jiantou");
	$(".customerli").find("ul #index_customer").find("a").addClass("active");
	$("#datagrid-mask-msg").html("页面正在加载...");

	function getAtr(ele){
		API.getAttrVal({cd:ele}, function(data) {
	        var obj=data.data.attrVal;
	        //if(ele == 'custom_tag'){
				var str = '';
		        $.each(obj,function(index,item){
		            str+='<option  value="'+item+'">'+item+'</option>'
		        });
		        $(".attrVal").html(str);
		        $(".attrVal").multiselect({
			        noneSelectedText: "请选择",
			        selectedList: 1000000,
			        minWidth:150
			    });//普通筛选的标签选择
			    $(".attrVal").multiselect("refresh");
	        //}else{
	        	/*$("."+ele).typeahead({
		   		   source: obj,
		   		   display: 'attrTagName',
		           val: 'attrTagName',
		           minLength: 2
		   		});*/
	        //}
	    });
	}


    $("#attrValsel").on('change',function(){
    	var atval = $("#attrValsel").val();
    	getAtr(atval);
    	$(".ui-multiselect").show();
    	if(atval == ''){
    		$(".ui-multiselect").hide();
    	}
    })
	allStage();//获取全部销售阶段
	allSource();//获取全部来源
	allUser();//获取全部负责人
	PTsearch();//普通搜索客户列表
	$("#PTfilter").on("click",function(){
		$("#PTfilterBox").show();
		$("#GJfilterBox").hide();
		window.filt = 1;
		console.log(window.filt);
	});
	$("#GJfilter").on("click",function(){
		$("#PTfilterBox").hide();
		$("#GJfilterBox").show();
		window.filt = 0;
		console.log(window.filt);
	});
});
//获取全部销售阶段
function allStage(){
	API.stageSelect({},function(data){
		if(data.code == 200){
			var stageListObj=data.data.stageList;
			var stageListstr='<option value="">全部阶段</option>';
			$.each(stageListObj,function(index,item){
				stageListstr+='<option value="'+item.id+'">'+item.name+'</option>'
			});
			$('#allStage').html(stageListstr);
		}else{
			dcrmAlertError(data.msg)
		}
	})
}
//获取全部来源
function allSource(){
	API.getCustSoure({},function(data){
		if(data.code == 200){
			var sourceListObj=data.data.list;
			var sourceListstr='<option value="">全部来源</option>';
			$.each(sourceListObj,function(index,item){
				if(item.custFrom != "未知"){
					sourceListstr+='<option value="'+item.custFrom+'">'+item.custFrom+'</option>'
				}

			});
			//sourceListstr+='<option value="未知">未知</option>'
			$('#allSource').html(sourceListstr);
		}else{
			dcrmAlertError(data.msg)
		}
	})
}
//获取全部负责人
function allUser(){
	API.selectExecutorUser({},function(data){
		if(data.code == 200){
			//获取全部负责人
			var userListObj=data.data.data;
			var userListstr='<option value="">全部负责人</option>';
			$.each(userListObj,function(index,item){
				if(item.id == Global.userId){
					userListstr+='<option value="'+item.id+'">我的客户</option>'
				}else{
					userListstr+='<option value="'+item.id+'">'+item.userName+'</option>'
				}
			});
			userListstr+='<option value="0">未分配</option>';
			$('#allUser').html(userListstr)
		}else{
			dcrmAlertError(data.msg)
		}
	})
}
//普通搜索
function PTsearch(){
	$('.manyuser').html("0");
	if($('#attrValsel').val()!=''&& $('.attrVal').val() == null){
		dcrmAlertWarning('请选择客户标签！');
		return
	}
	var obj= {
		"items": [
			{
				"item": [],
				"expr": "且"
			}
		],
		"expr": "且"
	};

	//阶段
	var stage={
		"scope": "stage",
		"op": "",
		"term": {
			"name": "销售阶段",
			"cd": "stage_id",
			"attrType": "select"
		},
		"val": [],
		"valName": "新客户"
	};
	stage.val.push($("#allStage").val());
	var _stage = $("#allStage").val();
	stage.valName = $("#allStage option[value = _stage]").html();
	if(_stage!=''){
		obj.items[0].item.push(stage);
	}
	//来源
	var source={
		"scope": "source",
		"op": "",
		"term": {
			"name": "客户来源",
			"cd": "source",
			"attrType": "select"
		},
		"val": [],
		"valName": ""
	};
	source.val.push($("#allSource").val());
	var _source = $("#allSource").val();
	source.valName = $("#allSource option[value = _source]").html();
	if(_source!=''){
		obj.items[0].item.push(source);
	}
	//属性----性别
	var sex =   {
		"scope": "attr",
		"op": "",
		"term": {
			"name": "性别",
			"cd": "sex",
			"attrType": "select"
		},
		"val": [],
		"valName": ""
	};
	sex.val.push($("#allSex").val());
	var _sex = $("#allSex").val();
	sex.valName = $("#allSex option[value = _sex]").html();
	if(_sex!=''){
		obj.items[0].item.push(sex);
	}
	//属性----客户负责人
	var userid =  {
		"scope": "attr",
		"op": "",
		"term": {
			"name": "客户负责人",
			"cd": "user_id",
			"attrType": "text"
		},
		"val": [],
		"valName": ""
	};
	userid.val.push($("#allUser").val());
	var _userid = $("#allUser").val();
	userid.valName = $("#allUser option[value = _userid]").html();
	if(_userid!=''){
		obj.items[0].item.push(userid);
	}
	//属性----创建时间
	var time =  {
		"scope": "attr",
		"op": "",
		"term": {
			"name": "创建时间",
			"cd": "create_time",
			"attrType": "date"
		},
		"val": [],
		"valName": ""
	};
	$.each($(".createInput"),function(e,f){
		time.val.push($(f).val());
	})
	time.valName = (time.val).join();
	if($(".createInput").val() !=''){
		obj.items[0].item.push(time);
	}
	//属性----客户标签
	var custtag =  {
		"scope": "cust_tag",
		"op": "",
		"term": {
			"name": "",
			"cd": "",
			"attrType": "select"
		},
		"date": [],
		"val": [],
		"valName": ""
	};
	if($('#attrValsel').val()=='custom_tag'){
		custtag.term.name = '自定义标签';
		custtag.term.cd = 'custom_tag';
	}
	if($('#attrValsel').val()=='hk_tag'){
		custtag.term.name = '华坤道威标签';
		custtag.term.cd = 'hk_tag';
	}

	custtag.val = $(".attrVal").val();
	var _custtag = $(".attrVal").val();
	custtag.valName = $(".attrVal").val();
	if(_custtag!=''){
		obj.items[0].item.push(custtag);
	}

	//key
	var _key =  {
		"scope": "searchKey",
		"op": "",
		"term": {
			"name": "",
			"cd": "",
			"attrType": "date"
		},
		"val": [],
		"valName": ""
	};
	_key.val.push($(".chaxun").val());
	if($(".chaxun").val()!=''){
		obj.items[0].item.push(_key);
	}
	window.filterJson=JSON.stringify(obj);

	custList(0,20);

}




// 客户列表
function custList(page,size){
	$('#selectAll').prop('checked',false)
	var pagenum=window.location.hash.split('=')[1];

	var data = {
		'filterJson':window.filterJson,
		"pageIndex":page,
		"pageSize":size
    };

    MaskUtil.Loading();
	API.custList(data,function(data){
        //客户表格列表
		if(data.data&&data.code==200){
			var obj=data.data.pageData.list;
			window.total = data.data.pageData.page.total;
			if(obj.length){
				for (var i =0;i< obj.length; i++) {
					// 判断数据是否为null
					var allCustTag='<div class="allCustTag hide">';
					var type=obj[i].stageName;
					var sex=obj[i].sex;
					var sexImg='';
					var name;
					var trdat;
					var custTag='';
					var contTag='';
					var allcontTag='<div class="allContTag hide"><p>';
					var allArr=[];
					var typeImg='';
					var weixinNiceName=isNull(obj[i].weixinNiceName);
					var wxHeadImgUri=isNull(obj[i].wxHeadImgUri);
					var weixinImg='';
					if(wxHeadImgUri){
						weixinImg='<img class="weixinImg" src="/view/images/weixin.png" data-container="body" data-toggle="popover" data-placement="top" data-html="true" data-content="<img  src=\''+wxHeadImgUri+'\'  height=40 width=40 ><span>'+weixinNiceName+'</span>">';
					}else{
						weixinImg='';
					}


					var stageContent='';
					// 华坤标签
					if(obj[i].hkdwTaglist.length!=0){
						// 如果华坤道威标签有值
						var arr=obj[i].hkdwTaglist;
						custTag='<p class="listP">';
						allCustTag+='<p class="hkdwTag">';
						if(arr.length<=2){
							$.each(arr,function(index,item){
								custTag+='<span class="listTag">'+item+'</span>';
								allCustTag+='<span class="listTag">'+item+'</span>';
							});
							custTag+='</p>';
							allCustTag+='</p>'
						}else{
							//列表页只显示2个标签
							custTag='<p class="listP"><span class="listTag">'+arr[0]+'</span><span class="listTag">'+arr[1]+'</span></p>'
							// 鼠标悬停，显示4个标签

							if(arr.length>4){
								arr=arr.splice(0, 4);
							}
							allCustTag+='<p class="listP">';

							for(var j=0;j<arr.length;j++){
								allCustTag+='<span class="listTag">'+arr[j]+'</span>'
							}
							allCustTag+='</p>'
						}
					}
					// 自定义标签
					if(obj[i].customTagList.length!=0){
						//如果自定义标签有值
						custTag+='<p class="listP customTag">';
						allCustTag+='<p class="customTag">'
						var arr2=obj[i].customTagList;
						if(arr2.length<=2){
							$.each(arr2,function(index,item){
								allCustTag+='<span class="listTag">'+item+'</span>'
								custTag+='<span class="listTag">'+item+'</span>'
							});
							// allCustTag+='</p><i class="triangle"></i></div>'
							custTag+='</p>'
						}else{
							//列表页只显示2个标签
							custTag+='<span class="listTag">'+arr2[0]+'</span><span class="listTag">'+arr2[1]+'</span></p>'
							// 鼠标悬停，显示4个标签
							if(arr2.length>4){
								arr2=arr2.splice(0, 4);
							}

							for(var j=0;j<arr2.length;j++){
								allCustTag+='<span class="listTag">'+arr2[j]+'</span>'
							}
							allCustTag+='</p>'
						}
					}
					// 内容标签
					if(obj[i].makingTagList.length!=0){
						var arr3=obj[i].makingTagList;
						var arrall=[];
						$.each(arr3,function(index,item){
							arrall.push(item)
						});
						// 列表页的 内容标签
						//contTag='<p class="listP">';
						if(arr3.length<=2){//如果标签个数小于2，则全部显示
							$.each(arr3,function(index,item){
								//contTag+='<span class="listTag custag">'+item+'</span>'
							});
							//contTag+='</p>';
						}else{
							//contTag='<p class="listP"><span class="listTag custag">'+arr3[0]+'</span><span class="listTag custag">'+arr3[1]+'</span></p>'
						}
						// 鼠标悬停后展示8个内容标签，4个一排
						allCustTag+='<p class="listP">';
						if(arrall.length<4){//如果标签个数小于4，则全部显示
							$.each(arrall,function(index,item){
								allCustTag+='<span class="listTag custag">'+item+'</span>'
							})

						}else{
							for(var j=0;j<4;j++){
								allCustTag+='<span class="listTag custag">'+arrall[j]+'</span>'
							}
						}
					}

					// 如果华坤道威标签没值
					if(obj[i].hkdwTaglist.length==0 && obj[i].customTagList.length==0 && obj[i].makingTagList.length==0){//如果华坤标签和自定义标签都为空，就不显示悬浮窗
						allCustTag=''
					}else{//如果自定义标签没值，华坤道威标签有值。就显示悬浮窗
						allCustTag+='</p><i class="triangle"></i></div>'
					}
					// 姓名
					if(type=='老客户'){
						typeImg='<img src="/view/images/old.png">';
					}else if(type=='新客户'){
						typeImg='<img src="/view/images/new.png">';
					}else if(type=='流失客户'){
						typeImg='<img src="/view/images/miss.png">';
					}
					if(sex=='男'){
						sexImg='<img src="/view/images/littleman.png">';
					}else if(sex=='女'){
						sexImg='<img src="/view/images/littlewoman.png">';
					}
					// 销售阶段
					if(obj[i].stageName=='新客户'){
						stageContent='<span class="spcspan icon icon-new newicon"></span>';
					}else if(obj[i].stageName=='初次接触'){
						stageContent='<span class="spcspan icon icon-chuji cheng"></span>';
					}else if(obj[i].stageName=='意向线索'){
						stageContent='<span class="spcspan icon icon-yixiang green"></span>';
					}/*else if(obj[i].stageName=='确认线索'){
						stageContent='<span class="spcspan icon icon-tijiaochenggong yellow"></span>';
					}*/else if(obj[i].stageName=='成交客户'){
						stageContent='<span class="green spcspan icon icon-jiaoyichenggong chengjiao"></span>';
					}
					// 客户来源
					var sources=isNull(obj[i].source);
					var sourceicon='';
					if(sources=='华坤道威'){
						sourceicon='<i class="icon icon-huakundaowei fontsource red"></i>'
					}else if(sources=='未知'){
						sources='';
					}else if(sources=='企业数据'){
						sourceicon='<i class="icon icon-gaiicon-5 fontsource"></i>'
					}else if(sources=='营销数据'){
						sourceicon='<i class="icon icon-gaiicon-18 fontsource"></i>'
					}


					var calltd='';//打电话
					var custP = '';//客户画像
					var viewcall='';//查看拨打记录
					var chak = '';//查看
	                var edit = '';//编辑
	                var lystr = '';//录音
	                var del = '';//删除
	                var wechart = '';//单个加好友
	                var sendsms = '';//单个发短信
	                var sendemail = '';//单个发邮件
	                var sendflash = '';//单个发弹信
	                var task = '';//创建任务
					var Mobnum=isNull(obj[i].mobile);//联系电话
					var Telnum=isNull(obj[i].telephone);//联系电话
					var phonenum = '';
					if(obj[i].showCrateTime == null||obj[i].showCrateTime ==''){
						phonenum = '';
					}else{
						phonenum = isNull(obj[i].showCrateTime);
					};
					if(Mobnum==''){
		                 mobile='';
		                 }else{
		                // 如果来自华坤道威，则显示锁图标
		                 if(isNull(obj[i].grantMobileStatus)==10){
		                    mobile='<i class="icon icon-B-mima"></i>'
		                 }
		            }
		            //客户--查看
					if (hasPermission("cust", "GET")) {
					    chak = '<td  class="textLeft" onclick="chakan('+obj[i].id+','+obj[i].companyId+')">';
					}else{
					    chak = '<td  class="textLeft">';
					}
					//客户画像
					if (hasPermission("custPortrait", "GET")) {
                        custP = '<a href="javascript:;" onclick="profile(event,'+obj[i].id+',1)" data-container="body" data-toggle="popover" data-placement="top" data-content="客户画像"><i class="icon icon-kehu "></i></a>';
					}else{
					    custP = '<a><i class="icon icon-kehu disabled"></i></a>';
					}
					//添加任务
                    //批量发弹信
					if (hasPermission("task", "SEND")) {
					    task = '<a data-power="ADD" href="javascript:;" onclick="addTask(event,'+obj[i].id+',\''+obj[i].name+'\')" data-container="body" data-toggle="popover" data-placement="top" data-content="创建任务"><i class="icon icon-tianjia1"></i></a>';
					}else{
					    task = '<a><i class="icon icon-tianjia1 disabled"></i></a>';
					}
					//打电话权限----录音
					if (hasPermission("call", "ADD")) {
						if(Mobnum==''&&Telnum == ''){
							calltd='<a href="javascript:;" class="cursorDefault"><i class="icon icon-boda disabled"></i></a><i class="shugang">|</i>'
						}else if(Mobnum != ''&&Telnum != ''){
							calltd='<a class="phonea dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" href="javascript:;"><i class="icon icon-boda" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打电话"></i>'+
								'<b class="phonenum">'+isNull(obj[i].callCount)+'</b>'+
								'</a>'+
								'<ul class="dropdown-menu" aria-labelledby="dropdownMenu">'+
								'    <li><a href="javascript:;" onclick="call('+obj[i].id+','+obj[i].companyId+',\''+Mobnum+'\',0)">手机号码：'+Mobnum+'</a></li>'+
								'    <li role="separator" class="divider"></li>'+
								'    <li><a href="javascript:;" onclick="call('+obj[i].id+','+obj[i].companyId+',\''+Telnum+'\',1)">联系电话：'+Telnum+'</a></li>'+
								'  </ul>'+
								'<i class="shugang">|</i>';
						}else if(Mobnum != ''&&Telnum == ''){
							calltd='<a class="phonea" href="javascript:;" onclick="call('+obj[i].id+','+obj[i].companyId+',\''+Mobnum+'\',0)" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打电话"><i class="icon icon-boda"></i><b class="phonenum">'+isNull(obj[i].callCount)+'</b></a><i class="shugang">|</i>';
						}else if(Mobnum == ''&&Telnum != ''){
							calltd='<a class="phonea" href="javascript:;" onclick="call('+obj[i].id+','+obj[i].companyId+',\''+Telnum+'\',1)" data-container="body" data-toggle="popover" data-placement="top" data-content="拨打电话"><i class="icon icon-boda"></i><b class="phonenum">'+isNull(obj[i].callCount)+'</b></a><i class="shugang">|</i>';
						}
						lystr='<div class="play play'+i+'" onclick="play('+obj[i].id+','+i+')"  data-container="body" data-toggle="popover" data-placement="left" data-content="播放录音"><i class="icon icon-17"></i></div>'+
	                        '<div class="pause pause'+i+' hide" onclick="pause('+i+')"   data-container="body" data-toggle="popover" data-placement="left" data-content="暂停录音"><i class="icon icon-zanting"></i></div>';
	                    if(Mobnum==''){
							viewcall='<div class="cursorDefault colorfff"><i class="icon icon-jilu disabled"></i></div>'
						}else{
							viewcall='<div href="javascript:;" class="call" onclick="viewCall('+obj[i].id+')" data-container="body" data-toggle="popover" data-placement="left" data-content="查看拨打记录"><i class="icon icon-jilu"></i></div>'
						}
					}else{
						calltd='<a href="javascript:;" class="cursorDefault"><i class="icon icon-boda disabled"></i></a><i class="shugang">|</i>';
						lystr='<div class="play"><i class="icon icon-17 disabled"></i></div>';
						viewcall='<div class="cursorDefault colorfff"><i class="icon icon-jilu disabled"></i></div>'
					}
					//单个加好友
					if (hasPermission("cust", "ADDFRIENDS")) {
						wechart = '<a href="javascript:;" onclick="addPoptc('+obj[i].id+')" data-container="body" data-toggle="popover" data-placement="top" data-content="添加微信好友"><i class="icon icon-weixin1"></i></a>';
					}else{
						wechart = '<a><i class="icon icon-weixin1 disabled"></i></a>'
					}
					//编辑
					if (hasPermission("cust", "UPDATE")) {
					    edit = '<div onclick="addCustomer(\'indexeditoid\',event,'+obj[i].id+')" data-container="body" data-toggle="popover" data-placement="left" data-content="编辑客户"><i class="icon icon-bianji"></i></div>';
	                }else{
	                	edit = '<div><i class="icon icon-bianji disabled"></i></div>';
	                }
	                //单个发短信
					if (hasPermission("sms", "SEND")) {
					    sendsms = '<div smsctrl onclick="SelfsendPop(event,'+obj[i].id+',\''+obj[i].name+'\',1)" data-container="body" data-toggle="popover" data-placement="left" data-content="发送短信"><i class="icon icon-552cd536f34e4"></i></div>';
					}else{
					    sendsms = '<div smsctrl><i class="icon icon-552cd536f34e4 disabled"></i></div>';
					}
					//单个发邮件
					if (hasPermission("email", "SEND")) {
					    sendemail = '<div onclick="SelfsendPop(event,'+obj[i].id+',\''+obj[i].name+'\',2)" data-container="body" data-toggle="popover" data-placement="left" data-content="发送邮件"><i class="icon icon-wsmp-sendMail"></i></div>';
					}else{
					    sendemail = '<div><i class="icon icon-wsmp-sendMail disabled"></i></div>';
					}
					//单个发弹信
					if (hasPermission("flash", "SEND")) {
					    sendflash = '<div onclick="SelfsendPop(event,'+obj[i].id+',\''+obj[i].name+'\',3)" data-container="body" data-toggle="popover" data-placement="left" data-content="发送弹信"><i class="icon icon-shouji"></i></div>';
					}else{
					    sendflash = '<div><i class="icon icon-shouji disabled"></i></div>';
					}
					//删除
					if (hasPermission("cust", "DEL")) {
					    del = '<div onclick="delCustomer(event,'+obj[i].id+')" data-container="body" data-toggle="popover" data-placement="left" data-content="删除"><i class="icon icon-shanchu"></i></div>';
	                }else{
	                	del = '<div><i class="icon icon-shanchu disabled"></i></div>';
	                }
					trdat+='<tr >'+
						'   <td  class="checkname"><input name="custId" data-id="'+obj[i].id+'" data-content="'+isNull(obj[i].name)+'" type="checkbox"/></td>' +chak+
						'<span class="qianlan">'+isNull(obj[i].name)+'</span>' +
						'<p class="littleIcon">'+sexImg+typeImg+weixinImg+'</p></td>'+
						'   <td class="custTagTd">'+custTag+allCustTag+contTag+allcontTag+'</td>'+
						'   <td>'+'<i class="icon icon-B-mima"></i>'+'</td>'+//全部用户加锁图标
						'   <td ><span class="stageName">'+isNull(obj[i].stageName)+'</span>'+stageContent+'</td>'+
						'   <td>'+sourceicon+sources+'</td>'+
						'   <td>'+isNull(obj[i].userName)+'</td>'+
						'   <td class="textLeft">'+phonenum+'</td>'+
						'   <td class="textcenter pr">' +
						custP+'<i class="shugang">|</i>' +
						task+'<i class="shugang">|</i>' +
						calltd+wechart+'<i class="shugang">|</i>'+
						'<a href="javascript:;" class="moreicon"><i class="icon icon-weibiaoti2zhuanhuan morebox"></i>' +
						'<div class="hide hideicon">'+edit+viewcall+sendsms+sendemail+lystr+sendflash+del+
						'</div>'+
						'</a>'+
						'</td></tr>'
				}

				$('#cusList tbody').html(trdat);
				if(page==0){
					$('.ui-paging-container').eq(0).remove();
					$('#customerListpage').Paging({pagesize:20,count:data.data.pageData.page.total,toolbar:true,callback:function(page,size){
						custList(page,size);
					}});
				}
				$('li[data-page="'+pagenum+'"]').click();
			}else{
				trdat = "<tr >"+
	           		 	"<td  colspan='9' class='textcenter'><i class='icon icon-icon nodata'></i>暂无数据</td>"+
	           		 	"</tr> ";
	        	$('#cusList tbody').html(trdat)
			}

		}else{
			// trdat = "<tr >"+
	  //           "<td  colspan='9' class='textcenter'><i class='icon icon-icon'></i>暂无数据</td>"+
	  //           "</tr> ";
	  //       $('#cusList tbody').html(trdat)
	        dcrmAlertError(data.msg)
		}
	MaskUtil.RemoveLoading();
      setTimeout(function(){
        $("[data-toggle='popover']").popover({trigger:"hover"});
       	   $(".weixinImg").popover({trigger:"hover"});
           $('.custTagTd').mouseenter(function(){
				$(this).find('.allCustTag').removeClass('hide');
		   }).mouseleave(function(){
				$(this).find('.allCustTag').addClass('hide');
		   });
           $('.contTagTd').mouseenter(function(){
				$(this).find('.allContTag').removeClass('hide');
		   }).mouseleave(function(){
				$(this).find('.allContTag').addClass('hide');
		   });
		   smsCtrl();
        },500)
	});
}
//添加好友弹窗
function addPoptc(id){
	if(id){
		$('#selectAll').prop('checked',false);
		$('input[name="custId"]').prop('checked',false);
		$('.manyuser').html('0');
		YoNseletall();
		window.custIdList = id;
		$('.more30,.more50,.batch').hide();
		$('.single').show();
	}else{
		$('.single').hide();
		$('.batch').show();
		var Num = $('.manyuser').html();
	    if(Num<51){
	        $('.more30').show();
	        $('.more50').hide();
	        $('.more30 span').html(Num);
	    }else{
	        $('.more30').hide();
	        $('.more50').show();
	        $('.more50 span').html(Num);
	    }
	}
	$("#addBox").show();
	$('#helloMessage').val('');
}
//跳转到客户画像
function profile(event,id,status){
	if(event){
		event.stopPropagation();
	}
    window.location.href = "/view/customer/customer/miniPcProfile.html?id="+id+"&type=1&status="+status;
	// $.ajax({
	// 	type: 'GET',
	// 	url: "/json/"+id+".json",
	// 	async: false,
	// 	dataType: 'json',
	// 	success: function () {
	// 		window.location.href = "/view/customer/customer/pcProfile.html?id="+id+"&type=1&status="+status;
	// 	},
	// 	error:function(){
	// 		dcrmAlertWarning("无客户画像");
	// 	}
	// })
}

// 新建任务
function addTask(event,id,name){

		if(event){
			event.stopPropagation();
		}
		window.location.href = "/view/customer/customer/addTask.html?indexoid="+id+"&str="+escape(name);


}

//查看客户
function chakan(id,companyId){
	window.location.href = "/view/customer/customer/customerDetail.html?oid="+id+'&companyId='+companyId;
}

//普通重置
function reset(){
	$('.filter .ui-multiselect').hide();
	if($('#attrValsel').val()!=''){
		$('.filter select').val("");
		$(".attrVal").multiselect("refresh");
	}
	$('.filter input').val("");
    $('.filter select').val("");

    setTimeout(function(){
    	PTsearch();
    },500)
}

//高级重置
function GJreset(){
	var trdat = "<tr >"+
	            "<td  colspan='9' class='textcenter'><i class='icon icon-icon'></i>暂无数据</td>"+
	            "</tr> ";
	$('#cusList tbody').html(trdat);
    // $('#GJfilterBox input').val("");
    // $('#GJfilterBox select').val("");
    var custstr='<div class="cell-right hide big-cell">且</div>'+
                '    <div class="term">'+
                '        <div class="cell-right hide"></div>'+
                '        <p class="qiehuo"><span>且</span><i class="icon icon-qiehuan"></i></p>'+
                '        <div class="contains ">'+
                '            <select name="" class="filterFirst">'+
                '                <option value="">请选择</option>'+
                '                <option value="attr">属性</option>'+
                '                <option value="source">来源</option>'+
                '                <option value="kpi">指标</option>'+
                '                <option value="event">事件</option>'+
                '                <option value="area">所在地区</option>'+
                '                <option value="stage">销售阶段</option>'+
                '                <option value="cust_tag">客户标签</option>'+
                '            </select>'+
                '            <div class="filterSecond spcSecond">'+
                '                <select name="" class="moren">'+
                '                    <option value="">请选择</option>'+
                '                </select>'+
                '            </div>'+
                '            <div class="filterThird">'+
                '                <select name="" class="moren">'+
                '                    <option value="">请选择</option>'+
                '                </select>'+
                '            </div>'+
                '            <div class="filterFourth hide">'+
                '                <input type="text"  class="wicon fourthstart"  placeholder="选择日期" readonly >-<input type="text"  class="wicon fourthend"  placeholder="选择日期" readonly >'+
                '            </div>'+
                '            <span class="delete"><a href="javascript:;">删除</a></span>'+
                '        </div>'+
                '        <div class="newItem"><a href="javascript:;">+ 添加筛选条件</a></div>'+
                '    </div>';
    $('#GJfilterBox .filterGroup').html(custstr);
    filterEvent();
    setTimeout(function(){
    	PTsearch();
    },500)
}
function addCustomer(title,event,id){
	if(event){
		event.stopPropagation();
	}

	if(id){//编辑
		window.location.href = "/view/customer/customer/addCustomer.html?indexeditoid="+id;
	}else{//新建
		window.location.href = "/view/customer/customer/addCustomer.html";
	}
}

// 删除客户
function delCustomer(event,id){
	var pagenum = window.location.search.split('=')[1];
	if(event){
		event.stopPropagation();
	}

	if(id){
		delId=id
	}else{
		delId=$('.addEventId').attr('data-id')
	}
	var data={
		id:delId
	};
	dcrmConfirm('您确定要删除该客户吗',function(){
		API.deleteCustomer(data,function(res){
			if(res.code == 200){
				//dcrmAlertSuccess(res.msg);
				//window.location.href = "/view/customer/customer/customer.html";
				custList(0,20);
				$('li[data-page="'+pagenum+'"]').click();
			}else{
				dcrmAlertError(res.msg);
			}
		})
	})
}



$('body').on('mouseenter','.moreicon',function(){
	$(this).find('.hideicon').removeClass('hide');
});
$('body').on('mouseleave','.moreicon',function(){
	$(this).find('.hideicon').addClass('hide');
});



var flag=true;
// 打电话
function call(id,companyId,mobile,isTelephone){
	$('#isTelephone').hide();
	console.log($.cookie('uuid'+Global.userId))
    // 如果window.uuid存在，则说明该用户已打过电话，则要先判断上次拨打电话是否已经结束。
	if($.cookie('uuid'+Global.userId)){
    	var param={
    		uuid:$.cookie('uuid'+Global.userId)
    	}
    	API.callLog(param,function(data){
    		if(data.data.calllog.status==1||data.data.calllog.status==4){
    			flag=true;
    		}else{
    			//flag=false;	//不能打电话

    		}
    	})
	}
	if(flag){
	    dcrmConfirm('您是否拨打电话',function(){
	    	//为true时可以打电话
		    	//打电话
		        var data={
		            custId:id,
		            custMobile:mobile,
		            isTelephone:isTelephone
		        };
		        API.callPhone(data,function(data){
		            if(data.code == 200){
		            	var results=data.data.result;
		            	var str='<option value="">请选择</option>';
		            	$.each(results,function(index,item){
		            		str+='<option value="'+index+'">'+item+'</option>'
		            	})
		            	$('#resultResponse').html(str);
		            	$('#callTime').html(data.data.callTime);
		            	window.uuid=data.data.uuid;
		            	$.cookie('uuid'+Global.userId, data.data.uuid, {expires: 7, path: '/'});

						$('.calling').removeClass('hide');
						        $('.numseconds').text('5');
						        var wait=5;
						        timeOut();
						        function timeOut(){
						            if(wait==0){
						                //在原页面 显示拨打记录弹窗
						                $('.calling').addClass('hide');
						                clearInfo();
						                var modelContent=$('#writeCall');//弹窗最外层
						                var contentInfo=$('#writeCall .contentInfo');//弹窗内层
						                frameDiv(modelContent,contentInfo);//弹窗操作
						                window.phoneid=id;
						                custList(0,20);
						                //打开客户详情新页面
						                window.open("/view/customer/customer/customerPhoneDetail.html?oid="+id+"&companyId="+companyId);
						            }else{
						                setTimeout(function(){
						                    wait--;
						                    $('.numseconds').text(wait);
						                    timeOut();
						                },1000)
						            }
						        }
		            }else{
		                dcrmAlertError(data.msg)
		            }
		        })
	    })
	}else{
		dcrmAlertWarning('电话正在呼叫中')
	}
}
//拨打记录保存
function addCall(){
    var data={
        uuid:window.uuid,
        remark:$('#remark').val(),
        resultResponse:$('#resultResponse').val()
    };

    API.saveStatus(data,function(data){
        if(data.code == 200){
            dcrmAlertSuccess(data.msg);
            $('#writeCall').fadeOut();
            $('.bg').fadeOut();
        }else{
            dcrmAlertError(data.msg)
        }
    })
}
//查看拨打记录
function viewCall(id){
    window.location.href = "/view/marketing/call/callMarketList.html?oid="+id;
}



$(function(){
	$('#cusList').on('change',$('input:checked'),function(){
		var checkeds=$('#cusList').find('input:checked');
		$('.manyuser').html(checkeds.length);
	})
	// 全选按钮改变时
	$('#selectAll').click(function(){
		selectAll();
	});

	// 全选
	function selectAll(){
		if($('#selectAll').prop('checked')){//全选按钮选中时
			$('#cusList').find(':checkbox').prop('checked',true);
			$('#cusList').find(':checkbox').prop('disabled',true);
			$('.manyuser').html(window.total);

		}else{//全选按钮没选中
			$('#cusList').find(':checkbox').prop('checked',false);
			$('#cusList').find(':checkbox').prop('disabled',false);
			$('.manyuser').html("0");
		}
	}

});




//群组命名
	function searchName(){
		var check = $('#cusList').find('input:checked');//列表里面的checkbox
		var s = $('.manyuser').html();
		var _val = '';
		$.each(check,function(i,u){
			if(u.length == 1){
				_val = $(u).attr("data-content");
			}else{
				if(i == 0){
					_val = $(u).attr("data-content")+"等"+s+"个客户";
				}
			}

		});
		$("#GroupName").val(_val);
	}

//是否全选，确定是否传custIdList参数
	function YoNseletall(){
		if($('#selectAll').prop('checked')){//全选按钮选中时
			window.selectAll = 1;
			window.custIdList = "";
		}else{
			window.selectAll = 0;
			var obj=$('input[name="custId"]');
			//取到对象数组后，我们来循环检测它是不是被选中
			//console.log(obj);
			var custIdList='';
			$.each(obj,function(e,f){
				//console.log($(f));
				//console.log($(f).attr("data-id"));
				if($(f).prop("checked")){
					custIdList+=$(f).attr("data-id")+','; //如果选中，将value添加到变量s中
				}
			})
			custIdList = (custIdList.substring(custIdList.length - 1) == ',') ? custIdList.substring(0, custIdList.length - 1) : custIdList;
			//console.log(custIdList);
			window.custIdList = custIdList;
		}
	}
	//批量删除按钮点击
	function custAllDelPop(){
		YoNseletall();
		var manyuser = $(".manyuser").html();
		if( manyuser == '0'){
			dcrmAlertWarning("请选择要删除的客户");
			return;
		}else{
			custAllDel();
		}
	}
	//批量删除
	function custAllDel(){
		var data = {
			custIdList:window.custIdList,
			isSelAll:window.selectAll,
			filterJson:window.filterJson
		};
		dcrmConfirm('您确定要删除所选客户吗',function(){
			API.custAllDel(data,function(res){
				if(res.code == 200){
					dcrmAlertSuccess(res.msg);
					custList(0,20);
					$('.manyuser').html("0");
				}else{
					dcrmAlertError(res.msg);
				}
			})
		})
	}
	//批量加微信好友
	function batchAdd(){
		YoNseletall();
		var manyuser = $(".manyuser").html();
		if( manyuser == '0'){
			dcrmAlertWarning("请选择要发送的客户");
			return;
		}else{
			addPoptc();
		}
	}

		//单个添加好友
	function add(){
		var helloMessage = $("#helloMessage").val();
		var data = {
				commonId:window.sessionid,
				custIdList:window.custIdList,
				helloMessage:helloMessage,
				isSelAll:window.selectAll,
				filterJson:window.filterJson
			};
		MaskUtil.Loading();
		var addfriendscallback = function(res) {
				$("#addBox").hide();
				if (res.code == 200) {
					dcrmAlertSuccess(res.msg);
				}else if(res.code == 4001){
					 addPop(function(){
					 	data['commonId'] = window.sessionid;
					 	API.addWechatFriends(data,addfriendscallback);
					 });
				}else{
					dcrmAlertError(res.msg);
				}
				MaskUtil.RemoveLoading();
			}
			API.addWechatFriends(data,addfriendscallback);
	}
	//关闭添加好友弹窗
	function noAdd(){
		$("#addBox").hide();
	}

	//批量发送弹窗
	function SendPop(num){

		$("#GroupName").val("");
		searchName();
		YoNseletall();

		if(window.filt == 1){
			console.log("普通");
			$("#PTfilterBox").show();
			$("#GJfilterBox").hide();
		}else if(window.filt == 0){
			console.log("高级");
			$("#PTfilterBox").hide();
			$("#GJfilterBox").show();
		}

		$(".SMSdl").show();
		$("#SMScont").html("");
		var manyuser = $(".manyuser").html();
		if( manyuser == '0'){
			dcrmAlertWarning("请选择要发送的客户！");
			return;
		}else if(num == 2 && Global.email == ''){
            dcrmAlertWarning('请在个人设置填写邮箱地址!');
            return;
		}else{
			$("#SMSBox").show();
			$("#SMScont").hide();
			$("#SMSnum").html(manyuser);
			if(num == 1){
				$("#SMSBox .tt").html("批量发短信");
				$("#SMSmb").html("短信模板");
				$("#SMSnr").html("短信内容");
				getSMS();//获取短信模板
				$("#sendBtn").unbind("click").on("click",function(){
					sendData(1);
				})
			}
			if(num == 2){
				$("#SMSBox .tt").html("批量发邮件");
				$("#SMSmb").html("邮件模板");
				$("#SMSnr").html("邮件内容");
				getEmail();//获取邮件模板
				$("#sendBtn").unbind("click").on("click",function(){
					sendData(2);
				})
			}
			if(num == 3){
				$("#SMSBox .tt").html("批量发弹信");
				$("#SMSmb").html("弹信模板");
				$("#SMSnr").html("弹信内容");
				getflash();//获取弹信模板
				$("#sendBtn").unbind("click").on("click",function(){
					sendData(3);
				})
			}
			$("body").delegate("#SMSsel","change",function(){
				var val = $(this).val();
				var _id = $(this).find("option[value='"+val+"']").attr("data-id");
				console.log(_id);
				$("#smsId").val(_id);
				if(val == ''){
					$("#SMScont").hide();
				}else{
					$("#SMScont").show().html(val);
				}
			});
		}
	}
	//单个发送弹窗
	function SelfsendPop(event,id,name,num){
		if(event){
			event.stopPropagation();
		}
		if(num == 2){
			if(Global.email == ''){
                dcrmAlertWarning('请在个人设置填写邮箱地址!');
                return;
            }
		}
		$(".SMSdl").hide();
		$("#SMSBox").show();
		$("#SMScont").hide();
		if(num == 1){
			$("#SMSBox .tt").html("发短信");
			$("#SMSmb").html("短信模板");
			$("#SMSnr").html("短信内容");
			getSMS();//获取短信模板
			$("#sendBtn").unbind("click").on("click",function(){
				selfsendData(id,name,1);
			})
		}
		if(num == 2){
			$("#SMSBox .tt").html("发邮件");
			$("#SMSmb").html("邮件模板");
			$("#SMSnr").html("邮件内容");
			getEmail();//获取邮件模板
			$("#sendBtn").unbind("click").on("click",function(){
				selfsendData(id,name,2);
			})
		}
		if(num == 3){
			$("#SMSBox .tt").html("发弹信");
			$("#SMSmb").html("弹信模板");
			$("#SMSnr").html("弹信内容");
			getflash();//获取弹信模板
			$("#sendBtn").unbind("click").on("click",function(){
				selfsendData(id,name,3);
			})
		}
		$("body").delegate("#SMSsel","change",function(){
			var val = $(this).val();
				var _id = $(this).find("option[value='"+val+"']").attr("data-id");
				console.log(_id);
				$("#smsId").val(_id);
			if(val == ''){
				$("#SMScont").hide();
			}else{
				$("#SMScont").show().html(val);
			}
		});
	}
	//批量分配弹窗
	function fenpeiPop(){
		YoNseletall();

		var manyuser = $(".manyuser").html();
		if( manyuser == '0'){
			dcrmAlertWarning("请选择要分配的客户");
			return;
		}else{
			$("#FPBox").show();
			$("#FPnum").html(manyuser);
			getCust();//获取下属客户

			var $ddd = $(".selectpicker ").select2({
				placeholder: "请选择"
			});



			// $("body").delegate("#FPsel","change",function(){
			// 		window.plval=$(this).val().join(',');
			// 	});
		}
	}

	//获取短信模板
	function getSMS(){
		$("#SMSsel").empty();
		SMSlist ="<option value=''>请选择</option>";
		API.getSmsList({}, function(data){
			if(data.code == 200) {
				var lists = data.data.data;
				$.each(lists,function(i,v){
					SMSlist += "<option value='"+v.content+"' data-id='"+v.id+"'>"+v.smsName+"</option>";
				});
			}
			$("#SMSsel").html(SMSlist);
		});
	}
	//获取邮件模板
	function getEmail(){
		$("#SMSsel").empty();
		SMSlist ="<option value=''>请选择</option>";
		API.getEmailList({}, function(data){
			if(data.code == 200) {
				var lists = data.data.data;
				$.each(lists,function(i,v){
					SMSlist += "<option value='"+v.content+"' data-id='"+v.id+"'>"+v.mailName+"</option>";
				});
			}
			$("#SMSsel").html(SMSlist);
		});
	}
	//获取弹信模板
	function getflash(){
		$("#SMSsel").empty();
		SMSlist ="<option value=''>请选择</option>";
		API.getFlashList({}, function(data){
			if(data.code == 200) {
				var lists = data.data.data;
				$.each(lists,function(i,v){
					SMSlist += "<option value='"+v.content+"' data-id='"+v.id+"'>"+v.flashName+"</option>";
				});
			}
			$("#SMSsel").html(SMSlist);
		});
	}
	//获取下属列表
	function getCust(){
		//$("#FPsel").empty();
		SMSlist ="<option value=''>请选择</option>";
		API.selectExecutorUser({}, function(data){
			if(data.code == 200) {
				var lists = data.data.data;
				$.each(lists,function(i,v){
					SMSlist += "<option value='"+v.id+"'>"+v.userName+"</option>";
				});
			}
			$("#FPsel").html(SMSlist);
		});
	}
	//批量发送
	function sendData(ele){
		var sel = $("#SMSsel").val();
		var GroupName = $("#GroupName").val();
		if(GroupName == ''){
			dcrmAlertWarning("群组名不能为空！");
			return;
		}
		if(sel == ''){
			if(ele == 1){
				dcrmAlertWarning("请选择短信模板！");
			}
			if(ele == 2){
				dcrmAlertWarning("请选择邮件模板！");
			}
			if(ele == 3){
				dcrmAlertWarning("请选择弹信模板！");
			}
			return;
		}

		var data = {
				commonId:$("#smsId").val(),
				custIdList:window.custIdList,
				groupName:GroupName,
				isSelAll:window.selectAll,
				filterJson:window.filterJson
			};


		if(ele == 1){
			API.smsBatchSend(data, function(data){
				if(data.code == 200) {
					$("#SMSBox").hide();
					dcrmAlertSuccess(data.msg);
				}else{
					dcrmAlertError(data.msg);
				}
			})
		}
		if(ele == 2){
			API.emailBatchSend(data, function(data){
				if(data.code == 200) {
					$("#SMSBox").hide();
					dcrmAlertSuccess(data.msg);
				}else{
					dcrmAlertError(data.msg);
				}
			})
		}
		if(ele == 3){
			API.flashBatchSend(data, function(data){
				if(data.code == 200) {
					$("#SMSBox").hide();
					dcrmAlertSuccess(data.msg);
				}else{
					dcrmAlertError(data.msg);
				}
			})
		}
	}
	//单个发送
	function selfsendData(id,name,ele){
		var sel = $("#SMSsel").val();

		if(sel == ''){
			if(ele == 1){
				dcrmAlertWarning("请选择短信模板！");
			}
			if(ele == 2){
				dcrmAlertWarning("请选择邮件模板！");
			}
			if(ele == 3){
				dcrmAlertWarning("请选择弹信模板！");
			}
			return;
		}

		var data = {
				commonId:$("#smsId").val(),
				custIdList:id,
				groupName:name,
				isSelAll:"0",
				filterJson:window.filterJson
			};


		if(ele == 1){
			API.smsBatchSend(data, function(data){
				if(data.code == 200) {
					$("#SMSBox").hide();
					dcrmAlertSuccess(data.msg);
				}else{
					dcrmAlertError(data.msg);
				}
			})
		}
		if(ele == 2){
			API.emailBatchSend(data, function(data){
				if(data.code == 200) {
					$("#SMSBox").hide();
					dcrmAlertSuccess(data.msg);
				}else{
					dcrmAlertError(data.msg);
				}
			})
		}
		if(ele == 3){
			API.flashBatchSend(data, function(data){
				if(data.code == 200) {
					$("#SMSBox").hide();
					dcrmAlertSuccess(data.msg);
				}else{
					dcrmAlertError(data.msg);
				}
			})
		}
	}
	//批量分配
	function fenpei(){
		var data = {
				userIds:$("#FPsel").val().join(','),
				custIdList:window.custIdList,
				isSelAll:window.selectAll,
				filterJson:window.filterJson
			};
		API.custAllotment(data, function(data){
			if(data.code == 200) {
				$("#FPBox").hide();
				$(".manyuser").html('0');
				dcrmAlertSuccess(data.msg);
				custList(0,20);

			}else{
					dcrmAlertError(data.msg);
				}
		})
	}


//筛选器显示
filterEvent();



//筛选器保存前拼json
function GJsearch(num){
    var item=[];
    var lock=true;
    $.each($('.filterFirst'),function(index,u){
        var obj= {};
        var firstval=$(u).val();
        obj.scope=$(u).parent().find('.filterSecond select option:selected').attr('data-scope');
        obj.op='';
        if(firstval=='area'){//地区
        	obj.scope='area';
            if($(u).parent().find('.filterThird select').val()){//如果市有值，省市都传
                var provinceName=$(u).parent().find('.filterSecond select').val().join(',');
                var cityName=$(u).parent().find('.filterThird select').val();//市的值本身是个数组
                var cityEle=$(u).parent().find('.filterThird select option:selected');//所有被选中市的元素集合
                var cityStr='';//市的值拼接字符串
                $.each(cityEle,function(m,n){
                    cityStr+=$(n).html()+',';
                })
                cityStr=cityStr.substring(0,cityStr.length-1);

                obj.term={name:provinceName,cd:'city',attrType:'select'}
                obj.valName=cityName.join(',');
                obj.val=cityStr.split(',');

            }else if($(u).parent().find('.filterThird select').val()==null && $(u).parent().find('.filterSecond select').val()!=null){//市没值，只有省有值，只传省的值
                var provinceName=$(u).parent().find('.filterSecond select').val();
                var provinceStr=$(u).parent().find('.filterSecond select').val().join(',');
                var provinceEle=$(u).parent().find('.filterSecond select option:selected');//所有被选中市的元素集合
                var provinceStr='';//市的值拼接字符串
                $.each(provinceEle,function(m,n){
                    provinceStr+=$(n).html()+',';
                })
                provinceStr=provinceStr.substring(0,provinceStr.length-1);

                obj.term={name:provinceName,cd:'province',attrType:'select'}
                obj.val=provinceStr.split(',');
                obj.valName=provinceName.join(',');
            }else{//省市都没值
                 lock=false;
                 obj={};
            }
        }else{

            if(firstval=='source'){// 只有二级的情况，客户来源和销售阶段
                obj.term={name:'客户来源',cd:'source',attrType:'select'};
                obj.scope='source';
                var attrType='select'
            }else if(firstval=='stage'){
                obj.term={name:'销售阶段',cd:'stage_id',attrType:'select'};
                obj.scope='stage';
                var attrType='select'
            }else{//有三级的情况

                var attrType=$(u).parent().find('.filterSecond select option:selected').attr('attr-type');
                var name=$(u).parent().find('.filterSecond select option:selected').attr('attr-name');
                var cd=$(u).parent().find('.filterSecond select').val();
                if (cd === 'user_name') {
                	cd = 'user_id';
				}
                obj.term={name:name,cd:cd,attrType:attrType};
                if(firstval=='event'){//事件
                    obj.date=[];
                    var fourthstart=$(u).parent().find('.filterFourth .fourthstart').val();
                    var fourthend=$(u).parent().find('.filterFourth .fourthend').val();

                    if(fourthstart==''||fourthend==""){
                       obj.date=[];
                    }else{
	                    obj.date.push(fourthstart);
	                    obj.date.push(fourthend)
                    }
                }else{
                   obj.date=[];
                }

            }
            if(attrType=='digit'){//数字区间框
                var startVal=$(u).parent().find('.filterThird .thirddigitstart').val();
                var endVal=$(u).parent().find('.filterThird .thirddigitend').val();
                var arr=[];
                if(isNaN(startVal)||isNaN(endVal)){
                    dcrmAlertError('区间框请输入数值')
                    lock=false;
                    return false;
                }else if(Number(startVal)>Number(endVal)){
                    dcrmAlertError('第一个区间框的值不能大于第二个区间框的值')
                    lock=false;
                    return false;
                }else if(!startVal||!endVal){
                    lock=false;
                }else{
                    arr.push(startVal,endVal);
                    obj.val=arr;
                    obj.valName=arr.join(',');
                }

            }else if(attrType=='date'){//日期区间框
                var startVal=$(u).parent().find('.filterThird .thirdstart').val();
                var endVal=$(u).parent().find('.filterThird .thirdend').val();
                var arr=[];
                if(startVal==''||endVal==''){
                    lock=false;
                    return false;
                }else{
                    arr.push(startVal,endVal);
                    obj.val=arr;
                    obj.valName=arr.join(',');
                }
            }else if(attrType=='text'){//文本框
                var arr=[];
                var value=$(u).parent().find('.filterThird input').val();
                if(!value){
                    lock=false;
                    return false;
                }else{
                  arr.push(value)
                  obj.val=arr;
                  obj.valName=value;
                }

            }else if(attrType=='select'){//多选下拉框
                var value=$(u).parent().find('.filterThird select').val();//多选框的值本身就是数组
                var valName=$(u).parent().find('.filterThird select option:selected');
                console.log(valName)
                var valStr='';
                $.each(valName,function(m,n){
                    valStr+=$(n).html()+',';
                })
                valStr=valStr.substring(0,valStr.length-1);

                if(value){
                    obj.val=value;
                    obj.valName=valStr;
                }else{//三级没值的情况
                    lock=false;
                    obj={};
                }
            }else if(attrType=='tag_select'){//模糊搜索框
                var value=$(u).parent().find('.filterThird .TagNamebox').val();
                console.log(value)


                if(value){
                    obj.val=value.split(",");
                    obj.valName=value;
                }else{//三级没值的情况
                    lock=false;
                    obj={};
                }
            }

        };


        if(obj!={}){
         item.push(obj)
        }
    });
    var qiehuo=$('.qiehuo span').html();


    var items=[];
    var object={};
    object.item=item;
    object.expr=qiehuo;
    items.push(object);

    var bigObject={};
    bigObject.items=items;
    bigObject.expr="且" ;


    window.filterJson=JSON.stringify(bigObject);

        if($('.moren').length!=0){
            lock=false;
        }
        if(lock){
            custList(0,20)
        }else{
            dcrmAlertError('筛选条件不完整')
        }



};
// 录音
var audio=document.getElementById("audio");
function play(id,i){
	var data={
		custId:id
	}
	if(!$('.play'+i).attr('data-url')){//如果该音频还没附上地址,就调接口
		API.lastRecordings(data,function(data){
			if(data.code==200){
				$('.play'+i).attr('data-url',data.data.calllog.recordUri)
				var url=data.data.calllog.recordUri;
			    audio.src=url;
			    audio.volume = 0.5; //
			    audio.play(); // 播放
			    // 其他的暂停按钮隐藏
			    $('.pause').addClass('hide')
			    $('.play').removeClass('hide')
			    // 当前的暂停按钮显示

			    $('.play'+i).siblings('.pause').removeClass('hide')
			    $('.play'+i).addClass('hide')
			    audio.addEventListener('ended', function () {
			       pause(i)
			    }, false);
			}else{
				dcrmAlertError(data.msg);
				audio.pause();
				audio.load();//音频重新加载，起到关闭的效果而不是暂停
				// 其他的暂停按钮隐藏
			    $('.pause').addClass('hide')
			    $('.play').removeClass('hide')
			}
		})
	}else{//如果该音频已经附上了地址
		audio.volume = 0.5; //
		audio.play(); // 播放
		// 其他的暂停按钮隐藏
	    $('.pause').addClass('hide')
	    $('.play').removeClass('hide')
	    // 当前的暂停按钮显示

	    $('.play'+i).siblings('.pause').removeClass('hide')
	    $('.play'+i).addClass('hide')
	    audio.addEventListener('ended', function () {
	       pause(i)
	    }, false);
	}

};

function pause(i){
    audio.pause();
    $('.pause'+i).addClass('hide')
    $('.pause'+i).siblings('.play').removeClass('hide')
};



