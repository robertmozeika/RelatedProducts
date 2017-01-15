
import callDad from './callDad.js';

function callingMom(){
  var dad = new callDad('john');
  dad.sayName();
}
class Tester {
  constructor(){
    this.dad = "dads name"
    this._mom = "mom's name"

  }
  callHome(){
    console.log('calling home')
  }
  callMom(){
    return callingMom();
  }
};
//
// angular
//   .module('app')
//   .service('Tester', Tester)
export default Tester


//
// export { Tester }
