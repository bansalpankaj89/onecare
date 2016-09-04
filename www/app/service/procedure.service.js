(function() {
    angular.module('mediDocApp.service')
    .factory('procedureService', ['$q', '$firebaseArray', procedureService]);
    
    function procedureService($q, $firebaseArray) {
        var precedureRef = new Firebase("https://popping-inferno-1947.firebaseio.com/precedure/");
         
        var procedureCollection = $firebaseArray(precedureRef);
        
        var create = function (data) {
            return $q(function(resolve, reject) {
                procedureCollection.$add(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                procedureCollection.$loaded()
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
                procedureCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                procedureCollection.$loaded()
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
        
        return {
            create: create,
            update: update,
            getById: getById,
            getAll: getAll
        };
    }
})();