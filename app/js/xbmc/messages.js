'use strict';

var app = angular.module('xbmc.services');

app.factory('messages', function() {
  return {
    songNotFound: function() {
      return "Sound couldn't be found";
    },
    exactSong: function(trackFilter, song) {
      var output = "Found song " + song;
      if ('artist' in trackFilter) {
        output = output + " by " + trackFilter.artist;
      };
  
      return output;
    },
    listSongs: function(trackFilter) {
      var output = "Here are a selection of possible songs"
      if ('artist' in trackFilter) {
        output = output + " by " + trackFilter.artist;
      };
  
      return output;
    },
    videoNotFound: function() {
      return "Couldn't find anything to watch";
    },
    exactVideo: function(video) {
      return "Okay. Let's watch " + video.label + '.';
    },
    videoTypeNotFound: function(videoType) {
      return 'Video type ' + videoType + ' not found';
    }
  };
});
