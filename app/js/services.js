'use strict';

angular.module('igor.services', [])
  .factory('witService', function($http) {
    var witUrl = 'http://10.0.0.5:5000';

    var getQuery = function(query, path) {
      return $http({
        method: 'GET',
        url: witUrl + '/' + path + '?q=' + query
      });
    }

    return {
      getMessage: function(query) {
        return getQuery(query, 'message');
      }
    };
  })
  .factory('utterance', function() {
    return new SpeechSynthesisUtterance();
  })
  .factory('speech', ['$window', 'utterance', function($window, utterance) {
    var msg = utterance;

    return {
      say: function(text) {
        msg.text = text;
        return $window.speechSynthesis.speak(msg);
      }
    }
  }])
