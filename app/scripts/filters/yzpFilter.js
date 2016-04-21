/*
 * Filters
 */
'use strict';
var filtersModule = angular.module('app.filters', []);

filtersModule
    .filter('tripTargetFilter', function() {
        return function(targets) {
            var targetStr = String(targets);
            return targetStr.split(",").join("-");
        };
    }).filter('tripTravelFilter', function() {
        return function(detail) {
            if (detail.length > 0) {
                for (var i = 0; i < detail.length; i++) {
                    if (detail[i].type == 'time') {
                        detail[i].extras.date = Math.floor(detail[i].extras.date)
                    } else if (detail[i].type == 'word') {
                        var data = JSON.stringify(detail[i].data).split('\\n').join('\<br\>').split('\\').join("");
                        detail[i].data = data.slice(1, data.length - 1);
                    }

                }
            }
            return detail;
        };
    }).filter('tripProductDescFilter', function() {
        return function(detail) {
            if (detail.length > 0) {
                for (var i = 0; i < detail.length; i++) {
                    var data = JSON.stringify(detail[i].desc).split('\\n').join('\<br\>').split('\\').join("");
                    detail[i].desc = data.slice(1, data.length - 1);
                }
            }
            return detail;
        };
    }).filter('sponsorsFilter', function() {
        return function(sponsors) {
            var newSponsors = [];
            for (var i = 0, count = sponsors.length; i < count; i++) {
                var sponsorWrapObj = {};
                sponsorWrapObj.value = sponsors[i];
                sponsorWrapObj.isChecked = false;
                newSponsors.push(sponsorWrapObj);
            }
            return newSponsors;
        };
    }).filter('travelJsonToHtmlFilter', function() {
        function convertTimeFormatter(time) {
            var tmp_time = new Date(parseInt(time) * 1000).toLocaleString().split(",")[1].trim();
            var tmp_time_divideds = tmp_time.split(":");
            var tmp_time_finilly = "";
            var tmp_time_divideds_last = tmp_time_divideds[2].split(" ")[1].trim();

            if (tmp_time_divideds_last == "AM") {
                var tmp_hour_am = parseInt(tmp_time_divideds[0]);
                var tmp_min_am = parseInt(tmp_time_divideds[1]);
                if (tmp_hour_am < 10) {
                    tmp_time_finilly += ("0" + tmp_hour_am + ":");
                } else {
                    tmp_time_finilly += (tmp_hour_am + ":");
                }
                if (tmp_min_am < 10) {
                    tmp_time_finilly += ("0" + tmp_min_am)
                } else {
                    tmp_time_finilly += tmp_min_am;
                }
            } else if (tmp_time_divideds_last == "PM") {
                var tmp_hour_pm = parseInt(tmp_time_divideds[0]);
                var tmp_min_pm = parseInt(tmp_time_divideds[1]);
                if (tmp_hour_pm < 10) {
                    tmp_time_finilly += ((tmp_hour_pm + 12) + ":");
                } else {
                    tmp_time_finilly += (tmp_hour_pm + ":");
                }
                if (tmp_min_pm < 10) {
                    tmp_time_finilly += ("0" + tmp_min_pm)
                } else {
                    tmp_time_finilly += tmp_min_pm;
                }
            }
            return tmp_time_finilly;
        }

        function convertDateFormatter(date) {
            var date_divideds = new Date(parseInt(date) * 1000).toLocaleString().split(",")[0].trim().split("/");
            var date_finilly = "";
            var tmp_date_month = parseInt(date_divideds[0]);
            var tmp_date_day = parseInt(date_divideds[1]);
            if (tmp_date_month < 10) {
                date_finilly += date_divideds[2] + "-0" + tmp_date_month;
            } else {
                date_finilly += date_divideds[2] + "-" + tmp_date_month;
            }
            if (tmp_date_day < 10) {
                date_finilly += ("-0" + tmp_date_day);
            } else {
                date_finilly += ("-" + tmp_date_day);
            }
            return date_finilly;
        }

        return function(data) {
            var travels = JSON.parse('{"travels":' + data + "}").travels;
            var travelsText = "";
            for (var i = 0; i < travels.length; i++) {
                switch (travels[i].type) {
                    case 'word':
                        if (travels[i].data) {
                            $("#travel_content").append($("<div></div>").append($('<textarea data-type="word" rows="10" style="resize: none;" class="tripDatas  form-control" placeholder="请输入文本信息"></textarea>').text(travels[i].data)).append($('<a class="glyphicon glyphicon-remove-circle target-remove delete"></a>')));
                        }
                        break;
                    case 'image':
                        $("#travel_content").append($("<div></div>").append($('<img data-type="image" w=' + travels[i].extras.w + " h=" + travels[i].extras.h + ' class="tripDatas  img-rounded" width=100%' + ' src="' + travels[i].data + '"/>')).append($('<a class="glyphicon glyphicon-remove-circle target-remove delete"></a>')));
                        break;
                    case 'time':
                        var extras = travels[i].extras;
                        var $dateWrap = $("<div class='tripDatas form-inline' data-type='date'></div>");
                        if (extras.hasOwnProperty('date')) {
                            var date_result = convertDateFormatter(extras.date);
                            $dateWrap.append($('<input type="text" class="form-control date" />').val(date_result));
                        }
                        if (extras.hasOwnProperty('start_time')) {
                            var start_time_result = convertTimeFormatter(extras.start_time);
                            $dateWrap.append($('<input type="text" class="time start form-control" />').val(start_time_result));
                        }
                        if (extras.hasOwnProperty('end_time')) {
                            var end_time_result = convertTimeFormatter(extras.end_time);
                            $dateWrap.append($('<input type="text" class="time start form-control" />').val(end_time_result));
                        }
                        //将日期、开始时间、结束时间封装到一个div中
                        $("#travel_content").append($dateWrap.append($('<a class="glyphicon glyphicon-remove-circle target-remove delete"></a>')));
                        $.datetimepicker.setLocale('zh');
                        $('.date').datetimepicker({
                            timepicker: false,
                            format: 'Y-m-d'
                        });
                        $('.time').datetimepicker({
                            datepicker: false,
                            format: 'H:i'
                        });
                        break;
                    case 'locate':
                        $("#travel_content").append($('<div></div>').append($('<input data-type="locate" type="text" class="tripDatas form-control" placeholder="请输入地点信息">').val(travels[i].data)).append($('<a class="glyphicon glyphicon-remove-circle target-remove delete"></a>')));
                        break;
                }
                $('#travel_content .delete').bind('click', function() {
                    $(this).parent().remove();
                });
            }
            return travelsText;
        };
    }).filter('travelHtmlToJsonFilter', function() {
        function parseDate(data) {
            var extras = {};
            var date = $(data[0]).val();
            var start_time = $(data[1]).val();
            var end_time = $(data[2]).val();

            //转换日期和时间到时间戳
            extras.date = Math.round(new Date(date).getTime() / 1000);
            if (start_time) {
                extras.start_time = Math.round(new Date(date + " " + start_time).getTime() / 1000);
            }

            if (end_time) {
                extras.end_time = Math.round(new Date(date + " " + end_time).getTime() / 1000);
            }
            return extras;
        }

        return function(data) {
            var dataformated = [];
            for (var i = 0; i < data.length; i++) {
                switch ($(data[i]).attr("data-type")) {
                    case "word":
                        dataformated.push({
                            extras: {},
                            data: $(data[i]).val(),
                            type: 'word'
                        });
                        break;
                    case "image":
                        dataformated.push({
                            extras: { w: $(data[i]).attr("w"), h: $(data[i]).attr("h") },
                            data: $(data[i]).attr("src"),
                            type: 'image',
                        });

                        break;
                    case "locate":
                        dataformated.push({
                            extras: {},
                            data: $(data[i]).val(),
                            type: 'locate'
                        });
                        break;
                    case "date":
                        dataformated.push({
                            extras: parseDate($(data[i]).children()),
                            type: 'time',
                        });
                        break;
                }
            }
            console.log(dataformated);
            return JSON.stringify(dataformated);
        }
    });