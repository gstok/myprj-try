var lock=false;
// 新增一个条件
$('body').on('click','.newItem a',function(){
		var str='<div class="contains ">'+//一级
	' <select name="" class="filterFirst">'+
	' <option value="">请选择</option>'+
	' <option value="attr">属性</option>'+
	' <option value="source">来源</option>'+
	' <option value="kpi">指标</option>'+
	' <option value="event">事件</option>'+
	' <option value="area">所在地区</option>'+
	' <option value="stage">销售阶段</option>'+
	' <option value="cust_tag">客户标签</option>'+
	'</select>'+//二级
	'<div class="filterSecond">'+
    '   <select name="" class="moren">'+
    '        <option value="">请选择</option>'+
    '   </select>'+
    '</div>'+//三级
	'	<div class="filterThird">'+
      ' <select name="" class="moren" >'+
    '            <option value="">请选择</option>'+
     '      </select>'+
    '   </div>'+
    '<div class="filterFourth hide">'+
    '    <input type="text"  class="wicon fourthstart"  placeholder="选择日期" readonly >-<input type="text"  class="wicon fourthend"  placeholder="选择日期" readonly >'+
   	'</div>'+
	'<span class="delete newDelete"><a href="javascript:;">删除</a></span>'+
	'</div>'
	var newItem=$(this).parent();
	newItem.before(str);
	// intProvince(province,city);
	// intequ(equ)
	var h=newItem.parent().height();
	newItem.siblings('.line').css('height',h-50+'px');
	newItem.siblings('.line').removeClass('hide');
	newItem.siblings('.cell-right').removeClass('hide');
	newItem.siblings('.cell-right').css('top',(h-60)/2+'px')
	var obj=newItem.closest('.filterGroup');
	filterEvent();
})


	// 点击input出现下拉框
	$('body').on('click','.sort2',function(){
		var str=$(this).find('.active a').html();
		$(this).parent().siblings('.firstInput').val(str);
		$(this).parent().addClass('hide');

	})
	$('body').on('focus','.firstInput',function(){
		$('.firstSort').addClass('hide');
		$('.secondSort').addClass('hide');
		$(this).siblings('.firstSort').removeClass('hide');
	})



	$('body').on('click','.sort3',function(){
		var str=$(this).find('.active a').html();
		$(this).parent().siblings('.secondInput').val(str);
		$(this).parent().addClass('hide');
	})

	$('body').on('focus','.secondInput',function(){
		$('.firstSort').addClass('hide');
		$('.secondSort').addClass('hide');
		$(this).siblings('.secondSort').removeClass('hide');
	})



	// 删除item
	$('body').on('click','.delete',function(){
		var length=$('.contains').length;
		console.log(length)
		if(length<2){
			dcrmAlertError('仅剩一组条件了,不能删除哦！');
		}else{
			var obj=$(this).closest('.filterGroup');
			if($(this).parent().parent().find('.delete').length>1){
				if($(this).parent().parent().find('.delete').length<=2){
					$(this).parent().siblings('.line').addClass('hide');
					$(this).parent().siblings('.cell-right').addClass('hide');

				}else{
					var h=$(this).parent().parent().height();
					$(this).parent().siblings('.line').css('height',h-80+'px');
					$(this).parent().siblings('.line').removeClass('hide');

					$(this).parent().siblings('.cell-right').css('top',(h-90)/2+'px')
				}

				$(this).parent().remove();

			}else{
				$(this).parent().parent().remove();

			}
		}

	})


	$('.qiehuo').click(function(){
		var txt=$(this).find('span').html();
		if(txt=='且'){
			$(this).find('span').html('或')
		}else{
			$(this).find('span').html('且')
		}

	})

