(function() {
    angular.module('mediDocApp.directive')
    .directive('mediAvatar', [mediAvatar]);
    function mediAvatar() {
        return {
            restrict: 'AE',
            scope: {
                avatar: '='
            },
            templateUrl: 'app/directive/avatar/medi-avatar.directive.html'
        };
    };
})();