/**
 * Created by Administrator on 2017/6/6 0006.
 */
$(function(){
    $(".homeli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".homeli").find("span").attr("class","icon icon-jiantou");
    $(".homeli").find("a").addClass("active");
    homeSubmitAnaly();
});

//获取任务
var data={};
API.hTask(data,function(res){
    if(res.code == 200){
        $('.todayTaskContent').html(res.data.todayTask);
        $('.undistributed').html(res.data.undistributed);
        $('.myInProcess').html(res.data.myInProcess);
        $('.inProcess').html(res.data.inProcess);
    }else{
        dcrmAlertError(res.msg);
    }
})
// 客户统计

API.stageCount(data,function(res){
    if(res.code == 200){
    	var obj=res.data.custMap;
        if(obj.length!=0){
            $.each(obj,function(index,item){
                if(item.stageId==1){
                    $('.newContent').html(isNull(item.num))
                }else if(item.stageId==2){
                    $('.chuciContent').html(isNull(item.num))
                }else if(item.stageId==3){
                    $('.chujiContent').html(isNull(item.num))
                }else if(item.stageId==4){
                    $('.yixiangContent').html(isNull(item.num))
                }else if(item.stageId==5){
                    $('.querenContent').html(isNull(item.num))
                }else if(item.stageId==6){
                    $('.chengjiaoContent').html(isNull(item.num))
                }


            })
            $('.sumContent').html(isNull(res.data.sum))
            //计算百分比
            var bfb=parseInt($('.newContent').html())+parseInt($('.chuciContent').html())+
                parseInt($('.yixiangContent').html())+
                parseInt($('.chengjiaoContent').html());
            var newbfb=( parseInt($('.newContent').html())/bfb*100).toFixed(2);
            var chucibfb=  (parseInt($('.chuciContent').html())/bfb*100).toFixed(2);
            var yixiangbfb=(parseInt($('.yixiangContent').html())/bfb*100).toFixed(2);
            var chengjiaobfb= (parseInt($('.chengjiaoContent').html())/bfb*100).toFixed(2);

            // 进度条显示
            $('.new .div').attr('w',newbfb);
            $('.chuci .div').attr('w',chucibfb);
            $('.yixiang .div').attr('w',yixiangbfb);
            $('.chengjiao .div').attr('w',chengjiaobfb);

            $('.new i').html(newbfb+'%');
            $('.chuci i').html(chucibfb+'%');
            $('.yixiang i').html(yixiangbfb+'%');
            $('.chengjiao i').html(chengjiaobfb+'%');
        }


        $(function(){
            //a 底色，b 加载色 , w 展示宽度，h 展示高度
            var a="#606cbf";
            var b="#e0e8ed";
            var w="100%";
            var h="4px";
            var div=$(".div");//进度条要插入的地方
            var barb=function(){
                div.each(function(){
                    var width=$(this).attr('w');
                    var barbox='<dl class="barbox"><dd class="barline"><div w="'+width+'" class="charts" style="width:0px"><d></d></div></dd></dl>';
                    $(this).append(barbox);
                })
            }

            var amimeat=function(){
                $(".charts").each(function(i,item){
                    var wi=parseInt($(this).attr("w"));
                    $(item).animate({width: wi+"%"},1000,function(){//一天内走完
                        $(this).children('d').html(wi+"%");
                    });
                });
            }
            var barbCss=function(a,b){
                $(".barbox").css({
                    "height":h,
                    "line-height":h,
                    "text-align":"center",
                    "color":"#fff",
                })
                $(".barbox>dd").css({
                    "float":"left"
                })
                $(".barline").css({
                    "width":w,
                    "background":b,
                    "height":h,
                    "overflow":"hidden",
                    "display":"inline",
                    "position":"relative",
                    "border-radius":"8px",
                })
                $(".barline>d").css({
                    "position":"absolute",
                    "top":"0px",
                })
                $(".charts").css({
                    "background":a,
                    "height":h,
                    "width":"0px",
                    "overflow":"hidden",
                    "border-radius":"8px"
                })
            }
            barb();
            amimeat();
            barbCss(a,b);
        })

    }else{
        dcrmAlertError(res.msg);
    }
})
//最新邮件
API.lastEmail(data,function(res){
    if(res.code == 200){
        var obj=res.data.ideaEmail;
        if(obj){
          $('.email .targetSum').html(obj.targetSum)
          $('.email .arriveUv').html(obj.arriveUv)
          $('.email .openUv').html(obj.openUv)
          $('.email .unsubUv').html(obj.unsubUv)
        }
    }else{
        dcrmAlertError(res.msg);
    }
})




//查看短信列表
function viewSms(){
    window.location.href = "/view/marketing/sms/smspage.html?oid=indexList";
}

//查看邮件列表
function viewEmail(){
    window.location.href = "/view/marketing/email/email.html?oid=indexList";
}
// 查看未分配任务
function undistributed(){
    if(hasPermission('task', 'GET')){
        window.location.href = "/view/task/task.html?oid=undistributed";
    }
}
// 查看所有处理中任务
function inProcess(){
    if(hasPermission('task', 'GET')){
        window.location.href = "/view/task/task.html?oid=inProcess";
    }
}
// 查看我处理中的任务
function myInProcess(){
    if(hasPermission('task', 'GET')){
        window.location.href = "/view/task/task.html?oid=myInProcess";
    }
}

// 选项卡切换
//默认微页面高亮
 weiyemian()
 function weiyemian(){
        $(".weipage").find('li').hide();
        MaskUtil.Loading();
        API.topideaPage(data,function(res){
            console.log(res)
            if(res.code == 200){
                $(".weipage").find('li').eq(0).show();
                var obj=res.data.ideaPageList;
                $('.nodata').addClass('hide');
                $('.weipage').removeClass('hide');
                if(obj.length>0){
                    $(".weipage").find('li').eq(1).show();
                    $('.top1 a').html(isNull(obj[0].title))
                    $('.top1 a').attr('data-content',isNull(obj[0].title))
                    $('.top1').click(function(){//点击微页面名称进入分析页面
                        window.location.href = "/view/marketing/micro/micropage.html?id="+obj[0].id;
                    })
                    $('.top1'). siblings('.secondSpan').click(function(){
                        window.location.href = "/view/marketing/micro/microdata.html?id="+obj[0].id;
                    })
                     $('.top1'). siblings('.ThirdSpan').click(function(){
                        window.location.href = "/view/marketing/micro/microdata.html?id="+obj[0].id+'&submit=true';
                    })

                    $('.top1'). siblings('.lastSpan').click(function(){
                        window.location.href = "/view/marketing/micro/microdata.html?id="+obj[0].id+'&share=true';
                    })

                    if(obj[0].viewNum){
                     $('.top1 ').siblings('.secondSpan').html(obj[0].viewNum)
                    }
                    if(obj[0].submitNum){
                     $('.top1 ').siblings('.secondSpan').html(obj[0].submitNum)
                    }
                    if(obj[0].shareNum){
                      $('.top1'). siblings('.lastSpan').html(obj[0].shareNum)
                    }
                    $('.top1 a').addClass('pointer');
                    $('.top1'). siblings('.secondSpan').addClass('pointer')
                    $('.top1'). siblings('.ThirdSpan').addClass('pointer')
                    $('.top1'). siblings('.lastSpan').addClass('pointer')
                    if(obj[1]){
                        $(".weipage").find('li').eq(2).show();
                        $('.top2 a').html(isNull(obj[1].title))
                        $('.top2 a').attr('data-content',isNull(obj[1].title))
                        $('.top2').click(function(){//点击微页面名称进入分析页面
                            window.location.href = "/view/marketing/micro/micropage.html?id="+obj[1].id;
                        })
                        $('.top2'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[1].id;
                        })
                        $('.top2'). siblings('.ThirdSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[1].id+'&submit=true';;
                        })
                        $('.top2'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[1].id+'&share=true';;
                        })
                        $('.top2 a').addClass('pointer');
                        $('.top2'). siblings('.secondSpan').addClass('pointer')
                         $('.top2'). siblings('.ThirdSpan').addClass('pointer')

                        $('.top2'). siblings('.lastSpan').addClass('pointer')
                        if(obj[1].viewNum){
                         $('.top2 ').siblings('.secondSpan').html(obj[1].viewNum)
                        }
                         if(obj[1].submitNum){
                         $('.top2 ').siblings('.ThirdSpan').html(obj[1].submitNum)
                        }
                        if(obj[1].shareNum){
                          $('.top2').siblings('.lastSpan').html(obj[1].shareNum)
                        }
                    }


                    if(obj[2]){
                        $(".weipage").find('li').eq(3).show();
                       $('.top3 a').html(isNull(obj[2].title))
                       $('.top3 a').attr('data-content',isNull(obj[2].title))
                        $('.top3').click(function(){//点击微页面名称进入分析页面
                            window.location.href = "/view/marketing/micro/micropage.html?id="+obj[2].id;
                        })
                        $('.top3'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[2].id;
                        })
                        $('.top2'). siblings('.ThirdSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[1].id+'&submit=true';;
                        })
                        $('.top3'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[2].id+'&share=true';;
                        })

                        if(obj[2].viewNum){
                           $('.top3').siblings('.secondSpan').html(obj[2].viewNum)
                        }
                          if(obj[2].submitNum){
                           $('.top3').siblings('.ThirdSpan').html(obj[2].submitNum)
                        }
                        if(obj[2].shareNum){
                           $('.top3'). siblings('.lastSpan').html(obj[2].shareNum)
                        }
                        $('.top3 a').addClass('pointer');
                        $('.top3'). siblings('.secondSpan').addClass('pointer')
                        $('.top3'). siblings('.ThirdSpan').addClass('pointer')
                        $('.top3'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top3').siblings('.secondSpan').html('')
                        $('.top3').siblings('.ThirdSpan').html('')
                        $('.top3'). siblings('.lastSpan').html('')
                    }
                    if(obj[3]){
                        $(".weipage").find('li').eq(4).show();
                       $('.top4 a').html(isNull(obj[3].title))
                       $('.top4 a').attr('data-content',isNull(obj[3].title))
                        $('.top4').click(function(){//点击微页面名称进入分析页面
                            window.location.href = "/view/marketing/micro/micropage.html?id="+obj[3].id;
                        })
                        $('.top4'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[3].id;
                        })
                        $('.top2'). siblings('.ThirdSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[1].id+'&submit=true';;
                        })
                        $('.top4'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[3].id+'&share=true';;
                        })
                        if(obj[3].viewNum){
                           $('.top4').siblings('.secondSpan').html(obj[3].viewNum)
                        }
                          if(obj[3].submitNum){
                           $('.top3').siblings('.ThirdSpan').html(obj[2].submitNum)
                        }
                        if(obj[3].shareNum){
                           $('.top4'). siblings('.lastSpan').html(obj[3].shareNum)
                        }
                        $('.top4 a').addClass('pointer');
                        $('.top4'). siblings('.secondSpan').addClass('pointer')
                        $('.top4'). siblings('.ThirdSpan').addClass('pointer')
                        $('.top4'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top4').siblings('.secondSpan').html('');
                        $('.top4').siblings('.ThirdSpan').html('');
                        $('.top4').siblings('.lastSpan').html('')
                    }
                    if(obj[4]){
                        $(".weipage").find('li').eq(5).show();
                       $('.top5 a').html(isNull(obj[4].title))
                       $('.top5 a').attr('data-content',isNull(obj[4].title))
                        $('.top5').click(function(){//点击微页面名称进入分析页面
                            window.location.href = "/view/marketing/micro/micropage.html?id="+obj[4].id;
                        })
                        $('.top5'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[4].id;
                        })
                         $('.top5'). siblings('.ThirdSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[4].id+'&submit=true';;
                        })
                        $('.top5'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/micro/microdata.html?id="+obj[4].id+'&share=true';;
                        })

                        if(obj[4].viewNum){
                           $('.top5').siblings('.secondSpan').html(obj[4].viewNum)
                        }
                        if(obj[4].viewNum){
                           $('.top5').siblings('.ThirdSpan').html(obj[4].submit)
                        }
                        if(obj[4].shareNum){
                           $('.top5'). siblings('.lastSpan').html(obj[4].shareNum)
                        }

                        $('.top5 a').addClass('pointer');
                        $('.top5'). siblings('.secondSpan').addClass('pointer')
                        $('.top5'). siblings('.ThirdSpan').addClass('pointer')
                        $('.top5'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top5').siblings('.secondSpan').html('')
                        $('.top5').siblings('.ThirdSpan').html('')
                        $('.top5'). siblings('.lastSpan').html('')
                    }

                }else{
                    $('.nodata').removeClass('hide');
                    $('.weipage').addClass('hide');
                }


            }else{
                dcrmAlertError(res.msg);
            }
            MaskUtil.RemoveLoading();
            $(function (){
               setTimeout(function(){
                   $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)
            });

        });
}

