(function() {
    angular.module('mediDocApp.service')
    .factory('diagnosisService', diagnosisService);
    
    diagnosisService.$inject = ['$q', '$firebaseArray'];
    
    function diagnosisService($q, $firebaseArray) {
        var diagnosisRef = new Firebase("https://popping-inferno-1947.firebaseio.com/diagnosis/");
         
        var diagnosisCollection = $firebaseArray(diagnosisRef);
        
        var create = function (data) {
            return $q(function(resolve, reject) {
                diagnosisCollection.$add(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                diagnosisCollection.$loaded()
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
                diagnosisCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                diagnosisCollection.$loaded()
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