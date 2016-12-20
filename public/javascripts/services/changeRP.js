angular
  .module('app')
  .service('ChangeRP', ["$http", function($http){

      this.changeRP = function(order,productID, newProduct){
        var postData = {
          order: order,
          productID: productID,
          newProduct: newProduct,
        }
        return $http.post('/changeRP', postData)
      };




  }])
