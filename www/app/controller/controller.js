( function() {
    angular.module('mediDocApp.controller', ['mediDocApp.model', 'mediDocApp.filters', 'onezone-datepicker','ngMaterial','ngMdIcons', 
                                             'ionic-timepicker', 'ion-gallery', 'ionic-datepicker', 'medi-calendar', 'toaster', 'ngAnimate']);
    
    angular.module('mediDocApp.controller').config(function(ionicTimePickerProvider, ionGalleryConfigProvider, ionicDatePickerProvider) {
        var timePickerObj = {
          inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
          format: 24,
          step: 15,
          setLabel: 'Set',
          closeLabel: 'Close'
        };
        ionicTimePickerProvider.configTimePicker(timePickerObj);
        
        ionGalleryConfigProvider.setGalleryConfig({
                          action_label: 'Close',
                          toggle: false,
                          fixed_row_size: false
        });
    });
})();