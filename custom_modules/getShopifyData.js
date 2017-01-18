var shopifyAPI = require('shopify-node-api');

//called from renderMain()
//[0] returns array of products from shopify with all collections added as a property in an array, [1] is array of all collections
class GetShopData {
  constructor(shopifyconfig){
    this.shopify = new shopifyAPI(shopifyconfig);
  }
  init(){
    return new Promise((resolve,reject)=>{
      Promise.all([
        this.getProducts(),
        this.getCustomCollections(),
        this.getSmartCollections(),
        this.getCollects(),
      ])
      .then(this.combineCollectionsAndProducts.bind(this))
      .then((data)=>{
        resolve(data);
      }).catch(err=>{
        console.log('Error at GetShopData from rendermain', err)
      })
    })
  }
  //gets product data from the shopify API
  getProducts(){
    return new Promise((resolve,reject)=>{
      this.shopify.get('/admin/products.json',  function(err, data, headers){
          if (err){
            console.log("reject is ", err)
            reject(err);
          } else {
            resolve(data.products)
          }
      });
    })
  }
  //gets custom collections from the shopify API (hand picked collections)
  getCustomCollections(){
    return new Promise((resolve,reject)=>{
      this.shopify.get('/admin/custom_collections.json', function(err, data, headers){
          if (err){
            console.log("reject is ", err)
            reject(err);
          } else {
            resolve(data.custom_collections)
          }
      });
    })
  }
  //gets smart collections from the shopify API (automatic generated collections)
  getSmartCollections(){
    return new Promise((resolve,reject)=>{
      this.shopify.get('/admin/smart_collections.json', function(err, data, headers){
          if (err){
            console.log("reject is " + err)
            reject(err);
          } else {
            resolve(data.smart_collections)
          }
      });
    })
  }
  //gets collects (objects that show connection between a single object and a single collections)
  getCollects(){
    return new Promise((resolve,reject)=>{
      this.shopify.get('/admin/collects.json', function(err, data, headers){
          if (err){
            console.log("reject is " + err)
            reject(err);
          } else {
            resolve(data.collects)
          }
      });
    })
  }
  combineCollectionsAndProducts([ products, custom_collections, smart_collections, collects ]){
    return new Promise((resolve,reject)=>{
      const collectionMap = this.createMap(custom_collections,smart_collections);
      const collectionArray = this.createArray(collectionMap);
      collects.forEach((collect)=>{
        var idx = this.findWithAttr(products,'id',collect.product_id);
        console.log(collect.collection_id,collectionMap.get(collect.collection_id),collectionMap)
        if (products[idx].collections){
          products[idx].collections.push(collectionMap.get(collect.collection_id))
        } else {
          products[idx].collections = [collectionMap.get(collect.collection_id)]
          products[idx].collections = products[idx].collections.sort()
        }
      })
      resolve([products,collectionArray])
    })
  }

  createMap(custom_collections,smart_collections){
    const collectionMap = new Map();
    custom_collections.forEach((element)=>{
      collectionMap.set(element.id,element.title)
    })
    smart_collections.forEach((element)=>{
      collectionMap.set(element.id,element.title)
    })
    return collectionMap;
  }
  createArray(collectionMap){
    const collectionArray = [];
    collectionMap.forEach((val)=>{
      collectionArray.push({value: val, display: val})
    })
    return collectionArray;
  }
  findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
          if(array[i][attr] === value) {
              return i;
          }
      }
      return -1;
  }

}


module.exports = GetShopData
