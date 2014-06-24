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
        var params = {};
        var trackFilter = {};

        params.properties = ['title', 'artist', 'genre', 'thumbnail'];
        var entities = outcome.entities;
        if ('artist' in entities && entities.artist.value) {
          params.filter = {artist: entities.artist.value};
        };

        if ('selection' in entities && entities.selection.value) {
          socket.send('AudioLibrary.GetSongs', params)
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
                selection: song,
                body: returnedData.result.songs,
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
       * xbmcWatchMovieHandler
       *
       * Handles any thing that should result in a
       * a video being displayed
       */
      xbmcWatchMovieHandler: function(outcome, handler) {
        var defer = $q.defer();
        var playListId = 1;
        var handler = handler;
        var videoFilter = {};
        var entities = outcome.entities;
        var params = {properties: ['art', 'rating', 'thumbnail', 'playcount', 'file']};

        socket.send('VideoLibrary.GetMovies', params).then(function(returnedData) {
          console.log('sent a request to XBMC and got this');
          console.log(returnedData);
          var movie = null;

           if ('selection' in entities && entities.selection.value === 'random') {
             movie = helpers.findRandomItem(returnedData.result.movies);
           }

           if (!movie) {
             return defer.resolve({
               message: messages.videoNotFound(),
               body: null
             });
           }

           var params = {item: {}, 'playlistid': playListId};
           params.item.movieid = movie.movieid;

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
             selection: movie,
             body: returnedData.result.movies,
             message: messages.exactVideo(movie)
           });
         });

         return defer.promise;
      },
      xbmcWatchTVShowHandler: function(outcome) {
        var defer = $q.defer();
        var playListId = 1;
        var params = {};
        var entities = outcome.entities;
        var show;

        // If TVShow title requested, then find the closest match
        socket.send('VideoLibrary.GetTVShows', {}).then(function(returnedData) {
          if ('title' in entities && entities.title.value) {
            show = helpers.findClosestMatch(
              entities.title.value, returnedData.result.tvshows);
          } else {
            show = helpers.findRandomItem(returnedData.result.tvshows);
          }

          var tvShowParams = {
            tvshowid: show.id,
            properties: ['art', 'rating', 'thumbnail', 'playcount', 'file']};

          socket.send('VideoLibrary.GetEpisodes', tvShowParams).then(function(episodeData) {
            var episode = helpers.findRandomItem(episodeData.result.episodes);
            var playListParams = {item: {episodeid: episode.episodeid}, 'playlistid': playListId};
            // Todo: deal with failures!
            socket.send('Playlist.Clear');
            socket.send('Playlist.Add', playListParams);

            socket.send('Playlist.GetItems', {'playlistid': playListId})
             .then(function(playListData) {
               console.log(playListData);
               var position = playListData.result.items.length - 1;
               socket.send('Player.Open',
                  {'item': {'playlistid': playListId, 'position': position}}
               );
             });

           return defer.resolve({
             selection: episode,
             body: episodeData.result.episodes,
             message: messages.exactVideo(episode)
           });
          });
        });

        return defer.promise;
      },
      xbmcPlayerControl: function(outcome) {
        var defer = $q.defer();
        var entities = outcome.entities;

        if (entities.control) {
          if (entities.control.value == 'stop') {
            socket.send('Player.GetActivePlayers', {})
              .then(function(playerData) {
                console.log(playerData.result.length);
                if (playerData.result.length > 0) {
                  for (var i = 0; i < playerData.result.length; i++) {
                    var player = playerData.result[i];
                    socket.send('Player.Stop', {'playerid': player.playerid})
                      .then(function(resultData) {
                        console.log(resultData);
                      });
                  }
                  return defer.resolve({
                    message: messages.stopPlaying()
                  });
                }
                else {
                  return defer.resolve({
                    message: messages.nothingToStop()
                  });
                };
              });
          }
        }

        return defer.promise;
      }
    };
}]);
