/**
 * Created by Administrator on 2017/6/15 0015.
 */

// var start = {
//     format:"YYYY-MM-DD",
//     minDate: '2014-06-16 23:59:59', //Éè¶¨×îÐ¡ÈÕÆÚÎªµ±Ç°ÈÕÆÚ
//     isinitVal:true,
//     festival:true,
//     ishmsVal:false,
//     maxDate: $.nowDate({DD:0}), //×î´óÈÕÆÚ
//     choosefun: function(elem, val, date){
//         end.minDate = date; //¿ªÊ¼ÈÕÑ¡ºÃºó£¬ÖØÖÃ½áÊøÈÕµÄ×îÐ¡ÈÕÆÚ
//         endDates();
//     }
// };
// var end = {
//     format:"YYYY-MM-DD",
//     minDate: $.nowDate({DD:0}), //Éè¶¨×îÐ¡ÈÕÆÚÎªµ±Ç°ÈÕÆÚ
//     festival:true,
//     maxDate: '2099-06-16 23:59:59', //×î´óÈÕÆÚ
//     choosefun: function(elem, val, date){
//         start.maxDate = date; //½«½áÊøÈÕµÄ³õÊ¼ÖµÉè¶¨Îª¿ªÊ¼ÈÕµÄ×î´óÈÕÆÚ
//     }
// };
//ÕâÀïÊÇÈÕÆÚÁª¶¯µÄ¹Ø¼ü
// function endDates() {
//     //½«½áÊøÈÕÆÚµÄÊÂ¼þ¸Ä³É false ¼´¿É
//     end.trigger = false;
//     $("#inpend").jeDate(end);
// }
// $('#inpstart').jeDate(start);
// $('#inpend').jeDate(end);

// //»òÕßÊÇ
// $.jeDate('#inpstart',start);
// $.jeDate('#inpend',end);






//ÊµÏÖÈÕÆÚÑ¡ÔñÁª¶¯

var start = {
    format: 'YYYY-MM-DD',
    maxDate: $.nowDate({DD:0}), //×î´óÈÕÆÚ
    choosefun: function(elem,datas){
        end.minDate = datas; //¿ªÊ¼ÈÕÑ¡ºÃºó£¬ÖØÖÃ½áÊøÈÕµÄ×îÐ¡ÈÕÆÚ
        endDates();
    },
    okfun:function (elem,datas) {
        //alert(datas);
    }
};
var end = {
    format: 'YYYY-MM-DD',
    maxDate: '2099-06-16', //×î´óÈÕÆÚ
    choosefun: function(elem,datas){
        start.maxDate = datas; //½«½áÊøÈÕµÄ³õÊ¼ÖµÉè¶¨Îª¿ªÊ¼ÈÕµÄ×î´óÈÕÆÚ
    }
};
function endDates() {
    end.trigger = false;
    $("#inpend").jeDate(end);
}
$("#inpstart").jeDate(start);
$("#inpend").jeDate(end);

// $("#billstart").jeDate(start);
// $("#billend").jeDate(end);

// $("#czstart").jeDate(start);
// $("#czend").jeDate(end);


//ÈÕÆÚ
$('#completeTime').jeDate({
    format:"YYYY-MM-DD",
    isTime:false,
    minDate:"2008-09-19 00:00:00"
})
// $('#createTime').jeDate({
//     format:"YYYY-MM-DD",
//     isTime:false,
//     minDate:"2008-09-19 00:00:00"
// })

// $('#chooseTime').jeDate({
//     format:"YYYY-MM-DD",
//     isTime:false,
//     minDate:"2008-09-19 00:00:00"
// })

$('#finishTime').jeDate({
    format:"YYYY-MM-DD",
    isTime:false,
    minDate:"2008-09-19 00:00:00"
})

$('#taskTime').jeDate({
    format:"YYYY-MM-DD",
    isTime:false,
    minDate:"2008-09-19 00:00:00"
});



$('#birthday').jeDate({
    format:"YYYY-MM-DD",
    isTime:false,
    minDate:"2008-09-19 00:00:00"
})
$('#userBirthday').jeDate({
    format:"YYYY-MM-DD",
    isTime:false,
    minDate:"2008-09-19 00:00:00"
})

// function showDate(elem){
//     var that = this;
//     $.jeDate('#'+elem,{
//         insTrigger:false,
//         format: 'YYYY-MM-DD',
//         festival: false,//ÊÇ·ñÏÔÊ¾Å©Àú½ÚÈÕ
//         fixed:true,     //ÊÇ·ñ¾²Ö¹¶¨Î»£¬ÎªtrueÊ±¶¨Î»ÔÚÊäÈë¿ò£¬ÎªfalseÊ±¾ÓÖÐ¶¨Î»
//         zIndex:300,     //µ¯³ö²ãµÄ²ã¼¶¸ß¶È
//         okfun:function(elem2, val) {
//             // console.log(elem);
//             //that.addhouseinfo[elem]=val;
//             $('#'+elem).parent().find(".placeholder").hide();
//         },//µã»÷È·¶¨ºóµÄ»Øµ÷, elemµ±Ç°ÊäÈë¿òID, valµ±Ç°Ñ¡ÔñµÄÖµ
//         choosefun:function(elem2, val) {
//             //that.addhouseinfo[elem]=val;
//             $('#'+elem).parent().find(".placeholder").hide();
//         },//Ñ¡ÖÐÈÕÆÚºóµÄ»Øµ÷, elemµ±Ç°ÊäÈë¿òID, valµ±Ç°Ñ¡ÔñµÄÖµ
//         clearfun:function(elem2, val) {
//             //that.addhouseinfo[elem]=val;
//         } //Çå³ýÈÕÆÚºóµÄ»Øµ÷, elemµ±Ç°ÊäÈë¿òID, valµ±Ç°Ñ¡ÔñµÄÖµ
//     });
// }
/******************带时分秒联动日期选择********************/
/**********普通搜索**********/
var starthms = {
    //festival:true,//农历
    isinitVal:true,
    ishmsVal:false,
    format: 'YYYY-MM-DD hh:mm:ss',
    maxDate: $.nowDate({DD:0}),
    choosefun: function(elem,datas){
        endhms.minDate = datas;
        endDateshms();
    },
    okfun:function (elem,datas) {
        //alert(datas);
    }
};
var endhms = {
    isinitVal:true,
    ishmsVal:false,
    format: 'YYYY-MM-DD hh:mm:ss',
    maxDate: '2099-06-16 00:00:00', //×î´óÈÕÆÚ
    choosefun: function(elem,datas){
        starthms.maxDate = datas; //½«½áÊøÈÕµÄ³õÊ¼ÖµÉè¶¨Îª¿ªÊ¼ÈÕµÄ×î´óÈÕÆÚ
    }
};
function endDateshms() {
    endhms.trigger = false;
    $("#inpendhms").jeDate(endhms);
}
$("#inpstarthms").jeDate(starthms);
$("#inpendhms").jeDate(endhms);

$("#inpstarthms,#inpendhms").val('');
/*********普通搜索**********/


/******************带时分秒联动日期选择********************/