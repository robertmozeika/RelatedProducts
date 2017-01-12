var shopifyAPI = require('shopify-node-api');
var mongodb = require('mongodb');


function addAlsoBought(array, shopifyconfig,map){
  return new Promise((resolve,reject)=>{
      var alsoBoughtInsert = [];

      var shopify = new shopifyAPI(shopifyconfig)

      shopify.get('/admin/orders.json', function(err, data, headers){
        if (err){
          reject('error at shopify get orders')
        }
        array.forEach((productAtHand)=>{
            //array of all emails who people who bought the item at hand
            var peopleWhoBought = [];
            data.orders.forEach((element)=>{
              element.line_items.forEach((line)=>{
                if (line.product_id == productAtHand.productID){
                  peopleWhoBought.push(element.email);
                }
              })
            })

            function testPB(value){
              return (peopleWhoBought.indexOf(value.email) > -1)
            }

            var peopleWhoBoughtOrders = data.orders.filter(testPB);

            var productsAlsoBought = [];
            peopleWhoBoughtOrders.forEach((element)=>{
              element.line_items.forEach((item)=>{
                if (item.product_id !== productAtHand.productID){
                  productsAlsoBought.push(item)
                }
              })
            })

            productsAlsoBought.forEach((element)=>{

                  var seen = false;
                  var atIndex = -1;
                  for(var j = 0; j != alsoBoughtInsert.length; ++j) {
                      if(alsoBoughtInsert[j].productID == element.product_id && alsoBoughtInsert[j].forProduct == productAtHand.productID){
                       seen = true;
                       atIndex = j;
                      }
                  }
                  if (seen){
                    alsoBoughtInsert[atIndex].howMany = alsoBoughtInsert[atIndex].howMany + 1;
                  } else {
                    var store = element.vendor.replace(/ /g, "-");
                    store = store.toLowerCase();


                    if (map){
                      let gotMap = map.get(element.product_id)
                      var abObj = {
                        store: store,
                        forProduct: productAtHand.productID.toString(),
                        productID: element.product_id.toString(),
                        title: gotMap.title,
                        price:gotMap.price,
                        handle:gotMap.handle,
                        image: gotMap.image,
                        howMany:1,
                      }
                    } else {
                      var image;
                      array.some((imageSearch)=>{

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
                      }
                    }
                    if (abObj.forProduct !== abObj.productID){
                      alsoBoughtInsert.push(abObj)
                    }
                  }


            })


        });
        resolve(alsoBoughtInsert);







      })
  })
}

module.exports = addAlsoBought
