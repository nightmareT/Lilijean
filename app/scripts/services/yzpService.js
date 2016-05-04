/*
 * Services
 */
'use strict';
var serviceModule = angular.module('app.services', []);

serviceModule
    .factory('loginModalSrv', ["$http", "baseURL", '$localStorage', "$rootScope", 'AUTH_EVENTS', function($http, baseURL, $localStorage, $rootScope, AUTH_EVENTS) {
        function login(credentials) {
            return $http
                .post(baseURL + 'login', credentials)
                .then(function(res) {
                   // console.log(res.data.code);
                   console.log(res.data);
                    if (res.data.code == 200) {
                         console.log("why");
                        $localStorage.$default({
                            TOKEN: res.data.token,
                            USER: res.data.user
                        });
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        console.log("you");
                    }
                });
        }

        function isAuthorized() {
            if (localStorage.getItem("YZP_TOKEN") && localStorage.getItem("YZP_USER")) {
                return true;
            } else {
                return false;
            }
        }
        return {
            login: login,
            isAuthorized: isAuthorized
        };
    }]).service('tripProductSupplyService', function() {
        return function(trip) {
            var info = {
                title: "",
                subtitle: "",
                image: ""
            };
            if (trip.custom_trip) {
                if (trip.travel) {
                    //私人定制
                    info.title = "以下套餐由" + trip.travel.user + "提供";
                    info.image = trip.travel.image_url;
                } else {
                    //自主定制
                    info.title = "以下套餐由发起人自主定制，由发起人负责购买";
                    info.image = "./images/icon_custom.png";
                };
            } else {
                info.title = "该行程暂无任何旅游套餐";
                info.image = "./images/icon_unwanted.png";
                info.subtitle = "如有产品需求，请自行购买";
            }
            return info;
        };
    }).service('numberService', function() {
        return {
            numbers: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        }
    }).service('tripSponsorService', ['$http', '$q', 'baseURL', '$filter', function($http, $q, baseURL, $filter) {
        return {
            getData: function() {
                return $q(function(resolve, reject) {
                    $http.get(baseURL + 'sponsors')
                        .success(function(data, status, headers, config) {
                            var sponsorsData = $filter('sponsorsFilter')(angular.copy(data.sponsors));
                            resolve(sponsorsData);
                        }).error(function(data, status, headers, config) {
                            reject("Error: 获取赞助商Service出错!");
                        });
                });
            }
        }
    }]).service('clearService', ['$localStorage', function($localStorage) {
        return {
            clearTempCache: function() {
                delete $localStorage.TITLE;
                delete $localStorage.TRIP;
                delete $localStorage.SPONSOR;
                delete $localStorage.IMAGE;
                delete $localStorage.BOUNDS;
            }
        }
    }]).service('tripTravelService', ['$localStorage', 'clearService', '$state', '$q', '$http', '$timeout', 'Upload', function($localStorage, clearService, $state, $q, $http, $timeout, Upload) {
        return {
            combinationData: function() {
                var data = {};
                data.detail = $localStorage.TRIP.detail;
                data.title = $localStorage.TITLE;
                data.start_time = $localStorage.TRIP.start_time;
                data.end_time = $localStorage.TRIP.end_time;
                data.trip_target = $localStorage.TRIP.trip_target;
                data.private_users = $localStorage.TRIP.private_users;
                data.sponsor_ids = [];
                console.log($localStorage.TRIP.new_group);
                if(typeof($localStorage.TRIP.new_group)=="string"){
                    data.new_group=$localStorage.TRIP.new_group;
                    console.log("neko");

                }
                //标识套餐类型，私人定制不允许修改
                if (!$localStorage.TRIP.private) {
                    data.custom_trip = $localStorage.TRIP.custom_trip;
                    data.travel_id = $localStorage.TRIP.travel_id;
                }
                data.group_id = $localStorage.TRIP.group_id;
                data._id = $localStorage.TRIP.group_id;
                var sponsors = $localStorage.SPONSOR;
                for (var i = 0; i < sponsors.length; i++) {
                    if (sponsors[i].isChecked) {
                        data.sponsor_ids.push(sponsors[i].value._id);
                    }
                }
                return data;
            },
            validateCroppedImage: function() {
                if (!$localStorage.IMAGE.croppedImage) {
                    alert('亲，没有选择封面图哦!');
                    return;
                }
            },
            validateProductModel: function() {
                if ($localStorage.TRIP.custom_trip && $localStorage.TRIP.travel) {
                    alert('私人定制产品不能修改产品模式');
                    return;
                }
            },
            uploadData: function(obj) {
                //1.先更新数据
                var promise = $q(function(resolve, reject) {
                    $http({
                        method: obj.method,
                        url: obj.url,
                        data: obj.data
                    }).then(function(res) {
                        console.log(res.data);
                        resolve();
                    });
                });

                //2.随后更新封面
                promise.then(function() {
                    if (obj.file) {
                        Upload.upload({
                            method: obj.method,
                            url: obj.url,
                            data: { image: obj.file }
                        }).then(function(res) {
                            if (res.data.code == 200) {
                                clearService.clearTempCache();
                                $localStorage.STATUS = "NO";
                                $('body').loading('stop');
                                $state.transitionTo('app.dashboard.groupList', null, { 'reload': true });
                            }
                        });
                    } else {
                        clearService.clearTempCache();
                        $localStorage.STATUS = "NO";
                        $('body').loading('stop');
                        $state.transitionTo('app.dashboard.groupList', null, { 'reload': true });
                    }
                });
            }
        }
    }]).service('d2bService', function() {
        return {
            convert: function(u) {
                var p = u.split(/[:;,]/),
                    t = p[1],
                    dec = p[2] == "base64" ? atob : decodeURIComponent,
                    bin = dec(p.pop()),
                    mx = bin.length,
                    i = 0,
                    uia = new Uint8Array(mx);

                for (i; i < mx; ++i) uia[i] = bin.charCodeAt(i);

                return new Blob([uia], { type: t });
            }
        }
    })