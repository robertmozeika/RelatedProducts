angular
  .module('app')
  .service('ChangeLock', ["$http", function($http){

      this.changeLock = function(index){
        console.log(this.rpWindowProduct.locks);
        this.noNewModal = true;

        var pIdx = this.products.indexOf(this.rpWindowProduct);
        var bool = !this.products[pIdx].locks[index]
        this.products[pIdx].locks[index] = bool;

        var postData = {
          bool: bool,
          productID: this.rpWindowProduct.productID,
          index: index,
        }
        $http.post('/changeLock', postData).then(function(data){
          console.log(data)
        })

      }

      this.changeWPLock = function(index,bool){
        // this.noNewModal = true;

        this.checkedProducts.forEach((product)=>{
          var pIdx = this.products.indexOf(product);
          this.products[pIdx].locks[index] = bool;
        })


        let productIDs = [];

        this.checkedProducts.forEach((element)=>{
          productIDs.push(element.productID)
        })


        var postData = {
          bool,
          productIDs: productIDs,
          index: index,
        }
        $http.post('/changeLock/multiple', postData).then(function(data){
          console.log(data)
        })
      }





  }])
