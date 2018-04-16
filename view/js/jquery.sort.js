

var arrow = " <font>&gt;</font> ";


	/*第一个input 初始化一级目录*/
	function intProvince(province,city) {
		var str="";
		var city=city;
		for (var i=0; i<province.length; i++) {
			str += '<li onClick="selectP(' + i + ');"><a href="javascript:void(0)">' + province[i] + '</a></li>';
		}
		$(".sort1").html(str);
	}


	/*选择一级目录*/
	function selectP(p) {
		var str = "";
		for (var j=0; j<city[p].length; j++) {
			str += '<li onClick="selectC(' + p + ',' + j + ');"><a href="javascript:void(0)">' + city[p][j] + '</a></li>';
		}
		$(".sort2").html(str).show();
		$(".sort1").parent().not(".hide").find('.sort1 li').eq(p).addClass("active").siblings("li").removeClass("active");
	}

	/*选择二级目录*/
	function selectC(p,c) {
		console.log($(".sort2"))
		$(".sort2").parent().not(".hide").find('.sort2 li').eq(c).addClass("active").siblings("li").removeClass("active");
		$(".sort2").parent().not(".hide").find('.sort2 li').eq(c).find('a').css('background','none')
	}




	/*第二个input 初始化一级目录*/
	function intequ(equ) {
		var str = "";
		for (var i=0; i<equ.length; i++) {
			str += '<li onClick="selectD(' + i+ ')";><a href="javascript:void(0)">' + equ[i] + '</a></li>';
		}
		$(".sort3").html(str);
	}


	function selectD(i) {
		$(".sort3").parent().not(".hide").find('.sort3 li').eq(i).addClass("active").siblings("li").removeClass("active");
		$(".sort3").parent().not(".hide").find('.sort3 li').eq(i).find('a').css('background','none')
    }

