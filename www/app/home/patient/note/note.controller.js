(function() {
    angular.module('mediDocApp.controller').controller('noteController', 
        ['$scope','$state', '$stateParams', '$q','$ionicPopup','patientInfo', 'admissionInfo','admissionService','notesService','notificationService', noteController]);
    
    function noteController($scope,$state, $stateParams,$q,$ionicPopup,patientInfo, admissionInfo,admissionService,notesService,notificationService) {
        //code goes here   
        var vm = this;
        vm.sysdate = new Date();
        vm.newNote = {};
        vm.notification = {};
        vm.admissionInfo = admissionInfo;
        vm.patientInfo = patientInfo;
        vm.showDelete = false;

        vm.init = function() {
           
            console.log("-----",vm.admissionInfo.staff[0].notes);
            vm.notes = vm.admissionInfo.staff[0].notes;

         vm.onItemDelete = function(note) {
            vm.notes.splice(vm.notes.indexOf(note), 1);
          };

        }   
        vm.init();

        vm.addNewNote = function() {
          vm.newNote.remark_date = vm.sysdate.toString();
          // todo : replace by login person
          vm.newNote.remark_by = "Pankaj Bansal";  
          notesService.create(vm.newNote)
            .then(function(result) {
                    console.log('output',JSON.stringify(result));
                     notesService.getById(result)
                      .then(function(output) {
                          vm.notesDetails = output;
                          updateNoteAdminsion(output);
                      }, function(err) {
                          console.log('err ', err)
                      });
                //    $state.go('home.patient.admission', {id:result});
                }, function(err) {
                    console.log('err ', err)
                });
        }


        var updateNoteAdminsion = function(output) {
          console.log("notes",output);
          if(vm.admissionInfo.staff[0].notes === undefined){
            vm.admissionInfo.staff[0].notes = [];
          }
            vm.admissionInfo.staff[0].notes.push({ 
               "remark" : output.remark,
               "remark_date"  : output.remark_date,
               "id" : output.$id,
               "notification" : "off"
            });
            admissionService.update(vm.admissionInfo);
            vm.init();
            vm.newNote.remark = '';
        }
        
        vm.updateNote = function() {            
            var output = notesService.update(vm.newNote);
        }
        

        vm.share = function(note) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Send Message',
            template: 'Are you sure you want to share this meassage with other staff?'
            });

          confirmPopup.then(function(res) {
            if(res) {
             console.log('You are sure');
             addNewNotification(note);
            } else {
             console.log('You are not sure');
            }
          });
        };




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
        }

        var addNewNotification = function(note) {
          console.log('share note',note);

          vm.notification.remark = note.remark;
          vm.notification.date = vm.sysdate.toString();
          // todo : replace by login person
          vm.notification.by = "Pankaj Bansal";  

          notificationService.create(vm.notification)
            .then(function(result) {
                 //   console.log('output',JSON.stringify(result));
                     notificationService.getById(result)
                      .then(function(output) {
                          updateNotificationAdminsion(output);
                      }, function(err) {
                          console.log('err ', err)
                      });
                //    $state.go('home.patient.admission', {id:result});
                }, function(err) {
                    console.log('err ', err)
                });
        }
       

    };
})();
