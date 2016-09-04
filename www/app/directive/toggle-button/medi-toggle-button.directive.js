(function() {
    angular.module('mediDocApp.directive')
    .directive('mediToggleButton', [mediToggleButton]);
    function mediToggleButton() {
        var mediToggleButtonLink = function (scope, element, attr) {
            scope.toggle = function() {
                scope.toggleValue = !scope.toggleValue;
            }
        };
        return {
            restrict: 'E',
            scope: {
                toggleValue: "="
            },
            templateUrl: 'app/directive/toggle-button/medi-toggle-button.directive.html',
            link: mediToggleButtonLink
        };
    };
})();