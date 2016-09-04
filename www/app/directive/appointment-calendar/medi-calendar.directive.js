angular.module('medi-calendar.directive', ['ionic'])
.directive('mediCalendar', mediCalendar);

mediCalendar. $inject = ['mediCalendarService'];

function mediCalendar(mediCalendarService) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl : 'app/directive/appointment-calendar/medi-appointment-calendar.directive.html',
        scope: {
            appointmentObj: '=config',
            onDateSelected: '&'
        },
        link: function(scope, element, attrs) {
            mediCalendarLink(scope, element, attrs, mediCalendarService);
        }
    }
}

function mediCalendarLink(scope, element, attrs, mediCalendarService) {
    var config = {
        todayLabel: 'Today',
        clearLabel: 'Clear',
        startDate: new Date(),
        mondayFirst: true,
        weeklyList: ['S','M','T','W','T','F','S'],
        monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug','Sep','Oct','Nov','Dec'],
        templateType: 'default',
        showTodyButton: true,
        disableWeekdays: []
    };
    
    angular.extend(config, scope.config);
    
    scope.today = resetHMSM(new Date()).getDate();
    
    scope.disabledDates = [];
    
    function resetHMSM(currentDate) {
        //console.log('before HMSM ', currentDate.getTime());
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.getMilliseconds(0);
        //console.log('after HMSM ', currentDate.getTime());

        return currentDate;
    }

    scope.previousMonth = function(){
        if(scope.currentDate.getMonth() === 1) {
            scope.currentDate.setFullYear(scope.currentDate.getFullYear());
        }
        scope.currentDate.setMonth(scope.currentDate.getMonth() - 1);
        scope.currentMonth = scope.mainObj.monthList[scope.currentDate.getMonth()];
        scope.currentYear = scope.currentDate.getFullYear();

        refreshDateList(scope.currentDate);
    }

    scope.nextMonth = function(){
        if(scope.currentDate.getMonth() === 11) {
            scope.currentDate.setFullYear(scope.currentDate.getFullYear());
        }
        scope.currentDate.setDate(1);
        scope.currentDate.setMonth(scope.currentDate.getMonth()+1);
        scope.currentMonth = scope.mainObj.monthList[scope.currentDate.getMonth()];
        scope.currentYear = scope.currentDate.getFullYear();

        refreshDateList(scope.currentDate);
    }

    scope.dateSelected = function(selectedDate) {
        if(!selectedDate || Object.keys(selectedDate).length === 0)
            return;
        scope.selectedDateEpoch = selectedDate.epoch;

        //call the callback with the selected date
        scope.onDateSelected(
                        { selectedDate: scope.selectedDateEpoch 
                        });  
    }
    
    scope.setTodayDate = function() {
        var today = new Date();
        refreshDateList(new Date());

        scope.selectedDateEpoch = resetHMSM(today).getTime();

        //call the callback with the selected date
        scope.onDateSelected(
                        { selectedDate: scope.selectedDateEpoch 
                        });   
    }

    function setDisableDates(mainObj) {
        if(!mainObj.disableDates || mainObj.disableDates.length === 0) {
            scope.disabledDates = [];
        } else {
            scope.disabledDates = [];
            angula.forEach(mainObj.disableDates, function(val , key) {
                val = resetHMSM(new Date(val));
                scope.disabledDates.push(val.getTime());
            });
        }
    }
    
    function refreshDateList(currentDate) {
        currentDate = resetHMSM(currentDate);
        scope.currentDate = angular.copy(currentDate);

        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate();
        var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        scope.monthList = [];
        if(scope.mainObj.monthList && scope.mainObj.monthList.length === 12) {
            scope.monthList = scope.mainObj.monthList;
        } else {
            scope.monthList = mediCalendarService.monthList;
        }

        scope.yearList = mediCalendarService.getYearsList(scope.mainObj.from, scope.mainObj.to);

        scope.dayList = [];

        var tempDate, disabled;
        scope.firstDayEpoch = resetHMSM(new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDay)).getTime();
        scope.lastDayEpoch = resetHMSM(new Date(currentDate.getFullYear(), currentDate.getMonth(), lastDay)).getTime();

        for(var i = firstDay; i <= lastDay; i++) {
            tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            disabled = (tempDate.getTime() < scope.fromDate) || (tempDate.getTime() > scope.toDate) 
                        || scope.mainObj.disableWeekdays.indexOf(tempDate.getDate()) >=0;
            scope.dayList.push({
                date: tempDate.getDate(),
                month: tempDate.getMonth(),
                year: tempDate.getFullYear(),
                day: tempDate.getDay(),
                epoch: resetHMSM(tempDate).getTime(),
                disabled: disabled
            });
        }

        //set monday as the first day of the week 
        var firstDayMonday = scope.dayList[0].day - scope.mainObj.mondayFirst;
        firstDayMonday = (firstDayMonday <0)? 6: firstDayMonday;

        for(var j=0; j<firstDayMonday; j++){
            scope.dayList.unshift({});
        }

        scope.rows = [0,7,14,21,28,35];
        scope.cols = [0,1,2,3,4,5,6];

        scope.currentMonth = scope.mainObj.monthList[currentDate.getMonth()];
        scope.currentYear = currentDate.getFullYear().toString();
        scope.currentMonthSelected = angular.copy(scope.currentMonth);
        scope.currentYearSelected = angular.copy(scope.currentYear);
        scope.numColumns = 7;

    }
    
    scope.monthChanged = function(month) {
        var monthNumber = scope.monthList.indexOf(month);
        scope.currentDate.setMonth(monthNumber);
        refreshDateList(scope.currentDate);

    }

    scope.yearChanged = function(year) {
        scope.currentDate.setFullYear(year);
        refreshDateList(scope.currentDate);
    }
    
    function setInitialObject(initObj) {
        scope.mainObj = angular.copy(initObj);
        scope.selectedDateEpoch = resetHMSM(scope.mainObj.startDate).getTime();

        if(scope.mainObj.weeklyList && scope.mainObj.weeklyList.length === 7){
            scope.weekList = scope.mainObj.weeklyList;
        } else{
            scope.weekList = ['S', 'M', 'T', 'W', 'T','F','S'];
        }

        if(scope.mainObj.mondayFirst){
            scope.weekList.push(scope.mainObj.weeklyList.shift());
        }
        scope.disableWeekdays = scope.mainObj.disableWeekdays;

        refreshDateList(scope.mainObj.startDate);
        setDisableDates(scope.mainObj);
    }
    
    init({})
    
    function init(inputObj) {
        var buttons = [];
        delete scope.fromDate;
        delete scope.toDate;

        scope.mainObj = angular.extend({}, config, inputObj);
        if(scope.mainObj.from){
            scope.fromDate = resetHMSM(new Date(scope.mainObj.from)).getTime();
        }

        if(scope.mainObj.to){
            scope.toDate = resetHMSM(new Date(scope.mainObj.to)).getTime();
        }

        if(inputObj.disableWeekdays && config.disableWeekdays) {
            scope.mainObj.disableWeekdays = inputObj.disableWeekdays.concat(config.disableWeekdays);
        }

        setInitialObject(scope.mainObj);

//            buttons =  [{
//                text: scope.mainObj.setLabel,
//                type: 'button_set',
//                onTap: function(e) {
//                    scope.mainObj.callback(scope.selectedDateEpoch);
//                }
//            }];

        buttons = [];

        if(scope.mainObj.showTodayButton) {
            buttons.push({
                text: scope.mainObj.todayLabel,
                type: 'button_today',
                onTap: function(e) {
                    var today = new Date();
                    refreshDateList(new Date());
                    scope.selectedDateEpoch = resetHMSM(today).getTime();
                }
            });
        }

        buttons.push({
            text: scope.mainObj.clearLabel,
            type: 'button_clear',
            onTap: function(e) {
                console.error('handle the function to clear the date and set the current date')
            }
        });
    };
}