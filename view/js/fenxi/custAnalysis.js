$(function(){
    $(".analyli").find("ul").show();
    $(".menuNormal").find("a").removeClass("active");
    $(".analyli").find("span").attr("class","icon icon-jiantou");
    $(".analyli").find("ul #index_custGroupanalysis").find("a").addClass("active");
});
var tag_arr = '', tag_arrn;
$(function () {
    var hor_list, row_list, row_arr;
    //var tag_ap = $("input[name='tags" + spec_id + "']").val();
    var tag_ap = $("input[name='tags6']").val();
    console.log(tag_ap);
    tag_ap = JSON.parse(tag_ap);
    for (i in tag_ap) {
        hor_list += "<option value='" + tag_ap[i].tag_column + "'>" + tag_ap[i].tagName + "</option>";
        row_list += "<option value='" + tag_ap[i].tag_column + "'>" + tag_ap[i].tagName + "</option>";

        tag_arr += '"' + tag_ap[i].tag_column + '":' + tag_ap[i].default_display + ',';
    }

    tag_arrn = tag_arr.length - 1;
    tag_arr = tag_arr.substring(0, tag_arrn);
    tag_arr = '{' + tag_arr + '}';
    tag_arr = JSON.parse(tag_arr);
    console.log(tag_arr);

    $("#hor_sel").append(hor_list);
    $("#row_sel").html(row_list).chosen();

    $("#row_sel").change(function () {
        row_arr = $(this).val();
        if ($.inArray($("#hor_sel").val(), row_arr) >= 0) {
            alert("纵坐标不能与横坐标重复，请重新选择横坐标值");
            $("#hor_sel").find("option[value='" + $("#hor_sel").val() + "']").attr("selected", false);
        }
    })

    $("#hor_sel").change(function () {
        if ($.inArray($(this).val(), row_arr) >= 0) {
            alert("横坐标不能与纵坐标重复，请重新选择横坐标值");
            $(this).find("option[value='" + $(this).val() + "']").attr("selected", false);
        }
    });

    $("#sele_chartPic").on('click', function () {
        if ($("#hor_sel").val() != "" && $("#row_sel").val() != null) {
            $(".logo_ptit").removeClass("hide");
            $("#chart_loadbox").show(10,function () {
            load_s("120");
            //判断是否是空值
            var stp_ss_tmp = $("#sel_txt_p").val();
            var stp_ss = null;
            if (stp_ss_tmp) {
                stp_ss = $("#sel_txt_p").val().split(",");
            }
            getDetail($("#hor_sel").val(), $("#row_sel").val(), stp_ss);
        });
            $("#chart_showbox").css({'left': '-9999px', 'width': $("#chart_mainbox").width() + 'px'});
            $("#loading_img").css({'background-position-y': '200px'});
            $("#loading_num").text('0');

        } else {
            alert("横坐标和纵坐标都不能为空,请选择!");
        }
    })
})

function load_s(load_num) {
    $("#loading_img").animate({'background-position-y': +(200 - load_num) + 'px'});
    $("#loading_num").text(load_num / 2);
    if (load_num == '200') {
        $("#chart_loadbox").fadeOut(1000, function () {
            $("#chart_showbox").css({'left': '0px', 'width': $("#chart_mainbox").width() + 'px'})
        });
    }
}

function data_select(data_s, data_type) {
    var da_js = "", d_js = "", dj_num;
    if (data_type == "2" || data_type == "3") {
        for (ai in data_s) {
            da_js += '{"name":"' + data_s[ai].key + '","y":' + data_s[ai].doc_count + '},';
        }
    } else {
        for (bi in data_s) {
            da_js += '{"name":"' + data_s[bi].key + '","data":[' + data_s[bi].doc_count + ']},'
        }
    }
    dj_num = da_js.length - 1;
    da_js = da_js.substring(0, dj_num);
    d_js = '[' + da_js + ']';
    d_js = JSON.parse(d_js);
    return d_js;
}

