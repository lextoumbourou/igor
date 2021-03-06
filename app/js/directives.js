'use strict';

/* Directives */

angular.module('igor.directives', []).
  directive('ngEnter', function() {
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
  })
  .directive('autoGrow', function() {
    return function(scope, element, attrs) {
      element.bind('keyup', function(event) {
        if (this.scrollHeight > this.clientHeight) {
          this.style.height = this.scrollHeight + 'px';
        }
      });
    }
  })
  .directive('skrollr', function() {
    return function() {
      skrollr.init();
    };
  })
  .directive('resizeOnWindow', function($window) {
    return function(scope) {
      scope.initScopeWindowSize = function() {
        scope.windowHeight = $window.innerHeight;
        scope.windowWidth = $window.innerWidth;
      }

      scope.initScopeWindowSize();

      angular.element($window).bind('resize', function() {
        scope.initScopeWindowSize();
        return scope.$apply();
      });
    }
  }); 
