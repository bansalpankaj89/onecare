(function() {
    angular.module('mediDocApp.service')
    .factory('notesService', ['$q', '$firebaseArray', notesService]);
    
    function notesService($q, $firebaseArray) {
        var noteRef = new Firebase("https://popping-inferno-1947.firebaseio.com/note/");
        
        var noteCollection = $firebaseArray(noteRef);
        
        // var create = function (data) {
        //     noteCollection.$add(data)
        //     .then(function(res) {
        //         var id = res.key();
        //         console.log("added record with id " + id);
        //     })
        // }

        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            return $q(function(resolve,reject){
            noteCollection.$add(data)
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
                noteCollection.$loaded()
                .then(function(collection) {
                    var result =  collection.$getRecord(id);
                    resolve(result);
                }, function(err) {
                    reject(err);
                });
            });
        }
        
        var update = function (data){
            console.log("note service",data);
            noteCollection.$save(data)
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                noteCollection.$loaded()
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