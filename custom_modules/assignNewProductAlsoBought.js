var abModel = require('../models/alsoBoughtProducts');
var rpModel = require('../models/relatedProducts');


class AssignNewAB {
  constructor(products,allMostBoughtArr, shop, abInsert){
    this.products = products;
    this.allMostBoughtArr = allMostBoughtArr;
    this.shop = shop;
    this.abInsert = abInsert;
    this._insert2RP = [];
  }
  init(){
    return new Promise((resolve,reject)=>{
      this.insertABtoDB();
      if (this.allMostBoughtArr.indexOf(true) > -1 && this.abInsert){
        const mostBoughtOrdered = this.orderMostBought();
        let trackMostBought = 0;
        this.allMostBoughtArr.forEach((mb,index)=>{
          //mb is true if the user picked that spot in related products to be automatically set to a most bought product
          if (mb){
            trackMostBought++;
            this.fillCheckedMostBoughtSpot(mostBoughtOrdered,trackMostBought,index)
          } else {
            this.fillUnCheckedMostBoughtSpot(index);
          }
        })
      } else {
        this.noAllMBorInsert();
      }
      rpModel.insertMany(this._insert2RP)
        .catch(function(err){
          console.log('Error at assignNewProducts: Inserting related products: ', err);
          reject(err)
        })
      //sends products back now that they have the related products arr attached, will be combined with all the products already in db
      resolve(this.products)


    })
  }
  //inserts into alsoMostBoughtDB products from data returned from addAlsoBought
  insertABtoDB(){
    if (this.abInsert.length){
      abModel.insertMany(this.abInsert)
        .catch(err=>{
          console.log('Error: assignNewProducts inserting also boughts: ',err);
          reject(err)
        })
    }
  }
  //takes all abInserts, and orders them from most to least for each main product to add
  //{ 'productID':
  // 1:
  //   'mostBought'}
  orderMostBought(){
    let leftovers = this.abInsert;
    let leftOversToReplace = [];
    const mostBoughtOrdered = {};
    for (var i = 0; i < this.allMostBoughtArr.length; i++){
      mostBoughtOrdered[i+1] = {};


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
    return mostBoughtOrdered;
  }
  //makes insert for relatedProducts db AND attaches array of related product to main product entry (one that goes into store products, and passes to client ejs)
  fillCheckedMostBoughtSpot(mostBoughtOrdered,trackMostBought,index){
    this.products.forEach((product)=>{
      if (!product.locks[index]){
          if (!product.relatedProducts){
            product.relatedProducts = [];
          }
          if (mostBoughtOrdered[trackMostBought][product.productID]){
            var currentEntry = mostBoughtOrdered[trackMostBought][product.productID]
            product.relatedProducts[index] = currentEntry.title;
            var insObj = this.RelatedProductInsert(product,index,currentEntry)
          } else {
            product.relatedProducts[index] = "blank";
            var insObj = this.RelatedProductInsert(product,index)
          }
          this._insert2RP.push(insObj)

      }
    })
  }
  fillUnCheckedMostBoughtSpot(index){
    this.products.forEach((product)=>{
        if (!product.locks[index]){
            if (!product.relatedProducts){
              product.relatedProducts = [];
            }
            product.relatedProducts[index] = "blank";
            var insObj = this.RelatedProductInsert(product,index)
            this._insert2RP.push(insObj)
        }
    })
  }
  //just adds all blanks to related products and the inner arr of the products sent to client ejs
  noAllMBorInsert(){
    this.products.forEach((product)=>{
      for (var i = 0; i < 6; i++){

        if (!product.locks[i]){
          if (!product.relatedProducts){
            product.relatedProducts = [];
          }
          product.relatedProducts[i] = "blank";
          var insObj = this.RelatedProductInsert(product,index)
          this._insert2RP.push(insObj)
        }
      }
    })
  }
  RelatedProductInsert(product,index,currentEntry){
    if (!currentEntry){
      currentEntry = {};
    }
    const obj = {
      store: this.shop,
      forProduct: product.productID,
      productID: (currentEntry.productID || "blank"),
      title: (currentEntry.title || "blank"),
      order: index,
      image: (currentEntry.image || null),
      locked: false,
      price: (currentEntry.price || null),
      handle: (currentEntry.handle || null),
    }
    return obj;

  }


}

function assignNewAB(products, allMostBought, shop,ab2Add){
  return new Promise ((resolve,reject)=>{
    if(ab2Add.length){
      abModel.insertMany(ab2Add)
        .catch(function(err){
          console.log('Error: assignNewProducts inserting also boughts: ',err)
        });
    }

    var insert2RP = [];

    if (allMostBought.indexOf(true) > -1 && ab2Add){
            var leftovers = ab2Add;
            var leftOversToReplace = [];
            var mostBoughtOrdered = {};
            for (var i = 0; i < allMostBought.length; i++){
              mostBoughtOrdered[i+1] = {};


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



          let trackMostBought = 0;
          allMostBought.forEach((mb,index)=>{
            if (mb){
              trackMostBought++;
              products.forEach((product)=>{
                if (!product.locks[index]){
                    if (!product.relatedProducts){
                      product.relatedProducts = [];


                    }
                    if (mostBoughtOrdered[trackMostBought][product.productID]){
                      var currentEntry = mostBoughtOrdered[trackMostBought][product.productID]
                      product.relatedProducts[index] = currentEntry.title;
                      var insObj = {
                        store: shop,
                        forProduct: product.productID,
                        productID: currentEntry.productID,
                        title: currentEntry.title,
                        order: index,
                        image: currentEntry.image,
                        locked: false,
                        price: currentEntry.price,
                        handle: currentEntry.handle,
                      };
                      insert2RP.push(insObj)
                    } else {
                      product.relatedProducts[index] = "blank";
                      var insObj = {
                        store: shop,
                        forProduct: product.productID,
                        productID: "blank",
                        title: "blank",
                        order: index,
                        image: null,
                        locked: false,
                        price: null,
                        handle: null,
                      };
                      insert2RP.push(insObj)
                    }
                }
              })
            }
            else {

                products.forEach((product)=>{
                    if (!product.locks[index]){
                        if (!product.relatedProducts){
                          product.relatedProducts = [];
                        }
                        product.relatedProducts[index] = "blank";
                        var insObj = {
                          store: shop,
                          forProduct: product.productID,
                          productID: "blank",
                          title: "blank",
                          order: index,
                          image: null,
                          locked: false,
                          handle: null,
                        };
                        insert2RP.push(insObj)
                    }
                })
            }
            //left off here
          })
        } else {
          products.forEach((product)=>{
            for (var i = 0; i < 6; i++){

              if (!product.locks[i]){
                if (!product.relatedProducts){
                  product.relatedProducts = [];
                }
                product.relatedProducts[i] = "blank";
                var insObj = {
                  store: shop,
                  forProduct: product.productID,
                  productID: "blank",
                  title: "blank",
                  order: i,
                  image: null,
                  locked: false,
                  handle: null,
                };
                insert2RP.push(insObj)

              }
            }
          })
        }



          rpModel.insertMany(insert2RP)
            .catch(function(err){
              console.log('Error at assignNewProducts: Inserting related products: ', err)
            })
          resolve(products)


  })
}


module.exports = AssignNewAB;

// db.alsoBoughtProducts.remove({"forProduct":"7881883408"})
// db.StoreProducts.remove({"productID":"7881883408"})
// db.alsoBoughtProducts.remove({"forProduct":"7882724688"})
// db.StoreProducts.remove({"productID":"7882724688"})
