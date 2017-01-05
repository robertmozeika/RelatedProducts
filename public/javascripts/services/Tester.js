
import callDad from './callDad.js';

function callingMom(){
  var dad = new callDad('john');
  dad.sayName();
}
class Tester {
  constructor(){

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
