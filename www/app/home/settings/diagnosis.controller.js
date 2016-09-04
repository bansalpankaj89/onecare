(function() {
    angular.module('mediDocApp.controller').controller('diagnosisController', 
        ['$scope', 'diagnosisService' , diagnosisController]);
    
    function diagnosisController($scope, diagnosisService) {
        //code goes here   
        var vm = this;
        vm.mode = 'create';
        
        function init() {
          
            vm.loadDiagnosis = function() {            
                    vm.action = 'Add';
                    vm.isAdd = true;
                    diagnosisService.getAll()
                    .then(function(result) {
                        vm.diagnosisCollection = result;
                        console.log('diagnosisCollection',vm.diagnosisCollection);
                    }, function(err) {
                        console.error('Error - diagnosisController - loadDiagnosis ', err);
                    })
            };

              vm.loadDiagnosis();
        }

        init();
        
        vm.editDiagnosis = function(item) {
            vm.diagnosis = item;
            vm.mode = 'edit'
        }
        

        vm.saveDiagnosis = function() {
            if(vm.mode == 'create') {
                vm.diagnosis.status = true;
                diagnosisService.create(vm.diagnosis)
                .then(function(result) {
                    vm.diagnosis = {};
                    vm.loadDiagnosis();
                }, function(err) {
                    console.error('Error - diagnosisController - createDiagnosis ', err);
                });
            } else {
                diagnosisService.update(vm.diagnosis)
                .then(function(result) {
                    vm.diagnosis = {};
                    vm.loadDiagnosis();
                }, function(err) {
                    console.error('Error - diagnosisController - updateDiagnosis ', err);
                });
            }
        }    
  
        
        vm.removeDiagnosis = function(item) {
            item.status = false;
            diagnosisService.update(item)
            .then(function(result) {
                vm.diagnosis = {};
                vm.loadDiagnosis();
            }, function(err) {
                console.error('Error - diagnosisController - updateDiagnosis ', err);
            });
        }
        

        
      
    };
})();
