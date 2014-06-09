'use strict';

angular.module('igor.xbmc.services', [])
  .factory('xbmcSocket', function() {
    var Service = {}
    var callbacks = [];
    var currentCallbackId = 0;
    var ws = new WebSocket('ws://10.0.0.9:9090/jsonrpc');

    ws.onopen = function(){  
      console.log("Socket has been opened!");  
    };
        
    ws.onmessage = function(message) {
      listener(JSON.parse(message.data));
    };

    var sendRequest = function(request, handler) {
      callbacks[request.id] = {
        time: new Date(),
        cb: handler
      };
      console.log('sending request', request);
      ws.send(JSON.stringify(request));
    }

     var listener = function(data) {
       var messageObj = data;
       console.log('Received data from websocket: ', messageObj);
       if (callbacks.hasOwnProperty(messageObj.id)) {
         console.log(callbacks[messageObj.id]);
         callbacks[messageObj.id].cb(messageObj);
         delete callbacks[messageObj.id];
       }
     }

     Service.run = function(method, handler) {
       var request = {
         'jsonrpc': '2.0',
         'method': method,
         'id': method,
       };

       return sendRequest(request, handler);
     }

     return Service;
  })
  .factory('xbmcRouter', ['xbmcSocket', function(xbmcSocket) {
    var xbmcSocket = xbmcSocket;

    var router = {
      /*
       * xbmcPlayAudioHandler
       *
       * Handles any thing that should result in a
       * track being played.
       *
       * Arguments:
       *
       *   xbmcSocket - object
       */
      xbmcPlayAudioHandler: function() {
        var output = {}

        output.run = function(outcome, handler) {
          var handler = handler;
          xbmcSocket.run('AudioLibrary.GetSongs', function(data) {
            console.log();
            return handler({
              body: data.result.songs,
              message: "Okay, i'll play audio"
            });
          });
        };

        return output;
      },

      /*
       * xbmcListAudioHandler
       *
       * Handles any thing that should result in a
       * more information being returned about audio
       *
       * Arguments:
       *
       *   xbmcSocket - object
       */
      xbmcListAudioHandler: function() {
        var output = {};

        output.run = function(outcome, handler) {
          var handler = handler;
          xbmcSocket.run('AudioLibrary.GetSongs', function(data) {
            return handler({
              body: data.result.songs,
              message: 'List audio message'
            });
          });
        };

        return output;
      },

      /*
       * xbmcWatchVideoHandler
       *
       * Handles any thing that should result in a
       * a video being displayed
       *
       * Arguments:
       *
       *   xbmcSocket - object
       */
      xbmcWatchVideoHandler: function() {
        var output = {};

        output.run = function(outcome, handler) {
          var handler = handler;
          xbmcSocket.run('VideoLibrary.GetMovies', function(data) {
            return handler({
              body: data.result.movies,
              message: "Okay, i'll watch video"
            });
          });
        };

        return output;
      },
    };

    return router;
  }]);
