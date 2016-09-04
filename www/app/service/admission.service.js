(function() {
    angular.module('mediDocApp.service')
    .factory('admissionService', ['$q', '$firebaseArray', admissionService]);
    
    function admissionService($q, $firebaseArray) {
        var admissionRef = new Firebase("https://popping-inferno-1947.firebaseio.com/admission/");
        
        var admissionCollection = $firebaseArray(admissionRef);
        
        var create = function (data) {
            return $q(function(resolve, reject) {
                data.is_active= true;            
                data.date_time = new Date().toString();
                admissionCollection.$add(data)
                .then(function(result) {
                    return resolve(result.key());
                }, function(error) {
                    return reject(error);
                })
            })
            
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                admissionCollection.$loaded()
                .then(function(collection) {
                    var result =  collection.$getRecord(id);
                    resolve(result);
                }, function(err) {
                    reject(err);
                });
            });
        }
        
         
        
        var update = function (data){
            return $q(function(resolve, reject) {
                admissionCollection.$save(data)
                .then(function(result){
                    console.log('save result ', result);
                    resolve(result);
                }, function(err) {
                    reject(err);
                });
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                admissionCollection.$loaded()
                .then(function(collection) {
                    resolve(collection);
                }, function(err) {
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
        
        var remove = function(key) {
            return $q(function(resolve, reject) {
                var deleteRef = new Firebase("https://popping-inferno-1947.firebaseio.com/admission/"+ key);
                deleteRef.remove()
                .then(function(result) {
                    return resolve(true);
                }, function(error) {
                    console.log('error ', error);
                    return reject(error);
                })
            });
        }
        return {
            create: create,
            update: update,
            getById: getById,
            getByKeyVal: getByKeyVal,
            getAll: getAll,
            remove: remove
        };
    }
})();