function chart_show(ii, data_, cha_box, cha_type) {
    console.log(cha_type);
    var child_dds;
    for (k in data_[ii][cha_box].buckets) {
        var child_d = data_[ii][cha_box].buckets;
        child_dds = data_select(child_d, cha_type);
    }
    if (cha_type == "2") {
        pie_pic($("#" + cha_box + ii), data_[ii].key, child_dds);
    } else if (cha_type == "1") {
        column_pic($("#" + cha_box + ii), data_[ii].key, child_dds);
    } else if (cha_type == "3") {
        line_pic($("#" + cha_box + ii), data_[ii].key, child_dds);
    }
}

function getDetail(row_d_p, line_d_p, sel_d_p) {
    var pic_tb_row = "";
    var pic_tb_litit = "";
    var param = buildSearchParam(row_d_p, line_d_p, sel_d_p);
    var url = "/apis/search/client/geekerSearch.json";
    post(url, param, function (res) {
        $(".swiper-container").html('<div class="swiper-wrapper" id="pic_tabbox"><div>')
        if (res.data != null) {
            var data_ = res.data.aggregations[row_d_p].buckets;
            for (i in data_) {
                var pic_tb_line = "";
                for (j in data_[i]) {
                    if (j != "key" && j != "doc_count" && j != "from" && j != "from_as_string" && j != "to" && j != "to_as_string") {
                        pic_tb_line += '<div class="cpcb_tablist"><div id="' + j + i + '" class="cpcb_tablichart box_s"></div></div>';
                    }
                }
                pic_tb_row = '<div class="swiper-slide cha_page_chb_child"><div class="cpcb_tabtop">' + data_[i].key + '<div class="violet">客户ID总数：' + data_[i].doc_count + '</div></div>' + pic_tb_line + '</div>';
                $("#pic_tabbox").append(pic_tb_row);
                for (j2 in data_[i]) {
                    if (j2 != "key" && j2 != "doc_count") {
                        chart_show(i, data_, j2, tag_arr[j2]);
                    }
                }
            }
            var mySwiper = new Swiper('.swiper-container', {
                slidesPerView: 2,
                grabCursor: true,
                resistanceRatio: 0,
                mousewheelControl: true,
                onInit: function (swiper) {
                    load_s('200');
                }
            });
            $("#chart_prevbtn").on("click", function () {
                mySwiper.slidePrev();
            })
            $("#chart_nextbtn").on("click", function () {
                mySwiper.slideNext();
            })
            mySwiper.slideTo(0, 1000, false);
        } else {
            alert("数据加载错误！");
            $("#chart_loadbox").fadeOut();
        }
        var cpbl_arr = [];
        var cpb_n = 0;
        for (j3 in data_[i]) {
            if (j3 != "key" && j3 != "doc_count" && j3 != "from" && j3 != "from_as_string" && j3 != "to" && j3 != "to_as_string") {
                cpbl_arr[cpb_n++] = j3;
            }
        }
        get_datat(cpbl_arr);
    });
}

function get_datat(data_tt) {
    var param = "";
    var url ="/apis/user/geekerTagsCnNameMapping.json";
    var get_dtts = "";
    post(url, param, function (res) {
        for (cpb_da_i in data_tt) {
            get_dtts += '<li class="cpcbl_list pr"><div class="cpcbl_tpoint pa box_center">' + res.data[data_tt[cpb_da_i]] + '</div><div class="cpcbl_tline"></div></li>';
        }
        $("#pic_tabtit").html('<li class="cpcbl_top pr"><div class="cpcbl_tpoint pa box_center"></div><div class="cpcbl_tline"></div></li>' + get_dtts);
    });
}

function buildSearchParam(row_d, line_d, sel_d) {
    var aggFParam = '', aggFP_len, aggquery = '', aggque_len;
    for (li_i in line_d) {
        aggFParam += '{"fieldName":"' + line_d[li_i] + '","aggType":0},';
    }
    var childParam = null;

    console.log(sel_d);
    if (sel_d != null && sel_d.length != 0) {
        childParam = {
            "boolType": 0,
            "searchType": 17,
            "childQueryParam": []
        }
        var aggQuery = [];
        for (li_que in sel_d) {
            aggQuery.push({
                "value": sel_d[li_que],
                "searchType": 0,
                "boolType": 2,
                "fieldName": row_d
            });
        }
        childParam.childQueryParam = aggQuery;
    }
    //是否去重
    var param1 = {
        "boolType": 1,
        "fieldName": "tag_is_distinct_flg",
        "searchType": 0,
        "value": 1,
        "fieldCnName": "是否去重"
    };
    aggFP_len = aggFParam.length - 1;
    aggFParam = aggFParam.substring(0, aggFP_len);
    var parentParam = '{"parentAgg":{"fieldName":"' + row_d + '","aggType":0},"aggField":[' + aggFParam + '],"queryParam":[]}';
    parentParam = JSON.parse(parentParam);
    if (childParam) {
        parentParam.queryParam.push(childParam);
    }
    parentParam.queryParam.push(param1);
    return parentParam;

}

