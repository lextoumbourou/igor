'use strict';

angular.module('igor.xbmc.services', [])
  .factory('xbmcPlayAudioHandler', function() {
    var run = function(outcome) {
      console.log(outcome);
      console.log("Okay, i'll play audio");
    };

    return {
      run: function(outcome) {
        return run(outcome);
      }
    }
  })
  .factory('xbmcListAudioHandler', function() {
    var run = function(outcome) {
      console.log(outcome);
      console.log("Okay, i'll list audio");
    };

    return {
      run: function(outcome) {
        return run(outcome);
      }
    }
  })
  .factory('xbmcWatchVideoHandler', function() {
    var run = function(outcome) {
      console.log(outcome);
      console.log("Okay, i'll watch video");
    };

    return {
      run: function(outcome) {
        return run(outcome);
      }
    }
  });
