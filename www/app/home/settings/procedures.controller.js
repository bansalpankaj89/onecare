(function() {
    angular.module('mediDocApp.controller').controller('proceduresController', 
        ['$scope','procedureService' , proceduresController]);
    
    function proceduresController($scope, procedureService) {
      console.log('----');   
        var vm = this;
        vm.mode = 'create';
        function init() {
            vm.loadProcedure = function() {            
                    vm.action = 'Add';  
                    vm.isAdd = true;
                    procedureService.getAll()
                    .then(function(result) {
                        vm.procedureCollection = result;
                         console.log('procedureCollection',vm.procedureCollection);
                    }, function(err) {
                        console.error('Error - procedureController - loadProcedure ', err);
                    })
            };
            vm.loadProcedure();
        }

        init();     
        vm.editProcedure = function(item) {
            vm.procedure = item;
            vm.mode = 'edit'
        }
           
        
        vm.saveProcedure = function() {
            if(vm.mode == 'create') {
                vm.procedure.status = true;
                procedureService.create(vm.procedure)
                .then(function(result) {
                    vm.procedure = {};
                    vm.loadProcedure();
                }, function(err) {
                    console.error('Error - procedureController - createProcedure ', err);
                });
            } else {
                procedureService.update(vm.procedure)
                .then(function(result) {
                    vm.procedure = {};
                    vm.loadProcedure();
                }, function(err) {
                    console.error('Error - procedureController - updateProcedure ', err);
                });
            }
        }   
        
        
        vm.removeProcedure = function(item) {
            item.status = false;
            procedureService.update(item)
            .then(function(result) {
                vm.procedure = {};
                vm.loadProcedure();
            }, function(err) {
                console.error('Error - procedureController - updateProcedure ', err);
            });
        }
        

    };
})();
