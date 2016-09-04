(function () {
    angular.module('mediDocApp')
        .constant('appointmentStatusConst', 
            [
                {
                    appointmentType: 'Visit',
                    status: [{  description: 'Scheduled',
                                value: 'Scheduled'},
                             {  description: 'Cancelled',
                                value: 'Cancelled'},
                             {  description: 'TimeElapsed',
                                value: 'TimeElapsed'},
                             {  description: 'Completed',
                                value: 'Completed'}
                ]}, 
                {
                    appointmentType: 'Medication',
                    status: [{  description: 'Prescibed',
                                value: 'Prescibed'},
                             {  description: 'Dispatched',
                                value: 'Dispatched'},
                             {  description: 'In Progress',
                                value: 'In-Progress'},
                             {  description: 'Cancelled',
                                value: 'Cancelled'},
                             {  description: 'Completed',
                                value: 'Completed'}
                ]},  
                {
                    appointmentType: 'Examination',
                    status: [{  description: 'Prescibed',
                                value: 'Prescibed'},
                             {  description: 'Scheduled',
                                value: 'Scheduled'},
                             {  description: 'Sample Collected',
                                value: 'Sample-Collected'},
                             {  description: 'Sent for Examination',
                                value: 'Sent-for-Examination'},
                             {  description: 'Examined',
                                value: 'Examined'},
                             {  description: 'Result Updated',
                                value: 'Result-Updated'},
                             {  description: 'Sent for Examination',
                                value: 'Sent-for-Examination'},
                             {  description: 'Cancelled',
                                value: 'Cancelled'},
                             {  description: 'Completed',
                                value: 'Completed'}
                ]},  
                {
                    appointmentType: 'Examination',
                    status: [{  description: 'Scheduled',
                                value: 'Scheduled'},
                             {  description: 'In Progress',
                                value: 'In-Progress'},
                             {  description: 'Cancelled',
                                value: 'Cancelled'},
                             {  description: 'Completed',
                                value: 'Completed'}
                ]}
            ]);
 })();
    