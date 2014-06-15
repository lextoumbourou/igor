describe('igor controllers', function() {

  describe('igor MainController', function() {

      beforeEach(function() {
        angular.mock.module('igor')
        config = {
          xbmc: {
            ip: '127.0.0.1', port: '9090'
          }
        };

      });

      it('should have the correct initial title', inject(function($controller) {
          var scope = {},
              ctrl = $controller(
                'MainController',
                {$scope:scope, $http:{}, witService:{}, xbmcRouter:{}, speech:{}}
                );

          expect(scope.title).toBe('Why Not?');
      }));
  });
});
