(function() {
    angular.module('mediDocApp.controller')
        .controller('homeController', ['$rootScope','$scope', '$state', '$ionicSideMenuDelegate', homeController]);
    
    function homeController($rootScope, $scope, $state, $ionicSideMenuDelegate) {
        var vm = this;
        
//        //Bsed on the route this should be changed. eg. if default logged in should load the app users name
//        //if it goes into a patient should load the patient name
//        vm.displayName = 'Dr. Raviharan';
//        vm.showHeaderOptions = false;
//        $rootScope.$on('$stateChangeSuccess', 
//            function(event, toState, toParams, fromState, fromParams) { 
//                console.log('toState ', toState);
//                loadStateSpecificOptions(toState.name);
//            });
//        
//        var loadStateSpecificOptions = function(state) {
//            switch(state) {
//                case 'home.patient': {
//                    vm.showHeaderOptions = true;
//                }
//                break;
//            }
//        }
        
//        vm.navigate = function (state) {
//            $state.go(state);
//        }
        
        
        $scope.toggleLeft = function() {
          $ionicSideMenuDelegate.toggleLeft();
        }; 
        $scope.menu = [
            {
              link : '#/patientlist',
              title: 'Home',
              icon: 'ion-ios-medical-outline'
            },
              {
              link : '#/staff',
              title: 'Manage Staff',
              icon: 'ion-person-stalker'
            },
             {
              link : '#/registration',
              title: 'Patient Registration',
              icon: 'ion-cube'
            },
            // {
            //   link : '#/favouritediagnoisis',
            //   title: 'Diagnosis Settings',
            //   icon: 'ion-ios-pulse-strong'
            // },
            // {
            //   link : '#/facouriteprocedures',
            //   title: 'Procedures Settings',
            //   icon: 'ion-ios-medkit'
            // },
            {
              link : '',
              title: 'Drugs Settings',
              icon: 'ion-toggle-filled'
            },
            {
              link : '#/designtemplate',
              title: 'Design Template',
              icon: 'ion-clipboard'
            },
            {
              link : '#/chat',
              title: 'Chat',
              icon: 'ion-chatbubbles'
            },
            {
              link : '#/directory',
              title: 'Directory',
              icon: 'ion-android-contacts'
            },
            {
              link : '#/termsconditions',
              title: 'Terms & Conditions',
              icon: 'ion-android-checkbox-outline'
            },
             {
              link : '#/task/laboratory',
              title: 'Task',
              icon: 'ion-android-calendar'
            },
            {
              link : '#/settings',
              title: 'Settings',
              icon: 'ion-ios-gear-outline'
            },
             {
              link : 'showListBottomSheet($event)',
              title: 'Logout',
              icon: 'ion-power'
            }
          ];

    };
})();
