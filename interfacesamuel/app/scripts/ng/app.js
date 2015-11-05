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
    'xeditable',
    'ngPrettyJson',
    'ngGrid',
    'angularMoment',
    'ngLodash',
    'ngDialog',
    'SignalR',
    'ui.bootstrap.datetimepicker',
    'nvd3ChartDirectives',
	   'endpoints'
    ];
    try {
        angular.module('views');
        return angular.module('onionfront', modules.concat(['views']));
    } catch (e) {
        return angular.module('onionfront', modules);
    }
})() .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise("/");
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $stateProvider.state('test', {
        url: '/to/test?hide&go',
        templateUrl: 'views/test.html'
    }).state('start', {
        url: '/',
        templateUrl: 'views/test.html'
    }).state('dashboard', {
        url: '/to/testagain',
        templateUrl: 'views/test.html'
    });

    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).run(function (editableOptions, $rootScope, $state) {
    editableOptions.theme = 'bs3';

    $rootScope.uiNotificationsLogs = [];
    var doAlert = function(msg, name) {
        window.toastr[name](msg);
    };
    $rootScope.alertSuccess = function(msg) {
        $rootScope.uiNotificationsLogs.unshift({
            message: msg,
            status: 'success'
        });
        doAlert(msg, 'success');
    };
    $rootScope.alertError = function(msg) {
        $rootScope.uiNotificationsLogs.unshift({
            message: msg,
            status: 'error'
        });
        doAlert(msg, 'error');
    };
    $rootScope.alertInfo = function(msg) {
        $rootScope.uiNotificationsLogs.unshift({
            message: msg,
            status: 'info'
        });
        doAlert(msg, 'info');
    };
    $rootScope.cancelPreviousAlerts = function() {
        window.toastr.clear();
    };
    $rootScope.$on('$stateChangeStart', function() {
        $rootScope.$emit('stateChangeStarted');
    });

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    });
});

angular.module('onionfront').factory("setCookie",function(){
	return function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};
}).factory("getCookie",function(){
	return function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};
})
.controller('index', function($scope, $state, serviceRequests, EndPoints, $rootScope) {
	}).directive('ngHtmlCompile', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(attrs.ngHtmlCompile, function(newValue, oldValue) {
                    element.html(newValue);
                    $compile(element.contents())(scope);
                });
            }
        };
    }).directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });