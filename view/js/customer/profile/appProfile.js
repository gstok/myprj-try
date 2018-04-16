var docEl = document.documentElement,
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = (clientWidth / 10) + "px";
    };
window.addEventListener("resize", recalc);
recalc();

$(function() {
    $('#dowebok').fullpage({
        scrollOverflow: true,
        touchSensitivity:30,
        afterLoad: function (anchorLink, index) {
            if (index == 1) {
                $('.section1').find('.custNameBox').show().animateCss("bounceInRight");
            }
            if (index == 2) {
                $('.section2').find('h3').show().animateCss("bounceInDown");
                $('.section2').find('.basicDataBox').show().animateCss("bounceIn");
            }
            if (index == 3) {
                $('.section3').find('.customerValueBox').show().animateCss("flipInX");
                $('.section3').find('h3').show().animateCss("bounceInLeft");
            }
            if (index == 4) {
                $('.section4').find('.buyChannelBox').show().animateCss("fadeInLeft");
                $('.section4').find('h3').show().animateCss("bounceInRight");
            }
            if (index == 5) {
                $('.section5').find('.vitalityBox').show().animateCss("bounceInUp");
                $('.section5').find('h3').show().animateCss("lightSpeedIn");
            }
            if (index == 6) {
                $('.section6').find('.recommendBox').show().animateCss("zoomIn");
                $('.section6').find('h3').show().animateCss("rotateIn");
            }
            if (index == 7) {
                $('.section7').find('.spreadBox').show().animateCss("tada");
                $('.section7').find('h3').show().animateCss("zoomIn");
            }
            if (index == 8) {
                $('.section8').find('.interactBox').show().animateCss("flipInY");
                $('.section8').find('h3').show().animateCss("fadeInRight");
                //$.fn.fullpage.setAllowScrolling(true);
            }
            if (index == 9) {
                $('.section9').find('.buywayBox').show().animateCss("zoomIn");
                $('.section9').find('h3').show().animateCss("lightSpeedIn");
                //$.fn.fullpage.setAllowScrolling(false);
                /*$(".box").scroll(function(){
                    var s = $(".box").scrollTop();
                    console.log($(".box").height()-$(".buyway").height());
                    if(s == 0 || s >= $(".box").height()-$(".buyway").height()){
                        $.fn.fullpage.setAllowScrolling(true);
                    }else{
                        $.fn.fullpage.setAllowScrolling(false);
                    }
                })*/

            }
        },
        onLeave: function (index, direction) {
            if (index == 2) {
                $('.section2').find('.basicDataBox').animateCss("bounceOut");
            }
            if (index == 3) {
                $('.section3').find('.customerValueBox').animateCss("flipOutX");
            }
            if (index == 4) {
                $('.section4').find('.buyChannelBox').animateCss("fadeOut");
            }
            if (index == 5) {
                $('.section5').find('.vitalityBox').animateCss("fadeOut");
            }
            if (index == 6) {
                $('.section6').find('.recommendBox').animateCss("zoomOut");
            }
            if (index == 7) {
                $('.section7').find('.spreadBox').animateCss("zoomOut");
            }
            if (index == 8) {
                $('.section8').find('.interactBox').animateCss("flipOutY");
            }
            if (index == 9) {
                $('.section9').find('.buywayBox').animateCss("zoomOut");
                //$.fn.fullpage.setAllowScrolling(true);
            }
        }
    });
    $(".box").slimScroll({
        height: '11.5rem'
    });
});

















