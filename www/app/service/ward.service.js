(function() {
    angular.module('mediDocApp.service')
    .factory('wardService', ['$q', '$firebaseArray', wardService]);
    
    function wardService($q, $firebaseArray) {
        var wardRed = new Firebase("https://popping-inferno-1947.firebaseio.com/ward/");
        
        var wardCollection = $firebaseArray(wardRed);
        
        var create = function (data) {
            wardCollection.$add(data)
            .then(function(res) {
                var id = res.key();
                console.log("added record with id " + id);
            })
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                wardCollection.$loaded()
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
                wardCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                wardCollection.$loaded()
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
            getAll: getAll
        };
    }
})();