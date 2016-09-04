(function () {
    angular.module('mediDocApp')
        .constant('patientStatusConst', 
            [
                {description: 'Admit',
                 value: 'Admit'}, 
                {description: 'Under Treatment',
                 value: 'Under Treatment'}, 
                {description: 'Operation',
                 value: 'Operation'}, 
                {description: 'Recovery',
                 value: 'Recovery'}, 
                {description: 'Cured',
                 value: 'Cured'}, 
                {description: 'Discharged',
                 value: 'Discharged'}, 
                {description: 'Death',
                 value: 'Death'}]);
 })();
    