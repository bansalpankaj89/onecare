(function() {
    angular.module('mediDocApp.service')
    .factory('registrationService', ['$q', '$firebaseArray','$firebaseObject', registrationService]);
    
    function registrationService($q, $firebaseArray,$firebaseObject) {
        var registrationRef = new Firebase("https://popping-inferno-1947.firebaseio.com/registration/");
        
        var registrationCollection = $firebaseArray(registrationRef);
        
        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            return $q(function(resolve,reject){
            registrationCollection.$add(data)
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
                registrationCollection.$loaded()
                .then(function(collection) {
                    var result =  collection.$getRecord(id);
                    console.log(result);
                    resolve(result);
                }, function(err) {
                    reject(err);
                });
            });
        }
        
        var getByKeyVal =  function (key, value) {
            var usrList = [];
            return $q(function(resolve, reject){
                var counter= 0;
                registrationRef.orderByChild(key).equalTo(value)
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

//         var getByRegistrationId = function (section, id) {
//            var usrList ={};
//             return $q(function(resolve, reject) {
//                  registrationRef.orderByChild(section).equalTo(id).on("child_added", function(snapshot) {
//                     usrList =  getById(snapshot.key());                      
//                    });
//                    return usrList;
//             })
//           
//         }  

        
        var update = function (data){
            return $q(function(resolve, reject){ 
                registrationCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                registrationCollection.$loaded()
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