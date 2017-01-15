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
    let message;
    if (this.post){
      message = this.constructPostMessage();
    } else {
      message = this.constructGetMessage();
    }
    this.compare(this.computeHMAC(message));

  }
  constructPostMessage(){
    const messageReplace = this.query.substring(indexOfQuery);
    const test = /hmac=[\d\w]+&/;
    const hmacExec = test.exec(messageReplace);
    this._hmac = hmacExec[0].replace('hmac=',"").replace('&',"");
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
    this.res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }


}
//
// // var testClass = new verifyHMAC({hmac:'123',taco:'yummy'});
// // console.log(testClass)
// // testClass.init()
//
// function verifyHMAC(query,post){
//
//   if (post){
//     const indexOfQuery = query.indexOf('?') + 1;
//     let messageReplace = query.substring(indexOfQuery);
//     var test = /hmac=[\d\w]+&/;
//     var hmacExec = test.exec(messageReplace);
//     var hmac = hmacExec[0].replace('hmac=',"")
//     hmac = hmac.replace('&',"")
//     var message = messageReplace.replace(test,"")
//   } else {
//     var { hmac, code, shop, timestamp, state, protocol } = query;
//     var message = "";
//     if (code){
//       message += `code=${code}`
//     }
//     if (protocol) {
//       if (message == ""){
//         var andSign = ""
//       } else {
//         var andSign = "&"
//       }
//       message += `${andSign}protocol=${protocol}`
//     }
//     console.log('protocol')
//     if (shop) {
//       if (message == ""){
//         var andSign = ""
//       } else {
//         var andSign = "&"
//       }
//       message += `${andSign}shop=${shop}`
//     }
//     if (state) {
//       if (message == ""){
//         var andSign = ""
//       } else {
//         var andSign = "&"
//       }
//       message += `${andSign}state=${state}`
//     }
//     if (timestamp) {
//       if (message == ""){
//         var andSign = ""
//       } else {
//         var andSign = "&"
//       }
//       message += `${andSign}timestamp=${timestamp}`
//
//     }
//
//
//   }
// console.log('$$',message)
//
//
//   // recompute hmac
//          var compute_hmac= crypto.createHmac('sha256', '6815b758b2996ee3ef116c112432a085').update(message).digest('hex');
//          console.log('compute',compute_hmac)
//          console.log('hmac',hmac)
//          // check hmac
//          if(compute_hmac != hmac){
//           console.log("Can't verify hmac");
//           return false;
//          }
//          else
//          {
//             // do stg
//             // return res.status(200).json({success:"ok"});
//             console.log('verified hmac');
//             return true;
//          }
// }


module.exports = VerifyHMAC
