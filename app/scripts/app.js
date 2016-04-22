
'use strict';
var app = angular.module('app', [
    'ngSanitize',
    'ngStorage',
    'ngAnimate',
    'ui.router',
    'ngStorage',
    'angular-jwt',
    'app.services',
    'app.controller',
    'app.directives',
    'app.filters',
    'app.constants',
    'app.routers',
    'app.utilityService',
    'ui.bootstrap.datetimepicker',
    'angular-img-cropper',
    'ngFileUpload',
    'base64'
]);

app
//本地存储配置
    .config(['$localStorageProvider',
    function($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('YZP_');
    }
])

//HTTP拦截器配置
.config(function Config($httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = ['$localStorage', '$rootScope', 'AUTH_EVENTS', function($localStorage, $rootScope, AUTH_EVENTS) {
        return $localStorage.TOKEN;
    }];

    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push(function($q, $injector) {
        return {
            responseError: function(rejection) {
                if (rejection.status == 419) {
                    $localStorage.$reset();
                    $state.go('welcome');
                    return;
                } else {
                    console.log(rejection);
                }
            }
        };
    });
});

app.run(['$rootScope', '$state', '$stateParams', '$localStorage', 'jwtHelper', 'loginModalSrv', 'tripSponsorService', 'AUTH_EVENTS', function($rootScope, $state, $stateParams, $localStorage, jwtHelper, loginModalSrv, tripSponsorService, AUTH_EVENTS) {
    jQuery(window).load(function() {
        // will first fade out the loading animation
        jQuery(".status").fadeOut();
        // will fade out the whole DIV that covers the website.
        jQuery(".preloader").delay(1000).fadeOut("slow");
    })
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $localStorage;
    $rootScope.user = $localStorage.USER;
    $rootScope.isLogined = loginModalSrv.isAuthorized();

    // 监听路由状态改变
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        if (toState && toState.data.requireLogin) {
            if (!$localStorage.TOKEN || jwtHelper.isTokenExpired($localStorage.TOKEN)) {
                event.preventDefault();
                $state.go('welcome');
            }
        }
    });

    $rootScope.loginOut = function() {
        //console.log("am I right?");
        if (confirm("确认注销?")) {
            $localStorage.$reset();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            $state.go('welcome');
        }
    };

}])