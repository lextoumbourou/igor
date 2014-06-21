'use strict';

angular.module('igor.services', [])
  .factory('witService', ['$http', function($http) {
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
  }])
  .factory('speech', ['$window', function($window) {
    var msg = new $window.SpeechSynthesisUtterance();

    return {
      say: function(text) {
        msg.text = text;
        return $window.speechSynthesis.speak(msg);
      }
    }
  }])
  .factory('speechListen', ['$window', 'speechResult', '$rootScope', function($window, speechResult, $rootScope) {
    var SpeechRecognition = $window.SpeechRecognition ||
                            $window.webkitSpeechRecognition ||
                            $window.mozSpeechRecognition ||
                            $window.msSpeechRecognition ||
                            $window.oSpeechRecognition;

    if (!SpeechRecognition) {
      return null;
    }

    var recognition = new SpeechRecognition();

    recognition.lang = "en-US"
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.handleFinal = function() {}; // to be overwritten

    recognition.onresult = function(event) {
      speechResult.message = '';
      for (var i = event.resultIndex; i < event.results.length; i++) {
        $rootScope.$apply(function() {
          if (event.results[i].isFinal) {
            speechResult.message =
              event.results[i][0].transcript + ' (Confidence: ' + event.results[i][0].confidence + ')';
            recognition.handleFinal(event.results[i][0].transcript);
          }
          else {
              speechResult.message += event.results[i][0].transcript;
          }
        });
      };
    };

    return recognition;
  }])
  .factory('speechResult', function() {
    return {
      message: null
    }
  })
  .factory('config', function() {
    var witToken = null;

    var xbmcDefault = {
      'host': null,
      'wsPort': 9090,
      'httpPort': 8080
    };

    return {
      witToken: null,
      xbmc: xbmcDefault
    }
  });
