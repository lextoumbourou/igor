'use strict';

describe('igor services', function() {

  describe('igor witService', function() {
    var httpBasedService,
        httpBackend;

    beforeEach(function() {
      module('igor');

      inject(function($httpBackend, _witService_) {
        witService = _witService_;
        httpBackend = $httpBackend;
      });
    });

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should return appropriate JSON data when called', function() {
      var returnData = {
        'outcome': {
          'entities': {
            'artist': {'body': 'ZHU', 'suggested': true, 'value': 'ZHU'},
            'selection': {'body': 'random', 'value': 'random'},
            'when': {'value': 'now'}
          },
          'intent': 'play_audio'
        }
      };

      var url = 'https://api.wit.ai/message?q=hello';

      httpBackend.expectGET(url).respond(returnData);

      var returnedPromise = witService.getMessage('hello');
      
      var result;
      returnedPromise.then(function(response) {
        result = response;
      });

      httpBackend.flush();

      expect(result).toEqual(returnData);
    });

  });

});
