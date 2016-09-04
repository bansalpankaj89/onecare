(function() {
    angular.module('mediDocApp.service')
    .factory('workorderManagerService', workorderManagerService);
    
    workorderManagerService.$inject = ['$q','workorderService', 'taskManageService']
    
    function workorderManagerService($q, workorderService, taskManageService) {    
        var create = function(source, type, createUser) {
            return $q(function(resolve, reject){
//                switch(type){
//                    case 'medical-examination':{
                        var workorderItem = createWorkorder(createUser, type, source);
                        if(type ==  'medical-examination') {
                            reference_id= source.medical_examination_id;
                        } else if(type == 'medication') {
                            reference_id= source.prescribed_Medication_id;
                        }
                        workorderService.create(workorderItem)
                        .then(function(result) {
                            workorderItem.$id = result;
                            console.log('success - workorderManagerService - create');
                            return taskManageService.process(workorderItem, source, createUser, 'new');
                            
                        }, function(error) {
                            console.error('error - workorderManagerService - create : while creating workorder for medical examination on create operation', err)  

                        })
                        .then(function(taskResult){
                            return resolve(workorderItem);
                        }, function(error){
                            console.error('error - workorderManagerService - create : while creating task for medical examination on create operation', err)  
                            return reject(error) 
                        });
//                    }
//                        break;
//                    default:
//                        break;
//                }
            })
            
        }
        
        var createWorkorder =  function(createUser, type, source ) {
            var wo = {
                type: type,
                create_user: createUser,
                current_status: 'new',
                admission_id: source.admission_id
            }
            return wo;
        }
        
        return {
            create: create
        };
    }
    
})();