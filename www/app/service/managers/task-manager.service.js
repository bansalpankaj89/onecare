(function() {
    angular.module('mediDocApp.service')
    .factory('taskManageService', taskManageService);
    taskManageService.$inject = ['$q', 'taskService',
                                 'medicalExaminationTaskManagerService', 'medicationTaskManagerService',
                                 'medicalExaminationService', 'prescribedMedicationService', 
                                 'admissionService', 'patientTransactionService'
                                ]
    function taskManageService($q, taskService, 
                                medicalExaminationTaskManagerService, medicationTaskManagerService,
                                medicalExaminationService, prescribedMedicationService,
                                admissionService, patientTransactionService) 
    {    
        
        var process = function(workorder, source, createUser, operation, task){
            return $q(function(resolve, reject) {
                switch(workorder.type){
                    case 'medical-examination': {
                            processMedicalExamination(workorder, source, createUser, operation, task)
                            .then(function(result){
                                console.log('success - taskManageService - process');

                            }, function(error) {
                                console.error('error - taskManageService - process : while creating task for medical examination on create operation', error);
                            })
                        }
                        break;
                    case 'medication': {
                            processMedication(workorder, source, createUser, operation, task)
                            .then(function(result){
                                console.log('success - taskManageService - process');

                            }, function(error) {
                                console.error('error - taskManageService - process : while creating task for medical examination on create operation', error);
                            })
                        }
                        break;  
                    default: 
                        break;
                } 
            })           
        }
        
        var processMedication = function(workorder, source, createUser, operation, processTask) {
            return $q(function(resolve, reject) {
               switch(operation) {
                   case 'new' : {
                           if(processTask == undefined) {
                                var task = {
                                    create_user: createUser,
                                    current_status: 'new',
                                    type: 'medication',
                                    workorder_type: workorder.type,
                                    assigned_department: 'nurse',
                                    assigned_group: 'nurse_user',
                                    source: source,
                                    workorder_id: workorder.$id,
                                    workorder: workorder,
                                    admission_id: workorder.admission_id
                                };
                                taskService.create(task)
                                .then(function(result) {
                                    task.$id = result;                                        
                                    console.log('success - taskManageService - processMedication');
                                    return medicationTaskManagerService.schedule(task, createUser, operation);                                    
                                }, function(error) {
                                    console.error('error - taskManageService - processMedication - new : while creating task for medication on create operation', err)  
                                    return reject(error);
                                })
                                .then(function(taskUpdate) {                                                                        
                                    console.log('success - taskManageService - processMedication - new : taskService.update ');
                                    return resolve(taskUpdate);
                                }, function(taskUpdateRrror) {
                                    console.error('error - taskManageService - processMedication - new : taskService.update', taskUpdateRrror) ;
                                    return reject(taskUpdateRrror);

                                });
                            }
                        }
                        break;
                    case 'read': {
                            if(processTask === undefined){                                   
                                console.error('error - taskManageService - processMedication - read : while updating task for medical examination on create operation')  
                                return reject('invalid operation')
                            }  
                            processTask.last_modified_user = createUser;
                            processTask.last_modified_date = new Date().toString();
                            processTask.current_status='read';                                       
                            console.log('success - taskManageService - processMedication');
                            return taskService.update(processTask)
                            .then(function(taskUpdate) {                                                                        
                                console.log('success - taskManageService - processMedication - read : taskService.update ');
                                return resolve(taskUpdate);
                            }, function(taskUpdateRrror) {
                                console.error('error - taskManageService - processMedication - read : taskService.update', taskUpdateRrror) ;
                                return reject(taskUpdateRrror);
                            });                                    
                        }
                        break;
                   case 'give-medication': {
                            //change the prescribed medication status to inprogress
                            prescribedMedicationService.getById(processTask.source.prescribed_Medication_id)
                            .then(function(prescribedMedicationResult) {
                                prescribedMedicationResult.status="in-progress";
                                return prescribedMedicationService.update(prescribedMedicationResult);
                            }, function(error) {
                                console.error('error - taskManageService - processMedication - give-medication : prescribedMedicationService.update', error) ;
                            })
                            .then(function(result) {
                                return admissionService.getById(processTask.admission_id);
                            }, function(error) {
                                return reject(error);
                            }) //update admission prescription status
                            .then(function(result) {                                                
                                angular.forEach(result.prescriptions, function(item){
                                    if(item.prescribed_Medication_id == processTask.source.prescribed_Medication_id){
                                        item.status= "in-progress";
                                    }
                                })
                                return admissionService.update(result);
                            }, function(error) {
                                console.error('error - taskManageService - processMedication - give-medication : admissionService.update', error) ;
                                return reject(error);
                            }) //enter another entry in the patients timeline
                            .then(function(result) {
                                var transaction = {
                                        admission_id: processTask.admission_id,
                                        info : 
                                            {
                                                updates: [
                                                {
                                                    isGiven: true,
                                                    item : {
                                                        description : processTask.source.description + " given",
                                                    }
                                                }]
                                            },                                       
                                        trans_date: new Date().toString()
                                    };  
                                return patientTransactionService.create(transaction);
                            }, function(error) {                                
                                console.error('error - taskManageService - processMedication - give-medication : patientTransactionService.create', error) ;
                                return reject(error);
                            })                       
                            //create a history task refereing to the master task  
                            
                            //update task to in-progress
                            .then(function(result) {
                                processTask.last_modified_user = createUser;
                                processTask.last_modified_date = new Date().toString();
                                if(processTask.last_medication){
                                    if(!processTask.medication_history)
                                        processTask.medication_history = [];
                                    processTask.medication_history.push(processTask.last_medication);
                                }
                                processTask.last_medication = new Date().toString();
                                processTask.current_status ='give-medication';
                                //processTask.deail_tasks.push(medicalExaminationTaskResult.$id);                                        
                                console.log('success - taskManageService - processMedication');
                                return taskService.update(processTask);
                            }, function(error) {                                                          
                                console.error('error - taskManageService - processMedication - give-medication : taskService.update', error) ;
                                return reject(error);
                            });
                        }
                        break;
                   case 'completed': {
                            //change the prescribed medication status to completed
                       
                            //enter another entry in the patients timeline
                       
                        }
                        break;
                   case 'cancel': {
                            //change the prescribed medication status to cancel
                       
                            //enter another entry in the patients timeline
                       
                        }
                        break;
               } 
            });
        }
        
        var processMedicalExamination = function(workorder, source, createUser, operation, processTask) {
            return $q(function(resolve, reject) {
                switch(operation) {
                    case 'new':
                        {
                            if(processTask === undefined){     
                                var task = {
                                    create_user: createUser,
                                    current_status: 'new',
                                    type: 'schedule',
                                    workorder_type: workorder.type,
                                    assigned_department: 'laboratory',
                                    assigned_group: 'lab_user',
                                    source: source,
                                    workorder_id: workorder.$id,
                                    workorder: workorder,
                                    admission_id: workorder.admission_id
                                };
                                taskService.create(task)
                                .then(function(result) {
                                    task.$id = result;                                        
                                    console.log('success - taskManageService - processMedicalExamination');                                    
                                    return medicalExaminationTaskManagerService.schedule(task, createUser, operation);                                    
                                }, function(error) {
                                    console.error('error - taskManageService - processMedicalExamination - new : while creating task for medical examination on create operation', err)  
                                    return reject(error);
                                })
//                                .then(function(medicalExaminationTaskResult) {
//                                    task.deail_tasks = [];
//                                    task.deail_tasks.push(medicalExaminationTaskResult.$id);                                       
//                                    console.log('success - taskManageService - processMedicalExamination - new : medicalExaminationTaskManagerService.schedule ');
//                                    return taskService.getById(task.$id)
//                                        .then( function(getResult) {  
//                                            getResult.deail_tasks = task.deail_tasks;
//                                            return taskService.update(getResult);
//                                        }, function(getError) {
//                                        return reject(getError);
//                                    });
//                                }, function(medicalExaminationError) {
//                                    console.error('error - taskManageService - processMedicalExamination - new : medicalExaminationTaskManagerService.schedule', medicalExaminationError)  
//                                    return reject(medicalExaminationError);
//                                })
                                .then(function(taskUpdate) {                                                                        
                                    console.log('success - taskManageService - processMedicalExamination - new : taskService.update ');
                                    return resolve(taskUpdate);
                                }, function(taskUpdateRrror) {
                                    console.error('error - taskManageService - processMedicalExamination - new : taskService.update', taskUpdateRrror) ;
                                    return reject(taskUpdateRrror);

                                });
                            }
                            else{
                                
                            }
                        }
                        break;
                    case 'read': 
                        {
                            if(processTask === undefined){                                   
                                console.error('error - taskManageService - processMedicalExamination - read : while updating task for medical examination on create operation')  
                                return reject('invalid operation')
                            }
                            
                            switch( processTask.type){
                                case 'schedule':
                                case 'appointment':
                                    {
                                        medicalExaminationTaskManagerService.schedule(processTask, createUser, operation)
                                        .then( function(medicalExaminationTaskResult) {
                                            processTask.last_modified_user = createUser;
                                            processTask.last_modified_date = new Date().toString();
                                            processTask.current_status='read';                                        
                                            console.log('success - taskManageService - processMedicalExamination');
                                            return taskService.update(processTask);
                                        }, function(medicalExaminationError) {
                                            console.error('error - taskManageService - processMedicalExamination - read : while updating task for medical examination on create operation')  
                                            return reject(medicalExaminationError);
                                        })
                                        .then(function(taskUpdate) {                                                                        
                                            console.log('success - taskManageService - processMedicalExamination - read : taskService.update ');
                                            return resolve(taskUpdate);
                                        }, function(taskUpdateRrror) {
                                            console.error('error - taskManageService - processMedicalExamination - read : taskService.update', taskUpdateRrror) ;
                                            return reject(taskUpdateRrror);

                                        });
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    case 'completed': 
                        {
                            if(processTask === undefined){                                   
                                console.error('error - taskManageService - processMedicalExamination - completed : while updating task for medical examination on create operation')  
                                return reject('invalid operation')
                            }
                            
                            switch(processTask.type){
                                case 'appointment':
                                case 'schedule':
                                case 'sent-to-examination':
                                    {
                                            processTask.last_modified_user = createUser;
                                            processTask.last_modified_date = new Date().toString();
                                            processTask.current_status ='completed';
                                        taskService.update(processTask)
                                        .then(function(taskUpdate) {    
                                            console.log('success - taskManageService - processMedicalExamination - completed : taskService.update ');
                                             var actionTask = {};
                                            if(processTask.type == 'schedule') {
                                                actionTask = generateTask(createUser, workorder, processTask, 'appointment', 'nurse', 'nurse-user');
                                                actionTask.appointment_time = processTask.appointment_time;
                                            } else if (processTask.type == 'appointment') {
                                                actionTask = generateTask(createUser, workorder, processTask, 'sent-to-examination', 'laboratory', 'lab-user');
                                                actionTask.examination_sent_time =  processTask.examination_sent_time;
                                                actionTask.appointment_time = processTask.appointment_time;
                                            } else if(processTask.type == 'sent-to-examination') {
                                                actionTask = generateTask(createUser, workorder, processTask, 'result', 'laboratory', 'lab-user');
                                                actionTask.examination_sent_time =  processTask.examination_sent_time;
                                                actionTask.appointment_time = processTask.appointment_time;
                                                actionTask.examined_time = processTask.examined_time;
                                            }
                                            taskService.create(actionTask)
                                            .then(function(result) {
                                                actionTask.$id = result;                                        
                                                console.log('success - taskManageService - processMedicalExamination', result);
                                                return taskService.getById(actionTask.$id)
                                                    .then( function(getResult) {  
                                                        //console.log('getResult', getResult)
                                                        return getResult;
                                                    }, function(getError) {
                                                    return reject(getError);
                                                });
                                            }, function(error) {
                                                console.error('error - taskManageService - processMedicalExamination - new : while creating appointment task for medical examination on create operation', err)  
                                                return reject(error);
                                            })
                                            .then(function(taskUpdate) {   
                                                console.log('success - taskManageService - processMedicalExamination - new : taskService.update ');
                                                return medicalExaminationService.getById(actionTask.source.medical_examination_id)
                                                .then(function(result) {
                                                    return result;
                                                }, function(error) {                                                
                                                    console.error('error - taskManageService - processMedicalExamination - new : medicalExaminationService.getById', taskUpdateRrror) ;
                                                    return reject(error);
                                                })
                                            }, function(taskUpdateRrror) {
                                                console.error('error - taskManageService - processMedicalExamination - new : taskService.update', taskUpdateRrror) ;
                                                return reject(taskUpdateRrror);

                                            })
                                            .then(function(result) {
                                                if(processTask.type == 'schedule') {
                                                    result.status = 'appointed';                                                        
                                                } else if(processTask.type == 'appointment') {
                                                    result.status = 'sent-to-examination';                                                        
                                                } else if(processTask.type == 'sent-to-examination') {
                                                    result.status = 'Examined';
                                                }                                       
                                                console.log('success - taskManageService - processMedicalExamination - new : medical examination updated with scheduled status ');
                                                return medicalExaminationService.update(result);
                                            }, function(error) {
                                                return reject(error);
                                            })
                                            .then(function(result) {
                                                return admissionService.getById(actionTask.admission_id);
                                            }, function(error) {
                                                return reject(error);
                                            })                                            
                                            .then(function(result) {                                                
                                                angular.forEach(result.medicalExaminations, function(item, index){
                                                    if(item.medical_examination_id == processTask.source.medical_examination_id){                                                        
                                                        if(processTask.type == 'schedule') {
                                                            item.status = 'appointed';                                                        
                                                        } else if(processTask.type == 'appointment') {
                                                            item.status = 'sent-to-examination';                                                        
                                                        } else if(processTask.type == 'sent-to-examination') {
                                                            item.status = 'Examined';
                                                        }                                                                   
                                                    }
                                                })
                                                return admissionService.update(result);
                                            }, function(error) {
                                                return reject(error);
                                            })                                            
                                            .then(function(result){
                                                return resolve('success');
                                            }, function(error) {
                                                return reject(error);

                                            });
                                        }, function(taskUpdateRrror) {
                                            console.error('error - taskManageService - processMedicalExamination - read : taskService.update', taskUpdateRrror) ;
                                            return reject(taskUpdateRrror);
                                        });
                                        
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    default:
                        break;
                }
            });
        }
        
        var generateTask = function(createUser, workorder, processTask, type, department, group) {
             var task = {
                create_user: createUser,
                current_status: 'new',
                type: type,
                workorder_type: workorder.type,
                assigned_department: department,
                assigned_group: group,
                source: processTask.source,
                workorder: workorder,
                workorder_id: processTask.workorder_id,
                admission_id: processTask.admission_id
            };
            return task;
        }
        
        return {
            process: process
        };
    }
})();