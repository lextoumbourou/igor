'use strict';

angular.module('igor.controllers', ['igor.services'])
.controller('MainController', [
    '$scope',
    '$http',
    'witService',
    'xbmcRouter',
    function ($scope, $http, witService, xbmcRouter) {

      $scope.title = 'Why Not?';
      $scope.body = false;
      $scope.subtitle = 'Tell me what you want';
      $scope.potential = 'Test';
      $scope.updateAndPlay = function(text) {
        var msg = new SpeechSynthesisUtterance();
        $scope.subtitle = text;
        msg.text = text;
        window.speechSynthesis.speak(msg);
      };

      $scope.lastRecognition = 0;
      $scope.timeBetweenCommands = 3000;
      $scope.interimResults = '';
      $scope.interimTranscript = ''
      $scope.finalTranscript = '';

      $scope.isNewCommand = function() {
        var tmpTime = new Date().getTime();
        if (tmpTime - $scope.lastRecognition > $scope.timeBetweenCommands) {
          $scope.lastRecognition = tmpTime;
          $scope.finalTranscript = '';
        };
      };

      $scope.rec = new webkitSpeechRecognition();
      $scope.rec.continuous = true;
      $scope.rec.lang = 'en-US';
      $scope.rec.onresult = function(event) {
        $scope.isNewCommand();
        $scope.findAndUpdateResults(event);
      };

      $scope.rec.onend = function(evt) {
      };

      $scope.findAndUpdateResults = function(event) {
        $scope.$apply(function() {
          finalTranscript = '';
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              $scope.title += event.results[i][0].transcript;
            }
          };

          $scope.title = finalTranscript;
        });

        $scope.getMeaningOfTitle();
      };

      $scope.handleResults = function(data) {
        if ('body' in data && data['body']) {
          $scope.body = data['body'];
        }
        $scope.updateAndPlay(data['message']);
      }

      $scope.clearLastCommand = function() {
        var tmpTime = new Date().getTime();
        if (tmpTime - $scope.lastRecognition > $scope.timeBetweenCommands) {
          $scope.lastRecognition = tmpTime;
        };
      };

      $scope.getMeaningOfTitle = function() {
        witService.getMessage($scope.title).
          success(function(data, status) {
            var intent = data['outcome']['intent'];
            if (intent in xbmcRouter) {
              xbmcRouter[intent].run(data);
            }
            else {
              $scope.updateAndPlay('Not really sure what you mean?');
            }
          }).
          error(function() {
            $scope.updateAndPlay('Something is wrong with the server');
          });
      };

      $scope.startListening = function() {
        $scope.rec.start();
      };

      $scope.stopListening = function() {
        $scope.rec.stop();
      };
  }]);
