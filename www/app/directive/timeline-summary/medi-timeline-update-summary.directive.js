(function() {
    angular.module('mediDocApp.directive')
    .directive('mediTimelineUpdateSummary', [mediTimelineUpdateSummary]);
    function mediTimelineUpdateSummary() {
        //var mediTimelineUpdateSummaryLink = function (scope, element, attr) {
        
        //};
        return {
            restrict: 'E',
            scope: {
                updates: '=',
                heading: '@'
            },
            templateUrl: 'app/directive/timeline-summary/medi-timeline-update-summary.directive.html'//,
            //link: mediTimelineUpdateSummaryLink
        };
    };
})();