'use strict';

angular.module('igor.services', [])
  .factory('witService', function($http) {
    var witUrl = 'http://api.wit.ai';
    var versionId = '20140401';
    var accessToken = config.accessToken;

    var getQuery = function(query, path) {
      var url = [
        witUrl, '/', path , '?q=', query,
       '&v=', versionId, '&access_token=', accessToken, '&callback=JSON_CALLBACK'
      ].join('');

      return $http.jsonp(url);
    };

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
