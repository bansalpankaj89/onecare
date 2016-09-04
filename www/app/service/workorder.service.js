(function() {
    angular.module('mediDocApp.service')
    .factory('workorderService', ['$q','$firebaseArray', workorderService]);
    
    function workorderService($q, $firebaseArray) {
        var workorderRef = new Firebase("https://popping-inferno-1947.firebaseio.com/workorders/");
         
        var workorderCollection = $firebaseArray(workorderRef);
        
        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            return $q(function(resolve, reject) {
                workorderCollection.$add(data)
                .then(function(result) {
                    return resolve(result.key());
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                workorderCollection.$loaded()
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
                workorderCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                workorderCollection.$loaded()
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
                workorderRef.orderByChild(key).equalTo(value)
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
            getByKeyVal: getByKeyVal
        };
    }
})();