(function() {
    angular.module('mediDocApp.directive')
    .directive('mediStaffSearch', mediStaffSearch);
    
    function mediStaffSearch() {
        var mediStaffSearchLink = function(scope, element, attr) {
            console.log('mediStaffSearch', scope)
//                scope.$watch('selectedItems', function(newVal, oldVal) {
//                    scope.selectedItems= newVal;
//                    console.log('staffs selected', scope)
//                })
        };
        return {
            restrict: 'E',
            scope: {
                itemCollection: "=",
                selectedItems: "=",
                multiSelect: '@',
                searchFilter: '='
            },
            templateUrl: 'app/directive/mediStaffSearch.directive.html',
            link: mediStaffSearchLink 
        }
    }
})();