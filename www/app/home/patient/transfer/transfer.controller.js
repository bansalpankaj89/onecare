(function() {
    angular.module('mediDocApp.controller').controller('transferController', transferController);
    
    transferController.$inject = ['$scope','$state', '$stateParams', '$q', '$ionicPopup', 
                                    'patientInfo', 'admissionInfo','admissionService', 'medicationService', 'medicalExaminationService', 
                                    'prescribedMedicationService', 'taskService','hospitalDepartmentConst','staffService', 'dischargeAppoitmentService',
                                   'appointmentService'];
    
    function transferController ($scope, $state, $stateParams, $q, $ionicPopup, 
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
        
        
       /* 
        $scope.drugCollection = medicationService.drugCollection.map(
            function(item) 
            { 
                return { description: item.pharmacological, value : item.id }
            });
        $scope.routeCollection = medicationService.routeCollection.map(
            function(item) {
                return { description: item, value: item };
            }
        );
        $scope.drugFrequencyCollection = medicationService.frequencyCollection.map(
            function(item) {
                return { description: item.description, value: item.tag };
            }
        );
        
        $scope.dischargeStatusCollection = [{
            description: "Cured",
            value: "cured"
        }, {
            description: "Under Medication",
            value : "under_medication"
        }, {
            description: "Dead", 
            value : "dead"
        }]
        
        $scope.appointmentDateSelected = function(selectedDate) {
            $scope.dischargeAppointment.date = moment(selectedDate).format('DD-MM-YYYY');
        }
        
        $scope.scheduleAppointment = function () {
            $scope.dischargeAppointment = {};
            var appointmentPopup = $ionicPopup.show({
                templateUrl: 'app/home/patient/discharge/tpl.discharge-appointment.view.html',
                title: 'Discharge Appointment',
                scope: $scope,
                buttons: [
                    { text: 'Cancel'},
                    {
                        text: 'Save',
                        type: 'button-positive',
                        onTap: function(e) {
                            if(!$scope.dischargeAppointment.date || !$scope.dischargeAppointment.remarks) {
                                e.preventDefault();
                                return;
                            }
                            if(!vm.patientInfo.dischargeAppointments)
                                vm.patientInfo.dischargeAppointments = [];
                            vm.patientInfo.dischargeAppointments.push({
                                appointment_date:  $scope.dischargeAppointment.date,
                                remarks: $scope.dischargeAppointment.remarks,
                                admission_id: vm.patientInfo.admission_id,
                                registration_id: vm.patientInfo.registration_id
                            });
                        }
                    }
                ]
            });
        }
        
        $scope.dischargeStatusChange = function(changedItem, changedState) {
            if(!vm.patientInfo.discharge_status)
                vm.patientInfo.discharge_status = [];
            vm.patientInfo.discharge_status.push({
                description : changedItem.description,
                value: changedItem.value
            });
        }
        
        $scope.prescripeMedicine = function() {
            $scope.prescription = {};
            var mediPopup = $ionicPopup.show({
                templateUrl: 'app/home/patient/detail/tpl.medical-prescription.view.html',
                title: 'Medications',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    { 
                        text: 'Save',
                        type: 'button-positive',
                        onTap: function(e) {
                            if ($scope.prescription.selectedDrugs.length == 0 || 
                                $scope.prescription.selectedRoutine.length == 0 || 
                                $scope.prescription.selectedFrequency.length == 0) {
                                e.preventDefault();
                            } else {
                                var textPrescription = $scope.prescription.selectedDrugs[0].description + ' ' 
                                 + ($scope.prescription.dosage ? $scope.prescription.dosage : '') + ' ' 
                                 + $scope.prescription.selectedFrequency[0].value + ' '
                                 + $scope.prescription.selectedRoutine[0].description;


                                 if(!vm.patientInfo.prescriptions) 
                                     vm.patientInfo.prescriptions = [];

                                 vm.patientInfo.prescriptions.push({
                                    description:  textPrescription,
                                    prescription: $scope.prescription
                                });
                            }
                                                           
                        }
                    }
                ]
            });
        };
        
        vm.dischargePatient = function() {
            var confirmPopup = $ionicPopup.confirm({
                template: '<h3>Please confirm to discharge the patient?</h3>',
                title: 'Discharge Confirmation'                
            });
            
            confirmPopup.then(function(res) {
               if(res) {
                 vm.saveDischarge();
               } else {
                 console.log('You are not sure');
               }
            });
        }   
        
         vm.saveDischarge = function() { 
             
             vm.patientInfo.discharge_info = {};
             vm.patientInfo.condition ? 
                 vm.patientInfo.discharge_info.condition = vm.patientInfo.condition: 
                 vm.patientInfo.discharge_info.condition = 'N/A';
             vm.patientInfo.instruction ? 
                 vm.patientInfo.discharge_info.instruction = vm.patientInfo.instruction:
                 vm.patientInfo.discharge_info.instruction = 'N/A';
             vm.patientInfo.discharge_info.discharge_status = vm.patientInfo.dischargeStatus;
//             vm.patientInfo.discharge_info.prescriptions = vm.patientInfo.prescriptions;
//             vm.patientInfo.discharge_info.dischargeAppointments = vm.patientInfo.dischargeAppointments;
             //move admission record to dischargeAdmissions collection.
             vm.dischargePatientData = vm.admissionInfo;
             vm.dischargePatientData.admission_id = vm.patientInfo.admission_id;
             vm.dischargePatientData.registration_id = vm.patientInfo.registration_id;
             delete vm.dischargePatientData.$id;
             dischargeAppoitmentService.create(vm.dischargePatientData)
             .then(function(result) {
                 return dischargeAppoitmentService.getById(result);
             }, function(error) {
               console.log(error);  
             })             
             .then(function(result) {                 
                //Update discharge input records to this object's discharge info'      
                vm.dischargePatientData = result;
                 //remove admission from the admission collection
                 return admissionService.remove(vm.dischargePatientData.admission_id);
             }, function(error) {
                 console.log(error);
             })  
             .then(function(result) {                 
                //Update discharge input records to this object's discharge info'      
                vm.dischargePatientData.discharge_info = vm.patientInfo.discharge_info;
                 return dischargeAppoitmentService.update(vm.dischargePatientData);
             }, function(error) {
                 console.log(error);
             })             
             .then(function(result) {                 
                 if(!vm.dischargePatientData.prescriptions)
                     return false;
                 //get all medications for the admission
                 return prescribedMedicationService.getByKeyVal('admission_id', vm.dischargePatientData.admission_id);
             }, function(error) {
                 console.log(error);
             })                          
             .then(function(result) {
                 if(!result)
                     return false;
                 //Change related medication
                 return $q(function(resolve, reject) {
                      var counter = 0;
                     angular.forEach(result, function(item) {
                         counter++;
                         item.is_active = false;
                         prescribedMedicationService.update(item)
                         .then(function(mediResult) {
                             counter --;
                             if(counter==0)
                                 return resolve();
                         }, function(mediError) {
                             counter --;
                             return reject();
                         })
                     })
                 })                
             }, function(error) {
                 console.log(error);
             })   
             .then(function(result) {                 
                 if(!vm.dischargePatientData.medicalExaminations)
                     return false;
                 //get all medical examination for the admission
                 return medicalExaminationService.getByKeyVal('admission_id', vm.dischargePatientData.admission_id);
             }, function(error) {
                 console.log(error);
             }) 
             .then(function(result) {
                 if(!result)
                     return false;
                 //Change related medical examination                 
                 return $q(function(resolve, reject) {
                     var counter = 0;
                     angular.forEach(result, function(item) {
                         counter++;
                         item.is_active = false;
                         medicalExaminationService.update(item)
                         .then(function(mediResult) {
                             counter --;
                             if(counter==0)
                                 return resolve();
                         }, function(mediError) {
                             counter --;
                             return reject();
                         })
                     })
                 });
             }, function(error) {
                 console.log(error);
             })   
             .then(function(result) {
                 //get all tasks for the admission
                 return taskService.getByKeyVal('admission_id', vm.dischargePatientData.admission_id);
             }, function(error) {
                 console.log(error);
             }) 
             .then(function(result) {
                 //Change related tasks                 
                 return $q(function(resolve, reject) {
                     var counter = 0;
                     angular.forEach(result, function(item) {
                         counter++;
                         item.is_active = false;
                         taskService.update(item)
                         .then(function(mediResult) {
                             counter --;
                             if(counter==0)
                                 return resolve();
                         }, function(mediError) {
                             counter --;
                             return reject();
                         })
                     })
                 });
             }, function(error) {
                 console.log(error);
             })  
             .then(function(result) {
                 //create new medication,
                 if(!vm.patientInfo.prescriptions)
                     return false;
                 
                 return prescribedMedicationService.create(vm.patientInfo.prescriptions, vm.dischargePatientData.admission_id, vm.dischargePatientData.registration_id);
             }, function(error) {
                 console.log(error);
             })
             .then(function(result) {
                 //create new tasks                 
                    if(result) {
                         vm.patientInfo.discharge_info.prescriptions = result;                        
                         return $q(function(resolve, reject) {
                            var woCounter = 0;
                            for(var i = 0; i < result.length; i++ ){
                                woCounter++;
                                result[i].admission_id = vm.vm.dischargePatientData.admission_id;                            
                                workorderManagerService.create(result[i], 'medication', 'dr-ravi')
                                .then(function(woResult) {
                                    woCounter--;
                                    if(woCounter==0){
                                        return resolve();
                                    }
                                }, function(error) {
                                    counter--;
                                    return reject();
                                });
                            }

                         });
                    }
                    return true;
                 
             }, function(error) {
                 console.log(error);
             })
             .then(function(result) {
                if(!vm.patientInfo.dischargeAppointments)
                     return false;
                 
                 return appointmentService.createBatch(vm.patientInfo.dischargeAppointments);
             }, function(error) {
                 console.log(error);
             })
             .then(function(result) {
                 //create new dischargeAppointment
                 if(result)
                    vm.patientInfo.discharge_info.discharge_appointments = result;
                 
                 return dischargeAppoitmentService.update(vm.dischargePatientData);
             }, function(error) {
                 console.log(error);
             })
             .then(function(result) {
                 console.log('successfully discharged the patient');
             }, function(error) {
                 console.log('error while updating dischangeAppointment with medications and appointments')
             })
             
         }*/

        vm.init();

    };
})();
