angular
  .module('app')
  .controller('homeCtrl',['$scope', 'ChangeNR', 'HeaderService','$timeout', 'Tester', function($scope, ChangeNR, HeaderService,$timeout,Tester){
    //global variable from before scripts.min.js

    Tester.callMom();

    $scope.products = products;
    console.log(products)
    $scope.numbers = [1,2,3,4,5,6];


    //global variable from before scripts.min.js
    $scope.defaultNR = defaultNum.defaultNum;
    console.log(defaultNum)



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
        console.log(data)
        data.finder.forEach((element,index)=>{
          var productIndex = products.findIndex(x => x.productID==element.forProduct);
          products[productIndex].relatedProducts[element.order] = data.setter[index].title;
        })


      })
    };

    $scope.settings = {show: false };

    $scope.openSettings = function(){
      $scope.settings.show = !$scope.settings.show;
      console.log($scope.settings.show)
    }

    $scope.headerValues = HeaderService.getValues();





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
