var shopifyAPI = require('shopify-node-api');
var mongodb = require('mongodb');

class AddAlsoBought {
  constructor(products2Add,shopifyconfig,productMap){
    this.products2Add = products2Add;
    this.shopify = new shopifyAPI(shopifyconfig);
    this.productMap = productMap;
  }
  init(){
    return new Promise((resolve,reject)=>{
      this.getOrders().then(data=>{
        resolve(this.createInsert(data));
      }).catch(err=>{
        console.log('error at AddAlsoBought')
        reject(err)
      })
    })
  }
  //retrieves orders from shopify api
  getOrders(){
    return new Promise((resolve,reject)=>{
      this.shopify.get('/admin/orders.json', function(err, data, headers){
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  createInsert(data){
    let alsoBoughtInsert = [];
    this.products2Add.forEach(toAddProduct=>{
      this._peopleWhoBought = this.createPeopleWhoBought(toAddProduct,data);
      const peopleWhoBoughtOrders = data.orders.filter(this.filterOutNonBuyers.bind(this));
      const productsAlsoBought = this.createAlsoBoughtOrders(peopleWhoBoughtOrders,toAddProduct);
      alsoBoughtInsert = alsoBoughtInsert.concat(this.singleProductAlsoBoughtInsert(productsAlsoBought,toAddProduct));
    })
    return alsoBoughtInsert;
  }
  //creates an array of all emails who bought the product at thend in createInsert for loop
  createPeopleWhoBought(toAddProduct,data){
    const peopleWhoBought = [];
    data.orders.forEach((element)=>{
      element.line_items.forEach((line)=>{
        if (line.product_id == toAddProduct.productID){
          peopleWhoBought.push(element.email);
        }
      })
    })
    return peopleWhoBought;
  }
  //filters out from the orders returned from shopify app of the people who never bought the productAtHand(toaddProduct)
  filterOutNonBuyers(value){
    return (this._peopleWhoBought.indexOf(value.email) > -1)
  }
  //creates raw list of all orders of people who bought that product before
  createAlsoBoughtOrders(peopleWhoBoughtOrders,toAddProduct){
    const productsAlsoBought = [];
    peopleWhoBoughtOrders.forEach((element)=>{
      element.line_items.forEach((item)=>{
        if (item.product_id !== toAddProduct.productID){
          productsAlsoBought.push(item)
        }
      })
    })
    return productsAlsoBought;
  }
  //turns raw orders into organized list such as {1: [product,product] 2: [product,product]}
  singleProductAlsoBoughtInsert(productsAlsoBought,toAddProduct){
    const singleProductAlsoBoughtInsert = [];
    productsAlsoBought.forEach((element)=>{
        const seenAlready = this.checkIfInInsertAlready(singleProductAlsoBoughtInsert,element,toAddProduct);
        if (seenAlready.seen){
          singleProductAlsoBoughtInsert[seenAlready.atIndex].howMany = singleProductAlsoBoughtInsert[seenAlready.atIndex].howMany + 1;
        } else {
          let store = element.vendor.replace(/ /g, "-");
          store = store.toLowerCase();
          if (this.productMap){
            let gotMap = this.productMap.get(element.product_id)
            var abObj = this.AbObjMap(toAddProduct,element,store,gotMap);
          } else {
            var abObj = this.AbObjNoMap(toAddProduct,element,store,this.products2Add)
          }
          //makes sure that the productAtHand(toAddProduct) isn't being added to itself as an also bought product
          if (abObj.forProduct !== abObj.productID){
            singleProductAlsoBoughtInsert.push(abObj)
          }
        }
    })
    return singleProductAlsoBoughtInsert;
  }
  //checks to see if it is in the insert already
  //if it is it will return where that product is in the insert so it can add plus one in the howmany property in the next step
  checkIfInInsertAlready(singleProductAlsoBoughtInsert,element,toAddProduct){
    var seenAlready = {};
    for(var j = 0; j < singleProductAlsoBoughtInsert.length; ++j) {
        if(singleProductAlsoBoughtInsert[j].productID == element.product_id && singleProductAlsoBoughtInsert[j].forProduct == toAddProduct.productID){
         seenAlready.seen = true;
         seenAlready.atIndex = j;
         return seenAlready;
       }
    }
    seenAlready.seen = false;
    seenAlready.atIndex = -1;
    return  seenAlready;
  }
  //template of what each individual products would look like inserted into the alsoBought DB
  //Map comes from addsproducts2db
  AbObjMap(toAddProduct,element,store,gotMap){
      const abObj = {
        store: store,
        forProduct: toAddProduct.productID.toString(),
        productID: element.product_id.toString(),
        title: gotMap.title,
        price:gotMap.price,
        handle:gotMap.handle,
        image: gotMap.image,
        howMany:1,
      }
      return abObj;
  }
  //will come from refresh products, when no map is passed
  AbObjNoMap(toAddProduct,element,store,products2Add) {
    var image;
    products2Add.some((imageSearch)=>{
      if (imageSearch.productID == element.product_id){
        image = imageSearch.image;
        return
      }
    })
    var abObj = {
      store: store,
      forProduct: productAtHand.productID.toString(),
      productID: element.product_id.toString(),
      title: element.title,
      price:element.price,
      image: image,
      howMany:1,
      handle: element.handle,
    }
    return abObj
  }
}


//
//
// function addAlsoBought(array, shopifyconfig,map){
//   return new Promise((resolve,reject)=>{
//       var alsoBoughtInsert = [];
//
//       var shopify = new shopifyAPI(shopifyconfig)
//
//       shopify.get('/admin/orders.json', function(err, data, headers){
//         if (err){
//           reject('error at shopify get orders')
//         }
//         array.forEach((productAtHand)=>{
//             //array of all emails who people who bought the item at hand
//             var peopleWhoBought = [];
//             data.orders.forEach((element)=>{
//               element.line_items.forEach((line)=>{
//                 if (line.product_id == productAtHand.productID){
//                   peopleWhoBought.push(element.email);
//                 }
//               })
//             })
//
//             function testPB(value){
//               return (peopleWhoBought.indexOf(value.email) > -1)
//             }
//
//             var peopleWhoBoughtOrders = data.orders.filter(testPB);
//
//             var productsAlsoBought = [];
//             peopleWhoBoughtOrders.forEach((element)=>{
//               element.line_items.forEach((item)=>{
//                 if (item.product_id !== productAtHand.productID){
//                   productsAlsoBought.push(item)
//                 }
//               })
//             })
//
//             productsAlsoBought.forEach((element)=>{
//
//                   var seen = false;
//                   var atIndex = -1;
//                   for(var j = 0; j < alsoBoughtInsert.length; ++j) {
//                       if(alsoBoughtInsert[j].productID == element.product_id && alsoBoughtInsert[j].forProduct == productAtHand.productID){
//                        seen = true;
//                        atIndex = j;
//                       }
//                   }
//                   if (seen){
//                     alsoBoughtInsert[atIndex].howMany = alsoBoughtInsert[atIndex].howMany + 1;
//                   } else {
//                     var store = element.vendor.replace(/ /g, "-");
//                     store = store.toLowerCase();
//
//
//                     if (map){
//                       let gotMap = map.get(element.product_id)
//                       var abObj = {
//                         store: store,
//                         forProduct: productAtHand.productID.toString(),
//                         productID: element.product_id.toString(),
//                         title: gotMap.title,
//                         price:gotMap.price,
//                         handle:gotMap.handle,
//                         image: gotMap.image,
//                         howMany:1,
//                       }
//                     } else {
//                       var image;
//                       array.some((imageSearch)=>{
//
//                         if (imageSearch.productID == element.product_id){
//                           image = imageSearch.image;
//                           return
//                         }
//                       })
//                       var abObj = {
//                         store: store,
//                         forProduct: productAtHand.productID.toString(),
//                         productID: element.product_id.toString(),
//                         title: element.title,
//                         price:element.price,
//                         image: image,
//                         howMany:1,
//                         handle: element.handle,
//                       }
//                     }
//                     if (abObj.forProduct !== abObj.productID){
//                       alsoBoughtInsert.push(abObj)
//                     }
//                   }
//
//
//             })
//
//
//         });
//         resolve(alsoBoughtInsert);
//
//       })
//   })
// }

module.exports = AddAlsoBought
