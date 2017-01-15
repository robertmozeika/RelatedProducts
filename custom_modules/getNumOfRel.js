const rpModel = require('../models/relatedProducts.js')
const spModel = require('../models/storeProducts.js')

class GetNumOfRel {
  constructor(res,shop){
    this.res = res;
    this.shop = shop;
  }
  init(){
    return new Promise((resolve,reject)=>{
       spModel.find({"store":this.shop}).lean()
       .then(result=>{
         if (result){
           return this.getRelatedProducts.call(this,result)
         } else {
           console.log('passing nothing at getRel');
           var passPromise = [res, []]
           resolve(passPromise)
         }
       })
       .then(result=>{
         console.log('passing promise?')
         const passPromise = [this.res, result, false, this.shop]
         resolve(passPromise)
       })
       .catch(err=>{
         this.storeFindError(err)
         reject(err)
       })
    })
  }

  storeFindError(err){
    console.log('Error at storeFind in getNumOfRel: ',err);
  }
  getRelatedProducts(inp){
    return new Promise((resolve, reject)=>{
       rpModel.find({"store":this.shop}).sort('order')
        .then(function(result){
          console.log('get hre?')

           var rpPass = {};
           if (result !== undefined){
            result.forEach((element)=>{
              if (rpPass[element.forProduct]){
                rpPass[element.forProduct].push(element.title)
              }
              else {
                rpPass[element.forProduct] = [element.title];
              }

            })


            inp.forEach(function(ele,index){
              ele.relatedProducts = rpPass[ele.productID];


            })
            resolve(inp);
           }
         else {
           console.log('passing nothing at getRel');

           var passPromise = [this.res, []]

           resolve(passPromise)
         }
       }).catch(function(err){
         console.log('Err at getRelatedProducts in getNumOfRel.js',err);
       })

  });

  }



}


module.exports = GetNumOfRel
