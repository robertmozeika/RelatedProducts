angular
  .module('app')
  .controller('homeCtrl',['$scope', 'ChangeNR', 'HeaderService','$timeout', 'Tester', function($scope, ChangeNR, HeaderService,$timeout,Tester){
    //global variable from before scripts.min.js

    Tester.callMom();

    $scope.products = products;
    $scope.numbers = [1,2,3,4,5,6];


    //global variable from before scripts.min.js
    $scope.defaultNR = defaultNum.defaultNum;



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
    $scope.showRPWindow = function(product){
      $scope.rpWindowProduct = product;
    }

    $scope.setAllChecked = defaultNum.allMostBought;


    $scope.setAllMostBought = function(checked){
      ChangeNR.setAllMostBought(checked).then(function(data){
        data.finder.forEach((element,index)=>{
          var productIndex = products.findIndex(x => x.productID==element.forProduct);
          if (products[productIndex].locks[element.order] == false){
            products[productIndex].relatedProducts[element.order] = data.setter[index].title;
          }
        })


      })
    };

    $scope.settings = {show: false };

    $scope.openSettings = function(){
      $scope.settings.show = !$scope.settings.show;
      console.log($scope.settings.show)
    }

    $scope.headerValues = HeaderService.getValues();


    $scope.checkedProducts = [];

    $scope.checkProduct = function(product,idx){
      console.log('ngchange fired')
      if($scope.checkModel[idx]){
        $scope.checkedProducts.push(product);
      } else {
        let index = $scope.checkedProducts.indexOf(product);
        $scope.checkedProducts.splice(index,1)
      }
      console.log($scope.checkedProducts)
    }

    $scope.checkAllModel = false;

    $scope.checkAll = function(){
      console.log($scope.checkAllModel)
      if($scope.checkAllModel){
        products.forEach((element)=>{
          if($scope.checkMap.get(element.productID)){
            console.log('already checked')
          } else {
            $scope.checkMap.set(element.productID, true);
            $scope.checkedProducts.push(element)
          }

        })
      } else {
        $scope.checkMap.forEach((value,key,map)=>{
          $scope.checkMap.set(key, false);
          $scope.checkedProducts = [];
        })
      }
      console.log($scope.checkMap)
      console.log($scope.checkedProducts);

    }

    $scope.checkMap = new Map();
    products.forEach((element)=>{
      $scope.checkMap.set(element.productID, false)
    })
    console.log($scope.checkMap);

    $scope.changeCheck = function(product){
      $('#checkAll').prop("indeterminate", true);

      $scope.checkMap.set(product.productID, !$scope.checkMap.get(product.productID));
      console.log($scope.checkMap.get(product.productID));

      if($scope.checkMap.get(product.productID)){
        $scope.checkedProducts.push(product);
      } else {
        let index = $scope.checkedProducts.indexOf(product);
        $scope.checkedProducts.splice(index,1)
      }
      console.log($scope.checkedProducts)

    }

    $scope.returnCheck = function(id){
      return $scope.checkMap.get(id)
    }



    // $scope.$watch('checkModel')






  }])




// db.shops.update({"name":"test-store-1994-1994"},{$set:{"allMostBought":[true,false,true,false,true,false]}})
.directive('popoverAutoclose', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var timeoutHandle;

      scope.$watch('tt_isOpen', function (isOpen) {
        $timeout.cancel(timeoutHandle);

        if (isOpen) {
          timeoutHandle = $timeout(function () {
            scope.tt_isOpen = false;
          }, +attrs.popoverAutoclose || 2000);
        }
      });
    }
  }
});
