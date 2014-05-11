var whyApp = angular.module('whyApp', []);
var apiUrl = 'http://127.0.0.1:5000';


whyApp.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind('keydown keypress', function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});
whyApp.controller('MainController', function ($scope, $http) {
    $scope.title = 'Why Not?';
    $scope.subtitle = 'Tell me what you want';

    $scope.lastRecognition = 0;
    $scope.timeBetweenCommands = 3000;
    $scope.interimResults = '';
    $scope.interimTranscript = ''
    $scope.finalTranscript = '';

    $scope.handlePlayMusic = function(data) {
        console.log(data);
        $scope.subtitle = 'Let the music play';
    };

    $scope.messages = {
        'play_music': $scope.handlePlayMusic,
    };

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
        //$scope.rec.start();
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

    $scope.rec.start();

    $scope.clearLastCommand = function() {
        var tmpTime = new Date().getTime();
        if (tmpTime - $scope.lastRecognition > $scope.timeBetweenCommands) {
            $scope.lastRecognition = tmpTime;
        };
    };

    $scope.getMeaningOfTitle = function() {
        $http.get(encodeURI(apiUrl + '?message=' + $scope.title)).
            success(function(data, status) {
                var intent = data['outcome']['intent'];
                if (intent in $scope.messages) {
                    $scope.messages[intent](data);
                }
            }).
            error(function() {
                $scope.subtitle = 'Whoops, something failed...';
            });
    };
});
