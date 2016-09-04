(function() {    
    angular.module('mediDocApp.directive')
    .directive('mediList', [mediList]);
    function mediList() {
        return {
            restrict: 'E',
            scope: {
                onSelect: '&',
                itemSelected: '=',
                textOverflow: '@'
            },
            transclude: true,
            templateUrl: function(elem, attr) {
                if(attr.isChecked)
                    return 'app/directive/selection-list/medi-list-checked.directive.html';
                return  'app/directive/selection-list/medi-list.directive.html';
            } 
        };
    };
})();