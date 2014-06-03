var whyApp = angular.module('whyApp', ['rt.encodeuri']);

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
    $scope.body = false;
    $scope.subtitle = 'Tell me what you want';
    $scope.potential = 'Test';
    $scope.updateAndPlay = function(text) {
        msg = new SpeechSynthesisUtterance();
        $scope.subtitle = text;
        msg.text = text;
        window.speechSynthesis.speak(msg);
    };

    $scope.lastRecognition = 0;
    $scope.timeBetweenCommands = 3000;
    $scope.interimResults = '';
    $scope.interimTranscript = ''
    $scope.finalTranscript = '';

    $scope.messages = { 'play_music': $scope.handlePlayMusic,
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
        $http.get(encodeURI('/handle_message?q=' + $scope.title)).
            success(function(data, status) {
                $scope.handleResults(data);
            }).
            error(function() {
                message = "Something is wrong with the server. Can you fix it?"
                $scope.updateAndPlay(message);
            });
    };

    $scope.startListening = function() {
        $scope.rec.start();
    };

    $scope.stopListening = function() {
        $scope.rec.stop();
    };
});
