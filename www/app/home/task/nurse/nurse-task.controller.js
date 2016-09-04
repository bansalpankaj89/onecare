(function () {
    'use strict';
    angular
        .module('mediDocApp.controller')
        .controller('nurseTaskController', nurseTaskController);
    
    nurseTaskController.$inject = ['$scope','$ionicScrollDelegate', '$ionicPopup', 'toaster',
                                   'filterFilter', 'taskService', 'admissionService', 'taskManageService'];
    
    function nurseTaskController ($scope, $ionicScrollDelegate, $ionicPopup, toaster, 
                                   filterFilter, taskService, admissionService, taskManageService) {
        var vm = this;
        function init() {

  

        }
        
        vm.loadNurseTasks = function() {
            vm.tasks  = [];
            taskService.getByKeyVal('assigned_department', 'nurse')
            .then(function(result) {
                angular.forEach(result, function(item){
                    if(!item.is_active)
                        return;
                    vm.tasks.push({
                        scheduledTime: item.date_time,
                        description: item.source.description + " test by Dr. "+ item.workorder.create_user,
                        status: item.current_status,
                        processText: item.type,
                        isEditable: isEditable(item),
                        source: item
                    });
                });
                vm.mainFilteredTask = vm.tasks;
                //vm.filterMainTask();
                $scope.$broadcast('scroll.refreshComplete');
            }, function(error) {
                
            });
        }
        
        var isEditable = function(taskItem) {
            switch(taskItem.processText) {
                case 'medication': {
                    if(taskItem.status != 'completed')
                        return true;
                    return false;
                }
                break;
                case 'appointment': {
                    if(taskItem.status != 'completed')
                        return true;
                    return false;
                }
                break;
                default:
                    return false;
                break;
            }
        }
        
        vm.filterMainTask = function(mainSelectedDate) {
            if(!mainSelectedDate)
                vm.mainSelectedDate = new Date();
            else 
                vm.mainSelectedDate = new Date(mainSelectedDate);
            
            if(!vm.tasks)
                vm.tasks = [];
            vm.mainFilteredTask = vm.tasks.filter(function(item) {
                if(moment(item.source.appointment_time).isSame(vm.mainSelectedDate, 'day'))
                {
                    return item;
                }
            });
        }   
        
        vm.stopMedication = function () {
            console.log('complete medication')
        }
        
        vm.executeTask = function () {
            if(vm.selectedTask.task.type == 'appointment') {
                vm.selectedTask.task.examination_sent_time = new Date().toString();
                taskManageService.process(vm.selectedTask.task.workorder, vm.selectedTask.task.source.source, 'labo', 'completed', vm.selectedTask.task)
                .then(function(result) {
                    toaster.pop('success', '','Appointment update successfully saved');
                    vm.loadNurseTasks();
                }, function(error) {
                    toaster.pop('warning', '','Sorry, Could not save appointment changes');

                });
            } else if (vm.selectedTask.task.type == 'medication') {
                vm.selectedTask.task.last_medication = new Date().toString();
                taskManageService.process(vm.selectedTask.task.workorder, vm.selectedTask.task.source.source, 'labo', 'give-medication', vm.selectedTask.task)
                .then(function(result) {                    
                    toaster.pop('success', '','Medication update successfully saved');
                    vm.loadNurseTasks();
                }, function(error) {
                    toaster.pop('warning', '','Sorry, Could not save medication changes');
                });
            }
        }
        
        vm.processTask = function(task) {          
            $scope.isEditable = task.isEditable;
            //Get admission information,
            $scope.selectedItem = task;
            $scope.isEditable = isEditable;
            vm.selectedTask = {};
            admissionService.getById(task.source.admission_id)
            .then(function (result) {
                vm.selectedTask.admission_id = task.source.admission_id;
                vm.selectedTask.full_name = result.patient.name;
                vm.selectedTask.ward_no  = result.beddetails.ward_no;
                vm.selectedTask.bed_no = result.beddetails.bed_no;
                vm.selectedTask.examination = task.source.source.description;
                vm.selectedTask.assigner = task.source.create_user;
                vm.selectedTask.prescribed_date = moment(task.source.date_time).format('DD-MM-YYYY HH:mm:ss');        
                switch(task.source.type) {
                    case 'appointment':
                        vm.processingItemText = 'SEND TO EXAMINATION';                
                        vm.selectedTask.appointment_date = task.source.appointment_time ? moment(task.source.appointment_time).format('DD-MM-YYYY HH:mm:ss'): "";
                        break;
                    case 'medication':
                        vm.processingItemText = 'MEDICATION GIVEN';
                        vm.selectedTask.last_medication = task.source.last_medication ? moment(task.source.last_medication).format('DD-MM-YYYY HH:mm:ss'): "";
                }
                vm.selectedTask.task = task.source;                
                return taskManageService.process(vm.selectedTask.task.workorder, vm.selectedTask.task.source, 'Nurse', 'read', vm.selectedTask.task)                
            }, function(error) {
                
            })
            .then(function(result) {
                
            }, function(error) {

            });            
        }
        
        vm.filterByAdmission = function(barcodeData) {    
            $scope.barcodeInfo = barcodeData.text.split(":");
            if($scope.barcodeInfo && $scope.barcodeInfo.length ==2) {
                $scope.mainFilteredTask = vm.tasks.filter(function(item) {
                    if(item.source.admission_id == $scope.barcodeInfo[1])
                    {
                        return item;
                    }
                })
            }
            
        }
        
        $scope.task = {};
        vm.tasks = [];
        vm.taskDateSelected = function(selectedDate) {
            //$scope.appointmentFilter = { scheduleTime: moment(selectedDate).format('DD-MMM-YYYY') };
        }


     init(); 

    };
}());



   






