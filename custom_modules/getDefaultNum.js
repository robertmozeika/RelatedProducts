const shopModel = require('../models/shops.js');

//gets default number of related products the user set, or sets it to 3 if they don't have a profile set up yet
function getDefault(shop){
  return new Promise(function(resolve, reject){
     shopModel.find({"name": shop})
       .then(result=>{
         if (result.length > 0){
             const { defaultNumOfRelated, allMostBought, header } = result[0];
             const defNumPass = {
               defaultNum: defaultNumOfRelated,
               allMostBought,
               header,
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
