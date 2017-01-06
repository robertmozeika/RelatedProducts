angular
  .module('app')
  .service('ChangeRP', ["$http", function($http){

      this.changeRP = function(order,productID, newProduct){
        var postData = {
          order: order,
          productID: productID,
          newProduct: newProduct,
        }
        console.log(postData)
        return $http.post('/changeRP', postData)
      };

      this.getBP = function(product){
        return $http.get('/changeRP?productID=' + product).then(function(response){
          return response.data;
        })
      }

      this.changeMultipleRP = function(products,order,product){
        console.log(products,order, product);
        const { productID, image, title } = product;
        console.log(productID,image)
        const postData = {
          products,
          order,
          productID,
          image,
          title,
          // productID,
        }
        return $http.post('/changeRP/multiple', postData)

      }





  }])
