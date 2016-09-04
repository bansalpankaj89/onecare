(function() {
    angular.module('mediDocApp.controller').controller('designTemplateController', designTemplateController);
    
    designTemplateController.$inject = ['$scope', '$ionicModal', 
                                        'examinationCategories',
                                        'medicalExaminationTemplateService',
                                        'medicalExaminationMeasurementTypeConst'];
    
    function designTemplateController($scope, $ionicModal, 
                                       examinationCategories,
                                       medicalExaminationTemplateService,
                                       medicalExaminationMeasurementTypeConst) {
        //code goes here   
        var vm = this;
        $scope.isView = false;
        $scope.isEditMaster = false;
        $scope.isEditField = false;
        vm.examinationCategories = examinationCategories;
        vm.measurementTypes = medicalExaminationMeasurementTypeConst;
        function init() {
                medicalExaminationTemplateService.getAll()
                .then(function (templates) {
                    vm.medicalExaminationTemplates = templates; 
                }, function(err) {
                    console.log("retrieve template error ",error);
                });
        }        
        init(); 
        
        vm.prepareNewTemplate = function() {            
            vm.template = {};
            $scope.isView = false;
            $scope.isEditMaster = true;
            $scope.isEditField = false;
            $scope.selectedItem  = {};
            
        }
        
        vm.viewTemplate = function(template) {
            vm.template = template;
            $scope.isView = true;
            $scope.isEditMaster = false;
            $scope.isEditField = false; 
            vm.newField = {};
            $scope.selectedItem = template;
        }
        
        vm.editTemplateDetail = function(template) {
            vm.template = template;
            vm.newField = {};
            $scope.isView = false;  
            $scope.isEditMaster = true;
            $scope.isEditField = false;          
            $scope.selectedItem = template;
        }
        
         vm.editTemplateField = function(template) {
            vm.template = template;
            vm.newField = {};
            $scope.isView = false;  
            $scope.isEditMaster = false;
            $scope.isEditField = true;          
            $scope.selectedItem = template;
        }
        
        vm.saveExaminationTemplate = function() {
            //vm.newTemplate.createDate = new Date();
            if(!vm.template.$id) {
                //this is new template save
                medicalExaminationTemplateService.create(vm.template)
                    .then(function(result) {
                    vm.prepareNewTemplate();
                }, function(err) {
                    console.log('medicalExaminationTemplateService create error ', err);
                });
            } else {
                //this is update template mode
                medicalExaminationTemplateService.update(vm.template)
                    .then(function(result) {
                    vm.prepareNewTemplate();
                }, function(err) {
                    console.log('medicalExaminationTemplateService update error', err);
                });
            }
            init();
        }
        
        vm.addTemplateField = function() {
            if(vm.template.$id)
                console.log('no template selected to add filed');
            
            if(!vm.template.fields)
                vm.template.fields = [];
            
            vm.template.fields.push({
                field: vm.newField.name,
                measurement: vm.newField.measurement? vm.newField.measurement : "",
                limit_range: vm.newField.limit_range + ' ' + vm.newField.measurement?vm.newField.measurement : ""
            });
            medicalExaminationTemplateService.update(vm.template)
                .then(function(result) {
                 vm.newField= {};
            }, function(err) {
                console.log('medicalExaminationTemplateService update error', err);
            });
        }
        
    };
})();
