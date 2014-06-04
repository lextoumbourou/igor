describe('igor controllers', function() {

  describe('igor MainController', function() {

      beforeEach(module('igor'));

      it('should have the correct initial title', inject(function($controller) {
          var scope = {},
              ctrl = $controller('MainController', {$scope:scope});

          expect(scope.title).toBe('Why Not?');
      }));
  });
});
