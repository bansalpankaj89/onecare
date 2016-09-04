(function () {
    'use strict';
    angular
        .module('mediDocApp.controller')
        .controller('staffListController',
                    ['$scope','$filter','$stateParams','staffService', staffListController]);

    function staffListController ($scope,$filter,$stateParams,staffService) {

      var vm = this;
      vm.staffList = [];
      var sysdate = new Date();
 
      vm.init = function() {
          console.log('result');
              staffService.getAll()
              .then(function(result) {
             //   console.log(result);
                  vm.staffList = result;
              }, function(err) {
                  console.log('err ', err)
              }); 
      }       

      vm.viewDetails = function(data){
        console.log('data',data);
      }

        
        vm.init();
  
    };
}());


   






