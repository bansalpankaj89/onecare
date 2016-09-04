(function() {
    angular.module('mediDocApp.controller').controller('patientController', [
        'patientInfo', //'admissionInfo',
        '$scope', '$rootScope', '$stateParams'
        , patientController]);
    
    function patientController(
        patientInfo, //admissionInfo,
        $scope, $rootScope, 
        $stateParams) {                
        $scope.patientButtonShow = false;

        $scope.patientFullName = patientInfo.last_name + " " + patientInfo.first_name;

        $scope.menuClicked = function(menu) {
            enablePatientSaveButton(null, {})
//           // console.log('menuClicked ', menu)
//            if(menu=="details")
//                $scope.patientButtonShow = true;
//            else
//                $scope.patientButtonShow = false;
        }
        
        $scope.$on('enable-patient-save',enablePatientSaveButton);
            
        function enablePatientSaveButton (scope, value) {
            if( value.newVisit && (
                (value.newVisit.patientStatus && value.newVisit.patientStatus.length>0) || 
                (value.newVisit.diagnosis && value.newVisit.diagnosis.length>0) || 
                (value.newVisit.procedures && value.newVisit.procedures.length>0) || 
                (value.newVisit.prescriptions && value.newVisit.prescriptions.length>0) || 
                (value.newVisit.observations && value.newVisit.observations.length>0) || 
                (value.newVisit.medicalExaminations && value.newVisit.medicalExaminations.length>0)
            ))
                $scope.patientButtonShow = true;
            else
                $scope.patientButtonShow = false;
        }
        
        //code goes here  
        $scope.patientName = $stateParams.name;
        
        $scope.saveVisitInfo = function() {
     //       console.log('saveNewVisit')
            $rootScope.$broadcast('saveNewVisit');
        }
        $scope.$watch('selectedIndex', function(current, old) {
        //    console.log('current selectedIndex', current);
//            switch (current) {
//                case 0:
//                    $location.url("/view1");
//                    break;
//                case 1:
//                    $location.url("/view2");
//                    break;
//                case 2:
//                    $location.url("/view3");
//                    break;
//            }
        });
    };
})();
