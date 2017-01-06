// import angular from 'angular';
// import uirouter from 'angular-ui-router';
// require('angular');
import 'angular';
import 'angular-ui-router';
import 'angular-ui-bootstrap';
import Tester from './services/Tester.js'
// import multipleWindow from './directives/multipleWindow.js'


// var arr = [1,2,3];
//
// arr.forEach((elem)=>{
//   console.log(elem)
// })

angular
// .directive(multipleWindow)
// .directive('multipleWindow', () => new multipleWindow())

  .module('app', [
    'ui.router',
    'ui.bootstrap',
    'app.directives.rpWindow',
    'app.directives.popdelay',
    'app.directives.multipleWindow',
  ])

  .service('Tester', Tester)
  .config(['$urlRouterProvider','$stateProvider','$uibTooltipProvider',function($urlRouterProvider, $stateProvider,$uibTooltipProvider) {

    $uibTooltipProvider.setTriggers({'openTrigger': 'closeTrigger'}) ;


    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl',

      })

  }])
