/*
 * Contants
 */
'use strict';
var constantsModule = angular.module('app.constants', []);

constantsModule
    .constant('baseURL', 'https://api-www.ipaitrip.com/api/v1/')
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('Constants', {
        appName: 'YZP',
        loginErrorUsernamePassword: 'You must enter username and password to log in',
    });