function post(url, data, callback) {
    data = JSON.stringify(data);
    var settings = {
        type: 'POST',
        url: url,
        data: data,
        async: true,
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function () {
            return true;
        },
        success: function (res) {
            callback(res);
        },
        error: function (result) {
            alert("Ajax请求出错");
        },
        complete: function () {
        }
    };
    $.ajax(settings);
}

function pie_pic(data_box, name_, data_json) {
    console.log(data_json);
    var chart = {
        //plotBackgroundColor: null,
        //plotBorderWidth: null,
        //plotShadow: false,
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    };
    var title = {
        text: ""
    };
    var tooltip = {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    };
    var plotOptions = {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 30,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y} ',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    };
    var series = [{
        type: 'pie',
        name: name_,
        data: data_json
    }];
    var credits = [{
        text: '',
        href: ''
    }];
    var json = {};
    json.chart = chart;
    json.title = title;
    json.tooltip = tooltip;
    json.series = series;
    json.plotOptions = plotOptions;
    json.credits = credits;
    data_box.highcharts(json);
}

function column_pic(data_box, name_, data_json) {
    console.log(data_json);
    var chart = {
        type: 'column',
        options3d: {
            enabled: true,     //显示图表是否设置为3D， 我们将其设置为 true
            alpha: 15,         //图表视图旋转角度
            beta: 10,          //图表视图旋转角度
            depth: 100,         //图表的合计深度，默认为100
            viewDistance: 25   //定义图表的浏览长度
        }
    };
    var title = {
        text: ""
    };
    var subtitle = {
        text: ''
    };
    var xAxis = {
        categories: [name_],
        crosshair: true
    };
    var yAxis = {
        min: 0,
        title: {
            text: ''
        }
    };
    var tooltip = {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    };
    var plotOptions = {
        column: {
            depth: 50,
            dataLabels: {
                enabled: true,
                color: '#e3e3e3',
                formatter: function () {
                    return "" + (this.y);
                }
            }
        }
    }
    var credits = {
        enabled: false
    };
    var series = data_json;
    var json = {};
    json.chart = chart;
    json.title = title;
    json.subtitle = subtitle;
    json.tooltip = tooltip;
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.series = series;
    json.plotOptions = plotOptions;
    json.credits = credits;
    data_box.highcharts(json);
}

function line_pic(data_box, name_, data_json) {
    console.log(data_json);
    var chart = {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
    };
    var title = {
        text: ""
    };
    var tooltip = {
        pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
    };
    var series = [{
        name: name_,
        data: data_json
    }];
    var credits = [{
        text: '',
        href: ''
    }];
    var xAxis = {
        categories: [],
        crosshair: true
    };
    var yAxis = {
        title: {
            text: ''
        }
    };
    var json = {};
    json.chart = chart;
    json.title = title;
    json.tooltip = tooltip;
    json.series = series;
    json.credits = credits;
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    data_box.highcharts(json);
}


function exportHighcharts(){
    //循环拿到各个绘图区域id
    $("#svgPDF").empty();
    $.each($(".cpcb_tablichart"),function(index,ele){
        //根据每个绘图区域的id获取svg等属性
        var svg = $(this).highcharts();
        if(typeof(svg)=='undefined'||svg==null){
            svg = 'noData';
        }else{
            svg = svg.getSVG();
        }
        //alert(svg);
        $("#svgPDF").append("<input id='SVG"+$(this).attr("id")+"' name='svg' type='hidden' value='' />");
        $("#SVG"+$(this).attr("id")).val(svg);

    });
    var title = encodeURI("用户画像分析报告");
    $("#svgPDF").append("<input name='logoT' type='hidden' value='"+title+"' />");

    $("#svgPDF").submit();
}




