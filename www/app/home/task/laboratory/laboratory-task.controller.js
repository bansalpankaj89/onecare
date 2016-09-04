(function () {
    'use strict';
    angular
        .module('mediDocApp.controller')
        .controller('laboratoryTaskController', laboratoryTaskController);
    
    laboratoryTaskController.$inject = ['$scope','$ionicScrollDelegate', '$ionicPopup', 'toaster',
                                        'filterFilter', 'taskService', 'admissionService', 'taskManageService'];
    
    function laboratoryTaskController ($scope, $ionicScrollDelegate, $ionicPopup, toaster,
                                        filterFilter, taskService, admissionService, taskManageService) {
        var vm = this;
        var qrScanned = false;
        function init() {
            
            $scope.task = {};
            vm.tasks = [];
            
        }
        
        vm.loadLaboratoryTasks = function(){
            taskService.getByKeyVal('assigned_department', 'laboratory')
            .then(function(result) {
                vm.tasks = [];
                vm.selectedTask = {};                
                $scope.isEditable = false;
                vm.examinationActiveTasks = [];
                
                angular.forEach(result, function(item){
                    if(!item.is_active)
                        return;
                    if(item.type == 'sent-to-examination' && item.current_status != 'completed')
                        vm.examinationActiveTasks.push(item.workorder_id);
                    var tempTask = {
                        prescribed_date: item.date_time,
                        scheduledTime: item.scheduled_time? item.scheduled_time: "",
                        description: item.source.description + " test by Dr. "+ item.workorder.create_user,
                        status: item.current_status,
                        processText: item.type,
                        isEditable: isEditable(item),                            
                        source: item
                    }
                    if(item.examination_sent_time)
                        tempTask.in_time = moment(item.examination_sent_time).format('DD-MM-YYYY HH:mm:ss');
                    vm.tasks.push(tempTask);
                });
                vm.mainFilteredTask = vm.tasks;
                $scope.selectedButton = 'new';
                delete $scope.tempMainFilterdTask;
                qrScanned= false;
                $scope.filterByStatus('new')
                $scope.$broadcast('scroll.refreshComplete');
            }, function(error) {
                $scope.$broadcast('scroll.refreshComplete');
                
            });
        }
        
        $scope.filterByStatus = function(status) {
            vm.selectedTask = {};
            $scope.selectedButton = status;
            if(qrScanned) {
                if(!$scope.tempMainFilterdTask)
                    $scope.tempMainFilterdTask = vm.mainFilteredTask;
                vm.mainFilteredTask = $scope.tempMainFilterdTask;
            } else {
                vm.mainFilteredTask = vm.tasks;
            }
            switch(status) {
                case 'new': {
                        vm.mainFilteredTask = vm.mainFilteredTask.filter(function(item) {
                            if(item.processText == 'schedule' && item.status != 'completed' )
                                return item;
                        })
                    }
                    break;
                case 'schedule': {
                        vm.mainFilteredTask = vm.mainFilteredTask.filter(function(item) {
                            if(item.processText == 'schedule' && item.status == 'completed' && vm.examinationActiveTasks.indexOf(item.source.workorder_id)<0)
                                return item;
                        })
                    }
                    break;
                case 'process': {
                        vm.mainFilteredTask = vm.mainFilteredTask.filter(function(item) {
                            if(item.processText == 'sent-to-examination' && item.status != 'completed') 
                                return item;
                        })
                    }
                    break;
                default:
                    vm.mainFilteredTask = [];
                    break;
            }
        }
        
        var isEditable = function( task) {
            if(task.type == 'schedule' && task.current_status == 'completed') {
                return false;
            } else if(task.type == 'sent-to-examination' && task.current_status == 'completed'){
                return false;
            }
            else if(task.type == 'examination' && task.current_status == 'completed') {
                return false;
            }
            return true;
        }
        
       
        vm.loadScheduled = function() {
            if(vm.selectedTask.task.current_status != 'completed'){
                taskManageService.process(vm.selectedTask.task.workorder, vm.selectedTask.task.source, 'labo', 'read', vm.selectedTask.task)
                .then(function(result) {

                }, function(error) {
                    
                })
            }
            $scope.scheduleData = {};
                    
            vm.loadAppointments();
            
            //vm.get(vm.selectedTask)
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'app/home/task/tpl.schedule-list.view.html',
                title: 'Schedule List',
                subTitle: '',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {    
                            if(!vm.selectedDate){
                                toaster.pop('info', '', 'Please select a time slot for the examination');
                                e.preventDefault();
                            }                                
                            var apointmentTime = moment(moment(vm.selectedDate).format('DD-MM-YYYY') + " " +$scope.activeElement,'DD-MM-YYYY HH:mm:ss').format('MM-DD-YYYY HH:mm:ss');
                            vm.selectedTask.task.appointment_time = new Date(apointmentTime).toString();
                            console.log(vm.selectedTask.task)
                            taskManageService.process(vm.selectedTask.task.workorder, vm.selectedTask.task.source.source, 'labo', 'completed', vm.selectedTask.task)
                            .then(function(result) {
                                toaster.pop('success', '', 'Time slot successfully allocated');
                                console.log('updated read status for ', result);
                                vm.loadLaboratoryTasks();
                                vm.loadAppointments();
                            }, function(error) {

                            })
                        }
                    }
                ]
            });
        }
        
        vm.loadAppointments = function() {
            
            $scope.scheduleData.tasks = [];
             taskService.getByKeyVal('type', 'appointment')
            .then(function(result) {
                $scope.scheduleData.tasks = result.map(function(item){
                    return {
                        appointment_time: moment(item.appointment_time).format('DD-MM-YYYY HH:mm:ss'),
                        description: item.source.description + " test by Dr. "+ item.workorder.create_user,
                        status: item.current_status,
                        processText: item.type,
                        source: item
                    }
                });
                $scope.filterAppointmentTask();
            }, function(error) {
                 console.log('appointments', error);

            });
        }
        
        vm.processTask = function(task) {
            //Get admission information,
            
            $scope.selectedItem = task;
            $scope.isEditable = task.isEditable;
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
                vm.selectedTask.appointment_date = task.source.appointment_time ? moment(task.source.appointment_time).format('DD-MM-YYYY HH:mm:ss'): "";
                vm.selectedTask.in_time = task.in_time;
                vm.selectedTask.task = task.source;
            }, function(error) {
                
            });            
        }
        
        vm.filterByAdmission = function(barcodeData) {    
            $scope.barcodeInfo = barcodeData.text.split(":");
            if($scope.barcodeInfo && $scope.barcodeInfo.length ==2) {
                vm.mainFilteredTask = vm.tasks.filter(function(item) {
                    if(item.source.admission_id == $scope.barcodeInfo[1])
                    {
                        return item;
                    }
                })
                delete $scope.tempMainFilterdTask;
                qrScanne = true;
            }
            
        }
        
        $scope.filterAppointmentTask = function(selectedDate) {
            if(!selectedDate)
                vm.selectedDate = new Date();
            else 
                vm.selectedDate = new Date(selectedDate);
            
            if(!$scope.scheduleData.tasks)
                $scope.scheduleData.tasks = [];
            $scope.allocatedTimes = [];
            $scope.allocatedDates = [];
            $scope.appointmentFilterTasks = $scope.scheduleData.tasks.filter(function(item) { 
                var tempDate = moment(item.appointment_time, 'DD-MM-YYYY HH:mm:ss');
                if(tempDate.isSame(moment(vm.selectedDate), 'day'))
                {
                    if($scope.allocatedDates.indexOf(tempDate.format('DD-MM-YYYY'))<0){
                        $scope.allocatedDates.push(tempDate.format('DD-MM-YYYY'));
                    }
                    $scope.allocatedTimes.push(tempDate.format('HH')+":00");
                    return item;
                }
            })
            console.log($scope.allocatedDates)
        }
        
        $scope.updateExamined = function() {
            vm.selectedTask.task.examined_time = new Date().toString();
            taskManageService.process(vm.selectedTask.task.workorder, vm.selectedTask.task.source.source, 'labo', 'completed', vm.selectedTask.task)
            .then(function(result) {
                toaster.pop('success', '', 'Examined update successfully saved');
                vm.loadLaboratoryTasks();
                vm.loadAppointments();
            }, function(error) {

            });
        }
        
        
        $scope.loadFilterTime = function(time) {
            if(!$scope.scheduleData.tasks)
                $scope.scheduleData.tasks = [];
            $scope.activeElement = time;
            
            var startTime = moment(moment(vm.selectedDate).format('DD-MM-YYYY') + " " + time, 'DD-MM-YYYY HH.mm');
            vm.selectedEventTime = startTime;
            var endTime = moment(startTime, 'DD-MM-YYYY HH:mm').add(59, 'm');
            $scope.appointmentFilterTasks = $scope.scheduleData.tasks.filter(function(item) {
                if(moment(item.appointment_time, 'DD-MM-YYYY HH:mm:ss').isSame(startTime))
                    return item;
            })
        }
        
        
        vm.taskDateSelected = function(selectedDate) {
            //$scope.appointmentFilter = { scheduleTime: moment(selectedDate).format('DD-MMM-YYYY') };
        }


     init(); 

    };
}());



   






