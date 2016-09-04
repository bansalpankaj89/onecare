(function() {
    angular.module('mediDocApp.directive')
    .directive('barcodeScanner', ['$cordovaBarcodeScanner' ,barcodeScanner]);
    
    function barcodeScanner($cordovaBarcodeScanner) {
        var barcodeScannerLink = function (scope, element, attr) {
            
            element.on('click', function() {  
                console.log('trying to scan')
                $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                        scope.onScan({barcodeData: barcodeData}); 
                    }, function(error) {
                        
                    });
            });
            
        };
        return {
            restrict: 'E',
            scope: {
                onScan: '&'
            },
            transclude: true,
            template: '<div><ng-transclude></ng-transclude></div>',
            link: barcodeScannerLink
        };
    };
})();