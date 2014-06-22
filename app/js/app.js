'use strict';

var app = angular.module('igor', [
  'rt.encodeuri',
  'ngAnimate',
  'ngRoute',
  'igor.directives',
  'igor.controllers',
  'igor.services',
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/settings', {
      templateUrl: 'partials/settings.html',
      controller: 'SettingsController'
    }).
    when('/result', {
      templateUrl: 'partials/results.html',
      controller: 'MainController'
    }).
    when('/', {
      redirectTo: '/result'
    });
}]);

var autoGrow = function (oField) {
  if (oField.scrollHeight > oField.clientHeight) {
    oField.style.height = oField.scrollHeight + "px";
  }
}
