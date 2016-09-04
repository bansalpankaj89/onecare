(function() {
    angular.module('mediDocApp.service')
    .factory('dischargeAppoitmentService', dischargeAppoitmentService);
    
    dischargeAppoitmentService.$inject = ['$q', '$firebaseArray']
    
    function dischargeAppoitmentService($q, $firebaseArray) {    
        var dischargeAppoitmentRef = new Firebase("https://popping-inferno-1947.firebaseio.com/discharge-appointments/");
         
        var dischargeAppoitmentCollection = $firebaseArray(dischargeAppoitmentRef);
        
        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            return $q(function(resolve, reject) {
                dischargeAppoitmentCollection.$add(data)
                .then(function(result) {
                    return resolve(result.key());
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                dischargeAppoitmentCollection.$loaded()
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
                dischargeAppoitmentCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                dischargeAppoitmentCollection.$loaded()
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
            var outputList = [];
            return $q(function(resolve, reject){
                var counter= 0;
                dischargeAppoitmentRef.orderByChild(key).equalTo(value)
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
        
        var remove = function(key) {
            return $q(function(resolve, reject) {
                dischargeAppoitmentRef.child(key).remove()
                .then(function(result) {
                    console.log(result);
                    return resolve(true);
                }, function(error) {
                    console.log('error ', error);
                    return reject(error);
                })
            });
        }
        
        return {
            create: create,
            update: update,
            getById: getById,
            getByKeyVal: getByKeyVal,
            getAll: getAll,
            remove: remove
        };
    }
})();