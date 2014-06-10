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
  .factory('xbmcRouter', ['xbmcSocket', function(xbmcSocket) {
    return {
      /*
       * xbmcPlayAudioHandler
       *
       * Handles any thing that should result in a
       * track being played.
       */
      xbmcPlayAudioHandler: function(outcome, handler) {
        var handler = handler;

        xbmcSocket.run('AudioLibrary.GetSongs', function(data) {

          return handler({
            body: data.result.songs,
            message: "Okay, i'll play audio"
          });
        });

      },

      /*
       * xbmcListAudioHandler
       *
       * Handles any thing that should result in a
       * more information being returned about audio
       */
      xbmcListAudioHandler: function(outcome, handler) {
        var handler = handler;

        xbmcSocket.run('AudioLibrary.GetSongs', function(data) {

          return handler({
            body: data.result.songs,
            message: 'List audio message'
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
