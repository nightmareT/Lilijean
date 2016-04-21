/*
 * Directives
 */
'use strict';
var directiveModule = angular.module('app.directives', []);

directiveModule.directive('stepBar', function() {
    return {
        restrict: 'A',
        templateUrl: "partials/stepBarTpl.html",
        link: function (scope, elem, attrs) {
            var v = attrs.stepBar;
            stepBar.init("stepBar", {
                step: v,
                animate: true
            })
        }
    }
});
