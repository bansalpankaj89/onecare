(function() {
    angular.module('mediDocApp.service')
    .factory('medicalExaminationService', medicalExaminationService);
    
    medicalExaminationService.$inject = ['$q', '$firebaseArray'];
    
    function medicalExaminationService($q, $firebaseArray) {
        
        var medicalExaminationRef = new Firebase("https://popping-inferno-1947.firebaseio.com/medical-examination/");
         
        var medicalExaminationCollection = $firebaseArray(medicalExaminationRef);
        
        var insertNewMedicalExamination = function(medicalExaminationCollection, admissionId, patientId) {
            return $q(function(resolve, reject) {
                var counter = 0;
                for(var i = 0 ; i < medicalExaminationCollection.length; i++) {
                    var medicalExamination = {
                        admission_id: admissionId,
                        patient_id: patientId,
                        medicalExamination: medicalExaminationCollection[i],
                        status: 'prescribed',
                        date_time: new Date().toString()
                    }
                    create(medicalExamination)
                    .then(function(result){
                        //get the created id and append to the admissionInfo prescription
                        medicalExaminationCollection[counter].medical_examination_id = result;
                        counter++;
                        if(counter == medicalExaminationCollection.length){
                            return resolve(medicalExaminationCollection);
                        }
                    }, function(err) {
                        console.error('error while creating medical Examination', err)                        
                        return reject('some erro while saving medical Examination');
                    });
                }
            })
        }
        
        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            return $q(function(resolve, reject) {
                medicalExaminationCollection.$add(data)
                .then(function(result) {
                    return resolve(result.key());
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                medicalExaminationCollection.$loaded()
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
                medicalExaminationCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                medicalExaminationCollection.$loaded()
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
                medicalExaminationRef.orderByChild(key).equalTo(value)
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
            create: insertNewMedicalExamination,
            update: update,
            getById: getById,
            getAll: getAll,
            getByKeyVal: getByKeyVal
        };
    }
})();