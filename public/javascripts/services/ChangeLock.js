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



  }])
