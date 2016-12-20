var shopifyAPI = require('shopify-node-api');
var mongodb = require('mongodb');


function addAlsoBought(array, shopifyconfig){
  var alsoBoughtInsert = [];

  var shopify = new shopifyAPI(shopifyconfig)

  shopify.get('/admin/orders.json', function(err, data, headers){
    array.forEach((productAtHand)=>{
        //array of all emails who people who bought the item at hand
        var peopleWhoBought = [];
        data.orders.forEach((element)=>{
          element.line_items.forEach((line)=>{
            if (line.product_id == productAtHand.id){
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
            if (item.product_id !== productAtHand.id){
              productsAlsoBought.push(item)
            }
          })
        })

        productsAlsoBought.forEach((element)=>{
              var seen = false;
              var atIndex = -1;
              for(var j = 0; j != alsoBoughtInsert.length; ++j) {
                  if(alsoBoughtInsert[j].productID == element.product_id && alsoBoughtInsert[j].forProduct == productAtHand.id){
                   seen = true;
                   atIndex = j;
                 }
              }
              if (seen){
                alsoBoughtInsert[atIndex].howMany = alsoBoughtInsert[atIndex].howMany + 1;
              } else {
                var store = element.vendor.replace(/ /g, "-");
                store = store.toLowerCase();

                var image;
                array.some((imageSearch)=>{

                  if (imageSearch.id == element.product_id){
                    image = imageSearch.image;
                    return
                  }
                })

                var abObj = {
                  forStore: store,
                  forProduct: productAtHand.id.toString(),
                  productID: element.product_id.toString(),
                  title: element.title,
                  image: image,
                  howMany:1,
                }
                alsoBoughtInsert.push(abObj)
              }


        })


    });

    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/shopify"
    MongoClient.connect(url, function(err, db){
      if(err){
        console.log('Unable to connect' + err)
      } else {
        console.log('Connection between Database Success at alsobought');

        var collection = db.collection('alsoBoughtProducts');

        collection.insert(alsoBoughtInsert,function(err, result){
          if(err) {

           console.log(err)
         }else {
          console.log('no error at alsobought')
        }

        db.close();

      });

      }
    })


  })
}

module.exports = addAlsoBought
