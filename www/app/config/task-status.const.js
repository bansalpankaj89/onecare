(function () {
    angular.module('mediDocApp')
        .constant('taskStatusConst', 
            [
                {description: 'Patient visit',
                 value: 'visit_patient'}, 
                {description: 'Patient Cleaning',
                 value: 'clean_patient'}, 
                {description: 'Patient CheckUp',
                 value: 'check_patient'}, 
                {description: 'Sample Collection For Test',
                 value: 'collect_sample'}, 
                {description: 'Perform Test',
                 value: 'perform_test'}, 
                {description: 'Give Medicine',
                 value: 'give_medicine'}
                 ]);
 })();
    