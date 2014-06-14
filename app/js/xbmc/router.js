'use strict';

var app = angular.module('xbmc.services');

app.factory(
  'router',
  ['socket', 'helpers', 'messages', '$q',
  function(socket, helpers, messages, $q) {

  return {
    /*
     * xbmcPlayAudioHandler
     *
     * Handles any thing that should result in a
     * track being played.
     */
    xbmcPlayAudioHandler: function(outcome, handler) {
      var defer = $q.defer();
      var playListId = 0;
      var handler = handler;
      var trackFilter = {};

      var entities = outcome.entities;
      if ('artist' in entities && entities.artist.value) {
        trackFilter.artist = entities.artist.value;
      };

      if ('selection' in entities && entities.selection.value) {
        socket.send('AudioLibrary.GetSongs', {'filter': trackFilter})
          .then(function(returnedData) {
            var song = null;

            if (outcome.entities.selection.body === 'exact' || 'song' in outcome.entities.selection) {

              song = helpers.findClosestMatch(
                entities.song.value, returnedData.result.songs,
                maxDistance);

           } else if (entities.selection.body === 'random') {

             song = helpers.findRandomItem(returnedData.result.songs);
           }

           if (!song) {
             return defer.reject({
               message: messages.songNotFound(),
               body: null
             });
           }

            // Todo: deal with failures!
            socket.send('Playlist.Clear');
            socket.send(
              'Playlist.Add', {item: {'songid': song.songid}, 'playlistid': playListId});

            socket.send('Playlist.GetItems', {'playlistid': playListId})
              .then(function(playListData) {
                var position = playListData.result.items.length - 1;
                socket.send('Player.Open',
                   {'item': {'playlistid': playListId, 'position': position}}
                );
              });

            return defer.resolve({
              message: messages.exactSong(trackFilter, song.label)
            });
          });
      };

      return defer.promise;
    },

    /*
     * xbmcListAudioHandler
     *
     * Handles any thing that should result in a
     * more information being returned about audio
     */
    xbmcListAudioHandler: function(outcome, handler, trackFilter) {
      var defer = $q.defer();
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

      socket.send('AudioLibrary.GetSongs', params)
        .then(function(returnedData) {
          var song = null;

          return defer.resolve({
            body: returnedData.result.songs,
            message: messages.listSongs(trackFilter)
          });
        });

      return defer.promise;
    },

    /*
     * xbmcWatchVideoHandler
     *
     * Handles any thing that should result in a
     * a video being displayed
     */
    xbmcWatchVideoHandler: function(outcome, handler) {
      var defer = $q.defer();
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
       return defer.reject({
         message: messages.videoTypeNotFound(videoType),
         body: null
       });
     }

     if ('genre' in entities && entities.genre.value) {
       videoFilter['genre'] =  entities.genre.value;
     };

     socket.send(callToMake, {'filter': videoFilter})
       .then(function(returnedData) {
         console.log(returnedData);
         var videoTypePlural = videoType + 's';
         var video = null;

          if ('selection' in entities && entities.selection.value === 'random') {
            video = helpers.findRandomItem(returnedData.result[videoTypePlural]);
          }

          if (!video) {
            return defer.resolve({
              message: messages.videoNotFound(),
              body: null
            });
          }

          var params = {item: {}, 'playlistid': playListId};
          params.item[videoType + 'id'] = video[videoType + 'id'];

          // Todo: deal with failures!
          socket.send('Playlist.Clear');
          socket.send('Playlist.Add', params);

          socket.send('Playlist.GetItems', {'playlistid': playListId})
            .then(function(playListData) {
              var position = playListData.result.items.length - 1;
              socket.send('Player.Open',
                 {'item': {'playlistid': playListId, 'position': position}}
              );
            });

          return defer.resolve({
            message: messages.exactVideo(video)
          });
        });

        return defer.promise;
      },
    };
}]);