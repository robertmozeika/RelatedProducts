angular
  .module('app.directives.rpWindow',[])
  .directive('rpWindow', ['$uibModal', 'ChangeRP', function($uibModal, ChangeRP){
    return {
      restrict: 'E',
      scope: {
        rpWindowProduct: '=',
        products: '=',
      },
      template:'<div></div>',

      link: function(scope,element,attrs){
        scope.$watch('rpWindowProduct', function(){
          console.log(scope.rpWindowProduct)
          if (scope.rpWindowProduct){
            scope.modal()
          }

        }, true);

        scope.modal = function(){
            scope.theModal = $uibModal.open({
              animation: true,
              scope: scope,
              templateUrl: 'templates/rpWindow.html',
              close: scope.closeModal,
              controller: function($scope){

              }

            });
            scope.closeModal = function(){
              scope.theModal.dismiss();
            }

            scope.theModal.result.catch(function(){
                //Do stuff with respect to dismissal
                console.log('dismissed')
                scope.rpWindowProduct = false;
            });

        };

        scope.showProductSelection = false;
        scope.changeRP = function(index){
          console.log(scope.products);
          scope.showProductSelection = true;
          scope.order = index + 1;
        }

        scope.selectedProductToChange = null;

        scope.changeRPSelect = function(product){
          console.log(scope.rpWindowProduct)
          console.log(scope.order);
          console.log(product)
          ChangeRP.changeRP(scope.order,scope.rpWindowProduct.productID,product)
        }



      },

    }
  }])
