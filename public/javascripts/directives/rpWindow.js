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

          if (scope.rpWindowProduct && !scope.noNewModal){

            ChangeRP.getBP(scope.rpWindowProduct.productID).then(function(data){
              scope.alsoBought = data;
              console.log(scope.alsoBought)
            });
            // console.log(scope.alsoBought)
            scope.modal();
          }
          scope.noNewModal = false;


        }, true);

        scope.getAlsoBought = function(){
          if (scope.alsoBought){
            return scope.alsoBought
          }
        }
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
                console.log('dismissed');
                scope.showProductSelection = false;
                scope.order = -1;
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
          scope.noNewModal = true;
          ChangeRP.changeRP(scope.order,scope.rpWindowProduct.productID,product);
          var index = scope.products.indexOf(scope.rpWindowProduct);
          scope.products[index].relatedProducts[scope.order - 1] = product.title;



        }



      },

    }
  }])
