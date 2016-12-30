
angular
  .module('app')
  .service('HeaderService', ["$http", function($http){

      this.header = defaultNum.header;

      this.getValues = (()=>{
        return this;
      });

      this.setHeader = ((newHead)=>{
        $http.get('/setHeader?header=' + newHead);
      });

      // function(input){
      //   var postData = {
      //     productID: input.productID,
      //     numOfRel: input.numOfRel
      //   }
      //   return $http.post('/changeNR', postData)
      // };





  }])
