(function() {
    angular.module('mediDocApp.service')
    .factory('medicalExaminationTemplateService', medicalExaminationTemplateService);
    
    medicalExaminationTemplateService.$inject = ['$q', '$firebaseArray'];
    function medicalExaminationTemplateService($q, $firebaseArray) {
        var medicalExaminationTemplateRef = new Firebase("https://popping-inferno-1947.firebaseio.com/medical-examination-template/");
        var medicalExaminationTemplateCollection = $firebaseArray(medicalExaminationTemplateRef);
        
        var create = function (data) {
            data.is_active= true;            
            data.date_time = new Date().toString();
            return $q(function(resolve, reject) {
                medicalExaminationTemplateCollection.$add(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                });
            });
        }
        
        var getById = function(id) {
            return $q(function(resolve, reject) {
                medicalExaminationTemplateCollection.$loaded()
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
                medicalExaminationTemplateCollection.$save(data)
                .then(function(result) {
                    return resolve(result);
                }, function(err) {
                    return reject(err);
                })
            });
        }
        
        var getAll = function() {
            return $q(function(resolve, reject) {
                medicalExaminationTemplateCollection.$loaded()
                .then(function(collection) {
                    var result = collection.filter(function(item) {
                        return item;
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