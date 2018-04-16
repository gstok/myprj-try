$(function(){
    $(".setli").find("ul").show();
	$(".menuNormal").find("a").removeClass("active");
    $(".setli").find("span").attr("class","icon icon-jiantou");
	$(".setli").find("ul #index_systemSet").find("a").addClass("active");
})


// 新建内容标签
function addContentTag(){
	var modelContent=$('#addContentTag');//弹窗最外层
	var contentInfo=$('#addContentTag .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 编辑内容标签
function editContentTag(){
	var modelContent=$('#editContentTag');//弹窗最外层
	var contentInfo=$('#editContentTag .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}

// 新建客户标签
function addCustomerTag(){
	var modelContent=$('#addCustomerTag');//弹窗最外层
	var contentInfo=$('#addCustomerTag .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 编辑客户标签
function editCustomerTag(){
	var modelContent=$('#editCustomerTag');//弹窗最外层
	var contentInfo=$('#editCustomerTag .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}




// 新建签名
function addSign(){
	var modelContent=$('#addSign');//弹窗最外层
	var contentInfo=$('#addSign .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 新建来源
function addSource(){
	var modelContent=$('#addSource');//弹窗最外层
	var contentInfo=$('#addSource .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 编辑来源
function editSource(){
	var modelContent=$('#editSource');//弹窗最外层
	var contentInfo=$('#editSource .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 新建事件
function addEvent(){
	var modelContent=$('#addEvent');//弹窗最外层
	var contentInfo=$('#addEvent .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 编辑事件
function editEvent(){
	var modelContent=$('#editEvent');//弹窗最外层
	var contentInfo=$('#editEvent .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 新建任务类型
function addTaskType(){
	var modelContent=$('#addTaskType');//弹窗最外层
	var contentInfo=$('#addTaskType .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 编辑任务类型
function editTaskType(){
	var modelContent=$('#editTaskType');//弹窗最外层
	var contentInfo=$('#editTaskType .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 新建属性
function addAttribute(){
	var modelContent=$('#addAttribute');//弹窗最外层
	var contentInfo=$('#addAttribute .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}
// 编辑属性
function editAttribute(){
	var modelContent=$('#editAttribute');//弹窗最外层
	var contentInfo=$('#editAttribute .contentInfo');//弹窗内层
	frameDiv(modelContent,contentInfo);//弹窗操作
}