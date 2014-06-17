'use strict';

angular.module('igor.controllers', ['igor.services', 'xbmc.services'])
.controller('MainController', [
    '$scope',
    '$http',
    'witService',
    'router',
    'speech',
    'speechListen',
    function ($scope, $http, witService, xbmcRouter, speech, speechListen) {

      $scope.title = 'Why Not?';
      $scope.body = null;
      $scope.subtitle = 'Tell me what you want';
      $scope.potential = 'Test';
      $scope.isListening = false;
      $scope.xbmcUrl = 'http://' + config.xbmc.host + ':' + config.xbmc.httpPort;

      $scope.lastRecognition = 0;
      $scope.timeBetweenCommands = 3000;
      $scope.interimResults = '';
      $scope.interimTranscript = ''
      $scope.finalTranscript = '';

      $scope.updateAndPlay = function(msg) {
        $scope.subtitle = msg;
        speechListen.stop();
        speech.say(msg);
      }

      speechListen.onresult = function(event) {
        var result = '';
        for (var i = event.resultIndex; i < event.results.length; i++) {
          $scope.$apply(function() {
            $scope.title = event.results[i][0].transcript;
          });
        };
      };

      speechListen.onstart = function() {
        $scope.isListening = true;
      };

      speechListen.onend = function() {
        $scope.isListening = false;
        if ($scope.title) {
          $scope.getMeaningOfTitle();
        };
      };

      speechListen.onerror = function(error) {
        console.log('speech error');
      };

      $scope.clearLastCommand = function() {
        var tmpTime = new Date().getTime();
        if (tmpTime - $scope.lastRecognition > $scope.timeBetweenCommands) {
          $scope.lastRecognition = tmpTime;
        };
      };

      $scope.getMeaningOfTitle = function() {
        witService.getMessage($scope.title).
          success(function(data, status) {
            $scope.result = null;
            var intent = data.outcome.intent;
            if (intent in xbmcRouter) {
              xbmcRouter[intent](data.outcome).then(function(result) {
                $scope.result = result;
                $scope.updateAndPlay(result.message)
              });
            }
            else {
              $scope.updateAndPlay('Not really sure what you mean?');
            }
          }).
          error(function(data, status) {
            $scope.updateAndPlay('Something is wrong with the server');
          });
      };

      $scope.toggleListening = function() {
        if ($scope.isListening) {
          speechListen.stop();
        }
        else if (!$scope.isListening) {
          speechListen.start();
        };
      };
  }])
  .controller('ListenCtrl', function() {
    console.log("I'm listening");
  });
