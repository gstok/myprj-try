setTimeout(function(){
	$('#username1').val('');
	$('#passWord1').val('');
},700);


$('.save').click(function(){
 console.log($('#username1').val());
 $('#passWord1').val('');
});

function returnManage(){
	window.location.href = API.baseUrl+"/view/setting/usermanage.html";
}