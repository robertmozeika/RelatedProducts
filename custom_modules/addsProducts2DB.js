var mongodb = require('mongodb');
var getNumOfRel = require('./getNumOfRel.js');
var AddAlsoBought = require('./addAlsoBought');
var AssignNewAB = require('./assignNewProductAlsoBought');
const spModel = require('../models/storeProducts.js')

function ProductInsert(product,image,defaultNum,shop){
    this.productID  = product.id.toString();
    this.title = product.title;
    this.numOfRel = defaultNum;
    this.store = shop;
    this.image = image;
    this.price = product.variants[0].price;
    this.handle = product.handle;
    this.locks = [false,false,false,false,false,false];
    this._collections = product.collections;
}

class AddProducts2DB {
  constructor([ dbProducts, shopData, defaultNum ], shop, shopify){
    this.dbProducts = dbProducts;
    this.shopData = shopData;
    this.shopProducts = shopData[0];
    this.collectionArr = shopData[1];
    this.defaultNum = defaultNum;
    this.shop = shop;
    this.shopify = shopify;
    this.referenceMap = new Map();
    this.products2Add = this.createProducts2Add();
  }
  init(){
    return new Promise((resolve,reject)=>{
      if (this.products2Add.length){
        this.dbProducts = this.dbProducts.concat(this.products2Add);
        const addAlsoBought = new AddAlsoBought(this.products2Add, this.shopify,this.referenceMap)
        Promise.all([
          spModel.insertMany(this.products2Add),
          addAlsoBought.init(),
        ])
        .then(function(data){
          const assignNewAB = new AssignNewAB(this.products2Add, this.defaultNum.allMostBought, this.shop,data[1]);
          //assigns new products their related products (if most bought positions are checked those will automatically be filled in), also gives them their related products arr as property
          return assignNewAB.init()
        }.bind(this)).then(function(data){
          //now dbProducts will have relatedproducts arr  as a property
          resolve([this.dbProducts,this.defaultNum,this.collectionArr])
        }.bind(this)).catch(function(err){
          console.log('error at addProducts2DB', err)
        })
      } else {
        resolve([this.dbProducts,this.defaultNum,this.collectionArr])
      }
    })
  }
  createProducts2Add(){
    const products2Add = [];
    if (this.dbProducts){
      this.shopProducts.forEach(shopProd=>{
        let need2add = true;
        this.dbProducts.forEach((currentDb) => {
          if (shopProd.id == currentDb.productID){
            need2add = false;
            return
          }
        })
        if (need2add == true){
          const image = this.makeImageString(shopProd.image)
          this.referenceMap.set(shopProd.id, {price:shopProd.variants[0].price, title:shopProd.title, handle:shopProd.handle, image:image,});
          const productInsert = new ProductInsert(shopProd,image,this.defaultNum.defaultNum,this.shop);
          products2Add.push(productInsert)
        }
      })
      return products2Add
    } else {
      return null;
    }
  }
  //Returns imade link with __medium added to reduce load time on the store
  //or returns null if no image was actually passed
  makeImageString(image){
    if (image){
      image = image.src
      var num = this.findExtIndex(image)
      if (num > -1){
        return [image.slice(0,num), "_medium", image.slice(num)].join('');
      }
    }
    else{
      return null;
    }
  }
  //returns index of a img filetype in an image link string
  findExtIndex(word){
    var ext = ['.jpg','.jpeg','.png','.gif'];
    var returnIndex = null;
    ext.some(function(element){
      var index = word.indexOf(element);
      if (index > -1){
        returnIndex = index;
        return
      }
    })
    if (returnIndex){
      return returnIndex
    } else {
      return null;
    }
  }
}

module.exports = AddProducts2DB
