'use strict';

/**
 * @ngdoc function
 * @name tinkApp.controller:DocsCtrl
 * @description
 * # DocsCtrl
 * Controller of the tinkApp
 */
angular.module('tinkFramework.controllers')
  .controller('MainCtrl',['$scope','$timeout',function (scope,$timeout) {
  scope.selectedDate = '2014-12-01';
  scope.dates= {last:null,first:new Date(2014, 0, 31)};
  scope.group1 = false;
  scope.group2 = true;

  var timeout;
  scope.group1go = function(action,actie){
    console.log(action,timeout);
    if(action ==="loading"){
      timeout = $timeout(actie,3000);
    }else if(action === "canceld"){
      $timeout.cancel(timeout);
    }
  }

  scope.go = function(){
  	console.log(scope.dates);
  };
}]);