$('.countTitle li').click(function(){
    $(this).siblings().find('a').removeClass('on')
    $(this).find('a').addClass('on')
    var title=$(this).find('a').html();
    if(title=='微页面统计'){
        $('.secondSpan').show();
        $('.first .secondSpan').html('页面访问(次)')
        $('.first .ThirdSpan').html('表单提交(次)')
        $('.first .lastSpan').html('分享(次)')
        clearmb();
        clearClick();
        //热门微页面
        weiyemian();
    }else if(title=='短信营销统计'){
        $('.ThirdSpan').hide();
        $('.first .secondSpan').html('发送(人)')
        $('.first .lastSpan').html('成功(人)')
        $('.secondSpan').show();
        clearmb();
        clearClick();
        $(".weipage").find('li').hide();
       //最新短信发送
        MaskUtil.Loading();
        API.lastSms(data,function(res){
            if(res.code == 200){
                $(".weipage").find('li').eq(0).show();
                var obj=res.data.ideaSmsLog;
                $('.nodata').addClass('hide');
                $('.weipage').removeClass('hide');
                if(obj.length>0){
                    $(".weipage").find('li').eq(1).show();
                    $('.top1 a').html(isNull(obj[0].title));
                    $('.top1 a').attr('data-content',isNull(obj[0].title));
                    $('.top1').click(function(){//点击微页面名称进入分析页面
                        window.location.href = "/view/marketing/sms/smspage.html?id="+obj[0].id;
                    });
                    $('.top1'). siblings('.secondSpan').click(function(){
                        window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[0].id+'&index=true';
                    });
                    $('.top1'). siblings('.lastSpan').click(function(){
                        window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[0].id+'&index=true';
                    });


                    if(obj[0].targetSum){
                     $('.top1').siblings('.secondSpan').html(obj[0].targetSum)
                    }
                    if(obj[0].arriveUv){
                      $('.top1').siblings('.lastSpan').html(obj[0].arriveUv)
                    }
                    $('.top1 a').addClass('pointer');
                    $('.top1'). siblings('.secondSpan').addClass('pointer')
                    $('.top1'). siblings('.lastSpan').addClass('pointer')

                    if(obj[1]){
                        $(".weipage").find('li').eq(2).show();
                       $('.top2 a').html(isNull(obj[1].title))
                        $('.top2 a').attr('data-content',isNull(obj[1].title))
                        $('.top2').click(function(){//点击微页面名称进入分析页面
                            window.location.href = "/view/marketing/sms/smspage.html?id="+obj[1].id;
                        })
                        $('.top2'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[1].id+'&index=true';
                        })
                        $('.top2'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[1].id+'&index=true';
                        })

                        if(obj[1].targetSum){
                         $('.top2 ').siblings('.secondSpan').html(obj[1].targetSum)
                        }
                        if(obj[1].arriveUv){
                          $('.top2').siblings('.lastSpan').html(obj[1].arriveUv)
                        }
                        $('.top2 a').addClass('pointer');
                        $('.top2'). siblings('.secondSpan').addClass('pointer')
                        $('.top2'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top2').siblings('.secondSpan').html('')
                        $('.top2'). siblings('.lastSpan').html('')
                    }


                    if(obj[2]){
                        $(".weipage").find('li').eq(3).show();
                       $('.top3 a').html(isNull(obj[2].title))
                       $('.top3 a').attr('data-content',isNull(obj[2].title))
                       $('.top3').click(function(){//点击微页面名称进入分析页面
                            window.location.href = "/view/marketing/sms/smspage.html?id="+obj[1].id;
                        })
                        $('.top3'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[1].id+'&index=true';
                        })
                        $('.top3'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[1].id+'&index=true';
                        })
                        if(obj[2].targetSum){
                         $('.top3 ').siblings('.secondSpan').html(obj[2].targetSum)
                        }
                        if(obj[2].arriveUv){
                          $('.top3').siblings('.lastSpan').html(obj[2].arriveUv)
                        }
                        $('.top3 a').addClass('pointer');
                        $('.top3'). siblings('.secondSpan').addClass('pointer')
                        $('.top3'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top3').siblings('.secondSpan').html('')
                        $('.top3'). siblings('.lastSpan').html('')
                    }
                    if(obj[3]){
                        $(".weipage").find('li').eq(4).show();
                       $('.top4 a').html(isNull(obj[3].title))
                       $('.top4 a').attr('data-content',isNull(obj[3].title))
                       $('.top4').click(function(){//点击微页面名称进入分析页面
                            window.location.href = "/view/marketing/sms/smspage.html?id="+obj[3].id;
                        })
                        $('.top4'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[3].id+'&index=true';
                        })
                        $('.top4'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[3].id+'&index=true';
                        });
                        if(obj[3].targetSum){
                         $('.top4 ').siblings('.secondSpan').html(obj[3].targetSum);
                        }
                        if(obj[3].arriveUv){
                          $('.top4').siblings('.lastSpan').html(obj[3].arriveUv);
                        }
                        $('.top4 a').addClass('pointer');
                        $('.top4'). siblings('.secondSpan').addClass('pointer');
                        $('.top4'). siblings('.lastSpan').addClass('pointer');
                    }else{
                        $('.top4').siblings('.secondSpan').html('');
                        $('.top4'). siblings('.lastSpan').html('');
                    }
                    if(obj[4]){
                        $(".weipage").find('li').eq(5).show();
                       $('.top5 a').html(isNull(obj[4].title));
                       $('.top5 a').attr('data-content',isNull(obj[4].title));
                       $('.top5').click(function(){//点击微页面名称进入分析页面
                            window.location.href = "/view/marketing/sms/smspage.html?id="+obj[4].id;
                        });
                        $('.top5'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[4].id+'&index=true';
                        });
                        $('.top5'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/sms/smsdata.html?id="+obj[4].id+'&index=true';
                        });

                        if(obj[4].targetSum){
                         $('.top5 ').siblings('.secondSpan').html(obj[4].targetSum)
                        }
                        if(obj[4].arriveUv){
                          $('.top5').siblings('.lastSpan').html(obj[4].arriveUv)
                        }
                        $('.top5 a').addClass('pointer');
                        $('.top5'). siblings('.secondSpan').addClass('pointer')
                        $('.top5'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top5').siblings('.secondSpan').html('')
                        $('.top5'). siblings('.lastSpan').html('')
                    }

                }else{
                    $('.nodata').removeClass('hide');
                    $('.weipage').addClass('hide');
                }
            }else{
                dcrmAlertError(res.msg);
            }
            MaskUtil.RemoveLoading();
        })

    }else if(title=='邮件营销统计'){
        $('.ThirdSpan').hide();
        $('.first .secondSpan').html('收到(人)')
        $('.first .lastSpan').html('查看(人)')
        clearmb()
        clearClick();
        $(".weipage").find('li').hide();
        MaskUtil.Loading();
        API.lastEmail(data,function(res){
            if(res.code == 200){
                $(".weipage").find('li').eq(0).show();
                var obj=res.data.ideaEmail;
                $('.nodata').addClass('hide');
                $('.weipage').removeClass('hide');
                if(obj.length>0){
                    $(".weipage").find('li').eq(1).show();
                    $('.top1 a').html(isNull(obj[0].mailName))
                    $('.top1 a').attr('data-content',isNull(obj[0].mailName))
                    $('.top1').click(function(){//点击邮件名称进入营销页面
                        window.location.href = "/view/marketing/email/email.html?id="+obj[0].id;
                    })
                    $('.top1'). siblings('.secondSpan').click(function(){
                        window.location.href = "/view/marketing/email/emaildata.html?id="+obj[0].id+'&index=true';
                    })
                    $('.top1'). siblings('.lastSpan').click(function(){
                        window.location.href = "/view/marketing/email/emaildata.html?id="+obj[0].id+'&index=chakan';
                    })

                    if(obj[0].arriveUv){
                     $('.top1').siblings('.secondSpan').html(obj[0].arriveUv)
                    }
                    if(obj[0].openUv){
                      $('.top1').siblings('.lastSpan').html(obj[0].openUv)
                    }
                    $('.top1 a').addClass('pointer');
                    $('.top1'). siblings('.secondSpan').addClass('pointer')
                    $('.top1'). siblings('.lastSpan').addClass('pointer')

                    if(obj[1]){
                        $(".weipage").find('li').eq(2).show();
                        $('.top2 a').html(isNull(obj[1].mailName))
                        $('.top2 a').attr('data-content',isNull(obj[1].mailName))
                        // 点击页面跳转start
                        $('.top2').click(function(){//点击邮件名称进入营销页面
                            window.location.href = "/view/marketing/email/email.html?id="+obj[1].id;
                        })
                        $('.top2'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/email/emaildata.html?id="+obj[1].id+'&index=true';
                        })
                        $('.top2'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/email/emaildata.html?id="+obj[1].id+'&index=chakan';
                        })
                        // 点击页面跳转end
                        if(obj[1].arriveUv){
                         $('.top2 ').siblings('.secondSpan').html(obj[1].arriveUv)
                        }
                        if(obj[1].openUv){
                          $('.top2').siblings('.lastSpan').html(obj[1].openUv)
                        }
                        $('.top2 a').addClass('pointer');
                        $('.top2'). siblings('.secondSpan').addClass('pointer')
                        $('.top2'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top2').siblings('.secondSpan').html('')
                        $('.top2'). siblings('.lastSpan').html('')
                    }

                    if(obj[2]){
                        $(".weipage").find('li').eq(3).show();
                       $('.top3 a').html(isNull(obj[2].mailName))
                       $('.top3 a').attr('data-content',isNull(obj[2].mailName))
                       // 点击页面跳转start
                        $('.top3').click(function(){//点击邮件名称进入营销页面
                            window.location.href = "/view/marketing/email/email.html?id="+obj[2].id;
                        })
                        $('.top3'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/email/emaildata.html?id="+obj[2].id+'&index=true';
                        })
                        $('.top3'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/email/emaildata.html?id="+obj[2].id+'&index=chakan';
                        })
                        // 点击页面跳转end
                        if(obj[2].arriveUv){
                         $('.top3 ').siblings('.secondSpan').html(obj[2].arriveUv)
                        }
                        if(obj[2].openUv){
                          $('.top3').siblings('.lastSpan').html(obj[2].openUv)
                        }
                        $('.top3 a').addClass('pointer');
                        $('.top3'). siblings('.secondSpan').addClass('pointer')
                        $('.top3'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top3').siblings('.secondSpan').html('')
                        $('.top3'). siblings('.lastSpan').html('')
                    }
                    if(obj[3]){
                        $(".weipage").find('li').eq(4).show();
                       $('.top4 a').html(isNull(obj[3].mailName))
                       $('.top4 a').attr('data-content',isNull(obj[3].mailName))
                       // 点击页面跳转start
                        $('.top4').click(function(){//点击邮件名称进入营销页面
                            window.location.href = "/view/marketing/email/email.html?id="+obj[3].id;
                        })
                        $('.top4'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/email/emaildata.html?id="+obj[3].id+'&index=true';
                        })
                        $('.top4'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/email/emaildata.html?id="+obj[3].id+'&index=chakan';
                        })
                        // 点击页面跳转end
                        if(obj[3].arriveUv){
                         $('.top4').siblings('.secondSpan').html(obj[3].arriveUv)
                        }
                        if(obj[3].openUv){
                          $('.top4').siblings('.lastSpan').html(obj[3].openUv)
                        }
                        $('.top4 a').addClass('pointer');
                        $('.top4'). siblings('.secondSpan').addClass('pointer')
                        $('.top4'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top4').siblings('.secondSpan').html('')
                        $('.top4'). siblings('.lastSpan').html('')
                    }
                    if(obj[4]){
                        $(".weipage").find('li').eq(5).show();
                       $('.top5 a').html(isNull(obj[4].mailName))
                       $('.top5 a').attr('data-content',isNull(obj[4].mailName))
                       // 点击页面跳转start
                        $('.top5').click(function(){//点击邮件名称进入营销页面
                            window.location.href = "/view/marketing/email/email.html?id="+obj[4].id;
                        })
                        $('.top5'). siblings('.secondSpan').click(function(){
                            window.location.href = "/view/marketing/email/emaildata.html?id="+obj[4].id+'&index=true';
                        })
                        $('.top5'). siblings('.lastSpan').click(function(){
                            window.location.href = "/view/marketing/email/emaildata.html?id="+obj[4].id+'&index=chakan';
                        })
                        // 点击页面跳转end
                        if(obj[4].arriveUv){
                         $('.top5').siblings('.secondSpan').html(obj[4].arriveUv)
                        }
                        if(obj[4].openUv){
                          $('.top5').siblings('.lastSpan').html(obj[4].openUv)
                        }
                        $('.top5 a').addClass('pointer');
                        $('.top5'). siblings('.secondSpan').addClass('pointer')
                        $('.top5'). siblings('.lastSpan').addClass('pointer')
                    }else{
                        $('.top5').siblings('.secondSpan').html('')
                        $('.top5'). siblings('.lastSpan').html('')
                    }

                }else{
                    $('.nodata').removeClass('hide');
                    $('.weipage').addClass('hide');
                }
            }else{
                dcrmAlertError(res.msg);
            }
            MaskUtil.RemoveLoading();
        })
    }else if(title=='微信群营销统计'){
        $('.secondSpan').hide();
        $('.ThirdSpan').hide();
        $('.first .lastSpan').html('发送(人)');
        clearmb()
        clearClick()
        MaskUtil.Loading();
        $(".weipage").find('li').hide();
        API.wgTop5(data,function(res){
            if(res.code == 200){
                $(".weipage").find('li').eq(0).show();
                var obj=res.data. ideaFlashSmsLogVo;
                $('.nodata').addClass('hide');
                $('.weipage').removeClass('hide');
                if(obj.length>0){
                    $(".weipage").find('li').eq(1).show();
                    $('.top1 a').html(isNull(obj[0].modelName))
                    $('.top1 a').attr('data-content',isNull(obj[0].modelName))

                    // 点击页面跳转start
                    $('.top1').click(function(){//点击微信群名称进入营销页面
                        window.location.href = "/view/marketing/wechat/wechatgroup.html?id="+obj[0].id;
                    })

                    // 点击页面跳转end
                    if(obj[0].targetNum){
                      $('.top1'). siblings('.lastSpan').html(obj[0].targetNum)
                    }


                    if(obj[1]){
                         $(".weipage").find('li').eq(2).show();
                        $('.top2 a').html(isNull(obj[1].modelName))
                        $('.top2 a').attr('data-content',isNull(obj[1].modelName))
                        $('.top2').click(function(){//点击微信群名称进入营销页面
                            window.location.href = "/view/marketing/wechat/wechatgroup.html?id="+obj[1].id;
                        })
                        if(obj[1].targetNum){
                          $('.top2').siblings('.lastSpan').html(obj[1].targetNum)
                        }

                    }


                    if(obj[2]){
                        $(".weipage").find('li').eq(3).show();
                       $('.top3 a').html(isNull(obj[2].modelName))
                       $('.top3 a').attr('data-content',isNull(obj[2].modelName))
                       $('.top3').click(function(){//点击微信群名称进入营销页面
                            window.location.href = "/view/marketing/wechat/wechatgroup.html?id="+obj[2].id;
                        })

                        if(obj[2].targetNum){
                           $('.top3'). siblings('.lastSpan').html(obj[2].targetNum)
                        }

                    }else{
                        $('.top3').siblings('.secondSpan').html('')
                        $('.top3'). siblings('.lastSpan').html('')
                    }
                    if(obj[3]){
                        $(".weipage").find('li').eq(4).show();
                       $('.top4 a').html(isNull(obj[3].modelName))
                       $('.top4 a').attr('data-content',isNull(obj[3].modelName))
                       $('.top4').click(function(){//微信群名称进入营销页面
                            window.location.href = "/view/marketing/wechat/wechatgroup.html?id="+obj[3].id;
                        })

                        if(obj[3].targetNum){
                           $('.top4'). siblings('.lastSpan').html(obj[3].targetNum)
                        }

                    }else{
                        $('.top4').siblings('.secondSpan').html('');
                        $('.top4').siblings('.lastSpan').html('')
                    }
                    if(obj[4]){
                        $(".weipage").find('li').eq(5).show();
                       $('.top5 a').html(isNull(obj[4].modelName))
                       $('.top5 a').attr('data-content',isNull(obj[4].modelName))
                       $('.top5').click(function(){//点击微信群名称进入营销页面
                            window.location.href = "/view/marketing/wechat/wechatgroup.html?id="+obj[4].id;
                        })

                        if(obj[4].targetNum){
                           $('.top5'). siblings('.lastSpan').html(obj[4].targetNum)
                        }

                    }else{
                        $('.top5').siblings('.secondSpan').html('')
                        $('.top5'). siblings('.lastSpan').html('')
                    }

                }else{
                    $('.nodata').removeClass('hide');
                    $('.weipage').addClass('hide');
                }

            }else{
                dcrmAlertError(res.msg);
            }
            $(function (){
               setTimeout(function(){
                   $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)
               });
            MaskUtil.RemoveLoading();
        });
    }else if(title=='弹信营销统计'){
        $('.secondSpan').show();
        $('.ThirdSpan').show();
        $('.first .secondSpan').html('发送(人)')
        $('.first .ThirdSpan').html('失败(人)')
        $('.first .lastSpan').html('成功(人)')
        clearmb()
        clearClick();
        $(".weipage").find('li').hide();
        MaskUtil.Loading();
        API.fslogtop5(data,function(res){
            if(res.code == 200){
                $(".weipage").find('li').eq(0).show();
                var obj=res.data.IdeaFlashSmsLogVo;
                $('.nodata').addClass('hide');
                $('.weipage').removeClass('hide');
                if(obj.length>0){
                    $(".weipage").find('li').eq(1).show();
                    $('.top1 a').html(isNull(obj[0]. flashName))
                    $('.top1 a').attr('data-content',isNull(obj[0]. flashName))
                    $('.top1').click(function(){
                        window.location.href = "/view/marketing/FlashSMS/list.html?index="+obj[0].id;
                    })
                    if(obj[0].targetNum){
                     $('.top1 ').siblings('.secondSpan').html(obj[0].targetNum)
                    }
                    if(obj[0].arriveUv){
                       $('.top1'). siblings('.lastSpan').html(obj[0].arriveUv)
                    }

                    if(obj[1]){
                        $(".weipage").find('li').eq(2).show();
                        $('.top2 a').html(isNull(obj[1].flashName))
                        $('.top2 a').attr('data-content',isNull(obj[1].flashName))
                        $('.top2').click(function(){
                            window.location.href = "/view/marketing/FlashSMS/list.html?index="+obj[1].id;
                        })
                        if(obj[1].targetNum){
                           $('.top2 ').siblings('.secondSpan').html(obj[1].targetNum)
                        }
                        if(obj[1].arriveUv){
                          $('.top2').siblings('.lastSpan').html(obj[1].arriveUv)
                        }
                    }else{
                        $('.top2').siblings('.secondSpan').html('')
                        $('.top2'). siblings('.lastSpan').html('')
                    }

                    if(obj[2]){
                        $(".weipage").find('li').eq(3).show();
                       $('.top3 a').html(isNull(obj[2].flashName))
                       $('.top3 a').attr('data-content',isNull(obj[2].flashName))
                       $('.top3').click(function(){
                            window.location.href = "/view/marketing/FlashSMS/list.html?index="+obj[2].id;
                        })
                        if(obj[2].targetNum){
                           $('.top3').siblings('.secondSpan').html(obj[2].targetNum)
                        }
                        if(obj[2].arriveUv){
                           $('.top3'). siblings('.lastSpan').html(obj[2].arriveUv)
                        }
                        $('.top3'). siblings('.ThirdSpan').html(obj[2].targetNum - obj[2].arriveUv);
                    }else{
                        $('.top3').siblings('.secondSpan').html('')
                        $('.top3'). siblings('.lastSpan').html('')
                    }
                    if(obj[3]){
                        $(".weipage").find('li').eq(4).show();
                       $('.top4 a').html(isNull(obj[3].flashName))
                       $('.top4 a').attr('data-content',isNull(obj[3].flashName))
                       $('.top4').click(function(){
                            window.location.href = "/view/marketing/FlashSMS/list.html?index="+obj[3].id;
                        })
                        if(obj[3].targetNum){
                           $('.top4').siblings('.secondSpan').html(obj[3].targetNum)
                        }
                        if(obj[3].arriveUv){
                           $('.top4'). siblings('.lastSpan').html(obj[3].arriveUv)
                        }
                        $('.top4'). siblings('.ThirdSpan').html(obj[3].targetNum - obj[3].arriveUv);
                    }else{
                        $('.top4').siblings('.secondSpan').html('')
                        $('.top4'). siblings('.lastSpan').html('')
                    }
                    if(obj[4]){
                        $(".weipage").find('li').eq(5).show();
                       $('.top5 a').html(isNull(obj[4].flashName))
                       $('.top5 a').attr('data-content',isNull(obj[4].flashName))
                       $('.top5').click(function(){
                            window.location.href = "/view/marketing/FlashSMS/list.html?index="+obj[4].id;
                        })

                        if(obj[4].targetNum){
                           $('.top5').siblings('.secondSpan').html(obj[4].targetNum)
                        }
                        if(obj[4].arriveUv){
                           $('.top5'). siblings('.lastSpan').html(obj[4].arriveUv)
                        }
                        $('.top5'). siblings('.ThirdSpan').html(obj[4].targetNum - obj[4].arriveUv);

                    }else{
                        $('.top5').siblings('.secondSpan').html('')
                        $('.top5'). siblings('.lastSpan').html('')
                    }

                }else{
                    $('.nodata').removeClass('hide');
                    $('.weipage').addClass('hide');
                }


            }else{
                dcrmAlertError(res.msg);
            }
            $(function (){
               setTimeout(function(){
                   $("[data-toggle='popover']").popover({trigger:"hover"});
                },500)
               });
            MaskUtil.RemoveLoading();
        });
    }
})
// Date.prototype.pattern=function(fmt) {
//     var o = {
//     "M+" : this.getMonth()+1, //月份
//     "d+" : this.getDate(), //日
//     "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
//     "H+" : this.getHours(), //小时
//     "m+" : this.getMinutes(), //分
//     "s+" : this.getSeconds(), //秒
//     "q+" : Math.floor((this.getMonth()+3)/3), //季度
//     "S" : this.getMilliseconds() //毫秒
//     };
//     var week = {
//     "0" : "\u65e5",
//     "1" : "\u4e00",
//     "2" : "\u4e8c",
//     "3" : "\u4e09",
//     "4" : "\u56db",
//     "5" : "\u4e94",
//     "6" : "\u516d"
//     };
//     if(/(y+)/.test(fmt)){
//     fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
//     }
//     if(/(E+)/.test(fmt)){
//     fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);
//     }
//     for(var k in o){
//     if(new RegExp("("+ k +")").test(fmt)){
//     fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
//     }
//     }
//     return fmt;
// }
// 新增客户
// var hkdwNewAddDate=[0,0,0,0,0]
// var makingNewAddDate=[0,0,0,0,0,0,0]
// var myNewAddDate=[0,0,0,0,0,0,0]
// var week = [];
// var five=[]
// var date=new Date();
// for(var i = 7;i>0;i--){
//     var dat= new Date((+date)-i*24*3600*1000);
//     week.push(dat.pattern("yyyy-MM-dd"))
// }

