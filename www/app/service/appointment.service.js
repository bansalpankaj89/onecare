(function() {
    angular.module('mediDocApp.service')
    .factory('appointmentService', appointmentService);
    
    appointmentService.$inject = ['$q', '$firebaseArray']
    
    function appointmentService($q, $firebaseArray) {   
        
        var appointmentRef = new Firebase("https://popping-inferno-1947.firebaseio.com/appointments/");
         
        var appointmentCollection = $firebaseArray(appointmentRef);
        
        var insertBatchAppointments = function(appointmentCollection) {
            return $q(function(resolve, reject) {
                var counter = 0;
                for(var i = 0 ; i < appointmentCollection.length; i++) {
                    var appointment = appointmentCollection[i];                    
                    create(appointment)
                    .then(function(result){
                        //get the created id and append to the admissionInfo prescription
                        appointmentCollection[counter].appointment_id = result.key();
                        counter++;
                        if(counter == appointmentCollection.length){
                            return resolve(appointmentCollection);
                        }
                    }, function(err) {
                        console.error('error while creating appointments', err)                        
                        return reject('some erro while saving appointments');
                    });
                }
            })
        }
        
        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            return $q(function(resolve, reject) {
                appointmentCollection.$add(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                appointmentCollection.$loaded()
                .then(function(collection) {
                    var result =  collection.$getRecord(id);
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var update = function (data){
            return $q(function(resolve, reject){ 
                appointmentCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                appointmentCollection.$loaded()
                .then(function(collection) {
                    var result = collection.filter(function(item) {
                        return item.status;
                    })
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getByKeyVal =  function (key, value) {
            var outputList = [];
            return $q(function(resolve, reject){
                var counter= 0;
                admissionRef.orderByChild(key).equalTo(value)
                .on("child_added", function(snapshot) {
                     counter++;
                     getById(snapshot.key()).then(function(result) {
                         counter--;
                         outputList.push(result);
                         if(counter==0){                             
                            return resolve(outputList);
                         }
                     }, function(err) {
                         counter--;
                         return reject(err);
                     });
                });
                
                
            });
         }  
        
        return {
            create: create,
            createBatch: insertBatchAppointments,
            update: update,
            getById: getById,
            getByKeyVal: getByKeyVal,
            getAll: getAll
        };
    }
})();