(function(){
    angular.module('mediDocApp.directive')
    .directive('mediSearch', [mediSearch]);
    
    function mediSearch() {
        return {
            templateUrl: 'app/directive/mediSearch.directive.html'
        };
    }
})();