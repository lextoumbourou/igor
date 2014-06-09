'use strict';

angular.module('igor.services', ['igor.xbmc.services'])
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
  .factory('xbmcRouter', [
    'xbmcPlayAudioHandler',
    'xbmcListAudioHandler',
    'xbmcWatchVideoHandler',
    function(xbmcPlayAudioHandler, xbmcListAudioHandler, xbmcWatchVideoHandler) {
      return {
        play_audio: xbmcPlayAudioHandler,
        list_audio: xbmcListAudioHandler,
        watch_video: xbmcWatchVideoHandler
      };
  }])
  .factory('speech', ['$window', 'SpeechSynthesisUtterance', function($window, SpeechSynthesisUtterance) {
    var msg = new SpeechSynthesisUtterance();

    return {
      say: function(text) {
        msg.text = text;
        return $window.speechSynthesis.speak(msg);
      } 
    }
  }])
  .factory('xbmcService', function() {
    var sock = new SockJS('wss://10.0.0.5:8080/jsonrpc');
    sock.onopen = function() {
      console.log('open');
    };
    sock.onmessage = function(e) {
      console.log('message', e.data);
    }
    sock.onclose = function() {
      console.log('close');
    };
  });
