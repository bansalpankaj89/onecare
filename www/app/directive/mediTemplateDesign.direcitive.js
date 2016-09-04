(function() {
    angular.module('mediDocApp.directive')
    .directive('mediTemplateDesign', ['testTemplateService', mediTemplateDesign]);
    function mediTemplateDesign(testTemplateService) {
        
        var mediTemplateDesignLink = function (scope, element, attr) {
              

            
        };
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'app/directive/mediTemplateDesign.direcitive.html',
            link: mediTemplateDesignLink
        };
    };
})();