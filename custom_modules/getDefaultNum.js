const shopModel = require('../models/shops.js');

function getDefault(shop){
  return new Promise(function(resolve, reject){
     shopModel.find({"name": shop})
       .then(result=>{
         if (result.length > 0){
             var defaultNum = result[0].defaultNumOfRelated;
             var allMostBought = result[0].allMostBought;
             var header = result[0].header;
             var defNumPass = {
               defaultNum: defaultNum,
               allMostBought: allMostBought,
               header: header,
             }
             resolve(defNumPass)
         }
         else {
           console.log('passing nothing at getNumRel')
           //3 is the default chosen for new stores
           resolve(3)
         }
       }).catch(err=>{
         console.log("Error at getDefaultNum from renderMain ", err)
       });
  });

}


module.exports = getDefault;