// for(var i = 5;i>0;i--){
//     var dat= new Date((+date)-i*24*3600*1000);
//     five.push(dat.pattern("yyyy-MM-dd"))
// }
var hkdwNewAddDate=[];
var hkdwNewAddNum=[];
var makingNewAddDate=[];
var makingNewAddNum=[];
var myNewDate=[];
var myNewNum=[];

var param={
    'hkdwNumber':5,
    'MyDay':7,
    'MarketingDay':7,
};

API.homeCustTotle(param,function(res){
    if(res.code == 200){
        var hkdwNewAdd=res.data.hkdwNewAdd.list;
        var makingNewAdd=res.data.makingNewAdd.list;
        var myNewAdd=res.data.myNewAdd.list;
        for(var i=hkdwNewAdd.length-1;i>=0;i--){
            hkdwNewAddDate.push(hkdwNewAdd[i].date)
            hkdwNewAddNum.push(hkdwNewAdd[i].newCust)
        }

        for(var i=makingNewAdd.length-1;i>=0;i--){
            makingNewAddDate.push(makingNewAdd[i].date)
            makingNewAddNum.push(makingNewAdd[i].newCust)
        }

        for(var i=myNewAdd.length-1;i>=0;i--){
            myNewDate.push(myNewAdd[i].date)
            myNewNum.push(myNewAdd[i].newCust)
        }

        $('.hkdwNewAdd').html(res.data.hkdwNewAdd.totalCount)
        $('.makingNewAdd').html(res.data.makingNewAdd.totalCount)
        $('.myNewAdd').html(res.data.myNewAdd.totalCount)
    }else{
        dcrmAlertError(res.msg);
    }
})

