'use strict';

(function() {
    var modules = [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ngPrettyJson',
    'ngGrid',
    'angularMoment',
    'ngLodash'
    ];
    try {
        angular.module('views');
        return angular.module('onionfront', modules.concat(['views']));
    } catch (e) {
        return angular.module('onionfront', modules);
    }
})() 
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {  })
.run(function (editableOptions, $rootScope, $state) { });
//angular.module('onionfront');