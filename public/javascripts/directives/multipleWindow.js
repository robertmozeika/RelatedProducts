const TIMEOUT  = new WeakMap();
const UIBMODAL = new WeakMap();
const CHANGERP = new WeakMap();
const CHANGELOCK = new WeakMap();


class multipleWindow {
  constructor($uibModal,$timeout,ChangeRP,ChangeLock){
    // this.templateUrl = '../templates/multipleWindow.html';
    this.template = '<div></div>';
    this.restrict = 'E';
    this.scope = false;
    UIBMODAL.set(this,$uibModal);
    TIMEOUT.set(this,$timeout);
    CHANGERP.set(this,ChangeRP);
    CHANGELOCK.set(this,ChangeLock);


  }

  link(scope){
    scope.owLocks = {checked: false,};
    scope.showOW = function(){
      console.log(scope.owLocks)
    }
    scope.wpPopEnable = function(){
      if (scope.checkedProducts.length){
        return false;
      } else {
        return true;
      }
    };
    // $timeout(function(){console.log('im happy')},2000)
    scope.openModal = function(){
      if (!scope.checkedProducts.length){

      } else {
        // scope.changeMultiplePop = false;
        scope.modal();

      }
    }


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
    scope.setWPBlank = function(products,order){
      // scope.noNewModal = true;
      let blankProduct = {
        productID: "blank",
        title: "blank",
        image: null,
        price: null,
      }
      CHANGERP.get(multipleWindow.instance).changeMultipleRP(products,order,blankProduct,scope.owLocks.checked).then((data)=>{
        if (scope.owLocks.checked){
          console.log('doing this')
          scope.checkedProducts.forEach((element)=>{
            console.log('changed')
            element.relatedProducts[order] = "blank";
          })
        } else {
          scope.checkedProducts.forEach((element)=>{
            if (!element.locks[order]){
              element.relatedProducts[order] = "blank";
            }
          })
        }

      }).catch((error)=>{
        console.log(error)
      });
      //
      // ChangeRP.changeRP(index,scope.rpWindowProduct.productID,blankProduct);
      // var index = scope.products.indexOf(scope.rpWindowProduct);
      // scope.products[index].relatedProducts[scope.order] = "blank";


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

        scope.theModal.result.catch(function(){
            //Do stuff with respect to dismissal
            console.log('dismissed');
            scope.selectedWPOrder = -1;
        });

    };

    scope.getWPPopTitle = function(){
      if (scope.selectedWPOrder > -1){
        console.log(scope.selectedWPOrder)
        return "Product Changed"
      } else {
        return "No Product Selected"
      }
    }
    scope.selectedWPOrder = -1;
    scope.setWPOrder = function(num){
      console.log(num)
      scope.selectedWPOrder = num;
      console.log(scope.selectedWPOrder)
    }

    scope.changeWPLock = CHANGELOCK.get(multipleWindow.instance).changeWPLock.bind(scope);



  }
  static directiveFactory($uibModal,$timeout,ChangeRP,ChangeLock){
    multipleWindow.instance =  new multipleWindow($uibModal,$timeout,ChangeRP,ChangeLock);
    return multipleWindow.instance;
  }

}

multipleWindow.directiveFactory.$inject = ['$uibModal','$timeout','ChangeRP','ChangeLock'];

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