// 华坤道威新增悬浮展示
for(var m=0;m<5;m++){
  $('.huakun .dian em').eq(m).find(' p').eq(0).html(hkdwNewAddDate[m])
  $('.huakun .dian em').eq(m).find(' i').html(hkdwNewAddNum[m])
}
// 营销悬浮展示
for(var m=0;m<7;m++){
  $('.marketing .dian em').eq(m).find(' p').eq(0).html(makingNewAddDate[m])
  $('.marketing .dian em').eq(m).find(' i').html(makingNewAddNum[m])
}
// 我的新增悬浮展示
for(var m=0;m<7;m++){
  $('.myadd .dian em').eq(m).find(' p').eq(0).html(myNewDate[m])
  $('.myadd .dian em').eq(m).find(' i').html(myNewNum[m])
}
// 华坤新增图表
var huakunChart = echarts.init(document.getElementById('huakunChart'));
var huakunOption={
    legend: {
        data: ["最高气温"],
        show:false,
    },
    toolbox: {
        feature: {
            dataView: {
                readOnly: true,
                show: false
            },
            magicType: {
                type: ["line", "bar"],
                show: false
            }
        }
    },
    calculable: false,
    xAxis: [
        {
            show:false,
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五"]
        }
    ],
    yAxis: [
        {
            show:false,
            type: "value"
        }
    ],
    grid: {
        top:'60%',
        left: '-13%',
        right: '3%',
        bottom: '0%',
        containLabel: true,
        x:0
    },
    series: [
        {
            type: "line",
            name: "最高气温",
            data: [0, 0, 0, 0,0],
            smooth: true,
            symbol:"none",
            itemStyle : {
                normal : {
                     color:'#02cd81',
                    lineStyle:{
                        color:'#02cd81'
                    }
                }
            },
        }
    ]
}

