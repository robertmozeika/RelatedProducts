angular
  .module('app.directives.popdelay',[])
  .directive('popdelay', ['$timeout', function($timeout){
    return {
      restrict: 'A',
      scope: {
        exampleVar: '=',
        popoverIsOpen: '=',
      },
      // template:'<div>Hello</div>',

      link: function(scope,element,attrs){
        function changeOpen(){
          if (scope.popoverIsOpen){
            scope.popoverIsOpen = false;
          }
        };
        scope.$watch('popoverIsOpen',function(input){
          $timeout(changeOpen,3000)
        })

      },

    }
  }])
