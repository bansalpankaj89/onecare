(function() {
    angular.module('mediDocApp.controller').controller('patientListController', 
            ['$scope','$ionicPopup','$ionicPopover','$ionicModal','$stateParams','$state','admissionService', 'toaster', patientListController]);

    function patientListController($scope, $ionicPopup,$ionicPopover, $ionicModal, $stateParams, $state, admissionService, toaster) {
        var vm = this; 
                
        $scope.searchAdmission = function (barcodeData) {
            $scope.barecodeInfo = barcodeData.text.split(":");
            if($scope.barecodeInfo && $scope.barecodeInfo.length ==2) {
                $state.go('home.patient.view',
                          {'id':$scope.barecodeInfo[0], 
                           'admissionId': $scope.barecodeInfo[1], 
                           'name': ""});
            }
        }
        
        vm.patientDetail = function(admission) {
            $state.go('home.patient.view',{'id': admission.registered_id, 
                                           'admissionId': admission.$id, 
                                           'name': admission.patient.name });
        }

         vm.notification = function(patient) {
            $state.go('home.patient.view',{'id': patient.registered_id, 
                                           'admissionId': patient.$id, 
                                           'name': patient.patient.name });
        }

       $ionicPopover.fromTemplateUrl('/app/home/patient-list/popover.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.popover = popover;
        });

        vm.confirmUnfollow = function(){
             var confirmPopup = $ionicPopup.confirm({
               title: 'Unfollow Patient',
               template: 'By unfollow this patient,you will not recieve any notifications further.'
             });
             confirmPopup.then(function(res) {
               if(res) {
                 console.log('You are sure');
               } else {
                 console.log('You are not sure');
               }
             });
        };

        vm.confirmDischarge = function(admission){
//             var confirmPopup = $ionicPopup.confirm({
//               title: 'Discharge Patient',
//               template: 'Are you sure you want to discharge this patient?'
//             });
//             confirmPopup.then(function(res) {
//               if(res) {
                 $state.go('home.patient.discharge',{id: admission.registered_id, admissionId: admission.$id});
//               } else {
//                 console.log('You are not sure');
//               }
//             });
        };

        vm.confirmCall = function(number){
          if(cordova !== undefined){
          cordova.InAppBrowser.open('tel:' + number, '_system');  }
          else{
            alert('Contact No : '+number);
          }
        };  

        vm.confirmConsult = function(admission){
           $state.go('home.patient.consult',{id: admission.registered_id, admissionId: admission.$id});
        }; 

        vm.confirmTransfer = function(admission){
           $state.go('home.patient.transfer',{id: admission.registered_id, admissionId: admission.$id});
        }; 
        
        vm.loadAdmissions = function() {
            admissionService.getAll()
            .then(function(result) {
                //console.log('list of admissions ', result)
                angular.forEach(result, function(item) {
                    item.admission_date = moment(item).format("ddd do MMM YYYY HH:mm:ss")
                    if(item.beddetails.ward_no == "ICU")
                        item.rank = 5;
                    else if(item.patientStatus[0].value == 'Recovery')
                        item.rank = 2;
                    else if(item.patientStatus[0].value == 'Dead')
                        item.rank = 6;
                    else 
                        item.rank = 3;
                })
                vm.patientList = result;
                $scope.$broadcast('scroll.refreshComplete');
                //console.log('vm.patientList',vm.patientList);
            }, function(error) {
                toaster.pop("info","","No patients currently addmited")
            });
        }
        
        function init() {
            vm.loadAdmissions();
        }
        
        init();
        
    };
})();
