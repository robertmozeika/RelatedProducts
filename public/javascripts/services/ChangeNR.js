
angular
  .module('app')
  .service('ChangeNR', ["$http", function($http){

      this.changeNR = function(input){
        var postData = {
          productID: input.productID,
          numOfRel: input.numOfRel
        }
        return $http.post('/changeNR', postData)
      };

      this.changeDefaultNR = function(input,checked){
        return $http.get('/changeNR?num=' + input + '&checked=' + checked)
      }

      this.setAllMostBought = function(checked){
        var postData = {
          checked: checked,
        }
        return $http.post('/setAllMostBought', postData)
      }



  }])
