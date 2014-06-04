'use strict';

angular.module('igor.services', [])
  .factory('witService', function($http) {
    var witUrl = 'https://api.wit.ai';

    var getQuery = function(query, path) {
      return $http({
        method: 'GET',
        url: witUrl + '/' + path + '?q=' + q
      });
    }

    return {
      getMessage: function(q) {
        return getQuery(q, 'message');
      }
    };
  });
