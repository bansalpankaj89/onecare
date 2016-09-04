(function() {
    angular.module('mediDocApp.controller').controller('admissionController', admissionController);
        
    admissionController.$inject = ['$scope','$state', '$stateParams', '$q', 'toaster',
                                   'staffDesignationConst', 'hospitalDepartmentConst', 'patientStatusConst', 'Patient',
                                   'admissionService', 'registrationService', 'wardService', 'staffService',
                                   'patientTransactionService'];
    
    function admissionController( $scope, $state, $stateParams, $q, toaster,
                                   staffDesignationConst, hospitalDepartmentConst, patientStatusConst, Patient,
                                   admissionService, registrationService, wardService, staffService,
                                   patientTransactionService) {
        //code goes here   
        var vm = this;
        
        vm.patient = {};
        vm.admission = {};
        vm.regPatientList = {};
        vm.admissionList = {};
        vm.wardList = [];
        vm.staffList = [];
        vm.selectedWard ='';
        vm.selecteddepartment ='';
        vm.selectedStaff = {};
        vm.selecteddesignation = '';
        vm.sysdate = new Date();

        vm.init = function() {

            vm.reset = function(){
               vm.regPatientList = {};
               vm.admissionList = {};
           }  

          $scope.staffDesignations = staffDesignationConst;
          $scope.hospitalDepartments = hospitalDepartmentConst;
          $scope.patientStatus = patientStatusConst;

            if ($stateParams.id) {
                console.log('$stateParams.id',JSON.stringify($stateParams.id));
                registrationService.getById($stateParams.id)
                .then(function(result) {
                    vm.regPatientList = result;
                }, function(err) {
                    console.log('err ', err)
                });
            }


//            $q(function(resolve, reject) {
                wardService.getAll()
                    .then(function(res){ 
                        vm.wardList = res;
//                        resolve(res)
                    },
                    function(err){
//                        reject(err);
                    });
//            });

//            $q(function(resolve, reject) {
                staffService.getAll()
                    .then(function(res){ 
                        angular.forEach(res, function(item) {
                            item.full_name = item.last_name + ' ' + item.first_name;
                            
                            if(item.designation == 'Doctor' || item.designation == 'Head of Department')
                                item.full_name = 'Dr. '+ item.full_name;
                        });
                        vm.staffList = res;
//                        resolve(res)
                    },
                    function(err){
//                        reject(err);
                    });
//            });

           

        }   
        
         vm.searchRegisteredPat = function() {
            //$q(function(resolve, reject) {
                registrationService.getByKeyVal('identity_id',vm.identity_id)
                   .then(function(res){ 
                    if(res && res.length == 1 )
                        vm.regPatientList = res[0];
                        // resolve(res)
                    },
                    function(err){
                       // reject(err);
                    });
            //});
        }


        $scope.filterAvalibleBed = function(bed) {
            return (bed.status == 'available' );
        };

          $scope.filterStaff = function(staff) {
           // console.log(vm.admissionList.staff_designation)
            return (staff.designation == vm.selecteddesignation);
        };


        var updateWardInfo = function() {
            return $q(function(resolve, reject) {
                var wardList = {};
                wardList =  vm.wardList.filter(function(d){
                  return  d.ward_no == vm.selectedWard.ward_no;
                })


                //var replaceByValue  =  function() {
                for( var k = 0; k < wardList[0].bedDetails.length; ++k ) {
                    if( vm.selectedBed.bed_no == wardList[0].bedDetails[k]["bed_no"] ) {
                        wardList[0].bedDetails[k]["status"] = "unavailable" ;
                    }
                }
                wardList[0].bedDetails;
                //}  

                wardService.update(wardList)
                .then(function(result) {
                    return resolve(result);
                }, function(error) {
                    return reject(error);
                })
            })
           
        }


        var newAdminsion = function() {
            return $q(function(resolve, reject) {

                vm.admissionList.registered_id = vm.regPatientList.$id;
                vm.admissionList.admission_date = new Date().toString();
                vm.admissionList.patientStatus = [{
                        description: vm.admissionList.status,
                        selected: true,
                        value: vm.admissionList.status
                    }];
                vm.regPatientList.signs? vm.admissionList.signs = vm.regPatientList.signs : vm.admissionList.signs = "";
                vm.regPatientList.symptoms? vm.admissionList.symptoms = vm.regPatientList.symptoms : vm.admissionList.symptoms = "";
                vm.regPatientList.history? vm.admissionList.history = vm.regPatientList.history : vm.admissionList.history = "";
                vm.regPatientList.allergies? vm.admissionList.allergies = vm.regPatientList.allergies : vm.admissionList.allergies = "";


                vm.admissionList.patient = {};
                vm.admissionList.patient.name = vm.regPatientList.first_name +" "+ vm.regPatientList.last_name +" "+ (vm.regPatientList.other_name?vm.regPatientList.other_name : "");
                vm.admissionList.patient.dob = vm.regPatientList.dob;
                vm.admissionList.patient.gender = vm.regPatientList.gender;
                vm.regPatientList.blood_group? vm.admissionList.patient.blood_group = vm.regPatientList.blood_group : vm.admissionList.patient.blood_group = "";

                vm.admissionList.patient.identity_id = vm.regPatientList.identity_id;
                vm.regPatientList.guardian_name? vm.admissionList.patient.guardian_name = vm.regPatientList.guardian_name : vm.admissionList.patient.guardian_name = "";
                vm.regPatientList.contact_no? vm.admissionList.patient.contact = vm.regPatientList.contact_no: vm.admissionList.patient.contact ="";

                vm.admissionList.beddetails = {};
                vm.admissionList.beddetails.department = vm.selecteddepartment;
                vm.admissionList.beddetails.bed_no = vm.selectedBed.bed_no;
                vm.admissionList.beddetails.ward_no = vm.selectedWard.ward_no;

                vm.admissionList.staff = [];
                //console.log(vm.selectedStaff.$id+"----"+vm.selectedStaff.identity_id+"---"+vm.selecteddesignation+"--"+vm.selectedStaff.first_name)

                vm.admissionList.staff.push({ 
                  "staff_id" : vm.selectedStaff.$id,
                  "identity_id"  : vm.selectedStaff.identity_id,
                  "name"       : vm.selectedStaff.first_name +" "+vm.selectedStaff.last_name,
                  "staff_designation"  : vm.selecteddesignation,
                  "notes" : []
                });
                //   vm.admissionList.staff[0].staff_id = vm.selectedStaff.$id;
                //   vm.admissionList.staff[0].identity_id = vm.selectedStaff.identity_id;
                //   vm.admissionList.staff[0].name = vm.selectedStaff.first_name +" "+vm.selectedStaff.last_name;
                //   vm.admissionList.staff[0].staff_designation = vm.selecteddesignation;
                admissionService.create(vm.admissionList)
                .then(function(result) {
                    return resolve(result);
                }, function(error) {
                   return reject(error);
                });
            });
        }
        
        var updateAdmissionStatus = function() {
            return $q(function(resolve, reject) {
                $scope.patient = {};
                $scope.patient.newVisit = {};
                vm.patient = new Patient(vm.regPatientList, vm.admissionInfo);
                var tempPatientStatus = [{
                    description: vm.admissionList.status,
                    selected: true,
                    value: vm.admissionList.status
                }];
                vm.patient.setPatientStatus(tempPatientStatus, true);
                var newTransaction = vm.patient.updateNewVisitInfo(vm.patient);
                debugger;
                patientTransactionService.create(newTransaction)
                .then(function(result) {
                   return resolve(result);
                }, function(error) {
                    console.error('Error - patientDetailController - saveNewVisit ', err);
                    return reject(error)
                });    
            })
            
        }
         
        vm.saveAdmission = function(){
            registrationService.update(vm.regPatientList)
            .then(function(result) {
                return newAdminsion();
            }, function(error) {    
                toaster.pop('warning','','Sorry, Could not save admission information');
                console.log('Error while updating patent infroamtion ', error);
            })
            .then(function(result) {
                return admissionService.getById(result);
            }, function(error) {                
                toaster.pop('warning','','Sorry, Could not save admission information');
                console.log('Error while saving admission ', error);
            })
//            .then(function(result) {
//                vm.admissionInfo = result;
//                return updateWardInfo();
//            }, function(error) {                
//                toaster.pop('warning','','Sorry, Could not save admission information');
//                console.log('Error while retriing admission info', error);
//            })
            .then(function(result) {
                //comment if  top update is sorted out
                vm.admissionInfo = result;
                return updateAdmissionStatus();
            }, function(error) {                
                toaster.pop('warning','','Sorry, Could not save admission information');
                console.log('Error while saving ward updates', error);
            })
            .then(function(result) {     
                toaster.pop('success','', 'Successfully admitted patient');
                $state.go('home.patient-list');
            }, function(error) {
                toaster.pop('warning','','Sorry, Could not save admission information');
                console.log('Error while saving patient transaction', error);
            })
        }
        
       
        vm.init();
    };
})();
