'use strict';

angular.module('xbmc.services', [])
  .factory('socket', function() {
    var callbacks = {};
    var ws = new WebSocket('ws://10.0.0.19:9090/jsonrpc');

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
      if (message.id in callbacks && callbacks[message.id]) {
        callbacks[message.id](message);
        delete callbacks[message.id];
      };
    };

    return {
      run: function(method, params, handler) {
        if (!params) {
          params = {};
        }

        var request = {
          'jsonrpc': '2.0',
          'method': method,
          'id': method,
          'params': params,
        };

        return sendRequest(request, handler);
      }
    };
  })
