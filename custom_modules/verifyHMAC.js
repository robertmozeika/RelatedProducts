const crypto = require('crypto');


function verifyHMAC(query,post){
  console.log('made it to function')

  if (post){
    console.log('got to post')
    const indexOfQuery = query.indexOf('?') + 1;
    console.log('got to post1')
    let messageReplace = query.substring(indexOfQuery);
    console.log('got to post2')

    var test = /hmac=[\d\w]+&/;
    console.log('got to post4')

    var hmacExec = test.exec(messageReplace);
    console.log('got to post5')
    console.log(messageReplace)

    var hmac = hmacExec[0].replace('hmac=',"")
    hmac = hmac.replace('&',"")


    var message = messageReplace.replace(test,"")
    console.log('got to post7')



  } else {
    console.log('made it to else')
    var { hmac, code, shop, timestamp, state, protocol } = query;
    console.log(query)
    var message = "";
    console.log('declared message')
    if (code){
      message += `code=${code}`
    }
    console.log('code')
    console.lo
    if (protocol) {
      if (message == ""){
        var andSign = ""
      } else {
        var andSign = "&"
      }
      message += `${andSign}protocol=${protocol}`
    }
    console.log('protocol')
    if (shop) {
      if (message == ""){
        var andSign = ""
      } else {
        var andSign = "&"
      }
      message += `${andSign}shop=${shop}`
    }
    if (state) {
      if (message == ""){
        var andSign = ""
      } else {
        var andSign = "&"
      }
      message += `${andSign}state=${state}`
    }
    if (timestamp) {
      if (message == ""){
        var andSign = ""
      } else {
        var andSign = "&"
      }
      message += `${andSign}timestamp=${timestamp}`

    }
    console.log('message', message)

    // var message = `code=${code}&shop=${shop}&state=${state}&timestamp=${timestamp}`;

  }

  console.log(message)


  // recompute hmac
         var compute_hmac= crypto.createHmac('sha256', '6815b758b2996ee3ef116c112432a085').update(message).digest('hex');
         console.log('compute',compute_hmac)
         console.log('hmac',hmac)
         // check hmac
         if(compute_hmac != hmac){
          console.log("Can't verify hmac");
          return false;
         }
         else
         {
            // do stg
            // return res.status(200).json({success:"ok"});
            console.log('verified hmac');
            return true;
         }
}


module.exports = verifyHMAC
