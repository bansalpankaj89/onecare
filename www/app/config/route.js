(function () {
    angular.module('mediDocApp')
        .config(routeConfig);
    
    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider']
    
    function routeConfig($stateProvider, $urlRouterProvider) {
//        $rootScope.userEmail = null;
//        $rootScope.baseUrl = 'https://popping-inferno-1947.firebaseio.com/';
//        var authRef = new Firebase($rootScope.baseUrl);
//        $rootScope.auth = $firebaseAuth(authRef);
//        
//        $rootScope.auth.$login('password', {
//           email: 'desmond80in@gmail.com',
//           password: 'angelmy1love'
//        })
//        .then(function (user) {
//          $rootScope.hide();
//          $rootScope.userEmail = user.email;
//          console.log('authenticated ', user)
//        }, function(err) {
//            console.error('authentication Failed ', err);
//        })
        
        $urlRouterProvider.otherwise('/patientlist');
        
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'app/home/home.view.html',
            controller: 'homeController as homeCtrl'
        })
        .state('home.patient-list', {
            url: 'patientlist',
            templateUrl: 'app/home/patient-list/patientlist.view.html',
            controller : 'patientListController as patListCtrl'
        })
        .state('home.menu-preference', {
            url: 'menupreference',
            templateUrl: 'app/home/menu-preference/menupreference.view.html'
        })
        .state('home.favourite-diagnoisis', {
            url: 'favouritediagnoisis',
            templateUrl: 'app/home/favourite-diagnoisis/favouritediagnoisis.view.html'
        })
        .state('home.facourite-procedures', {
            url: 'facouriteprocedures',
            templateUrl: 'app/home/facourite-procedures/facouriteprocedures.view.html'
        })
        .state('home.design-template', {
            url: 'designtemplate',
            templateUrl: 'app/home/design-template/designtemplate.view.html',
            controller : 'designTemplateController as desiTempCtrl',
            resolve: {
                examinationCategories: ['medicalExaminationTypesService', 
                    function (medicalExaminationTypesService) {
                         return medicalExaminationTypesService.getAll();
                     }]
            }
        })     
        .state('home.terms-conditions', {
            url: 'termsconditions',
            templateUrl: 'app/home/terms-conditions/termsconditions.view.html'
        })
        .state('home.patient', {
            url: 'patient',
            template: '<ion-nav-view></ion-nav-view>'
        })
        .state('home.patient.view', {
            url: '/:id/:admissionId',
            resolve: {            
                patientInfo: ['patientService', '$stateParams', function(patientService, $stateParams) {
                    return patientService.getById($stateParams.id);
                }],
                admissionInfo: ['admissionService', '$stateParams', function(admissionService, $stateParams) {
                    return admissionService.getById($stateParams.admissionId);
                }]
            },
            views: {
                '': {
                    templateUrl: 'app/home/patient/view/patient.view.html',
                    controller: 'patientController as patCtrl'
                },                
                'detail@home.patient.view' : {
                    templateUrl: 'app/home/patient/detail/detail.view.html',
                    controller: 'patientDetailController as patDetail'
                },
                'time-line@home.patient.view' : {
                    templateUrl: 'app/home/patient/time-line/time-line.view.html',
                    controller: 'patientTimelineController as patTimeline'
                },                
                'media@home.patient.view' : {
                    templateUrl: 'app/home/patient/media/media.view.html',
                    controller: 'patientMediaController as patMedia'
                },                
                'notification@home.patient.view' : {
                    templateUrl: 'app/home/patient/notification/notification.view.html',
                    controller: 'patientNotificationController as patNotify'
                },                
                'history@home.patient.view' : {
                    templateUrl: 'app/home/patient/history/history.view.html',
                    controller: 'patientHistoryController as patHistory'
                }
            }         
        })
        .state('home.patient.admission', {
            url: 'admission/:id',
            templateUrl: 'app/home/patient/admission/admission.view.0.0.2.html',
            controller: 'admissionController as admissionCtrl'
        })
        .state('home.patient.observation', {
            url: 'observation/:id/:admissionId',
            resolve: {            
                patientInfo: ['patientService', '$stateParams', function(patientService, $stateParams) {
                    return patientService.getById($stateParams.id);
                }],
                admissionInfo: ['admissionService', '$stateParams', function(admissionService, $stateParams) {
                    return admissionService.getById($stateParams.admissionId);
                }]
            },
            templateUrl: 'app/home/patient/observation/observation.view.html',
            controller: 'patientObservationController as patObsvCtrl'
        })
        .state('home.patient.appointment', {
            url: 'appointment/:id/:admissionId',
            resolve: {            
                patientInfo: ['patientService', '$stateParams', function(patientService, $stateParams) {
                    return patientService.getById($stateParams.id);
                }],
                admissionInfo: ['admissionService', '$stateParams', function(admissionService, $stateParams) {
                    return admissionService.getById($stateParams.admissionId);
                }]
            },
            templateUrl: 'app/home/patient/appointment/patient-appointment.view.html',
            controller: 'patientAppointmentController as appoCtrl'
        })
        .state('home.patient.note', {
            url: 'note/:id/:admissionId',
            resolve: {            
                patientInfo: ['patientService', '$stateParams', function(patientService, $stateParams) {
                    return patientService.getById($stateParams.id);
                }],
                admissionInfo: ['admissionService', '$stateParams', function(admissionService, $stateParams) {
                    return admissionService.getById($stateParams.admissionId);
                }]
            },
            templateUrl: 'app/home/patient/note/note.view.html',
            controller: 'noteController as noteCtrl'
        })
        .state('home.patient.discharge', {
            url: 'discharge/:id/:admissionId', 
            resolve : {   
                patientInfo: ['patientService', '$stateParams', function(patientService, $stateParams) {
                    return patientService.getById($stateParams.id);
                }],
                admissionInfo: ['admissionService', '$stateParams', function(admissionService, $stateParams) {
                    return admissionService.getById($stateParams.admissionId);
                }]
            },               
            templateUrl: 'app/home/patient/discharge/discharge.view.html',
            controller: 'dischargerController as disCtrl'
        }) 
        .state('home.patient.consult', {
            url: 'consult/:id/:admissionId', 
            resolve : {   
                patientInfo: ['patientService', '$stateParams', function(patientService, $stateParams) {
                    return patientService.getById($stateParams.id);
                }],
                admissionInfo: ['admissionService', '$stateParams', function(admissionService, $stateParams) {
                    return admissionService.getById($stateParams.admissionId);
                }]
            },               
            templateUrl: 'app/home/patient/consult/consult.view.html',
            controller: 'consultController as consultCtrl'
        }) 
        .state('home.patient.transfer', {
            url: 'transfer/:id/:admissionId', 
            resolve : {   
                patientInfo: ['patientService', '$stateParams', function(patientService, $stateParams) {
                    return patientService.getById($stateParams.id);
                }],
                admissionInfo: ['admissionService', '$stateParams', function(admissionService, $stateParams) {
                    return admissionService.getById($stateParams.admissionId);
                }]
            },               
            templateUrl: 'app/home/patient/transfer/transfer.view.html',
            controller: 'transferController as transfertCtrl'
        })            
        .state('home.patient.editPatient', {
            url: 'note/:id/:admissionId',
            templateUrl: 'app/home/patient/editPatient/editPatient.view.html',
            controller: 'editPatientController as editPatCtrl'
        })
        .state('home.registration', {
            url: 'registration',
            templateUrl: 'app/home/registration/registration.view.html',
            controller: 'registrationController as registerCtrl'
        })
        .state('home.settings', {
            url: 'settings',
            templateUrl: 'app/home/settings/settings.view.html',
            controller: 'settingsController as setCtrl'
        })
        .state('home.manageDiagnose', {
            url: 'manageDiagnose',
            templateUrl: 'app/home/settings/tpl.settings-diagnosis.modal.html',
            controller: 'diagnosisController as diaCtrl'
        })
        .state('home.manageProcedure', {
            url: 'manageProcedure',
            templateUrl: 'app/home/settings/tpl.settings-procedure.modal.html',
            controller: 'proceduresController as prcCtrl'
        })
        .state('home.chat', {
            url: 'chat',
            templateUrl: 'app/home/chat/chat.view.html',
            controller: 'chatController as chatCtrl'
        })
        .state('home.task', {
            url: 'task',
            templateUrl: 'app/home/task/task.view.html',
            controller: 'taskController as taskCtrl'
        }) 
        .state('home.task.laboratory', {
            url: '/laboratory',
            templateUrl: 'app/home/task/laboratory/laboratory-task.view.html',
            controller: 'laboratoryTaskController as taskCtrl'
        })
        .state('home.task.nurse', {
            url: '/nurse',
            templateUrl: 'app/home/task/nurse/nurse-task.view.html',
            controller: 'nurseTaskController as taskCtrl'
        })
        .state('home.directory', {
            url: 'directory',
            templateUrl: 'app/home/directory/directory.view.html',
            controller: 'directoryController as dirCtrl'
        })
        .state('home.staff', {
            url: 'staff',
            templateUrl: 'app/home/staff/staff.view.html',
            controller: 'staffController as staffCtrl'
        })
        .state('home.stafflist', {
            url: 'stafflist',
            templateUrl: 'app/home/staff/staffList.view.html',
            controller: 'staffListController as staffListCtrl'
        })
    };
})();