(function (){
    angular.module('mediDocApp.directive', ['onezone-datepicker', 'ion-gallery']);
    
    angular.module('mediDocApp.directive').config(
        function (ionGalleryConfigProvider) {
            ionGalleryConfigProvider.setGalleryConfig({
                action_label: 'Close',
                toggle: false,
                row_size: 3,
                fixed_row_size: false
            });
        });
})();