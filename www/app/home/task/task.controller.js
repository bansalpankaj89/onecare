(function () {
    'use strict';
    angular
        .module('mediDocApp.controller')
        .controller('taskController', taskController);
    
    taskController.$inject = ['$scope', '$state'];
    
    function taskController ($scope, $state) {
        
        $scope.navigateLaboratoryTask = function() {
            $state.go('home.task.laboratory', {});
        }
        
        $scope.navigateNurseTask = function() {
            $state.go('home.task.nurse', {})

        }

    };
}());



   






