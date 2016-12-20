// import angular from 'angular';
// import uirouter from 'angular-ui-router';
// require('angular');
import 'angular';
import 'angular-ui-router';

// var arr = [1,2,3];
//
// arr.forEach((elem)=>{
//   console.log(elem)
// })

angular
  .module('app', [
    'ui.router',
  ])

  .config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl',

      })
  }])