huakunOption.series[0].data=hkdwNewAddNum;
huakunChart.setOption(huakunOption);

var marketChart = echarts.init(document.getElementById('marketChart'));
var marketOption={
    legend: {
        data: ["最高气温"],
        show:false,
    },
    // tooltip: {
    //     trigger: 'axis'
    // },
    toolbox: {
        feature: {
            dataView: {
                readOnly: true,
                show: false
            },
            magicType: {
                type: ["line", "bar"],
                show: false
            }
        }
    },
    calculable: false,
    xAxis: [
        {
            show:false,
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五",'周六','周日']
        }
    ],
    yAxis: [
        {
            show:false,
            type: "value"
        }
    ],
    grid: {
        top:'60%',
        left: '-7%',
        right: '3%',
        bottom: '0%',
        containLabel: true,
        x:0
    },
    series: [
        {
            type: "line",
            name: "最高气温",
            data: [0, 0, 0, 0,0,0,0],
            smooth: true,
            symbol:"none",
            itemStyle : {
                normal : {
                     color:'#02cd81',
                    lineStyle:{
                        color:'#02cd81'
                    }
                }
            },
        }
    ]
}
marketOption.series[0].data=makingNewAddNum;

marketChart.setOption(marketOption);

var myChart = echarts.init(document.getElementById('myChart'));

