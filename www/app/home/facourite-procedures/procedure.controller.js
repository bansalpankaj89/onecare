(function() {
    angular.module('mediDocApp.controller').controller('procedureController', 
        ['$scope', '$ionicModal', 'diagnosisService','procedureService' , procedureController]);
    
    function procedureController($scope, $ionicModal, diagnosisService, procedureService) {
        //code goes here   
        var vm = this;
        vm.mode = 'create';
        
        vm.loadDiagnosis = function() {            
                vm.action = 'Add';
                vm.isAdd = true;
                vm.modalDiagnosisTemp.show(); 
                diagnosisService.getAll()
                .then(function(result) {
                    vm.diagnosisCollection = result;
                }, function(err) {
                    console.error('Error - procedureController - loadDiagnosis ', err);
                })
        };
        
        vm.loadProcedure = function() {            
                vm.action = 'Add';
                vm.isAdd = true;
                vm.modalProcedureTemp.show(); 
                procedureService.getAll()
                .then(function(result) {
                    vm.procedureCollection = result;
                }, function(err) {
                    console.error('Error - procedureController - loadProcedure ', err);
                })
        };
        
        vm.editDiagnosis = function(item) {
            vm.diagnosis = item;
            vm.mode = 'edit'
        }
        
        vm.editProcedure = function(item) {
            vm.procedure = item;
            vm.mode = 'edit'
        }
        
        vm.saveDiagnosis = function() {
            if(vm.mode == 'create') {
                vm.diagnosis.status = true;
                diagnosisService.create(vm.diagnosis)
                .then(function(result) {
                    vm.diagnosis = {};
                }, function(err) {
                    console.error('Error - procedureController - createDiagnosis ', err);
                });
            } else {
                diagnosisService.update(vm.diagnosis)
                .then(function(result) {
                    vm.diagnosis = {};
                }, function(err) {
                    console.error('Error - procedureController - updateDiagnosis ', err);
                });
            }
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
        
        vm.removeDiagnosis = function(item) {
            item.status = false;
            diagnosisService.update(item)
            .then(function(result) {
                vm.diagnosis = {};
            }, function(err) {
                console.error('Error - procedureController - updateDiagnosis ', err);
            });
        }
        
        vm.removeProcedure = function(item) {
            item.status = false;
            procedureService.update(item)
            .then(function(result) {
                vm.procedure = {};
            }, function(err) {
                console.error('Error - procedureController - updateProcedure ', err);
            });
        }
        
        vm.closeTemplateStructureModal = function() {
            vm.modalDiagnosisTemp.hide();
            vm.modalProcedureTemp.hide();
        }
        
        $ionicModal.fromTemplateUrl('app/home/settings/tpl.settings-diagnosis.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            vm.modalDiagnosisTemp = modal;
            console.log('modal loaded');
        });
        
        $ionicModal.fromTemplateUrl('app/home/settings/tpl.settings-procedure.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            vm.modalProcedureTemp = modal;
            console.log('modal loaded');
        });
    };
})();
