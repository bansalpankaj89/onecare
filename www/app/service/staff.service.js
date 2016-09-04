(function() {
    angular.module('mediDocApp.service')
    .factory('staffService', ['$q', '$firebaseArray', staffService]);
    
    function staffService($q, $firebaseArray) {
        var staffRef = new Firebase("https://popping-inferno-1947.firebaseio.com/staff/");
        
        var staffCollection = $firebaseArray(staffRef);
        
        var create = function (data) {
            staffCollection.$add(data)
            .then(function(res) {
                var id = res.key();
                console.log("added record with id " + id);
            })
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                staffCollection.$loaded()
                .then(function(collection) {
                    var result =  collection.$getRecord(id);
                    resolve(result);
                }, function(err) {
                    reject(err);
                });
            });
        }
        
        var update = function (data){
            console.log("staff service",data);
            staffCollection.$save(data)
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                staffCollection.$loaded()
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