(function() {
    angular.module('mediDocApp.service')
    .factory('prescribedMedicationService', ['$q','$firebaseArray', prescribedMedicationService]);
    
    function prescribedMedicationService($q, $firebaseArray) {
         var prescribedMedicationRef = new Firebase("https://popping-inferno-1947.firebaseio.com/prescribed-medication/");
         
        var prescribedMedicationCollection = $firebaseArray(prescribedMedicationRef);
        
        var insertNewPrescription = function(prescriptionCollection, admissionId, patientId) {
            return $q(function(resolve, reject) {
                var counter = 0;
                for(var i = 0 ; i < prescriptionCollection.length; i++) {
                    var prescribedMedication = {
                        admission_id: admissionId,
                        patient_id: patientId,
                        prescription: prescriptionCollection[i].medication,
                        status: 'prescribed'
                    }
                    create(prescribedMedication)
                    .then(function(result){
                        //get the created id and append to the admissionInfo prescription
                        prescriptionCollection[counter].prescribed_Medication_id = result.key();
                        counter++;
                        if(counter == prescriptionCollection.length){
                            return resolve(prescriptionCollection);
                        }
                    }, function(err) {
                        console.error('error while creating prescribe medication', err)                        
                        return reject('some erro while saving prescribed medication');
                    });
                }
            })
        }
        
        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            return $q(function(resolve, reject) {
                prescribedMedicationCollection.$add(data)
                .then(function(result) {                    
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                prescribedMedicationCollection.$loaded()
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
                prescribedMedicationCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                prescribedMedicationCollection.$loaded()
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
            var usrList = [];
            return $q(function(resolve, reject){
                var counter= 0;
                prescribedMedicationRef.orderByChild(key).equalTo(value)
                .on("child_added", function(snapshot) {
                     counter++;
                     getById(snapshot.key()).then(function(result) {
                         counter--;
                         usrList.push(result);
                         if(counter==0){                             
                            return resolve(usrList);
                         }
                     }, function(err) {
                         counter--;
                         return reject(err);
                     });
                });
                
                
            });
         }  
        
        return {
            create: insertNewPrescription,
            update: update,
            getById: getById,
            getAll: getAll,
            getByKeyVal: getByKeyVal
        };
    }
})();