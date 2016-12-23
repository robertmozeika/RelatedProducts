var abModel = require('../models/alsoBoughtProducts');

function assignNewAB(products, allMostBought, shop){
  return new Promise ((resolve,reject)=>{
    if (allMostBought.indexOf(true) > -1){
      products.forEach((element)=>{
        abModel.find({forStore: shop, forProduct: element.productID})
          .then(function(doc){
            console.log('before doc')
            console.log(doc)
            console.log('this going first?')
            var leftovers = doc;
            var leftOversToReplace = [];
            var mostBoughtOrdered = {};
            for (var i = 0; i < allMostBought.length; i++){
              console.log('for going ifrst')
              mostBoughtOrdered[i+1] = {};

                console.log("leftovers")
                console.log(leftovers)
                console.log("leftovers over")

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
            resolve(mostBoughtOrdered)
          })
      })




      // allMostBought.forEach((element,index)=>{
      //   if (element){
      //     abModel.
      //   }
      // })
    }





  })
}


module.exports = assignNewAB;
