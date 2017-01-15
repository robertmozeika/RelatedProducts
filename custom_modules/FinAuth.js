const VerifyHMAC = require('./verifyHMAC.js')

class FinAuth {
  constructor(res,req,shop,shopifyconfig){
    this.res = res;
    this.req = req;
    this.shop = shop;
    this.shopifyconfig = shopifyconfig;
    // this.init = this.init();
  }
  init(){
    console.log('initalized')
    // console.log(this.req.query)
    console.log(this.req.query);
    console.log(this.verifySuccess.bind(this))
    console.log('$res',this.res)
    const verifyHMAC = new VerifyHMAC(this.req.query,false,this.verifySuccess.bind(this),this.res);
    // console.log('did it make a new?')
    // verifyHMAC.init();
    // verifyHMAC.init();
  }
  verifySuccess(){
    this.res.send('worked')
  }
  verifyFail() {
    // return false
    console.log('didnt work')
    this.res.send('Reques')
  }

}

module.exports = FinAuth
