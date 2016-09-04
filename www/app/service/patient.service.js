(function() {
    angular.module('mediDocApp.service')
    .factory('patientService', ['$q', '$firebaseArray', patientService]);
    
    function patientService($q, $firebaseArray) {
        //Firebase.enableLogging(true);
        //var patientRef = new Firebase("https://popping-inferno-1947.firebaseio.com/patients/");
        var patientRef = new Firebase("https://popping-inferno-1947.firebaseio.com/registration/");
        
        var patientCollection = $firebaseArray(patientRef);
        
        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            patientCollection.$add(data)
            .then(function(res) {
                var id = res.key();
                console.log("added record with id " + id);
            })
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                patientCollection.$loaded()
                .then(function(collection) {
                    var result =  collection.$getRecord(id);
                    //console.log('patient SErvice success');
                    resolve(result);
                }, function(err) {
                    console.log('patient SErvice error');

                    reject(err);
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
        
        var update = function (data){
            patientCollection.$save(data)
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                patientCollection.$loaded()
                .then(function(collection) {
                    resolve(collection);
                }, function(err) {
                    reject(err);
                });
            });
        }
        
        return {
            create: create,
            update: update,
            getById: getById,
            getByKeyVal: getByKeyVal,
            getAll: getAll
        };
    }
})();