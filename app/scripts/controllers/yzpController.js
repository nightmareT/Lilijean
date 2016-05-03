/*
 * Dashboard controller
 */
var controllerModule = angular.module('app.controller', []);

controllerModule
    .controller('navCtrl', ['$scope', '$state', 'AUTH_EVENTS', '$localStorage', function($scope, $state, AUTH_EVENTS, $localStorage) {
        $scope.$on(AUTH_EVENTS.loginSuccess, function(event) {
            $scope.user = $localStorage.USER;
           // console.log($scope.user);
          //  console.log($localStorage.TRIP);
            $scope.isLogined = true;
        });
        $scope.$on(AUTH_EVENTS.logoutSuccess, function(event) {
            $scope.isLogined = false;
        });

        $scope.redirectToTripEdit = function() {
            $state.transitionTo('app.dashboard', null, { 'reload': true });
        }

    }]).controller('LoginModalCtrl', ['$scope', '$state', 'loginModalSrv', function($scope, $state, loginModalSrv) {
        $scope.login = function(user) {
            loginModalSrv.login(user);
            $('#loginModal').modal('hide');
        }
    }]).controller('MainCtrl', ['$scope', 'baseURL', '$http', function($scope, baseURL, $http) {

    }]).controller('DashboardCtrl', ['$scope', '$state', 'baseURL', '$http', '$filter', '$localStorage', 'tripProductSupplyService', 'tripSponsorService', '$q', 'numberService', function($scope, $state, baseURL, $http, $filter, $localStorage, tripProductSupplyService, tripSponsorService, $q, numberService) {
        $scope.meals = numberService.numbers;
      // console.log($scope.$storage.TRIP);
        // var noya= function(){
        //     var defer=$q.defer();        //a small test about how to use $q in angular 
        //     if(1){
        //         defer.resolve()
        //     }
        //     else{
        //         defer.reject()
        //     }
        //     return defer.promise
        // }
        // var promise=noya();
        // promise.then(function(){console.log("x")},function(){console.log("z")});
        $(document).ready(function($){
    $("button").hover(function(){$(".shadow").css("display","block");console.log("1")},
    function(){$(".shadow").css("display","none");console.log("0")});
 
}(jQuery));


    
        $scope.admin={};
        $scope.createNewTeam=function(){
            $localStorage.TITLE="";
            group_id=$scope.groups[0]._id;
             $localStorage.TRIP = {
                    title: "",
                    trip_target: [],
                    start_time: Math.round(Date.now() / 1000) + 86400,
                    end_time: Math.round(Date.now() / 1000) + 86400,
                    detail: "[]",
                    set_meals: [],
                    custom_trip: false,
                    group_id: group_id,
                    private_users: 0,
                    latitude: 0,
                    longitude: 0,
                    sponsor_ids: [],
                    travel_id: "",
                    _id: group_id,
                    iscreateStatus: false
                   
                   
                };
            $state.go('app.dashboard.targetEdit')

        }
        $scope.createNewGroup=function(){
            var noya=function(){
              var defer=$q.defer();
            
            $http.get(baseURL + "groups/new").then(function(res) {
             if(res.data.group){
             group_id = res.data.group;
             defer.resolve(group_id)
            }
            else{
                defer.reject()
            }
           

            });
             return defer.promise
        }
        var promise=noya();

        promise.then(function(group_id){
            console.log(group_id);
            $localStorage.TITLE="";
             $localStorage.TRIP = {
                    title: "",
                    trip_target: [],
                    start_time: Math.round(Date.now() / 1000) + 86400,
                    end_time: Math.round(Date.now() / 1000) + 86400,
                    detail: "[]",
                    set_meals: [],
                    custom_trip: false,
                    group_id: group_id,
                    private_users: 0,
                    latitude: 0,
                    longitude: 0,
                    sponsor_ids: [],
                    travel_id: "",
                    _id: group_id,
                    iscreateStatus: true,
                    new_group:"atalasii"
                   
                }
            $state.go('app.dashboard.targetEdit')
        },function(){

        });
        //  $http.get(baseURL + "groups/new").then(function(res) {
            
        //       group_id = res.data.group;
        //       return group_id

        // });
        // console.log(group_id);
        }               
        
                $scope.saveData = function(group_id) {
            var promiseCreateTrip = tripSponsorService.getData();
            promiseCreateTrip.then(function(data) {
                $localStorage.SPONSOR = data
                $localStorage.TRIP = {
                    title: "",
                    trip_target: [],
                    start_time: Math.round(Date.now() / 1000) + 86400,
                    end_time: Math.round(Date.now() / 1000) + 86400,
                    detail: "[]",
                    set_meals: [],
                    custom_trip: false,
                    group_id: group_id,
                    private_users: 0,
                    latitude: 0,
                    longitude: 0,
                    sponsor_ids: [],
                    travel_id: "",
                    _id: group_id,
                    iscreateStatus: true
                }
            });
        };
        $scope.initSponsors = function() {
            //当本地存储中不存在sponsor时获取
            if (!$localStorage.SPONSOR) {
                //2.依赖基本信息
                var promiss = tripSponsorService.getData();
                promiss.then(
                    function(data) {
                        var sponsors = $localStorage.TRIP.sponsors;
                        for (var i = 0; i < sponsors.length; i++) {
                            for (var j = 0; j < data.length; j++) {
                                if (sponsors[i]._id == data[j].value._id) {
                                    data[j].isChecked = true;
                                }
                            }
                        }
                        $localStorage.SPONSOR = data;
                    },
                    function(error) {
                        console.log(error);
                    });
            }
        }
        // var noya=function(){
        //     var jungle=$q(function(resolve,reject){
        //         if(1){
        //             reject()
        //         }
        //         else{
        //             resolve()
        //         }
        //     });
        //     jungle.then(function(){console.log("x")},function(){console.log("p")})
        // }
        // noya();
        $scope.initData = function() {
            //1.获取基本信息
            // if ($localStorage.TRIP) {
            //     console.log("exit");
            //     $scope.trip = angular.copy($localStorage.TRIP);
            //     console.log($scope.trip.detail);

            //    // $scope.trip.detail = $filter('tripTravelFilter')(JSON.parse($scope.trip.detail));
            //    // console.log($scope.trip.detail);
            //     $scope.trip.set_meals = $filter('tripProductDescFilter')($scope.trip.set_meals);
            //     $scope.productSupply = tripProductSupplyService($scope.trip);
            //     $scope.initSponsors();
            // } else {
                var promiseOwnerGroups = $q(function(resolve, reject) {
                    $http.get(baseURL + 'users/owner_groups')
                        .then(function(res) {
                            if (res.data.code == 200) {
                                //没有群
                                if (res.data.groups.length == 0) {
                                    reject();
                                    return;
                                }
                                //true: 有群无队 Create, false: 有群有队 Edit
                                if (res.data.groups[0].status == "cancel") {
                                  //  console.log(res.data);
                                    reject(res.data.groups[0]._id);
                                } else {
                                    resolve(res);
                                }
                            }
                        });
                });
                promiseOwnerGroups.then(
                    function(res) {
                        $scope.groups=res.data.groups;
                        $scope.trip = res.data.groups[0].trip_info;
                        console.log(res.data.groups);
                        $scope.trip.detail = $filter('tripTravelFilter')(JSON.parse($scope.trip.detail));
                        $scope.trip.set_meals = $filter('tripProductDescFilter')($scope.trip.set_meals);
                        $scope.productSupply = tripProductSupplyService($scope.trip);
                        //存储TRIP
                        var copyTrip = angular.copy($scope.trip);
                        copyTrip.detail = JSON.stringify(copyTrip.detail);
                        $localStorage.TRIP = copyTrip;
                        console.log($scope.groups[0].status);

                        //初始化赞助商
                        $scope.initSponsors();
                    },
                    function(group_id) {
                        var promiseCreateGroup = $q(function(resolve, reject) {
                            if (!group_id) {
                                $http.get(baseURL + "groups/new").then(function(res) {
                                    group_id = res.data.group;
                                    resolve(group_id);
                                });
                            } else {
                                reject(group_id);
                            }
                        });
                        promiseCreateGroup.then(
                            function(group_id) {
                                $scope.saveData(group_id);
                            },
                            function(group_id) {
                                $scope.saveData(group_id);
                            });
                    });
            
        };
        $scope.initStatus = function() {
                $scope.initData();
                // if ($localStorage.STATUS && $localStorage.STATUS == 'YES') {
                //     toastr.warning('亲，编辑可能还没提交哦!');
                // }
            }
            //初始化状态
        $scope.initStatus();
        // console.log($localStorage.TRIP);
        // console.log($scope.$storage.TRIP.iscreateStatus);
         //console.log($scope.$storage.TRIP.status);
        // $scope.listNum=[
        // {left:10px},
        // {left:40px},
        // {left:70px}
        // ];


        $scope.tripEdit = function() {
            $localStorage.STATUS = "YES";
            $state.go('app.dashboard.targetEdit');
        }
    }]).controller('TripEditMain', ['$scope', '$state', 'baseURL', '$http', '$localStorage', function($scope, $state, baseURL, $http, $localStorage) {

    }]).controller('TripTargetEditCtrl', ['$scope', '$state', 'baseURL', '$http', '$localStorage', 'numberService', function($scope, $state, baseURL, $http, $localStorage, numberService) {
        if($localStorage.TRIP.trip_target){
        $scope.trip_target = $localStorage.TRIP.trip_target
    }
        $("#cityTab").hide();
         $scope.admin.first="you";
         console.log($scope.admin.second);


        $scope.targetNo = numberService.numbers;
        $scope.nextDateEdit = function() {
            $localStorage.TRIP.trip_target = $scope.trip_target;
            $state.go('app.dashboard.dateEdit');
        };

        $scope.delTargetByIndex = function(index) {
                $scope.trip_target.splice(index, 1);
            }
            // 默认国内
        $scope.isSelected = true;
        $scope.selectedType = "baidu"
        $scope.show = function(self, type) {
            $scope.selectedType = type;
            if ($scope.isSelected) {
                $scope.isSelected = false;
            } else {
                $scope.isSelected = true;
            }
        }

        $scope.selectCity = function(self, city) {
            $scope.trip_target.push(city.address);
            console.log("mdzz");
            $("#cityTab").hide();
        }

        $scope.searchByKey = function(key) {
            if (!key) {
                alert('请输入你的目的地');
                return;
            }
            $http({
                method: 'POST',
                url: baseURL + 'search_city',
                data: {
                    city: key,
                    type: $scope.selectedType
                }
            }).then(function successCallback(res) {
                $scope.citys = res.data.cities;
            }, function errorCallback(err) {});
            $("#cityTab").show();
        }
    }]).controller('TripDateEditCtrl', ['$scope', '$state', 'baseURL', '$http', '$localStorage', function($scope, $state, baseURL, $http, $localStorage) {
        $scope.admin.second="are";
        $scope.dateRangeStart = new Date($localStorage.TRIP.start_time * 1000);
        $scope.dateRangeEnd = new Date($localStorage.TRIP.end_time * 1000);
        var okToNext;
        $scope.tripDateStorageUpdate = function(startDate, endDate) {
                okToNext=true;
            if (!startDate) {
                alert("没有选择开始日期");
                return;
            } else if (!endDate) {
                alert("没有选择结束日期");
                return;
            } else {
                if(startDate>endDate){
                    alert("开始日期不能大于截止日期");
                    okToNext=false

                }
                $localStorage.TRIP.start_time = startDate / 1000;
                $localStorage.TRIP.end_time = endDate / 1000;
            }
        }

        $scope.preTargetEdit = function() {
            $scope.tripDateStorageUpdate($scope.dateRangeStart, $scope.dateRangeEnd);
            $state.go('app.dashboard.targetEdit');
        };
        $scope.nextTripTitleEdit = function() {
            $scope.tripDateStorageUpdate($scope.dateRangeStart, $scope.dateRangeEnd);
            if(okToNext==true){
            $state.go('app.dashboard.titleEdit')
            }

        };

        function _renderDateCallback($view, $dates, $leftDate, $upDate, $rightDate) {
            var activeDate = moment($scope.dateRangeStart);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() <= activeDate.valueOf()) $dates[i].selectable = false;
            }
        }

        $scope.beforeRenderStartDate = _renderDateCallback;
        $scope.beforeRenderEndDate = _renderDateCallback;

    }]).controller('TripTitleEditCtrl', ['$rootScope', '$scope', '$state', 'baseURL', '$http', '$localStorage', function($rootScope, $scope, $state, baseURL, $http, $localStorage) {
        $scope.image_url = $localStorage.TRIP.image_url;

        if ($localStorage.TITLE) {
            $scope.title = $localStorage.TITLE
        } else {
            $scope.title = $localStorage.TRIP.title || "";
        }

        if ($localStorage.IMAGE && $localStorage.BOUNDS) {
            $scope.bounds = $localStorage.BOUNDS;
            $scope.cropper = $localStorage.IMAGE;
        } else {
            $scope.cropper = {};
            $scope.cropper.sourceImage = null;
            $scope.cropper.croppedImage = null;

            $scope.bounds = {};
            $scope.bounds.left = 0;
            $scope.bounds.right = 0;
            $scope.bounds.top = 0;
            $scope.bounds.bottom = 0;
        }

        $scope.tripTitleStorageUpdate = function(title, image, bounds) {
            $localStorage.TITLE = title;
            $localStorage.BOUNDS = bounds;
            $localStorage.IMAGE = image;
        };

        $scope.preDateEdit = function() {
            $scope.tripTitleStorageUpdate($scope.title, $scope.cropper, $scope.bounds);
            $state.go('app.dashboard.dateEdit');
        };
        $scope.nextSponsorEdit = function() {
            $scope.tripTitleStorageUpdate($scope.title, $scope.cropper, $scope.bounds);
            $state.go('app.dashboard.sponsorEdit');
        };

    }]).controller('TripSponsorEditCtrl', ['$scope', '$state', 'baseURL', '$http', '$localStorage', function($scope, $state, baseURL, $http, $localStorage) {
        if($localStorage.SPONSOR){
        $scope.sponsors = $localStorage.SPONSOR
        }
        if($localStorage.TRIP.private_users){
        $scope.private_users = $localStorage.TRIP.private_users
         }   

        function _checkSponsorsNumber(sponsors) {
            var max_sponsor = 0;
            for (var i = 0; i < sponsors.length; i++) {
                if (sponsors[i].isChecked) {
                    max_sponsor++;
                };
            }
            return max_sponsor;
        }

        $scope.preTripTitleEdit = function() {
            if ($scope.private_users > 30) {
                alert("出行人数不能超过30人哦!");
                return;
            }

            if (_checkSponsorsNumber($scope.sponsors) > 5) {
                alert("赞助商不能超过5个哦!");
                return;
            }

            $localStorage.SPONSOR = $scope.sponsors;
            $localStorage.TRIP.private_users = $scope.private_users;
            $state.go('app.dashboard.titleEdit');
        };
        $scope.nextTravelEdit = function() {
            if ($scope.private_users > 30) {
                alert("出行人数不能超过30人哦!");
                return;
            }
            if (_checkSponsorsNumber($scope.sponsors) > 5) {
                alert("赞助商不能超过5个哦!");
                return;
            }

            $localStorage.SPONSOR = $scope.sponsors;
            $localStorage.TRIP.private_users = $scope.private_users;

            $state.go('app.dashboard.travelEdit');
        };

    }]).controller('tripTravelCtrl', ['$scope', '$state', 'Upload', 'baseURL', '$filter', '$localStorage', function($scope, $state, Upload, baseURL, $filter, $localStorage) {
        $filter('travelJsonToHtmlFilter')($localStorage.TRIP.detail);
        //console.log(travelsText);
        $scope.onFileSelect = function($files) {
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                Upload.upload({
                    method: "POST",
                    url: baseURL + "kindeditor",
                    data: {
                        upload: $file,
                    }
                }).then(function(resp) {
                    var imageUrl = resp.data.kind.image.url;
                    if (resp.data.code == 200 && imageUrl) {
                        var img = new Image();
                        img.src = imageUrl;
                        img.onload = function() {
                            var imgDiv = "<div>" + '<img width="100%" data-type="image" class="tripDatas img-rounded" w=' + img.width + ' h= ' + img.height + ' src="' + imageUrl + '"/>' + '<a class="glyphicon glyphicon-remove-circle target-remove delete"></a>' + "</div>"
                            $('#travel_content').append(imgDiv);
                            $('#travel_content .delete').bind('click', function() {
                                $(this).parent().remove();
                            });
                        }
                    }
                });
            }
        }
        $scope.travelEdit = {
            insertTextToContent: function() {
                var textDiv = '<div>' + '<textarea rows="5" data-type="word" style="resize: none;" class="tripDatas  form-control"></textarea>' + '<a class="glyphicon glyphicon-remove-circle target-remove delete"></a>' + '</div>';
                $('#travel_content').append(textDiv);
                $('#travel_content .delete').bind('click', function() {
                    $(this).parent().remove();
                });
            },
            insertDateToContent: function() {
                var dateDiv = "<div class='tripDatas form-inline' data-type='date'>" + '<input ng-model="" type="text" class="date form-control"><input type="text" class="time start form-control" />' + "-" + '<input type="text" class="time end form-control" />' + '<a class="glyphicon glyphicon-remove-circle target-remove delete"></a>' + "</div>"
                $('#travel_content').append(dateDiv);
                $.datetimepicker.setLocale('zh');
                $('.date').datetimepicker({
                    timepicker: false,
                    format: 'Y-m-d'
                });

                $('.time').datetimepicker({
                    datepicker: false,
                    format: 'H:i'
                });
                $('#travel_content .delete').bind('click', function() {
                    $(this).parent().remove();
                });

            },
            insertPlaceToContent: function() {
                var locateDiv = '<div>' + '<input data-type="locate" type="text" class="tripDatas form-control">' + '<a class="glyphicon glyphicon-remove-circle target-remove delete"></a>' + '</div>';
                $('#travel_content').append(locateDiv);
                $('#travel_content .delete').bind('click', function() {
                    $(this).parent().remove();
                });
            }
        }

        $scope.preSponsorEdit = function() {
            $localStorage.TRIP.detail = $filter('travelHtmlToJsonFilter')($(".tripDatas"));
            $state.go('app.dashboard.sponsorEdit');
        };
        $scope.nextProductEdit = function() {
            $localStorage.TRIP.detail = $filter('travelHtmlToJsonFilter')($(".tripDatas"));
            $state.go('app.dashboard.productEdit');
        }
    }]).controller('tripTravelProductCtrl', ['$scope', 'baseURL', 'tripTravelService', '$localStorage', '$state', '$http', 'clearService', 'd2bService', '$q', 'Upload', function($scope, baseURL, tripTravelService, $localStorage, $state, $http, clearService, d2bService, $q, Upload) {
        //Travel相关的工具方法

        
        var TravelProduct = {
            initSelected: function() {
                $localStorage.TRIP.private = false;
                if ($localStorage.TRIP.custom_trip) {
                    if ($localStorage.TRIP.travel) {
                        $scope.selectedStatus = {
                            noneed: false,
                            custom: false,
                            private: true
                        };
                        $localStorage.TRIP.private = true;
                    } else {
                        $scope.selectedStatus = {
                            noneed: false,
                            custom: true,
                            private: false
                        };
                    };
                } else {
                    $scope.selectedStatus = {
                        noneed: true,
                        custom: false,
                        private: false
                    };
                }
            }
        };

        TravelProduct.initSelected();


        $scope.nextCustomEdit = function() {
            $state.go('app.dashboard.customEdit');
        }
        $scope.preTravelEdit = function() {
            $state.go('app.dashboard.travelEdit');
        }

        //1.不需要 2.自主定制. 3.私人定制
        $scope.clickShow = function(self, type) {
            if ($localStorage.TRIP.private) {
                alert("私人定制的产品不能修改产品模式");
                return;
            }

            tripTravelService.validateProductModel();
            if (type == 2) {
                $scope.selectedStatus = {
                    noneed: false,
                    custom: true,
                    private: false
                };
                $localStorage.TRIP.custom_trip = true;
                $localStorage.TRIP.travel_id = "";
            } else if (type == 3) {
                $scope.selectedStatus = {
                    noneed: false,
                    custom: false,
                    private: true
                };
                $localStorage.TRIP.custom_trip = true;
                $localStorage.TRIP.travel_id = "567761a29d16fd646d00013f";

            } else {
                $scope.selectedStatus = {
                    noneed: true,
                    custom: false,
                    private: false
                };
                $localStorage.TRIP.custom_trip = false;
                $localStorage.TRIP.travel_id = "";
            }
        }

        $scope.tripUpdateCommited = function() {
            $('body').loading();
            var url = baseURL + "groups/" + $localStorage.TRIP.group_id + "/trips/" + $localStorage.TRIP.trip_id;
            var data = tripTravelService.combinationData();
            var croppedImg = null;
            if ($localStorage.IMAGE.croppedImage) {
                croppedImg = d2bService.convert($localStorage.IMAGE.croppedImage);
            }
            

            tripTravelService.uploadData({ file: croppedImg, data: data, url: url, method: "PUT" });
            console.log('alpha');

            
        }

        $scope.tripCreateCommited = function() {
            if (!($localStorage.TRIP.custom_trip && $localStorage.TRIP.travel_id == "")) {
                $('body').loading();
            }
            var data = tripTravelService.combinationData();
            data.latitude = $localStorage.TRIP.latitude || 0;
            data.longitude = $localStorage.TRIP.longitude || 0;
            console.log(data);
            $http({
                method: 'POST',
                url: baseURL + "groups",
                data: data
            }).then(function successCallback(res) {
                if (res.data.code == 200) {
                    var promiseUploadImg = $q(function(resolve) {
                        var trip = res.data.group.trip_info;
                        console.log(trip);
                        var url = baseURL + "groups/" + trip.group_id + "/trips/" + trip.trip_id;
                        var croppedImg = null;
                        if ($localStorage.IMAGE.croppedImage) {
                            croppedImg = d2bService.convert($localStorage.IMAGE.croppedImage);
                            Upload.upload({
                                method: "PUT",
                                url: url,
                                data: { image: croppedImg }
                            }).then(function(res) {
                                resolve();
                            });
                        }
                    });
                    promiseUploadImg.then(function() {
                        if (!($localStorage.TRIP.custom_trip && $localStorage.TRIP.travel_id == "")) {
                            clearService.clearTempCache();
                            $('body').loading('stop');
                            $localStorage.STATUS = "NO";
                            $state.transitionTo('app.dashboard', null, { 'reload': true });
                        }
                    });
                } else {
                    alert(res.data.msg);
                    $('body').loading('stop');
                    $state.go('app.dashboard');

                }
            }, function errorCallback(err) {});


        }
    }]).controller('tripCustomCtrl', ['$scope', 'baseURL', 'tripTravelService', '$localStorage', '$state', '$q', '$http', 'd2bService', function($scope, baseURL, tripTravelService, $localStorage, $state, $q, $http, d2bService) {
        //检查产品价格是否小于零
        function _ckPriceIsLTOEZero(products) {
            for (var i = 0; i < products.length; i++) {
                var elem = products[i];
                if (typeof elem.price == 'undefined' || elem.price <= 0) {
                    return true;
                }
            }
            return false;
        }

        $scope.setMeals = angular.copy($localStorage.TRIP.set_meals);

        $scope.addMeal = function() {
            if ($scope.setMeals.length >= 10) {
                alert("亲，套餐最多十个哦!");
                return;
            }
            $scope.setMeals.push({})
        }
        $scope.tripUpdateCommited = function() {
            $('body').loading();
            var url = baseURL + "groups/" + $localStorage.TRIP.group_id + "/trips/" + $localStorage.TRIP.trip_id;
            var data = tripTravelService.combinationData();

            //1.更新套餐
            var promise = $q(function(resolve) {
                if ($scope.setMeals.length > 0) {
                    $http({
                        method: "PUT",
                        url: baseURL + "groups/" + $localStorage.TRIP.group_id + "/trips/create_product",
                        data: {
                            set_meals_attributes: $scope.setMeals
                        }
                    }).then(function(res) {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
            //2.随后更新基础信息
            promise.then(function() {
                var croppedImg = null;
                if ($localStorage.IMAGE.croppedImage) {
                    croppedImg = d2bService.convert($localStorage.IMAGE.croppedImage);
                }
                tripTravelService.uploadData({ file: croppedImg, data: data, url: url, method: "PUT" });
            });

        }
        $scope.deleteCurrentMeal = function(self, index) {
            $scope.setMeals.splice(index, 1);
        }
    }])
