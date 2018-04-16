$(function(){
	$(".customerli").find("ul").show();
	$(".menuNormal").find("a").removeClass("active");
	$(".customerli").find("span").attr("class","icon icon-jiantou");
	$(".customerli").find("ul #index_customer").find("a").addClass("active");

})
var oid=window.location.search.split('=')[1];
var isIndex=window.location.search.split('=')[0];
console.log(isIndex)
// 新建或编辑客户展示
	var data={
		id:oid
	}
	MaskUtil.Loading();
	API.custSelectById(data,function(data){
		var str='';
		var typeList='';
		var sceneHideConfig=data.data.sceneHideConfig
		//常用
		var arr=data.data.commonAttrList;
		if(arr.length){
			for (var i =0;i< arr.length; i++) {
				var contentvalue=isNull(arr[i].contentvalue);
				if(arr[i].attrType=='date'){
				   typeList=' <input type="text" value="'+contentvalue+'" class="wicon" id="'+arr[i].attrKey+'" placeholder="选择日期" readonly >';
				}
				else if(arr[i].attrType=='select'){
					var selectList='';
						selectList =  ' <option value="">请选择</option>';
						if(arr[i].attrVal!="NULL"){
							var array=arr[i].attrVal.split(';');
							for(var j=0; j<array.length; j++){
								 selectList+= ' <option value="'+array[j]+'">'+array[j]+'</option>';
							}
							typeList='<select  name="" id="'+arr[i].attrKey+'">'+selectList+'</select>'
						}else{
							 typeList='<select name=""  id="'+arr[i].attrKey+'">'+selectList+'</select>'
						}
						// 如果是省市区，特殊处理
						if(arr[i].attrKey=='province'||arr[i].attrKey=='city'||arr[i].attrKey=='county'){
							typeList='<select name=""   id="'+arr[i].attrKey+'"><option value="">请选择</option></select>'
						}
				}else if(arr[i].attrType=='bool'){
					typeList='<input type="radio" name="'+arr[i].attrKey+'" value="是">是&emsp; <input type="radio" name="'+arr[i].attrKey+'" value="否">否';
				}
				else{
					if(arr[i].attrKey=='mobile'&& contentvalue.indexOf("*") > 0){
						typeList='<input type="text" value="" placeholder="该手机号已加密"  id="'+arr[i].attrKey+'">';
					}else{
						typeList='<input type="text" value="'+contentvalue+'"  id="'+arr[i].attrKey+'">';
					}

				}
				str+='<li>'+
					 '   <span>'+arr[i].attrName+'</span>'+typeList
					 '</li>'
			}

		}
		//非常用
		var arr2=data.data.uncommonAttrList;
		var str2='';
		var typeList2='';
        // 如果没有非常用标签，则隐藏更多
        if(arr2==[]||arr2==null){
        	$('.ckmore').hide()
        }else{
        	$('.ckmore').show()
        }
		if(arr2.length){
			for (var i =0;i< arr2.length; i++) {
				var contentvalue2=isNull(arr2[i].contentvalue);
				if(arr2[i].attrType=='date'){
					typeList2=' <input type="text" value="'+contentvalue2+'" class="wicon" id="'+arr2[i].attrKey+'" placeholder="选择日期" readonly>';
				}else if(arr2[i].attrType=='select'){
					var selectList2='';
						selectList2 =  ' <option value="">请选择</option>';
						if(arr2[i].attrVal!="NULL"){
							var array2=arr2[i].attrVal.split(';');
							for(var j=0; j<array2.length; j++){
								 selectList2+= ' <option value="'+array2[j]+'">'+array2[j]+'</option>';
							}
							typeList2='<select name="" id="'+arr2[i].attrKey+'">'+selectList2+'</select>'
						}else{
							 typeList2='<select name="" id="'+arr2[i].attrKey+'">'+selectList2+'</select>'
						}

				}else if(arr2[i].attrType=='bool'){
					typeList2='<input type="radio"  name="'+arr2[i].attrKey+'"  value="是" >是&emsp; <input type="radio" name="'+arr2[i].attrKey+'" value="否">否';
				}
				else{
					typeList2=' <input type="text" value="'+contentvalue2+'" id="'+arr2[i].attrKey+'">';
				}
				str2+='<li>'+
					 '  <span>'+arr2[i].attrName+'</span>'+typeList2
					 ' </li>'
			}
		}
		// 非常用属性
		$('.moreList').html(str2)
		// 常用属性
		$('.oftenUl').html(str);
		// setTimeout(function(){
        	//获取销售阶段
        	var stageList=data.data.stageList;
        	var stagestr='<option value="">请选择</option>';
        	$.each(stageList,function(index,item){
		        stagestr+='<option value="'+item.id+'">'+item.name+'</option>'
		        $('#stage_id').html(stagestr)
        	})
        	//获取负责人下拉框
        	var userList=data.data.userlist;
        	var userstr='<option value="">请选择</option>';
        	$.each(userList,function(index,item){
		        userstr+='<option value="'+item.id+'">'+item.userName+'</option>'
		        $('#user_name').html(userstr)
        	})

        	// 获取客户来源下拉框
     		var sourceList=data.data.confCustSourceList;
        	var sourcestr='<option value="">请选择</option>';
        	$.each(sourceList,function(index,item){
		        sourcestr+='<option value="'+item.custFrom+'">'+item.custFrom+'</option>'
		        $('#source').html(sourcestr)
        	})

        	//编辑客户获取值
        	setTimeout(function(){
				for (var i =0;i< arr.length; i++) {
					if(arr[i].attrType=='select'&&arr[i].attrKey!='province'){
						$('#'+arr[i].attrKey).val(arr[i].contentvalue)
					}else if(arr[i].attrType=='bool'){
						$("input[name='"+arr[i].attrKey+"'][value='"+arr[i].contentvalue+"']").attr("checked",true);
					}

					 if(arr[i].contentvalue=='华坤道威'){
						$('#'+arr[i].attrKey).parent().html('<span>客户来源</span><input id="source" type="text" value="华坤道威" readonly/>')
						console.log($('#'+arr[i].attrKey))
					}
				}
				for (var i =0;i< arr2.length; i++) {
					if(arr2[i].attrType=='select'&&arr2[i].attrKey!='province'){
						$('#'+arr2[i].attrKey).val(arr2[i].contentvalue);
						$("input[name='"+arr2[i].attrKey+"'][value='"+arr2[i].contentvalue+"']").attr("checked",true);
					}else if(arr2[i].attrType=='bool'){
						$("input[name='"+arr2[i].attrKey+"'][value='"+arr2[i].contentvalue+"']").attr("checked",true);
					}
				}
        	},500)


			//调日期js
			if(arr2.length){
				for (var i =0;i< arr2.length; i++) {
					if(arr2[i].attrType=='date'){
						$('#'+arr2[i].attrKey).jeDate({
						format:"YYYY-MM-DD",
						isTime:false,
						minDate:"1920-00-01 00:00:00"
					});
					}
				}
			}
			if(arr.length){
				for (var i =0;i< arr.length; i++) {
					if(arr[i].attrType=='date'){
						$('#'+arr[i].attrKey).jeDate({
						format:"YYYY-MM-DD",
						isTime:false,
						minDate:"1920-00-01 00:00:00"
					});
					}
				}
			}
			$('#id').parent().hide();

		// },50);
		//省市区三级联动
		// setTimeout(function(){
		// 	if($('#province').length>0&& $('#city').length>0&& $('#county').length>0){
		// 		addressInit('province','city','county');
		// 	}
		// },500)

		 // 获取省
            var data={};
            MaskUtil.Loading();
            API.getProvince(data,function(data){
                var province=data.data.province;
                var str='<option value="">请选择</option>'
                $.each(province,function(index,item){
                    str+='<option data-code="'+item.code+'" value="'+item.name+'">'+item.name+'</option>';
                })
                $('#province').html(str);

                MaskUtil.RemoveLoading();
            })

            // 省改变获取市
            $('#province').change(function(){
                var fCode=$(this).find('option[value="'+$(this).val()+'"]').attr('data-code');
                var str='<option value="">请选择</option>'
                console.log(fCode)
                $('#city').html(str);
                $('#county').html(str);
                if(fCode){

                        var data={
                             fCode:fCode
                        }
                        API.getCity(data,function(data){
                            var citys=data.data.city;

                            $.each(citys,function(index,item){
                            	str+='<option data-code="'+item.code+'" value="'+item.name+'">'+item.name+'</option>';

                            })
                            $('#city').html(str);
                        })

                }else{
                    $('#city').html(str);
                }

            })
            // 市改变获取区
            $('#city').change(function(){
            	var str='<option value="">请选择</option>'
            	$('#county').html(str);
                var fCode=$(this).find('option[value="'+$(this).val()+'"]').attr('data-code');
                if(fCode){

                        var data={
                             fCode:fCode
                        }
                        API.getCity(data,function(data){
                            var countys=data.data.city;

                            $.each(countys,function(index,item){
                               str+='<option data-code="'+item.code+'" value="'+item.name+'">'+item.name+'</option>';
                            })
                            $('#county').html(str)
                        })

                }else{
                   $('#county').html(str);
                }

            })


			//显示省市区的值

			if(arr2.length){
				for (var i =0;i< arr2.length; i++) {
					if(arr2[i].attrKey=='province'||arr2[i].attrKey=='city'||arr2[i].attrKey=='county'){

						$('#province option[value="'+arr2[i].contentvalue+'"]').attr('selected','selected')
						$('#province').change();

						setTimeout(function(){
							for (var i =0;i< arr2.length; i++) {
								if(arr2[i].attrKey=='city'){
	                            	$('#city option[value="'+arr2[i].contentvalue+'"]').attr('selected','selected')
	                            	$('#city').change();

	                            }
                       		}
						},50);
						setTimeout(function(){
							for (var i =0;i< arr1.length; i++) {
								if(arr2[i].attrKey=='county'){
	                            	$('#county option[value="'+arr2[i].contentvalue+'"]').attr('selected','selected')

	                            }
                       		}
						},100);
					}
				}
			}

			if(arr.length){
				for (var i =0;i< arr.length; i++) {
					if(arr[i].attrKey=='province'){
						if(arr[i].contentvalue){

							$('#province option[value="'+arr[i].contentvalue+'"]').attr('selected','selected')
							$('#province').change();

							setTimeout(function(){
								for (var i =0;i< arr.length; i++) {
									if(arr[i].attrKey=='city'){
		                            	$('#city option[value="'+arr[i].contentvalue+'"]').attr('selected','selected')
		                            	$('#city').change();

		                            }
	                       		}

							},50);

							setTimeout(function(){
								for (var i =0;i< arr.length; i++) {
									if(arr[i].attrKey=='county'){
		                            	$('#county option[value="'+arr[i].contentvalue+'"]').attr('selected','selected')
		                            }
	                       		}
							},100);
						}

					}

				}
			}
		//显示省市区的值end

		// 权限隐藏
		var sceneHideObj={};
		if(sceneHideConfig.cust){
			sceneHideObj=sceneHideConfig.cust;
		}

	$.each(sceneHideObj,function(index,item){
		if(item==false){//显示
			console.log($('#'+index))
			$('#'+index).removeClass('hide')
		}else{

			$('#'+index).parent().addClass('hide')
			$('input[name="'+index+'"]').parent().addClass('hide')
		}
	})
	 MaskUtil.RemoveLoading();
	});