var myOption={
    legend: {
        data: ["最高气温"],
        show:false,
    },
    // tooltip: {
    //     trigger: 'axis'
    // },
    toolbox: {
        feature: {
            dataView: {
                readOnly: true,
                show: false
            },
            magicType: {
                type: ["line", "bar"],
                show: false
            }
        }
    },
    calculable: false,
    xAxis: [
        {
            show:false,
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五",'周六','周日']
        }
    ],
    yAxis: [
        {
            show:false,
            type: "value"
        }
    ],
    grid: {
        top:'60%',
        left: '-7%',
        right: '3%',
        bottom: '0%',
        containLabel: true,
        x:0
    },
    series: [
        {
            type: "line",
            name: "最高气温",
            data: [0, 0, 0, 0,0,0,0],
            smooth: true,
            symbol:"none",
            itemStyle : {
                normal : {
                     color:'#02cd81',
                    lineStyle:{
                        color:'#02cd81'
                    }
                }
            },
        }
    ]
}
myOption.series[0].data=myNewNum;

myChart.setOption(myOption);


// 新增微信好友
var wxData={
    'wechatDayNumber':7
}
var wechatFriendList=[];
var wechatFriendDate=[];
var wechatFriendNum=[];
// API.wechatFriendTotle(wxData,function(res){
//     if(res.code==200){
//        wechatFriendList=res.data.wxFriendCount.acceptList;
//         for(var i=wechatFriendList.length-1;i>=0;i--){
//             wechatFriendDate.push(wechatFriendList[i].date)
//             wechatFriendNum.push(wechatFriendList[i].count)
//         }
//         $('.wxNewAdd').html(res.data.wxFriendCount.total)
//     }else{
//         dcrmAlertError(res.msg)
//     }

