(function() {
    angular.module('mediDocApp.service')
    .factory('medicationTaskManagerService', medicationTaskManagerService);
    
    medicationTaskManagerService.$inject = ['$q', 'prescribedMedicationService', 'taskService', 'workorderService', 'taskDetailService']
    
    function medicationTaskManagerService($q, prescribedMedicationService, taskService, workorderService, taskDetailService) {    
        
        var schedule = function(masterTask, createUser, status) {
            return $q(function(resolve, reject) {
                switch(status) {
                    case 'new':
                        {
                            var taskDetail = {
                                create_user: createUser,
                                current_status: 'new',
                                type: 'schedule',
                                workorder_type: masterTask.workorder.type,
                                assigned_department: 'laboratory',
                                assigned_group: 'lab_user',
                                source: masterTask.source,
                                workorder: masterTask.workorder,
                                workorder_id: masterTask.workorder.$id,
                                master_task_id: masterTask.$id
                            };
                            taskDetailService.create(taskDetail)
                            .then(function(result){                            
                                console.log('success - medicalExaminationTaskManagerService - schedule_new');
                                taskDetail.$id = result;
                                return resolve(taskDetail);
                            }, function(error) {                            
                                console.error('error - medicalExaminationTaskManagerService - schedule_new : while creating schedule task detail schedule for medical examination on create operation', err)  
                                return reject(error);
                            })
                        }
                        break;
                    case 'delay':
                        {
                            taskDetailService.getByKeyVal('master_task_id', masterTask.$id)
                            .then(function(result) {
                                var taskDetail = result;
                                taskDetail.current_status= 'delay';
                                taskDetail.delay_notification_time = new Date().toString();
                                taskDetailService.update(taskDetail);                                
                                console.log('success - medicalExaminationTaskManagerService - schedule_delay');

                                return resolve(taskDetail);                                
                                
                            }, function(error) {
                                console.error('error - medicalExaminationTaskManagerService - schedule_delay : while updating schedule task detail schedule for medical examination on create operation', err)  
                                return reject(error);

                            })
                        }
                        break;
                    case 'read':
                        {
                            taskDetailService.getByKeyVal('master_task_id', masterTask.$id)
                            .then(function(result) {
                                var taskDetail = result[0];
                                taskDetail.current_status= 'read';
                                taskDetail.read_time = new Date().toString();
                                taskDetail.read_user = createUser;
                                taskDetailService.update(taskDetail);                                
                                console.log('success - medicalExaminationTaskManagerService - schedule_delay');
                                return resolve(taskDetail);               
                            }, function(error) {
                                console.error('error - medicalExaminationTaskManagerService - schedule_delay : while updating schedule task detail schedule for medical examination on create operation', err)  
                                return reject(error);

                            })
                        }
                        break;
                    case 'completed':
                        {
                            taskDetailService.getByKeyVal('master_task_id', masterTask.$id)
                            .then(function(result) {
                                var taskDetail = result;
                                taskDetail.current_status= 'completed';
                                taskDetail.completed_time = new Date().toString();
                                taskDetail.completed_user = createUser;
                                taskDetailService.update(taskDetail);
                                is_active: true                               
                                console.log('success - medicalExaminationTaskManagerService - schedule_completed');

                                return resolve(taskDetail);                                
                                
                            }, function(error) {
                                console.error('error - medicalExaminationTaskManagerService - schedule_completed : while updating schedule task detail schedule for medical examination on create operation', err)  
                                return reject(error);

                            })
                        }
                        break;
                    default:
                        return reject('error - medicalExaminationTaskManagerService - schedule : default reached in ')
                        break;
                }
            })
        }
        
        var appointment = function(masterTask, createUser, status ) {
            return $q(function(resolve, reject) {
                switch(status) {
                    case 'new':
                                {
                                    var taskDetail = {
                                        create_user: createUser,
                                        current_status: 'new',
                                        type: 'appointment',
                                        workorder_type: masterTask.workorder.type,
                                        assigned_department: masterTask.assigned_department,
                                        assigned_group: masterTask.assigned_group,
                                        source: masterTask.source,
                                        workorder: masterTask.workorder,
                                        master_task_id: masterTask.$id
                                    };
                                    taskDetailService.create(taskDetail)
                                    .then(function(result){                            
                                        console.log('success - medicalExaminationTaskManagerService - appointment_new');
                                        taskDetail.$id = result;
                                        return resolve(taskDetail);
                                    }, function(error) {                            
                                        console.error('error - medicalExaminationTaskManagerService - appointment_new : while creating appointment task detail schedule for medical examination on create operation', err)  
                                        return reject(error);
                                    })
                                }
                                break;
                            case 'delay':
                                {
                                    taskDetailService.getByKeyVal('master_task_id', masterTask.$id)
                                    .then(function(result) {
                                        var taskDetail = result;
                                        taskDetail.current_status= 'delay';
                                        taskDetail.delay_notification_time = new Date().toString();
                                        taskDetailService.update(taskDetail);                                
                                        console.log('success - medicalExaminationTaskManagerService - schedule_delay');

                                        return resolve(taskDetail);                                

                                    }, function(error) {
                                        console.error('error - medicalExaminationTaskManagerService - schedule_delay : while updating appointment task detail schedule for medical examination on create operation', err)  
                                        return reject(error);

                                    })
                                }
                                break;
                            case 'read':
                                {
                                    taskDetailService.getByKeyVal('master_task_id', masterTask.$id)
                                    .then(function(result) {
                                        var taskDetail = result;
                                        taskDetail.current_status= 'read';
                                        taskDetail.read_time = new Date().toString();
                                        taskDetail.read_user = createUser;
                                        taskDetailService.update(taskDetail);                                
                                        console.log('success - medicalExaminationTaskManagerService - appointment_delay');


                                        return resolve(taskDetail);                                

                                    }, function(error) {
                                        console.error('error - medicalExaminationTaskManagerService - appointment_delay : while updating appointment task detail schedule for medical examination on create operation', err)  
                                        return reject(error);

                                    })
                                }
                                break;
                            case 'completed':
                                {
                                    taskDetailService.getByKeyVal('master_task_id', masterTask.$id)
                                    .then(function(result) {
                                        var taskDetail = result;
                                        taskDetail.current_status= 'completed';
                                        taskDetail.completed_time = new Date().toString();
                                        taskDetail.completed_user = createUser;
                                        taskDetailService.update(taskDetail);
                                        is_active: true                               
                                        console.log('success - medicalExaminationTaskManagerService - appointment_completed');

                                        return resolve(taskDetail);                                

                                    }, function(error) {
                                        console.error('error - medicalExaminationTaskManagerService - appointment_completed : while updating appointment task detail schedule for medical examination on create operation', err)  
                                        return reject(error);

                                    })
                                }
                                break;
                            default:
                                return reject('error - medicalExaminationTaskManagerService - schedule : default reached in ')
                                break;
                }
            });
        }
        
        var prepare = function(workorder, medicalExamination, createUser, status ) {
            
        }
        
        var transferTo = function(workorder, medicalExamination, createUser, status ) {
            
        }
        
        var conduct = function(workorder, medicalExamination, createUser, status) {
            
        }
        
        var transferBack = function(workorder, medicalExamination, createUser, status) {
            
        }
        
        var updateResult = function(workorder, medicalExamination, createUser, status) {
            
        }

        var reschedule = function(workorder, medicalExamination, createUser, status) {
            
        }
        
        var cancellation = function(workorder, medicalExamination, createUser, status) {
            
        }
        
        var readResult = function(workorder, medicalExamination, createUser, status) {
            
        }
        
        return {
            schedule: schedule,
            appointment: appointment,
            prepare: prepare,
            transferTo: transferTo,
            conduct: conduct,
            transferBack: transferBack,
            updateResult: updateResult,
            reschedule: reschedule,
            cancellation: cancellation,
            readResult: readResult
        };
    }
})();