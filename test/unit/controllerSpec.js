describe('igor controllers', function() {

  describe('igor MainController', function() {

      beforeEach(module('igor'));

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
