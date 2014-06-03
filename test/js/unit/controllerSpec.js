describe('igor controllers', function() {

  describe('MainController', function() {

      beforeEach(module('whyApp'));

      it('should have the correct initial title', inject(function($controller) {
          var scope = {},
              ctrl = $controller('MainController', {$scope:scope});

          expect(scope.title).toBe('Why Not?');
      }));
  });
});
