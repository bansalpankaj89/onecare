(function() {
    angular.module('mediDocApp.service')
    .factory('notificationService', ['$q', '$firebaseArray', notificationService]);
    
    function notificationService($q, $firebaseArray) {
        var notificationRef = new Firebase("https://popping-inferno-1947.firebaseio.com/notification/");
        
        var notificationCollection = $firebaseArray(notificationRef);
        
        // var create = function (data) {
        //     notificationCollection.$add(data)
        //     .then(function(res) {
        //         var id = res.key();
        //         console.log("added record with id " + id);
        //     })
        // }

        var create = function (data) {
            return $q(function(resolve,reject){
            notificationCollection.$add(data)
            .then(function(res) {
                    var id = res.key();
                    console.log("added record with id " + id);
                    resolve(id);
            }, function(err) {
                    reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                notificationCollection.$loaded()
                .then(function(collection) {
                    var result =  collection.$getRecord(id);
                    resolve(result);
                }, function(err) {
                    reject(err);
                });
            });
        }
        
        var update = function (data){
            console.log("notification service",data);
            notificationCollection.$save(data)
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                notificationCollection.$loaded()
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