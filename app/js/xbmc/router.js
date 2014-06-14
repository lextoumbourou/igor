'use strict';

var app = angular.module('xbmc.services');

app.factory(
  'router', ['socket', 'helpers', 'messages', function(xbmcSocket, xbmcHelpers, messages) {

  return {
    /*
     * xbmcPlayAudioHandler
     *
     * Handles any thing that should result in a
     * track being played.
     */
    xbmcPlayAudioHandler: function(outcome, handler) {
      var playListId = 0;
      var handler = handler;
      var trackFilter = {};

      var entities = outcome.entities;
      if ('artist' in entities && entities.artist.value) {
        trackFilter.artist = entities.artist.value;
      };

      if ('selection' in entities && entities.selection.value) {
        xbmcSocket.run('AudioLibrary.GetSongs', {'filter': trackFilter})
          .then(function(returnedData) {
            var song = null;

            if (outcome.entities.selection.body === 'exact' || 'song' in outcome.entities.selection) {

              song = xbmcHelpers.findClosestMatch(
                entities.song.value, returnedData.result.songs,
                maxDistance);

           } else if (entities.selection.body === 'random') {

             song = xbmcHelpers.findRandomItem(returnedData.result.songs);
           }

           if (!song) {
             return handler({
               message: messages.songNotFound(),
               body: null
             });
           }

            // Todo: deal with failures!
            xbmcSocket.run('Playlist.Clear');
            xbmcSocket.run(
              'Playlist.Add', {item: {'songid': song.songid}, 'playlistid': playListId});

            xbmcSocket.run('Playlist.GetItems', {'playlistid': playListId})
              .then(function(playListData) {
                var position = playListData.result.items.length - 1;
                xbmcSocket.run('Player.Open',
                   {'item': {'playlistid': playListId, 'position': position}}
                );
              });

            return handler({
              message: messages.exactSong(trackFilter, song.label)
            });
          });
      };
    },

    /*
     * xbmcListAudioHandler
     *
     * Handles any thing that should result in a
     * more information being returned about audio
     */
    xbmcListAudioHandler: function(outcome, handler, trackFilter) {
      if (!trackFilter) {
        var trackFilter = {};
      }

      var entities = outcome.entities;
      if ('artist' in entities && entities.artist.value) {
        trackFilter.artist = entities.artist.value;
      };

      var params = {
        'filter': trackFilter,
        'properties': ['title', 'artist', 'genre', 'thumbnail']};

      xbmcSocket.run('AudioLibrary.GetSongs', params)
        .then(function(returnedData) {
          var song = null;

          return handler({
            body: returnedData.result.songs,
            message: messages.listSongs(trackFilter)
          });
        });
    },

    /*
     * xbmcWatchVideoHandler
     *
     * Handles any thing that should result in a
     * a video being displayed
     */
    xbmcWatchVideoHandler: function(outcome, handler) {
      var playListId = 1;
      var handler = handler;
      var videoFilter = {};

      // Assume movie requested by default
      var videoType = 'movie'

      var entities = outcome.entities;
      if ('type' in entities && entities.type.value) {
        videoType = entities.type.value;
      };

      try {
        var callToMake = 'VideoLibrary.' + {
          'movie': 'GetMovies',
          'tvshow': 'GetEpisodes',
          'musicvideo': 'GetMusicVideos'
        }[videoType];
      }
      catch(err) {
       return handler({
         message: 'Huh?',
         body: null
       });
     }

     if ('genre' in entities && entities.genre.value) {
       videoFilter['genre'] =  entities.genre.value;
     };

     xbmcSocket.run(callToMake, {'filter': videoFilter})
       .then(function(returnedData) {
         var videoTypePlural = videoType + 's';
         var video = null;

          if ('selection' in entities && entities.selection.value === 'random') {
            video = xbmcHelpers.findRandomItem(returnedData.result[videoTypePlural]);
          }

          if (!video) {
            return handler({
              message: messages.videoNotFound(),
              body: null
            });
          }

          var params = {item: {}, 'playlistid': playListId};
          params.item[videoType + 'id'] = video[videoType + 'id'];

          // Todo: deal with failures!
          xbmcSocket.run('Playlist.Clear');
          xbmcSocket.run('Playlist.Add', params);

          xbmcSocket.run('Playlist.GetItems', {'playlistid': playListId})
            .then(function(playListData) {
              var position = playListData.result.items.length - 1;
              xbmcSocket.run('Player.Open',
                 {'item': {'playlistid': playListId, 'position': position}}
              );
            });

          return handler({
            message: messages.exactVideo(video)
          });
        });
      },
    };
}]);
