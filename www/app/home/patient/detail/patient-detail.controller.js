(function() {
    angular.module('mediDocApp.controller').controller('patientDetailController', 
                ['patientInfo', 'admissionInfo',// 'patientTransInfo', 
                 '$ionicPopup', '$stateParams', '$state','$scope', '$rootScope', 'toaster', 
                 'diagnosisService', 'procedureService','medicationService', 'medicalExaminationTemplateService', 
                 'admissionService', 'patientTransactionService',
                 'prescribedMedicationService', 'medicalExaminationService',
                 'workorderManagerService', 
                 'patientStatusConst', 
                 'Patient', patientDetailController]);
    
    function patientDetailController(
                patientInfo, admissionInfo, //patientTransInfo, 
                $ionicPopup, $stateParams, $state, $scope, $rootScope, toaster, 
                diagnosisService, procedureService, medicationService, medicalExaminationTemplateService, 
                admissionService, patientTransactionService, 
                prescribedMedicationService, medicalExaminationService,
                workorderManagerService,
                patientStatusConst,
                Patient ) {
                    
        //code goes here          
            //var patient;
            var vm = this;
            vm.patient = {};
            $scope.patient = {}
            $scope.patient.primartStaff = {};
            $scope.patient.associatedStaffs = [];
            $scope.staffs = [];
            $scope.patientStatus = [];
            $scope.associatedStaffs = [];
            $scope.patient.selectedStaffs = [];
            $scope.patient.diagnosis = [];
            $scope.patient.procedures = [];
            //$scope.appointments= {};
            $scope.patient.appointmentListCollection = [];
            $scope.patient.prescriptions = [];
            $scope.patient.medicalExaminations = [];
            
            
                    
            $scope.patientStatusChange = function(changedItem, status) {
                vm.patient.setPatientStatus(changedItem, status);
                $scope.$emit('enable-patient-save', vm.patient);   
            }
                                
            $scope.diagnosisStatusChange = function(changedItem, status) {
                vm.patient.setDiagnosis(changedItem, status); 
                $scope.$emit('enable-patient-save', vm.patient);   
            }
                    
            $scope.procedureStatusChange = function(changedItem, status) {
                vm.patient.setProcedure(changedItem, status); 
                $scope.$emit('enable-patient-save', vm.patient);   
            }
            
            $scope.patientPrescriptionChange = function(changedItem, status) {
                //validation to check alredy exists in completed or discontiniued state 
                if($scope.patient.prescriptions.filter(function(item) {
                    return item.medication.selectedDrugs[0].description == changedItem.medication.selectedDrugs[0].description 
                        && item.status != 'completed'}).length > 0)
                    {                        
                        toaster.pop("info", "", "Sorry, "+ changedItem.medication.selectedDrugs[0].description + " already prescribed");
                        console.log('Same prescription not completed or discontiniued')
                        return false;
                    }
                vm.patient.setPatientPrescription(changedItem, status);
                $scope.$emit('enable-patient-save', vm.patient);
                return true;
            }
            
            $scope.patientMedicalExaminationChange = function (changedItem, status) {
                //validate to check if already exists in completed or discontrinuted state
                if($scope.patient.medicalExaminations.filter(function (item) {
                    return item.medicalExamination.description == changedItem.description
                    && item.statusIndex < 2 }).length > 0)
                    {
                        console.log('Same medical examination can not be added unless it has been carried out');
                        toaster.pop("info", "", "Sorry, "+ changedItem.description +" already prescribed for examination");
                        return false;
                    }
                if(vm.patient.newVisit.medicalExaminations && vm.patient.newVisit.medicalExaminations.filter(function (item) {
                    return item.item.description == changedItem.description
                    }).length > 0)
                    {                    
                        toaster.pop("info", "", "Sorry, "+ changedItem.description + " already selected");
                        console.log('Same medical examination has already been added to the list');
                        return false;
                    }
                vm.patient.setMedicalExamination(changedItem,status);
                $scope.$emit('enable-patient-save', vm.patient);
                return true;
            }
            
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
            $scope.patient.prescriptions = [];
            $scope.drugFrequencyCollection = medicationService.frequencyCollection.map(
                function(item) {
                    return { description: item.description, value: item.tag };
                }
            );
                    
            $scope.patientStatus = patientStatusConst;
            $scope.appointmentTypes = [
                {description: 'Blood Test', value: 'Blood Test'},
                {description: 'X-Ray', value: 'X-Ray'},
                {description: 'Medicine', value: 'Medicine'},
                {description: 'Suger Test', value: 'Suger Test'},
                {description: 'Other', value: 'Other'}
            ];
                    
            for(var i = 0; i <10; i++) {
                $scope.staffs.push({ 
                    id: i,
                    name : 'Staff ' + i, 
                    designation : 'designation ' + i, 
                    pic: 'img/person' + i + '.jpg'});
            }
            
            $scope.routeObservations = function() {
                //console.log('home.patient.observations')
                $state.go('home.patient.observation', {id: $stateParams.id, admissionId: $stateParams.admissionId});
            }
            
            $scope.routeAppointment = function() {
                $state.go('home.patient.appointment', {id: $stateParams.id, admissionId: $stateParams.admissionId});    
            }

            $scope.routeNotes = function() {
                //console.log('home.patient.observations')
                $state.go('home.patient.note', {id: $stateParams.id, admissionId: $stateParams.admissionId});
            }

            $scope.routePatient = function() {
                $state.go('home.patient.editPatient', {id: $stateParams.id, admissionId: $stateParams.admissionId});    
            }
            
            $scope.associatedStaffs = $scope.staffs.map(function(staff) {
                return {description: staff.name + ' ' + staff.designation, pic: staff.pic, info: staff }
            })
            
            $scope.openStaffAssignment = function() {
                $scope.data = {};

                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    templateUrl: 'app/home/patient/detail/tpl.staff.view.html',
                    title: 'Assign Staff',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                //if (!$scope.data.wifi) {
                                    //don't allow the user to close unless he enters wifi password
                                //    e.preventDefault();
                                //} else {
                                //    return $scope.data.wifi;
                                //}
                            }
                        }
                    ]
                });
            }
            
            $scope.assignMedicalExamination = function() {   
                //medicalExaminationTemplateService.initDB();
                medicalExaminationTemplateService.getAll()
                .then(function(result) {
                    generateMedicalExaminationPopup(result);
                }, function(error) {
                    console.log('error ', error);
                });
            }
            
            var generateMedicalExaminationPopup = function (templates)  {
                $scope.medicationExaminationCollection  = templates.map(function(item) {
                    return { description: item.name, value: item.$id };
                });
                $scope.medicalExaminations = {};
                $scope.medicalExaminations.selectedExamination = [];
                $ionicPopup.show({
                    templateUrl: 'app/home/patient/detail/tpl.medical-examination-prescription.view.html',
                    title: 'Medical Examinations',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancel' },
                        { 
                            text: 'Save' ,
                            type: 'button-positive',
                            onTap: function(e) {   
                                if($scope.medicalExaminations.selectedExamination.length == 0){
                                    toaster.pop("warning", "", "Please select the examination");

                                    e.preventDefault();
                                }
                                else {
                                    for(var i= 0;i < $scope.medicalExaminations.selectedExamination.length ; i++ )
                                    {        
                                        if($scope.patientMedicalExaminationChange({
                                                description: $scope.medicalExaminations.selectedExamination[i].description,
                                                medicalExamination: $scope.medicalExaminations.selectedExamination[i]
                                            }, true)){
                                             if(!$scope.patient.medicalExaminations) 
                                                 $scope.patient.medicalExaminations = [];

                                             $scope.patient.medicalExaminations.push({
                                                description:  $scope.medicalExaminations.selectedExamination[i].description,
                                                medicalExamination: $scope.medicalExaminations.selectedExamination[i]
                                            });
                                            toaster.pop("info", "", "Medical Examination added");
                                        }

                                    }
                                }
                            }
                        }
                    ]
                })
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
                                    
                                    if($scope.patientPrescriptionChange({
                                            description: textPrescription,
                                            medication: $scope.prescription
                                        }, true)){
                                         if(!$scope.patient.prescriptions) 
                                             $scope.patient.prescriptions = [];

                                         $scope.patient.prescriptions.push({
                                            description:  textPrescription,
                                            prescription: $scope.prescription
                                        });
                                    }
                                }                               
                            }
                        }
                    ]
                });
            };

            $scope.openStaffInfo = function(item) {
                $scope.staff = item;
                console.log('item.info.name ', item.info.name)
                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    template: "<medi-staff-info staff-name='"+item.info.name+"' staff-designation='"+item.info.designation+"'></medi-staff-info>",
                    title: 'Send Message',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<i class="icon ion-paper-airplane"></i>',
                            type: 'button-balanced',
                            onTap: function(e) {
                                //if (!$scope.data.wifi) {
                                    //don't allow the user to close unless he enters wifi password
                                //    e.preventDefault();
                                //} else {
                                //    return $scope.data.wifi;
                                //}
                            }
                        }
                    ]
                });
            }

            $scope.addAppointments = function() {
                $scope.newAppointmentDate = new Date();
                $scope.appointmentNotes = "";
                $scope.newAppointment = {
                    date: new Date(), // MANDATORY                     
                    mondayFirst: false,                
                    //months: months,                    
                    //daysOfTheWeek: daysOfTheWeek,     
                    startDate: new Date(),             
                    //endDate: endDate,                    
                    disablePastDays: false,
                    disableSwipe: false,
                    disableWeekend: false,
                    //disableDates: disableDates,
                    //disableDaysOfWeek: disableDaysOfWeek,
                    showDatepicker: false,
                    showTodayButton: true,
                    calendarMode: false,
                    hideCancelButton: false,
                    hideSetButton: false,
                    highlights: [{
                        date: new Date(2016, 4, 23),
                        color: '#8FD4D9',
                        textColor: '#fff'
                    }],
                    callback: function(value){
                        $scope.newAppointmentDate = value;
                    }
                }
                var myPopup = $ionicPopup.show({
                    templateUrl: 'app/view/hospital.staff.appointment.edit.html',
                    title: 'Add Appointment',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<i class="icon ion-paper-airplane"></i>',
                            type: 'button-positive',
                            onTap: function(e) {
                                $scope.patient.appointmentListCollection.push({
                                    by: 'Dr. Ravi',
                                    date: $scope.newAppointmentDate,
                                    notes: $scope.appointmentNotes,
                                    description: 'By : ' + 'Dr. Ravi' + ' on : ' 
                                    + moment($scope.newAppointmentDate).format('DD/MM/YYYY') + ' <br> Note : ' 
                                    + $scope.appointmentNotes
                                });


                            }
                        }
                    ]
                });
            }
            
            $scope.updatePatientInfo = function() {
                $state.reload();
                init();
                $scope.$emit('enable-patient-save', {});  
                $scope.$broadcast('scroll.refreshComplete');
            };
                    
            var init = function() {
                
                diagnosisService.getAll()
                .then(function(result) {
                    $scope.diagnosisCollection = result.map(function(item) {
                        return {description: item.description, id: item.id}
                    });
                }, function(err) {
                    console.error('Error - mediPatientDetail.directive - diagnosisService.getAll() ', err);
                })
                
                procedureService.getAll()
                .then(function(result) {
                    $scope.procedureCollection = result.map(function(item) {
                        return { description: item.description, id: item.id,process: item.process}
                    });
                }, function(err) {
                    console.error('Error - mediPatientDetail.directive - procedureService.getAll() ', err);
                })
                prepareNewVisist();
                
                loadPatientAdmissionInformation();
                
                
                
            }
            
            var loadPatientAdmissionInformation = function() {
                
                admissionService.getById($stateParams.admissionId)
                .then(function (result) {
                    vm.admissionInfo = result;
                    
                    $scope.patient.admissionId = vm.admissionInfo.$id;
                    vm.patient = new Patient(patientInfo, vm.admissionInfo);
                    vm.patient.admissionDate = vm.admissionInfo.admission_date;
                    //This is for binding to the dropdown list
                    $scope.patient.patientStatus = vm.admissionInfo.patientStatus? angular.copy(vm.admissionInfo.patientStatus):[];
                    $scope.patient.diagnosis = vm.admissionInfo.diagnosis? angular.copy(vm.admissionInfo.diagnosis): [];
                    $scope.patient.procedures = vm.admissionInfo.procedures? angular.copy(vm.admissionInfo.procedures): [];
                    $scope.patient.prescriptions = vm.admissionInfo.prescriptions? angular.copy(vm.admissionInfo.prescriptions): [];
                    $scope.patient.medicalExaminations = vm.admissionInfo.medicalExaminations? angular.copy(vm.admissionInfo.medicalExaminations): [];
                    //THis is for binding the current patient information which are displaied in right hand side
                    $scope.patient.current = {};
                    $scope.patient.current.patientStatus = vm.admissionInfo.patientStatus? angular.copy(vm.admissionInfo.patientStatus):{};
                    $scope.patient.current.diagnosis = vm.admissionInfo.diagnosis? angular.copy(vm.admissionInfo.diagnosis): [];
                    $scope.patient.current.procedures = vm.admissionInfo.procedures? angular.copy(vm.admissionInfo.procedures): [];                
                    $scope.patient.current.prescriptions = vm.admissionInfo.prescriptions? angular.copy(vm.admissionInfo.prescriptions): [];
                    $scope.patient.current.medicalExaminations = vm.admissionInfo.medicalExaminations? angular.copy(vm.admissionInfo.medicalExaminations): [];

                })
                
                //console.log($scope.patient)
            }
            
           
            
            var prepareNewVisist = function() {
                $scope.patient.newVisit = {};
            }
            
            var saveNewVisit = function() {

                if(!vm.patient.newVisit) {
                    toaster.pop("warning", "", "No changes to save");
                    console.log('No transactions occured in new visit');
                    return;
                }
                var newTransaction = vm.patient.updateNewVisitInfo(vm.patient);
                if(vm.patient.newVisit.medicalExaminations) {
                    var tempNewExaminations = [];
                    //check from here
                    angular.forEach(vm.patient.newVisit.medicalExaminations, function(item) {
                        if(item.isAdd)
                            tempNewExaminations.push(item.item);
                    })
                    medicalExaminationService.create(tempNewExaminations, vm.admissionInfo.$id, vm.admissionInfo.registered_id)
                    .then(function(result){
                        var woCounter = 0;
                        for(var i = 0; i < result.length; i++ ){
                            woCounter++;
                            result[i].admission_id = vm.admissionInfo.$id;                            
                            workorderManagerService.create(result[i], 'medical-examination', 'dr-ravi')
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
                    }, function(error) {
                        toaster.pop("error", "", "Sorry, Could not save patient infomation");
                        console.error('error while creating medical examination', err)
                    })
                    .then(function(result) {
                        if(newTransaction.prescriptions.length>0) {
                            return prescribedMedicationService.create(newTransaction.prescriptions, vm.admissionInfo.$id, vm.admissionInfo.registered_id);
                        }
                        saveBasicAdmissionTransaction(newTransaction);
                    })
                    .then(function(result) {
                        var woCounter = 0;
                        for(var i = 0; i < result.length; i++ ){
                            woCounter++;
                            result[i].admission_id = vm.admissionInfo.$id;                            
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
                        //get the created id and append to the vm.admissionInfo prescription
                        newTransaction.prescriptions = result;
                        saveBasicAdmissionTransaction(newTransaction);
                    }, function(error) {
                        toaster.pop("error", "", "Sorry, Could not save patient infomation");
                        console.error('error while creating prescribe medication', err)
                    });
                    
                    console.log('before exit save');
                    return;
                }
                
                if(newTransaction.prescriptions.length>0) {                       
                    //create prescribedMedication object
                    prescribedMedicationService.create(newTransaction.prescriptions, vm.admissionInfo.$id, vm.admissionInfo.registered_id)
                    .then(function(result){
                        var woCounter = 0;
                        for(var i = 0; i < result.length; i++ ){
                            woCounter++;
                            result[i].admission_id = vm.admissionInfo.$id;                            
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
                        //get t
                        //get the created id and append to the vm.admissionInfo prescription
                        newTransaction.prescriptions = result;
                        saveBasicAdmissionTransaction(newTransaction);

                    }, function(err) {                    
                        toaster.pop("error", "", "Sorry, Could not save patient infomation");
                        console.error('error while creating prescribe medication', err)
                    })     
                } else {
                    saveBasicAdmissionTransaction(newTransaction);
                }
            }
            
            var saveBasicAdmissionTransaction = function(newTransaction) {
                //save the admission object with updated diagnosis / procedure / status
                vm.admissionInfo.diagnosis = newTransaction.diagnosis;
                vm.admissionInfo.procedures = newTransaction.procedures;
                vm.admissionInfo.patientStatus = newTransaction.patientStatus;
                vm.admissionInfo.prescriptions = newTransaction.prescriptions;
                vm.admissionInfo.medicalExaminations = newTransaction.medicalExaminations;
                
                // console.log('patient state ', vm.patient)
                admissionService.update(vm.admissionInfo)
                .then(function(result) {
                    //console.log('patient admission details succesfully saved');
                    loadPatientAdmissionInformation();                    
                    $scope.$emit('enable-patient-save', {});
                    
                    //create a new transaction for the admission with added and removed object

                    return patientTransactionService.create(newTransaction)
                }, function (err) {
                    toaster.pop("error", "", "Sorry, Could not save patient infomation");
                    console.log('Error - patientDetailController - saveNewVisit ', err);
                })
                .then(function(result) {
                    
                    toaster.pop("success", "", "Patient details successfully saved");
                    //console.log('patient transaction sucessfully added');
                }, function(err) {                    
                    toaster.pop("error", "", "Sorry, Could not save patient infomation");
                    console.error('Error - patientDetailController - saveNewVisit ', err);
                });
                
            }
            
            $rootScope.$on('saveNewVisit', saveNewVisit);
            
            init();
    };
})();
