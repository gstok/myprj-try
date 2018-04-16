function addUser(id){
	if(id){
		window.location.href = API.baseUrl+"/view/setting/adduser.html?="+id;
	}else{
		window.location.href = API.baseUrl+"/view/setting/adduser.html";
	}

}


function stopUser(){
	alert('停用')
}