//点击更多
$('.ckmore a em').click(function(){
	console.log($(this).val())
	if($(this).html()=='更多'){
		$('.moreList').removeClass('hide');
		$(this).html('收起')
		$('.sanjiaojt').addClass('xiangxia')
	}else{
		$('.moreList').addClass('hide');
		$(this).html('更多')
		$('.sanjiaojt').removeClass('xiangxia')
	}

})
var isedit=true;
if(isIndex){//地址栏是否有传值，不传值为新建
	$('.addTitle em').text(' / 编辑客户')
	isedit=true;

}else{
	$('.addTitle em').text(' / 新建客户')
	isedit=false;
}
//新建或编辑客户保存
function addSure(){

	var param={};
	var data={};
	API.custSelectById(data,function(data){
		var arr2=data.data.uncommonAttrList;
		if(arr2.length){
			for (var i =0;i< arr2.length; i++) {
				if(arr2[i].attrType!='bool'){
					var p=arr2[i].attrKey;
					param[p]=$('#'+p+'').val()
				}else{
					var p=arr2[i].attrKey;
					if($("input[name='"+p+"']:checked").length!=0){
						param[p]=$("input[name='"+p+"']:checked").val();
					}else{
						param[p]=''
					}

				}
			}
		}
		var arr1=data.data.commonAttrList;
		if(arr1.length){
			for (var i =0;i< arr1.length; i++) {
				if(arr1[i].attrType!='bool'){
					var p=arr1[i].attrKey;
					param[p]=$('#'+p+'').val()
				}else{
					var p=arr1[i].attrKey;
					if($("input[name='"+p+"']:checked").length!=0){
						param[p]=$("input[name='"+p+"']:checked").val();
					}else{
						param[p]=''
					}

				}
			}
		}


		//验证年龄
        var reg = /^(?:0|[1-9][0-9]?|100)$/;
	   if($('#age').val()!=''&&!reg.test($('#age').val())){
	    	dcrmAlertError('年龄须为0-100的正整数')
	    	return;
	    }
	    if(param.province=='请选择'){
	   			param.province='';
	   	}
		if(param.stage_id==''){
		 	param.stage_id='1'
		 }
		var phone = $('#mobile').val();
    	if($.trim(phone)!=''&&!(/^1[34578]\d{9}$/.test(phone))){
       		dcrmAlertError("手机号码有误，请重填");
        	return false;
		}
		//新建客户保存
	   if(isedit==false){


		 MaskUtil.Loading();

			API.addCustomer(param,function(res){
				if(res.code==200){
					dcrmAlertSuccess(res.msg);
					setTimeout(function(){
						window.location.href = "/view/customer/customer/customerPhoneDetail.html?oid="+oid;
					},1000)

				}else{
					dcrmAlertError(res.msg);
				}
				 MaskUtil.RemoveLoading();

			})
		}else{//编辑客户保存
			param.id=oid;
			console.log(param);
			MaskUtil.Loading();
			API.editCustomer(param,function(res){
				if(res.code==200){
					dcrmAlertSuccess(res.msg);
					setTimeout(function(){
						window.location.href = "/view/customer/customer/customerPhoneDetail.html?oid="+oid;
					},1000)
				}else{
					dcrmAlertError(res.msg);
				}
				 MaskUtil.RemoveLoading();

			})
		}
	})
}

function returnBack(){
	if(isIndex=='?editid'){
		window.location.href = "/view/customer/customer/customerPhoneDetail.html?oid="+oid;
	}else{
		window.location.href = "/view/customer/customer/customerPhoneDetail.html?oid="+oid;
	}

}

