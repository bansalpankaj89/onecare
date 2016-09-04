(function() {
    angular.module('mediDocApp.controller').controller('patientNotificationController', patientNotificationController);

        patientNotificationController.$injet = ['$scope', '$stateParams','notificationService','admissionService'];

    
    function patientNotificationController($scope, $stateParams,notificationService,admissionService) {
        var vm = this;
        vm.sysdate = new Date();
        vm.newNotification = {};
        vm.notifications = [];
        vm.admissionInfo = {};
        console.log('vm.notifications');

            function init() {
            	admissionService.getById($stateParams.admissionId)
                      .then(function(output) {
                        vm.admissionInfo = output;
                      	if(output.notification !== undefined){
                          vm.notifications = output.notification;
                      	}
                      }, function(err) {
                          console.log('err ', err)
                      });
            }


          var updateNotificationAdminsion = function(output) {
                  console.log("notification",output);
                  if(vm.admissionInfo.notification === undefined){
                    vm.admissionInfo.notification = [];
                  }
                    vm.admissionInfo.notification.push({ 
                       "remark" : output.remark,
                       "date"  : output.date,
                       "id" : output.$id,
                       "by" : output.by
                    });
                    admissionService.update(vm.admissionInfo);
                    init();
                    vm.newNotification.remark = '';
                }

              vm.addNewNotification = function() {
                vm.newNotification.date = vm.sysdate.toString();
                // todo : replace by login person
                vm.newNotification.by = "Pankaj Bansal";  
                notificationService.create(vm.newNotification)
                    .then(function(result) {
                     //   console.log('output',JSON.stringify(result));
                         notificationService.getById(result)
                          .then(function(output) {
                              updateNotificationAdminsion(output);
                          }, function(err) {
                              console.log('err ', err)
                          });
                    }, function(err) {
                        console.log('err ', err)
                    });
               }
        
           init(); 
    };
})();
