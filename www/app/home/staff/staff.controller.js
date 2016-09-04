(function () {
    'use strict';
    angular
        .module('mediDocApp.controller')
        .controller('staffController',
                    ['$scope','$state','$stateParams','staffDesignationConst','staffSpecialityConst','hospitalDepartmentConst','staffService', staffController]);

    function staffController ($scope,$state,$stateParams,staffDesignationConst,staffSpecialityConst,hospitalDepartmentConst,staffService) {

      var vm = this;
      vm.staff = {};
      var sysdate = new Date();

      vm.init = function() {

          $scope.staffDesignations = staffDesignationConst;
          $scope.staffSpecialities = staffSpecialityConst;
          $scope.hospitalDepartments = hospitalDepartmentConst;

          if ($stateParams.id) {
              staffService.getById($stateParams.id)
              .then(function(result) {
                  vm.staff = result;
              }, function(err) {
                  console.log('err ', err)
              }); 
          }
      }        
        
        vm.addStaff = function() {
            if($stateParams.id) {
                updateStaff();
            } else {
                newStaff();
                $state.go('home.stafflist');
            }
        }
        
        var newStaff = function() {
          vm.staff.dob = vm.date_of_birth.toString();
          vm.staff.created_date = sysdate.toString();
            console.log('newStaff',vm.staff);
           var output = staffService.create(vm.staff);
        }
        
        var updateStaff = function() {            
            var output = staffService.update(vm.staff);
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
                if(!vm.staff.mediaCollections)
                    vm.staff.mediaCollections = [];
                vm.staff.mediaCollections.push({
                    src: resolve, 
                    sub: 'staff_image', 
                    tag: 'registration'});
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
}());


   






