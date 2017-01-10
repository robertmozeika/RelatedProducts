const crypto = require('crypto');


function verifyHMAC(query,post){
  if (post){
    const indexOfQuery = query.indexOf('?') + 1;
    let messageReplace = query.substring(indexOfQuery);
    var test = /&hmac=[\d\w]+/;
    var hmacExec = test.exec(messageReplace);
    var hmac = hmacExec[0].replace('&hmac=',"")
    var message = messageReplace.replace(test,"")

  } else {
    var { hmac, code, shop, timestamp, state } = query;

    var message = `code=${code}&shop=${shop}&state=${state}&timestamp=${timestamp}`;

  }




  // recompute hmac
         var compute_hmac= crypto.createHmac('sha256', '6815b758b2996ee3ef116c112432a085').update(message).digest('hex');
         console.log('compute',compute_hmac)
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
