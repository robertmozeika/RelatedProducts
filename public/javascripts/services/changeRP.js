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

      this.changeMultipleRP = function(products,order,product,ow){
        console.log(products,order, product);
        const { productID, image, title, price } = product;
        console.log(productID,image)
        const postData = {
          products,
          order,
          productID,
          image,
          title,
          ow,
          price,
        }
        return $http.post('/changeRP/multiple', postData)

      }





  }])
