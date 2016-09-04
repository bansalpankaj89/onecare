(function() {
    angular.module('mediDocApp.service')
    .factory('taskService', ['$q', '$firebaseArray', taskService]);
    
    function taskService($q, $firebaseArray) {
        var taskRef = new Firebase("https://popping-inferno-1947.firebaseio.com/task/");
        
        var taskCollection = $firebaseArray(taskRef);
        
        var create = function (data) {
            data.date_time = new Date().toString();
            data.is_active= true;
            return $q(function(resolve, reject) {
                taskCollection.$add(data)
                .then(function(result) {
                    return resolve(result.key());
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                taskCollection.$loaded()
                .then(function(collection) {
                    var result =  collection.$getRecord(id);
                    resolve(result);
                }, function(err) {
                    reject(err);
                });
            });
        }
        
        var update = function (data){
            return $q(function(resolve, reject){ 
                taskCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
         var getByKeyVal =  function (key, value) {
            var outputList = [];
            return $q(function(resolve, reject){
                var counter= 0;
                taskRef.orderByChild(key).equalTo(value)
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
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                taskCollection.$loaded()
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
            getAll: getAll,
            getByKeyVal: getByKeyVal
        };
    }
})();