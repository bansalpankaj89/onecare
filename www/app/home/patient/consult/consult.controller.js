(function() {
    angular.module('mediDocApp.controller').controller('consultController', consultController);
    
    consultController.$inject = ['$scope','$state', '$stateParams', '$q', '$ionicPopup', 
                                    'patientInfo', 'admissionInfo','admissionService', 'medicationService', 'medicalExaminationService', 
                                    'prescribedMedicationService', 'taskService','hospitalDepartmentConst','staffService', 'dischargeAppoitmentService',
                                   'appointmentService'];
    
    function consultController ($scope, $state, $stateParams, $q, $ionicPopup, 
                                    patientInfo, admissionInfo, admissionService, medicationService, medicalExaminationService, 
                                    prescribedMedicationService, taskService,hospitalDepartmentConst,staffService, dischargeAppoitmentService,
                                   appointmentService) {
        //code goes here   
        var vm = this;
        $scope.title = patientInfo.last_name + ' ' + patientInfo.first_name;
        vm.patientInfo = patientInfo;
        vm.admissionInfo = admissionInfo;
        vm.staffList = [];
        vm.selecteddepartment ='';
        vm.selectedStaff = {};
        vm.sysdate = new Date();
        vm.consult ={};
        console.log(vm.patientInfo, vm.admissionInfo)

        vm.init = function() {
            $scope.hospitalDepartments = hospitalDepartmentConst;

            vm.patientInfo = {
                registration_id : vm.patientInfo.$id,
                full_name : vm.patientInfo.last_name + ' ' + vm.patientInfo.first_name,
                address : vm.patientInfo.address,
                admission_id : vm.admissionInfo.$id,
                admission_date : moment(vm.admissionInfo.admittion_date).format('DD-MM-YYYY HH:mm:SS'),
                ward_no : vm.admissionInfo.beddetails.ward_no,
                bed_no : vm.admissionInfo.beddetails.bed_no,
                diagnosis: vm.admissionInfo.diagnosis? 
                            vm.admissionInfo.diagnosis.map(function(item) {
                                return item.description;
                            }).toString() : []
            };           
            $scope.prescription = {};

            staffService.getAll()
            .then(function(res){ 
                angular.forEach(res, function(item) {
                    item.full_name = item.last_name + ' ' + item.first_name;
                    
                    if(item.designation == 'Doctor' || item.designation == 'Head of Department')
                        item.full_name = 'Dr. '+ item.full_name;
                });
                vm.staffList = res;
            },
            function(err){
            });


             $scope.filterStaff = function(staff) {
               // console.log("---",vm.selecteddepartment)
                return (staff.department == vm.selecteddepartment);
            };
        }
        
        
        vm.consultPatient = function() {

            var confirmPopup = $ionicPopup.confirm({
                template: '<h3>Please confirm to send consultation request to Dr. '+vm.selectedStaff.first_name+' </h3>',
                title: 'Consultation Confirmation'                
            });
            
            confirmPopup.then(function(res) {
               if(res) {
                 vm.saveConsult();
               } else {
                 console.log('You are not sure');
               }
            });
        } 

        vm.saveConsult = function() { 

                  if(vm.admissionInfo.consult === undefined){
                    vm.admissionInfo.consult = [];
                  }
                    vm.admissionInfo.consult.push({ 
                      "date" : vm.sysdate.toString(),
                      "remarks" : vm.remarks,
                      "staff_department" : vm.selectedStaff.department,
                      "staff_name" : vm.selectedStaff.first_name + vm.selectedStaff.last_name,
                      "staff_id" :  vm.selectedStaff.identity_id
                    });
                    admissionService.update(vm.admissionInfo);
                    vm.consult = {};    

        }

        vm.init();

    };
})();