// })
var friendChart = echarts.init(document.getElementById('friendChart'));

var friendOption={
    legend: {
        data: ["新增微信好友"],
        show:false,
    },
    // tooltip: {
    //     trigger: 'axis'
    // },
    toolbox: {
        feature: {
            dataView: {
                readOnly: true,
                show: false
            },
            magicType: {
                type: ["line", "bar"],
                show: false
            }
        }
    },
    calculable: false,
    xAxis: [
        {
            show:false,
            type: "category",
            data: ["11:20", "12:20", "13:20", "14:20", "15:20",'16:20','17:20']
        }
    ],
    yAxis: [
        {
            show:false,
            type: "value"
        }
    ],
    grid: {
        top:'60%',
        left: '-5%',
        right: '3%',
        bottom: '0%',
        containLabel: true,
        x:0
    },
    series: [
        {
            type: "line",
            name: "新增微信好友",
            data: [0,0,0,0,0,0,0],
            smooth: true,
            symbol:"none",
            itemStyle : {
                normal : {
                     color:'#02cd81',
                      // label : {show: true},
                    lineStyle:{
                        color:'#02cd81'
                    }
                }
            },

        }
    ]
}
if(wechatFriendDate){
    friendOption.series[0].data=wechatFriendNum;
}
friendChart.setOption(friendOption);
// 新增微信好友悬浮展示
console.log(wechatFriendDate)
console.log(wechatFriendNum)
for(var m=0;m<7;m++){
  $('.addFriend .dian em').eq(m).find(' p').eq(0).html(wechatFriendDate[m])
  $('.addFriend .dian em').eq(m).find(' i').html( wechatFriendNum[m])
}
// 点击小三角显示新增用户
$('.new .icon').click(function(){
    $('.allNew').toggle()
    $('.new .icon').toggleClass('xiangxia')
})

$('.dian span').mouseenter(function(){
    $(this).removeClass('lightGray').addClass('lightGreen')
    $(this).siblings().removeClass('lightGreen').addClass('lightGray')
    $('.dian em').css('opacity','0')
    $(this).find('em').css('opacity','1')

}).mouseleave(function(){
    $(this).addClass('lightGray').removeClass('lightGreen')

    $('.dian em').css('opacity','0')
})
// 清空模板记录
function clearmb(){
    $('.top1 a').html('')
    $('.top1 a').attr('data-content','')
    $('.top1').siblings('.secondSpan').html('0')
    $('.top1'). siblings('.lastSpan').html('0')

    $('.top2 a').html('')
    $('.top2 a').attr('data-content','')
    $('.top2').siblings('.secondSpan').html('0')
    $('.top2'). siblings('.lastSpan').html('0')

    $('.top3 a').html('')
    $('.top3 a').attr('data-content','')
    $('.top3').siblings('.secondSpan').html('0')
    $('.top3'). siblings('.lastSpan').html('0')

    $('.top4 a').html('')
    $('.top4 a').attr('data-content','')
    $('.top4').siblings('.secondSpan').html('0')
    $('.top4'). siblings('.lastSpan').html('0')

    $('.top5 a').html('')
    $('.top5 a').attr('data-content','')
    $('.top5').siblings('.secondSpan').html('0')
    $('.top5'). siblings('.lastSpan').html('0')
}
// 清空点击列表
function clearClick(){
    $('.top1').unbind('click');
    $('.top2').unbind('click');
    $('.top3').unbind('click');
    $('.top4').unbind('click');
    $('.top5').unbind('click');
    $('.secondSpan').unbind('click');
    $('.lastSpan').unbind('click');
    $('.secondSpan').removeClass('pointer');
    $('.lastSpan').removeClass('pointer')
    // $('.firstSpan a').removeClass('pointer')
}

//访问与提交图表
var renShu1 = [];//访问----人数
var cishu = [];//访问----次数
var xAxis = [];//X轴显示//访问----横坐标
var max1 = '';//y轴最大值
var main1 = '';//登录人的序号
var renShu2 = [];//提交----人数
var xAxis2 = [];//X轴显示//提交----横坐标
var max2 = '';//y轴最大值
var main2 = '';//登录人的序号
function homeSubmitAnaly(){
    API.homeSubmitAnaly({},function(res){
        if(res&&res.code == 200){
            var viewData = res.data.viewData;//访问
            var submitData = res.data.submitData;//提交


            $.each(viewData,function(i,u){
                if(u.id == Global.userId){
                    main1 = i;
                }
                renShu1.push(u.uv);
                cishu.push(u.pv);
                xAxis.push(u.user_name);
                if(xAxis.length>30){
                    window.end1 = 30;
                }
                if(20>xAxis.length>30){
                    window.end1 = 50;
                }
                if(xAxis.length<20){
                    window.end1 = 100;
                }
                var j = 0;
                for (var i=0;i<cishu.length ;i++ ){
                    if(cishu[i]>j){
                        j = cishu[i];
                    }
                }
                max1 = j;
            });
            $.each(submitData,function(i,u){
                if(u.id == Global.userId){
                    main2 = i;
                }
                renShu2.push(u.uv);
                xAxis2.push(u.user_name);
                if(xAxis2.length>30){
                    window.end2 = 30;
                }
                if(20>xAxis2.length>30){
                    window.end2 = 50;
                }
                if(xAxis2.length<20){
                    window.end2 = 100;
                }
                var j = 0;
                for (var i=0;i<renShu2.length ;i++ ){
                    if(renShu2[i]>j){
                        j = renShu2[i];
                    }
                }
                max2 = j;
            })
            setTimeout(function(){
                myview();//访问
                mySubmit();//提交
            },1000)

        }
    })
}

