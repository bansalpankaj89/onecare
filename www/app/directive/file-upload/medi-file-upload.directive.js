(function() {
    angular.module('mediDocApp.directive')
    .directive('mediFileUpload', [mediFileUpload]);
    function mediFileUpload() {
        var mediFileUploadLink = function (scope, element, attr) {
            //element.parent.append('<ion-spinner icon="lines" ng-show="uploading"></ion-spinner>');
            element.bind('change', function(event){
            var files = event.target.files;
            var file = files[0];
            scope.file = file;
            scope.$parent.file = file;
            scope.$parent.$apply();
            scope.uploaded({file: file});
            //console.log('change occured', file, scope.$parent.file)
          });
        };
        return {
            restrict: 'AE',
            //templateUrl: 'app/directive/medi-file-upload.directive.html',
            scope: {
              file: '=',
              uploaded: '&'
            },
            link: mediFileUploadLink
        };
    };
})();