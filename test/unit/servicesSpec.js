'use strict';

describe('igor.services', function() {

  describe('speech', function() {
    var $window, speech;

    // run before it() function
    beforeEach(module('igor'));

    beforeEach(function() {
      $window = {
        speechSynthesis: { speak: jasmine.createSpy() },
        SpeechSynthesisUtterance: function() {
          this.text = '';
        },
      };

      module(function($provide) {
        $provide.value('$window', $window);
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

describe('xbmc.services', function() {

  describe('helpers', function() {
    var xbmcHelpers;
    var config;

    beforeEach(angular.mock.module('igor'));

    beforeEach(function() {
      angular.mock.inject(function($injector) {
        xbmcHelpers = $injector.get('helpers');
      });
      config = {
        xbmc: {
          ip: '127.0.0.1', port: '9090'
        }
      };
    });

    it('should match a "close enough" string', function() {
      var artistData = {
        'id': 1, 'jsonrpc': 2.0, 'result': {
          'artists': [
            {'label': 'James Blake', 'artistid': 1},
            {'label': 'Mark Morrison', 'artistid': 2},
          ],
        },
      };

      var artists = artistData.result.artists;

      expect(xbmcHelpers.findClosestMatch('james blake', artists, 3))
        .toEqual(artistData.result.artists[0]);
    });

    it('should return a random item from an array', function() {
      spyOn(Math, 'random').andReturn(0.34);

      var items = ['first', 'second', 'third'];
      expect(xbmcHelpers.findRandomItem(items)).toEqual('second');
    });

  });

});
