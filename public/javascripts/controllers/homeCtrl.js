angular
  .module('app')
  .controller('homeCtrl',['$scope', 'ChangeNR', function($scope, ChangeNR){

    //global variable from before scripts.min.js
    $scope.products = products;

    $scope.numbers = [1,2,3,4,5,6];

    //global variable from before scripts.min.js
    $scope.defaultNR = defaultNum;



    $scope.changeNR = ChangeNR.changeNR;

    $scope.changeDefaultNR = function(num, checked){
      ChangeNR.changeDefaultNR(num,checked);
      if (checked){
        $scope.products.forEach((product)=>{
          product.numOfRel = num;
        })
      }
    }

    $scope.rpWindowProduct = false;
    $scope.showRPWindow = function(product,index){
      $scope.rpWindowProduct = product;
      $scope.rpWindowProduct.index = index
    }



  }])
