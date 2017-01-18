const VerifyHMAC = require('./verifyHMAC.js');
const renderMain = require('../custom_modules/renderMain.js');


class FinAuth {
  constructor(res,req){
    this.res = res;
    this.req = req;
    this.shop = req.session.shop;
    this.shopifyconfig = req.session.shopifyconfig;
    this.init = this.init();
  }
  init(){
    if(this.req.query.code || this.req.query.protocol){
      const verifyHMAC = new VerifyHMAC(this.req.query,false,this.verifySuccess.bind(this),this.res);
    } else {
      const verifyHMAC = new VerifyHMAC(this.req.headers.referer,true,this.verifyRefered.bind(this),this.res);
    }
  }
  verifySuccess(){
    const { res, shop, shopifyconfig } = this;
    renderMain(res,shop,shopifyconfig);
  }
  verifyRefered(){
    console.log('worked referer')
    const { res, shop, shopifyconfig } = this;
    renderMain(res,shop,shopifyconfig);
  }


}

function finAuth(req,res){
  const finAuth = new FinAuth(res,req,req.session.shop,req.session.shopifyconfig)
}

module.exports = finAuth
