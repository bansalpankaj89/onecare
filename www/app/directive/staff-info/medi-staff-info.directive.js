(function() {
    angular.module('mediDocApp.directive')
    .directive('mediStaffInfo', [mediStaffInfo]);
    function mediStaffInfo() {
        var mediStaffInfoLink = function (scope, element, attr) {
            console.log('Staff Name ', scope);
        };
        return {
            restrict: 'E',
            scope: {
                staffName: '@',
                staffDesignation: '@'
            },
            templateUrl: 'app/directive/staff-info/medi-staff-info.directive.html',
            link: mediStaffInfoLink
        };
    };
})();