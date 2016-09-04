(function() {
    angular.module('mediDocApp.controller').controller('registrationController', 
                ['$scope','$state', '$stateParams', '$q', 'toaster','patientMediaService', 'awsService', 'registrationService', registrationController]);
    
    function registrationController($scope,$state, $stateParams, $q, toaster,patientMediaService, awsService, registrationService) {
          
        var vm = this;
        vm.registration = {};
        var sysdate = new Date();
        var output ={};

        vm.init = function() {
            if ($stateParams.id) {
                registrationService.getById($stateParams.id)
                .then(function(result) {
                    vm.registration = result;
                }, function(err) {
                    console.log('err ', err)
                });
                
            }
            vm.registration = {};
        }      

        vm.reset = function(){
            vm.registration = {};
        }  
        
        vm.registerPatient = function() {
            if($stateParams.id) {
                updateRegistration();
            } else {
                newRegistration();
            }
        }
        
        var newRegistration = function() {
          vm.registration.dob = vm.date_of_birth.toString();
          vm.registration.identity_id =  vm.registration.identity_id.toUpperCase();
          vm.registration.created_date = sysdate.toString();
            console.log('newRegistration',vm.registration);
            registrationService.create(vm.registration)
              .then(function(result) {
                    console.log('output',JSON.stringify(result));
                    $state.go('home.patient.admission', {id:result});
                }, function(err) {
                    console.log('err ', err)
                });
           
        }
        
        var updateRegistration = function() {            
             output = registrationService.update(vm.registration);
        }

        vm.searchRegisteredPat = function() {            
                registrationService.getByKeyVal('identity_id',vm.identity_id.toUpperCase())
                   .then(function(res){ 
                        vm.registration = res[0];
                        toaster.pop("success", "", "Patient found");
                    },
                    function(err){
                        toaster.pop("warning", "", "Sorry, No patient registered with ID : ", vm.identity_id.toUpperCase());

                    });
        }
        

        $scope.capturePhoto = function() {
            navigator.camera.getPicture(onSuccess, onFail, { 
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI 
            });
        }

        $scope.fileUploaded = function(file) {
            console.log('img file', file);
            $scope.file = file;
        }
        
        $scope.upload = function() {          
          if($scope.file) {
            awsService.uploadImage($scope.file, 'registration')
            .then(function(resolve) { 
                $scope.uploading = false;
                if(!vm.registration.mediaCollections)
                    vm.registration.mediaCollections = [];
                vm.registration.mediaCollections.push({
                    src: resolve, 
                    sub: 'patient_image', 
                    tag: 'registration' });
                $scope.file = {};
                //console.log('file URI ',resolve);
            }, function(err) {
                $scope.uploading = false;
                console.log('error',err);
            }, function(notify) {
                $scope.progress = notify;
                $scope.uploading = true;
            })
          }
          else {
            console.warn('no files selected')
          }
        }  

        vm.init();
    };
})();