function myview() {
    /*图表*/
    var myChart1 = echarts.init(document.getElementById('chart_box1'));
    var optionWeek = {
        title: {
            text: '员工传播的微页面访问人数/次数',//图表标题
            textStyle: {
                //文字颜色
                color: '#000',
                //字体风格,'normal','italic','oblique'
                fontStyle: 'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight: 'bold',
                //字体系列
                fontFamily: 'sans-serif',
                //字体大小
                fontSize: 14
            }
        },
        grid: {
            top: '18%',
            left: '1%',
            right: '50',
            bottom: '15%',
            containLabel: true,
            x: 0
        },
        tooltip: {
            trigger: 'axis',    //提示触发类型      'item':数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
            //'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
            //'none':什么都不触发。
            show: true,     //是否显示提示框组件 默认为true
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: [
                {
                    name: '次数',
                    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAOCAIAAAC+b5sUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABYSURBVDhPY/j////dRz+XbnrfM/c12QioHWgI0CiGD5/+oMmRjYBGMZy79g1NlGwENIrh6NkvaKJkI6BRo8aRiYaAcee+oomSjUDGUTkZUzmTUbMI+P8fAMGGB/xGXRNVAAAAAElFTkSuQmCC'
                },
                {
                    name: '人数'
                }
            ],
            x: 'right'
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: window.end1
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: xAxis,
                axisPointer: {
                    type: 'shadow'
                }

            }
        ],
        yAxis: [
            {
                type: 'value',
                //name: '次数',
                min: 0,
                max: max1,
                //interval: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '次数',
                type: 'bar',         //bar表示柱状图
                data: cishu,//数据
                barWidth: 10,//柱图宽度
                markPoint: {
                    data: [
                        {
                            type: 'max', name: '最大值',
                            itemStyle: {
                                normal: {
                                    color: '#606cbf'
                                }
                            }
                        },
                        {
                            type: 'min', name: '最小值',
                            itemStyle: {
                                normal: {
                                    color: '#606cbf'
                                }
                            }
                        }
                    ]
                },
                markLine: {
                    data: [
                        {
                            type: 'average', name: '平均值',
                            itemStyle: {
                                normal: {
                                    color: '#606cbf'
                                }
                            }
                        }
                    ]
                },
                itemStyle: {    //更多柱状图样式搜索API：series-bar.itemStyle
                    emphasis: {
                        barBorderRadius: [5, 5, 0, 0]
                    },
                    normal: {
                        //color: '#8c9deb',//改变柱状的颜色
                        color: function (params) {
                            if (params.dataIndex === main1) {
                                return 'red';
                            } else {
                                return '#8c9deb';
                            }
                        },//改变柱状的颜色
                        borderColor: '#8c9deb', //描边的颜色：默认#000
                        borderWidth: 0,  //描边的宽度     默认：0
                        borderType: 'solid',  //描边的类型：'dashed', 'dotted'，'solid'(默认)
                        barBorderRadius: [5, 5, 0, 0]
                        /*
                        更多样式：
                        barBorderRadius:'10'//柱状的圆角
                        shadowBlur：图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                        shadowColor,shadowOffsetX, shadowOffsetY ：图形阴影效果
                        */
                    }
                }
            },
            {
                name: '人数',
                type: 'line',        //line表示折线图
                data: renShu1,
                itemStyle: {    //更多折线图线条样式搜索API：series-line.itemStyle
                    normal: {
                        color: '#02cd81',//改变折线点的颜色
                        lineStyle: {    //改变折线样式
                            color: '#02cd81', //改变折线颜色
                            width: 3    //改变线条的粗细
                        }
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart1.setOption(optionWeek);
}

function mySubmit() {
    var myChart2 = echarts.init(document.getElementById('chart_box2'));
    var optionWeek2 = {
        title: {
            text: '员工传播的微页面提交表单人数',//图表标题
            textStyle: {
                //文字颜色
                color: '#000',
                //字体风格,'normal','italic','oblique'
                fontStyle: 'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight: 'bold',
                //字体系列
                fontFamily: 'sans-serif',
                //字体大小
                fontSize: 14
            }
        },
        grid: {
            top: '18%',
            left: '1%',
            right: '50',
            bottom: '15%',
            containLabel: true,
            x: 0
        },
        tooltip: {
            trigger: 'axis',    //提示触发类型      'item':数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
            //'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
            //'none':什么都不触发。
            show: true,     //是否显示提示框组件 默认为true
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: [
                {
                    name: '人数',
                    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAOCAIAAAC+b5sUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABYSURBVDhPY/j////dRz+XbnrfM/c12QioHWgI0CiGD5/+oMmRjYBGMZy79g1NlGwENIrh6NkvaKJkI6BRo8aRiYaAcee+oomSjUDGUTkZUzmTUbMI+P8fAMGGB/xGXRNVAAAAAElFTkSuQmCC'
                }
            ],
            x: 'right'
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: window.end2
            }],
        xAxis: [
            {
                type: 'category',
                data: xAxis2,
                axisPointer: {
                    type: 'shadow'
                }

            }
        ],
        yAxis: [
            {
                type: 'value',
                //name: '人数',
                min: 0,
                max: max2,
                //interval: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '人数',
                type: 'bar',         //bar表示柱状图
                data: renShu2,//数据
                barWidth: 10,//柱图宽度
                markPoint: {
                    data: [
                        {
                            type: 'max', name: '最大值',
                            itemStyle: {
                                normal: {
                                    color: '#606cbf'
                                }
                            }
                        },
                        {
                            type: 'min', name: '最小值',
                            itemStyle: {
                                normal: {
                                    color: '#606cbf'
                                }
                            }
                        }
                    ]
                },
                markLine: {
                    data: [
                        {
                            type: 'average', name: '平均值',
                            itemStyle: {
                                normal: {
                                    color: '#606cbf'
                                }
                            }
                        }
                    ]
                },
                itemStyle: {    //更多柱状图样式搜索API：series-bar.itemStyle
                    emphasis: {
                        barBorderRadius: [5, 5, 0, 0]
                    },
                    normal: {
                        color: function (params) {
                            if (params.dataIndex === main2) {
                                return 'red';
                            } else {
                                return '#8c9deb';
                            }
                        },//改变柱状的颜色
                        borderColor: '#8c9deb', //描边的颜色：默认#000
                        borderWidth: 0,  //描边的宽度     默认：0
                        borderType: 'solid',  //描边的类型：'dashed', 'dotted'，'solid'(默认)
                        barBorderRadius: [5, 5, 0, 0]
                        /*
                        更多样式：
                        barBorderRadius:'10'//柱状的圆角
                        shadowBlur：图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                        shadowColor,shadowOffsetX, shadowOffsetY ：图形阴影效果
                        */
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart2.setOption(optionWeek2);
}

