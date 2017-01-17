const crypto = require('crypto');

class VerifyHMAC {
  constructor(query,post,successCallback,res){
    this.query = query;
    this.post = post;
    this.successCallback = successCallback;
    this.res = res;
    this.init = this.init();
  }
  init(){
    console.log('Initialized verification')
    let message;
    if (this.post){
      this.query = decodeURIComponent(this.query);
      console.log('look;',this.query)
      console.log('poast is true')
      message = this.constructPostMessage();
    } else {
      message = this.constructGetMessage();
    }
    console.log('comparing message...', message)
    this.compare(this.computeHMAC(message));

  }
  constructPostMessage(){
    const indexOfQuery = this.query.indexOf('?') + 1;
    const messageReplace = this.query.substring(indexOfQuery);
    const test = /hmac=[\d\w]+&/;
    const hmacExec = test.exec(messageReplace);
    this._hmac = hmacExec[0].replace('hmac=',"").replace('&',"");
    console.log('made it to here')
    return messageReplace.replace(test,"");
  }
  constructGetMessage(){
    let message = "";
    Object.keys(this.query).sort().forEach(key =>{
      if (key == 'hmac'){
        this._hmac = this.query[key]
      } else {
        message = this.addQuery(message,key,this.query[key]);
      }
    })
    return message;
  }
  addQuery(message,key,value){
    let andSign="";
    if (!message == ""){
      andSign = "&"
    }
    message += `${andSign}${key}=${value}`
    return message
  }
  computeHMAC(message){
    return crypto.createHmac('sha256', '6815b758b2996ee3ef116c112432a085').update(message).digest('hex');
  }
  compare(computedHMAC){
    if (computedHMAC == this._hmac) {
      return this.successCallback();
    } else {
      return this.verifyFailed.call(this);
    }
  }
  verifyFailed(){
    console.log('verify failed!')
    this.res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }


}

module.exports = VerifyHMAC
