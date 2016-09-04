(function() {
    angular.module('mediDocApp.service')
    .factory('medicalExaminationTypesService', medicalExaminationTypesService);
    
    medicalExaminationTypesService.$inject = ['$q','$firebaseArray'];
    
    function medicalExaminationTypesService($q, $firebaseArray) {
        var templateRef = new Firebase("https://popping-inferno-1947.firebaseio.com/medical-examination-types/");
         
        var templateCollection = $firebaseArray(templateRef);
        
        var saveMediaCollection = function(collection) {
            var defer = $q.defer();
            var counter = 0;
            for(var i = 0 ; i < collection.length ; i++ ){
                counter ++;
                this.create(collection[i]).then(
                    function(result){
                        counter --;
                        collection.media_id = result.key();
                        if(counter==0)
                            defer.resolve(collection);
                    }, function(err) {
                        defer.reject(err);
                    });
            }
            return defer.promise;
        }
        
        var create = function (data) {
            return $q(function(resolve, reject) {
                templateCollection.$add(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                templateCollection.$loaded()
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
                templateCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                templateCollection.$loaded()
                .then(function(collection) {
                    var result = collection.filter(function(item) {
                        return {
                            id: item.$id,
                            value: item.$value
                        };
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
                templateRef.orderByChild(key).equalTo(value)
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
            create: create,
            update: update,
            getById: getById,
            getAll: getAll,
            getByKeyVal: getByKeyVal,
            saveMediaCollection: saveMediaCollection
        };
    }
})();
    