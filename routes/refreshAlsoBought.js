var express = require('express');
var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
  var shop = req.session.shop;
  const VerifyHMAC = new verifyHMAC(req.headers.referer,true,verifySuccess,res);
  function verifySuccess(){
    function refreshProductInterval(){

        shopModel.find({name: shop})
          .then(function(doc){
            if (doc.length){
                const shopifyconfig = {
                  shop: shop, // MYSHOP.myshopify.com
                  shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
                  shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
                  access_token: element.access_token,
                  shopify_scope: 'read_products,write_script_tags,read_script_tags,read_orders',
                  redirect_uri: 'https://simple-related-products.herokuapp.com/finish_auth',
                  verbose: false,
                }

                updateProductInfo(shopifyconfig,shop).then(data => {
                  updateAlsoBought(shopifyconfig,shop);
                });
            }
          })
          .catch(err => {
            res.send('An error has occurred, please let developer know at robertmozeika20@gmail.com');
          })
      }
  }
});

module.exports = router;
