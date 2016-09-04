(function() {
    angular.module('mediDocApp.directive')
    .directive('mediDatetimePicker', mediDatetimePicker);
    
    mediDatetimePicker.$inject = ['$ionicPopup'];
    
    function mediDatetimePicker($ionicPopup) {
        var mediDatetimePickerLink = function (scope, element, attr) {
            
            scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'DateTime Picker';
            scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
            scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
            scope.cancelLabel = scope.inputObj.cancelLabel ? scope.inputObj.cancelLabel : 'Cancel';
            scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
            scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';            
            scope.cancelButtonType = scope.inputObj.cancelButtonType ? scope.inputObj.cancelButtonType : 'button-energized';

            scope.shortMonth = [2,4,6,9,11];
            scope.minDate = scope.inputObj.minDate ? scope.inputObj.minDate : new Date();
            scope.maxDate = scope.inputObj.maxDate ? scope.inputObj.maxDate : new Date();
            scope.returnFormat = scope.inputObj.returnFormat ? scope.inputObj.returnFormat : "DD-MMM-YYYY HH:mm";

            scope.increaseDate = function(){   
                var oldValue = scope.date;
                if(parseInt(scope.date)<30){
                     scope.date ++;
                } else if(scope.shortMonth.indexOf(parseInt(scope.month)) > 0 && scope.date == 30) {
                    scope.date = 1;
                } else if(scope.date == 30)
                     scope.date ++;
                else {
                    scope.date = 1;
                }
                if(!checkMinDate())
                    scope.date = oldValue;
            };
            
            scope.decreaseDate = function() {
               var oldValue = scope.date;
                if(parseInt(scope.date)>1){
                     scope.date --;
                } else if(scope.shortMonth.indexOf(parseInt(scope.month)) >0 && scope.date == 1) {
                    scope.date = 30;
                } else if(scope.date == 30)
                     scope.date --;
                else {
                    scope.date = 31;
                }
                if(!checkMinDate())
                    scope.date = oldValue;
            };
            
            scope.increaseMonth = function(){
                var oldValue = scope.month;
                if(parseInt(scope.month)<=11){
                     scope.month ++;
                }else{
                    scope.month = 1;
                }
                if(!checkMinDate())
                    scope.month = oldValue;
            };
            
            scope.decreaseMonth = function() {
                var oldValue = scope.month;
                if(parseInt(scope.month)>1){
                     scope.month --;
                }else{
                    scope.month = 12;
                }
                if(!checkMinDate())
                    scope.month = oldValue;
            };
            
            scope.increaseYear = function(){
                var oldValue = scope.year;
                if(parseInt(scope.year)>= moment().year())
                    scope.year = moment().year();
                else
                    scope.year ++;
                if(!checkMinDate())
                    scope.year = oldValue;
            };
            
            scope.decreaseYear = function() {
                var oldValue = scope.year;
                if(parseInt(scope.year)> moment().year())
                    scope.year = moment().year();
                else
                    scope.year --;
                if(!checkMinDate())
                    scope.year = oldValue;
            };
            
            scope.increaseHour = function(){
                var oldValue = scope.hour;
                if(parseInt(scope.hour)>=23){
                    scope.hour = 0;
                } else 
                    scope.hour ++;
                if(!checkMinDate())
                    scope.hour = oldValue;
            };
            
            scope.decreaseHour = function() {
                var oldValue = scope.hour;
                if(parseInt(scope.hour)<=0){
                    scope.hour = 23;
                } else 
                    scope.hour --;
                if(!checkMinDate())
                    scope.hour = oldValue;
            };
            
            scope.increaseMinute = function(){
                var oldValue = scope.minute;
                if(parseInt(scope.minute)>=59){
                    scope.minute = 0;
                } else 
                    scope.minute ++;
                if(!checkMinDate())
                    scope.minute = oldValue;
            };
            
            scope.decreaseMinute = function() {
                var oldValue = scope.minute;
                if(parseInt(scope.minute)<=0){
                    scope.minute = 59;
                } else 
                    scope.minute --;
                if(!checkMinDate())
                    scope.minute = oldValue;
            };
            
            var checkMinDate = function() {
                var newDate = moment({year: parseInt(scope.year), 
                                      month: parseInt(scope.month)-1, 
                                      day: parseInt(scope.date), 
                                      hour: parseInt(scope.hour),
                                      minute: parseInt(scope.minute),
                                      second: moment().second()});
                if(moment(scope.minDate).isBefore(newDate))
                    return true;
                return false;
            }   
            
            var init = function() {
                var currentDate = moment();
                scope.date = currentDate.format("DD");
                scope.month = currentDate.format("MM");
                scope.year = currentDate.format("YYYY");
                scope.hour = currentDate.format("HH");
                scope.minute = currentDate.format("mm");
            }
            
            init();
            
                
                element.on('click', function() {                    
                    if(!scope.mode) {
                    //templateUrl: 'app/directive/mediDatetimePicker.directive.html',
                    $ionicPopup.show({
                      templateUrl: 'app/directive/datetime-picker/medi-datetime-picker.directive.html',
                      title: scope.titleLabel,
                      subTitle: '',
                      scope: scope,
                      cssClass: 'medi-dtp',
                      buttons: [
                        {
                          text: scope.setLabel,
                          type: scope.setButtonType,
                          onTap: function (e) {
                            //scope.loadingContent = true;

                            //scope.numericValue = Number(scope.wholeNumber) + Number(strip(scope.decimalNumber, scope.precision));
                            scope.inputObj.callback(moment({year: parseInt(scope.year), 
                                          month: parseInt(scope.month)-1, 
                                          day: parseInt(scope.date), 
                                          hour: parseInt(scope.hour),
                                          minute: parseInt(scope.minute),
                                          second: moment().second()}).format(scope.returnFormat));
                          }
                        },
                        {
                          text: scope.cancelLabel,
                          type: scope.cancelButtonType,
                          onTap: function (e) {
                            scope.inputObj.callback(undefined);
                          }
                        },
                        {
                          text: scope.closeLabel,
                          type: scope.closeButtonType,
                          onTap: function (e) {
                            //scope.inputObj.callback(undefined);
                          }
                        }
                      ]
                    });
                    }
                });
        };
        return {
            restrict: 'AE',
            scope: {
                inputObj: '=',
                mode: '='
            },
            link: mediDatetimePickerLink
        };
    };
})();