'use strict';

describe('igor services', function() {

  describe('igor speech', function() {
    var $window, speech;

    // run before it() function
    beforeEach(module('igor'));

    beforeEach(function() {
      $window = {speechSynthesis: { speak: jasmine.createSpy()} };
      var SpeechSynthesisUtterance = function() { return {}; };

      module(function($provide) {
        $provide.value('$window', $window);
        $provide.value('SpeechSynthesisUtterance', SpeechSynthesisUtterance);
      });

      inject(function($injector) {
        speech = $injector.get('speech');
      });
    });

    it('class speechSynthesis with correct text', function() {
      speech.say('Hello');
      expect($window.speechSynthesis.speak).toHaveBeenCalledWith({text: 'Hello'});
    });
  });
});
