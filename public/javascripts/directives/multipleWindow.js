const TIMEOUT  = new WeakMap();
const UIBMODAL = new WeakMap();
const CHANGERP = new WeakMap();

class multipleWindow {
  constructor($uibModal,$timeout,ChangeRP){
    // this.templateUrl = '../templates/multipleWindow.html';
    this.template = '<div></div>';
    this.restrict = 'E';
    this.scope = false;
    UIBMODAL.set(this,$uibModal);
    TIMEOUT.set(this,$timeout);
    CHANGERP.set(this,ChangeRP);

  }

  link(scope){
    scope.owLocks = {checked: false,};
    scope.showOW = function(){
      console.log(scope.owLocks)
    }
    // $timeout(function(){console.log('im happy')},2000)
    scope.openModal = function(){
      scope.modal();
    }
    // scope.$watch('checkedProducts',function(){
    //   console.log('changed');
    //   scope.modal();
    // }, true)
    scope.changeMultipleRP = function(products,order,product){
      console.log('ow',scope.owLocks)
      CHANGERP.get(multipleWindow.instance).changeMultipleRP(products,order,product,scope.owLocks.checked).then((data)=>{
        if (scope.owLocks.checked){
          console.log('doing this')
          scope.checkedProducts.forEach((element)=>{
            console.log('changed')
            element.relatedProducts[order] = product.title;
          })
        } else {
          scope.checkedProducts.forEach((element)=>{
            if (!element.locks[order]){
              element.relatedProducts[order] = product.title;
            }
          })
        }

      }).catch((error)=>{
        console.log(error)
      });
    }
    scope.number = 6;
    scope.getNumber = function(num) {
        return new Array(num);
    }
    scope.modal = function(){
        scope.theModal = UIBMODAL.get(multipleWindow.instance).open({
          animation: true,
          scope: scope,
          templateUrl: 'templates/multipleWindow.html',
          close: scope.closeModal,
          controller: function($scope){

          }

        });
        scope.closeModal = function(){
          scope.theModal.dismiss();
        }

        // scope.theModal.result.catch(function(){
        //     //Do stuff with respect to dismissal
        //     console.log('dismissed');
        //     scope.showProductSelection = false;
        //     scope.order = -1;
        //     scope.rpWindowProduct = false;
        //
        //
        //
        //
        //
        // });

    };
    scope.selectedWPOrder = null;
    scope.setWPOrder = function(num){
      console.log(num)
      scope.selectedWPOrder = num;
      console.log(scope.selectedWPOrder)
    }
  }
  static directiveFactory($uibModal,$timeout,ChangeRP){
    multipleWindow.instance =  new multipleWindow($uibModal,$timeout,ChangeRP);
    return multipleWindow.instance;
  }

}

multipleWindow.directiveFactory.$inject = ['$uibModal','$timeout','ChangeRP'];

// export default multipleWindow
//
//
angular
  .module('app.directives.multipleWindow',[])
  .directive('multipleWindow', multipleWindow.directiveFactory)
//     return {
//       restrict: 'E',
//       scope: false,
//       template:'<div>Funn!!!</div>',
//     }
//   }])
//
//   console.log('finding this???!?!')
