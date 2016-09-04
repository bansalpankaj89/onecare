(function() {
    angular.module('mediDocApp.directive')
    .directive('mediDropdown', [mediDropdown]);
    function mediDropdown() {
        var mediDropdownLink = function (scope, element, attr) {
            
            scope.isItemSelected = false;

            scope.toggleGroup = function() {
                scope.showContent = !scope.showContent;
            }
            scope.$on('item-selected', function(event, args) {
                console.log('scope on ', args);
                scope.isItemSelected = args;
            })
            // scope.isItemSelected = function() {
                
            // }

            scope.$on('selectedItem', function(event, args) {
              scope.selectedItem = args;
            });

        };
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                itemName: "@"
            },
            templateUrl: 'app/directive/dropdown/medi-dropdown.directive.html',
            link: mediDropdownLink
        };
    };
})();