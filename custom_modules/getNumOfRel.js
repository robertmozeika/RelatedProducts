var mongodb = require('mongodb');
const rpModel = require('../models/relatedProducts.js')
const spModel = require('../models/storeProducts.js')


function getRelatedProducts(inp, shop){
  return new Promise(function(resolve, reject){
     rpModel.find({"store":shop}).sort('order')
      .then(function(result){
         var rpPass = {};
         if (result !== undefined){
          console.log("connection successful at getRel")
          result.forEach((element)=>{
            if (rpPass[element.forProduct]){
              rpPass[element.forProduct].push(element.title)

            }
            else {
              rpPass[element.forProduct] = [element.title];
            }

          })

          console.log('$inp1',inp)
          var newResult = [];
          var objArr = [{name:'bob'}]
          inp.forEach(function(ele,index){
            ele.relatedProducts = rpPass[ele.productID];
            console.log('**',rpPass[ele.productID])
            newResult.push(ele)
            newResult[index]["relatedProducts"] = rpPass[ele.productID];

          })
          // inp[0].relatedProducts = ['bark']
          console.log('$inp2',inp);

          resolve(rpPass);



         }
       else {
         console.log('passing nothing at getRel');

         var passPromise = [res, []]

         resolve(passPromise)

       }


     }).catch(function(err){
       console.log('Err at getRelatedProducts in getNumOfRel.js',err);
     })

});

}

function getNumOfRel(res, shop){
  return new Promise(function(resolve, reject){

     spModel.find({"store":shop}).lean()
      .then(function(result){
         if (result !== undefined){
           let result2 = result;
          getRelatedProducts(result2, shop).then(function(inp){
            console.log('pimp',inp)
            var passPromise = [res, result, inp, shop]
            resolve(passPromise)
          })


         }
       else {
         console.log('passing nothing at getNumRel')
         var passPromise = [res, []]

         resolve(passPromise)

       }


     }).catch(err=>{
       console.log('Err at getNumOfRel in getNumOfRel.js',err);
     });

});

}




module.exports = getNumOfRel
