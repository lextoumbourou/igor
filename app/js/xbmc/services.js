'use strict';

angular.module('igor.xbmc.services', [])
  .factory('xbmcSocket', function() {
    var callbacks = {};
    var ws = new WebSocket('ws://10.0.0.9:9090/jsonrpc');

    ws.onopen = function(){  
      console.log("Socket has been opened!");  
    };
        
    ws.onmessage = function(message) {
      handleMessage(JSON.parse(message.data));
    };

    /*
     * sendRequest
     *
     * Send data to the server and assign a call back
     * to our object for handling when the server responsed
     */
    var sendRequest = function(request, handler) {
      callbacks[request.id] = handler;
      ws.send(JSON.stringify(request));
    };

    /*
     * handleMessage
     *
     * When we receive a message from the server, we check
     * its id to see if a call back has been set for it. If so,
     * we run it!
     */
    var handleMessage = function(message) {
      if (callbacks.hasOwnProperty(message.id)) {
        callbacks[message.id](message);
        delete callbacks[message.id];
      };
    };

    return {
      run: function(method, handler) {
         var request = {
           'jsonrpc': '2.0',
           'method': method,
           'id': method,
         };

         return sendRequest(request, handler);
      }
    };
  })
  .factory('xbmcHelpers', function() {
    // For Levenshtein Distance string matching
    var maxDistance = 3;

    var _findClosestMatch = function(itemToFind, itemsToSearch) {
      var lowest = Infinity;
      var lowestMatch = null;

      for (var i = 0; i < itemsToSearch.length; i++) {

        var item = itemsToSearch[i];
        var l = new Levenshtein(itemToFind, item.label);

        if (l.distance <= lowest && l.distance <= maxDistance) {
          lowest = l.distance;
          lowestMatch = item;
        };

      };

      return lowestMatch;
    };

    var _findRandomItem = function(items, random) {
      return items[Math.floor(Math.random() * items.length)];
    };

    return {
      findClosestMatch: _findClosestMatch,
      findRandomItem: _findRandomItem,
    };
  })
  .factory('messages', function() {
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
      }
    };
  })
  .factory(
    'xbmcRouter', ['xbmcSocket', 'xbmcHelpers', 'messages', function(xbmcSocket, xbmcHelpers, messages) {
    
    return {
      /*
       * xbmcPlayAudioHandler
       *
       * Handles any thing that should result in a
       * track being played.
       */
      xbmcPlayAudioHandler: function(outcome, handler) {
        var handler = handler;
        var trackFilter = {};

        var entities = outcome.entities;
        if ('artist' in entities && entities.artist.value {
          trackFilter.artist = entities.artist.value;
        };

        if ('selection' in outcome.entities) {
          xbmcSocket.run('AudioLibrary.GetSongs', {'filter': trackFilter},
            function(songData) {
              var song = null;

              if (outcome.entities.selection.body === 'exact' || 'song' in outcome.entities.selection) {

                song = xbmcHelpers.findClosestMatch(
                  entities.song.value, songData.entities.result,
                  maxDistance);

             } else if (outcome.entities.select.body === 'random') {

               song = xbmcHelpers.findRandomItem(songData);

             }

             if (!song) {
               return handler({
                 message: messages.songNotFound(),
                 body: null
               });
             }

              // Todo: deal with failures!
              xbmcSocket.run('Playlist.Clear');
              xbmcSocket.run('Playlist.Add', {'songid': song.id});
              xbmcSocket.run('Playlist.GetItems', {'playlistid': 0});

              return handler({
                message: messages.exactSong(trackFilter, song)
              });
            }
          );
        };

        // Nothing was found let's attempt to list some data
        // so the user sees something
        return xbmcListAudioHandler(outcome, handler, trackFilter);
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

        var potentialSongs = [
            {'label': 'Song 1'}, {'label': 'Song 2'},
        ];

        return handler({
          body: potentialSongs,
          message: messages.listSongs(trackFilter),
        });
      },

      /*
       * xbmcWatchVideoHandler
       *
       * Handles any thing that should result in a
       * a video being displayed
       */
      xbmcWatchVideoHandler: function(outcome, handler) {
        var handler = handler;

        xbmcSocket.run('VideoLibrary.GetMovies', function(data) {

          return handler({
            body: data.result.movies,
            message: "Okay, i'll watch video"
          });
        });
      },
    };

  }]);
