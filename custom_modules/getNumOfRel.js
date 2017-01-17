const rpModel = require('../models/relatedProducts.js')
const spModel = require('../models/storeProducts.js')


//Promise called by renderMain;
//Retrieves all products from storeproducts DB then adds the related products in an array onto the product object
//Product array will be passed as the main products array to the client via ejs
class GetNumOfRel {
  constructor(res,shop){
    this.res = res;
    this.shop = shop;
  }
  init(){
    return new Promise((resolve,reject)=>{
       spModel.find({"store":this.shop}).lean()
       .then(result=>{
         console.log('result',result)

         if (result){
           console.log(result)
           return this.getRelatedProducts.call(this,result)
         } else {
           console.log('passing nothing at getRel');
          //  var passPromise = [res, []]
           resolve([])
         }
       })
       .then(result=>{
         resolve(result)
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
  //retrieves related products and adds them to main product array from storeproductsdb
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

           resolve([])
         }
       }).catch(function(err){
         console.log('Err at getRelatedProducts in getNumOfRel.js',err);
       })

  });

  }



}


module.exports = GetNumOfRel
