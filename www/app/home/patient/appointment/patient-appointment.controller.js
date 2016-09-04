(function() {
    angular.module('mediDocApp.controller').controller('patientAppointmentController', patientAppointmentController);
    
    patientAppointmentController.$inject = ['$scope', '$stateParams', 'patientInfo', 'appointmentTypeConst', 'appointmentStatusConst', 'appointmentService'];
    
    
    function patientAppointmentController($scope, $stateParams, patientInfo, appointmentTypeConst, appointmentStatusConst, appointmentService) {
        //code goes here 
        $scope.title = patientInfo.last_name + " " + patientInfo.first_name;
        console.log(patientInfo)
        var vm  = this;
        vm.appointmentTypes = appointmentTypeConst;
        vm.appointment = {};
        $scope.scheduleTime = {
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            cancelLabel: 'Clear',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            minDate: new Date(), 
            callback: function (val) {    //Mandatory
                setEndTime(val);
            }
        };  
        
        function setEndTime(val){
            console.log('scheduleTime', val);
            vm.appointment.scheduleTime = val;
        }
        
        vm.doReferesh = function() {
            init();
        }
        
        vm.appointmentStatus = [];
        vm.appointmentTypeChanged = function() {
            var tempStatus = appointmentStatusConst.filter(function(item) {
                return item.appointmentType == vm.appointment.type;
            });
            if(tempStatus && tempStatus[0].status)
                vm.appointmentStatus =  tempStatus[0].status
        }
        
        $scope.appointmentDateSelected = function(selectedDate){    
             $scope.appointmentFilter = { scheduleTime: moment(selectedDate).format('DD-MMM-YYYY') };
        }
        
        vm.saveAppointment = function() {
            vm.appointment.createdTime = new Date();
            vm.appointment.createdBy = 'doctor_a';
            vm.appointment.assignedTo = 'open';
            vm.appointment.registered_id = $stateParams.id;
            vm.appointment.lastUpdated = "";
            vm.appointment.admission_id = $stateParams.admissionId;
            appointmentService.create(vm.appointment)
                .then( function(result) {
                console.log(result);
                init();
            })
        }
        
        vm.newAppointment = function() {
            vm.appointment = {};
            $scope.selectedItem= {};
        }
        
        vm.viewTemplate = function(appointment) {
            $scope.selectedItem=  appointment;
            vm.appointment = appointment;
            vm.appointment.type = appointment.type;
            vm.appointmentTypeChanged();
            vm.appointment.status = appointment.status;
        }
        
        function init(){
            appointmentService.getAll()
                .then(function(result) {
                vm.appointments = result;
                $scope.$broadcast('scroll.refreshComplete');
            }, function(error) {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        init();
    };
    
})();
