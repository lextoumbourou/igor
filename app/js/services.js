'use strict';

angular.module('igor.services', ['igor.xbmc.services'])
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
  }]);
