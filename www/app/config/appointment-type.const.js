(function () {
    angular.module('mediDocApp')
        .constant('appointmentTypeConst', 
            [
                {description: 'Visit',
                 value: 'Visit'}, 
                {description: 'Medication',
                 value: 'Medication'}, 
                {description: 'Examination',
                 value: 'Examination'}, 
                {description: 'Other',
                 value: 'Other'}]);
 })();
    