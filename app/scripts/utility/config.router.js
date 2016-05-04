'use strict';
var routersModule = angular.module('app.routers', []);

routersModule
//路由配置
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/welcome');
    $stateProvider
        .state('welcome', {
            url: "/welcome",
            templateUrl: 'partials/mainContentTpl.html',
            data: {
                requireLogin: false
            }
        }).state('app', {
            url: "/app",
            abstract: true,
            template: "<div ui-view></div>",
            data: {
                requireLogin: true
            }
        }).state('app.dashboard', {
            url: "/dashboard",
            templateUrl: 'partials/dashboardTpl.html'
        }).state('app.dashboard.targetEdit', {
            url: "/target-edit",
            templateUrl: 'partials/tripTargetEditTpl.html'
        }).state('app.dashboard.dateEdit', {
            url: "/date-edit",
            templateUrl: 'partials/tripDateEditTpl.html'
        }).state('app.dashboard.titleEdit', {
            url: "/title-edit",
            templateUrl: 'partials/tripTitleEditTpl.html'
        }).state('app.dashboard.sponsorEdit', {
            url: "/sponsor-edit",
            templateUrl: 'partials/tripSponsorEditTpl.html'
        }).state('app.dashboard.travelEdit', {
            url: "/travel-edit",
            templateUrl: 'partials/tripTravelEditTpl.html'
        }).state('app.dashboard.productEdit', {
            url: "/product-edit",
            templateUrl: 'partials/tripTravelProductEditTpl.html'
        }).state('app.dashboard.customEdit', {
            url: "/custom-edit",
            templateUrl: 'partials/tripCustomEditTpl.html'
        }).state('app.dashboard.groupList', {
            url: "/groupList",
            templateUrl: 'partials/groupList.html'
        }).state('app.dashboard.groupDetail', {
            url: "/groupDetail/:index",
            templateUrl: 'partials/groupDetail.html'
        })
}]);
