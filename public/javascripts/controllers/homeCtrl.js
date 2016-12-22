angular
  .module('app')
  .controller('homeCtrl',['$scope', 'ChangeNR', function($scope, ChangeNR){

    //global variable from before scripts.min.js
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
          products[productIndex].relatedProducts[element.order - 1] = data.setter[index].title;
        })


      })
    };





  }])


// db.shops.update({"name":"test-store-1994-1994"},{$set:{"allMostBought":[true,false,true,false,true,false]}})
