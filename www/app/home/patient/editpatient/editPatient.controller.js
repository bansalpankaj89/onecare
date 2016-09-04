(function() {
    angular.module('mediDocApp.controller').controller('editPatientController', 
        ['$scope','$state', '$stateParams', '$q','staffDesignationConst','hospitalDepartmentConst','patientStatusConst','admissionService','registrationService','wardService','staffService', editPatientController]);
    
    function editPatientController($scope,$state, $stateParams,$q,staffDesignationConst,hospitalDepartmentConst,patientStatusConst,admissionService,registrationService,wardService,staffService) {
        //code goes here   
        var vm = this;
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


            $q(function(resolve, reject) {
                wardService.getAll()
                    .then(function(res){ 
                        vm.wardList = res;
                        resolve(res)
                    },
                    function(err){
                        reject(err);
                    });
            });

            $q(function(resolve, reject) {
                staffService.getAll()
                    .then(function(res){ 
                        vm.staffList = res;
                        resolve(res)
                    },
                    function(err){
                        reject(err);
                    });
            });

            vm.searchRegisteredPat = function() {
                $q(function(resolve, reject) {
                    registrationService.getByRegistrationId('identity_id',vm.registered_id)
                       .then(function(res){ 
                            vm.regPatientList = res;
                             resolve(res)
                        },
                        function(err){
                             reject(err);
                        });
                });
            }


            $scope.filterAvalibleBed = function(bed) {
                return (bed.status == 'available' );
            };

              $scope.filterStaff = function(staff) {
               // console.log(vm.admissionList.staff_designation)
                return (staff.designation == vm.selecteddesignation);
            };

        }   


        var updateWardInfo = function() {
            var wardList = {};
            wardList =  vm.wardList.filter(function(d){
              return  d.ward_no == vm.selectedWard.ward_no;
            })


            var replaceByValue  =  function() {
                for( var k = 0; k < wardList[0].bedDetails.length; ++k ) {
                    if( vm.selectedBed.bed_no == wardList[0].bedDetails[k]["bed_no"] ) {
                        wardList[0].bedDetails[k]["status"] = "unavailable" ;
                    }
                }
                return wardList[0].bedDetails;
            }  

            replaceByValue();

            console.log("final ward",wardList);
            wardService.update(wardList);
        }


        var newAdminsion = function() {

           vm.admissionList.registered_id = vm.regPatientList.$id;
           vm.admissionList.admission_date = vm.sysdate.toString();

           vm.admissionList.signs = vm.regPatientList.signs;
           vm.admissionList.symptoms  = vm.regPatientList.symptoms;
           vm.admissionList.history  = vm.regPatientList.history;
           vm.admissionList.allergies  = vm.regPatientList.allergies;

           vm.admissionList.patient = {};
           vm.admissionList.patient.name = vm.regPatientList.first_name +" "+ vm.regPatientList.last_name +" "+ vm.regPatientList.other_name ;
           vm.admissionList.patient.dob = vm.regPatientList.dob;
           vm.admissionList.patient.gender = vm.regPatientList.gender;
           vm.admissionList.patient.blood_group = vm.regPatientList.blood_group;
           vm.admissionList.patient.identity_id = vm.regPatientList.identity_id;
           vm.admissionList.patient.guardian_name = vm.regPatientList.guardian_name;
           vm.admissionList.patient.contact = vm.regPatientList.contact_no;

           vm.admissionList.beddetails = {};
           vm.admissionList.beddetails.department = vm.selecteddepartment;
           vm.admissionList.beddetails.bed_no = vm.selectedBed.bed_no;
           vm.admissionList.beddetails.ward_no = vm.selectedWard.ward_no;

           vm.admissionList.staff = [];
           console.log(vm.selectedStaff.$id+"----"+vm.selectedStaff.identity_id+"---"+vm.selecteddesignation+"--"+vm.selectedStaff.first_name)
          
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
                   

           console.log('newAdminsion',vm.admissionList);
           var output = admissionService.create(vm.admissionList);

           updateWardInfo();
        }
         
        vm.saveAdmission = function(){
            console.log(vm.regPatientList);
            registrationService.update(vm.regPatientList);
            newAdminsion();
            $state.go('home.patient-list');
        }
        
       
        vm.init();
    };
})();
