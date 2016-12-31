var abModel = require('../models/alsoBoughtProducts');
var rpModel = require('../models/relatedProducts');


function assignNewAB(products, allMostBought, shop,ab2Add){
  return new Promise ((resolve,reject)=>{

    abModel.insertMany(ab2Add);
    if (allMostBought.indexOf(true) > -1 && ab2Add){
      // console.log('products',products);
      // console.log('ab2Add',ab2Add)
      // products.forEach((ele)=>{


            var leftovers = ab2Add;
            var leftOversToReplace = [];
            var mostBoughtOrdered = {};
            for (var i = 0; i < allMostBought.length; i++){
              mostBoughtOrdered[i+1] = {};

                // console.log("leftovers")
                // console.log(leftovers)
                // console.log("leftovers over")

              leftovers.forEach((element)=>{
                if(mostBoughtOrdered[i+1][element.forProduct]){

                  if (element.howMany > mostBoughtOrdered[i+1][element.forProduct]["howMany"]){
                    leftOversToReplace.push(mostBoughtOrdered[i+1][element.forProduct])
                    mostBoughtOrdered[i+1][element.forProduct] = element;
                  } else {
                    leftOversToReplace.push(element)
                  }


                } else{
                  mostBoughtOrdered[i+1][element.forProduct] = element;
                }
              })
              leftovers = leftOversToReplace;
              leftOversToReplace = [];

            }

          // })
          // console.log('$$')
          // console.log(mostBoughtOrdered)
          // resolve(mostBoughtOrdered)

          var trackMostBought = 0;
          var insert2RP = [];
          allMostBought.forEach((mb,index)=>{
            if (mb){
              trackMostBought++;
              products.forEach((product)=>{
                if (!product.relatedProducts){
                  product.relatedProducts = [];


                }
                if (mostBoughtOrdered[trackMostBought][product.productID]){
                  var currentEntry = mostBoughtOrdered[trackMostBought][product.productID]
                  product.relatedProducts[index] = currentEntry.title;
                  var insObj = {
                    forStore: shop,
                    forProduct: product.productID,
                    productID: currentEntry.productID,
                    title: currentEntry.title,
                    order: index,
                    image: currentEntry.image,
                  };
                  insert2RP.push(insObj)
                } else {
                  product.relatedProducts[index] = "blank";
                  var insObj = {
                    forStore: shop,
                    forProduct: product.productID,
                    productID: "blank",
                    title: "blank",
                    order: index,
                    image: "none",
                  };
                  insert2RP.push(insObj)
                }
              })
            } else {

                products.forEach((product)=>{
                  if (!product.relatedProducts){
                    product.relatedProducts = [];
                  }
                  product.relatedProducts[index] = "blank";
                  var insObj = {
                    forStore: shop,
                    forProduct: product.productID,
                    productID: "blank",
                    title: "blank",
                    order: index,
                    image: "none",
                  };
                  insert2RP.push(insObj)

                })
            }
          })
          rpModel.insertMany(insert2RP);
          resolve(products)
      }

      else {
        resolve('nothing')
      }

  })
}


module.exports = assignNewAB;

// db.alsoBoughtProducts.remove({"forProduct":"7881883408"})
// db.StoreProducts.remove({"productID":"7881883408"})
// db.alsoBoughtProducts.remove({"forProduct":"7882724688"})
// db.StoreProducts.remove({"productID":"7882724688"})
