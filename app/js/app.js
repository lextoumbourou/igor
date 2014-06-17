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
    when('/listen', {
      templateUrl: 'partials/listen.html',
      controller: 'ListenCtrl'
    }).
    when('/result', {
      templateUrl: 'partials/results.html',
      controller: 'MainController'
    }).
    when('/', {
      redirectTo: '/result'
    });
}]);
