(function() {
    angular.module('mediDocApp.controller').controller('patientHistoryController', patientHistoryController);
    patientHistoryController.$inject = ['$scope', 'patientInfo', 'dischargeAppoitmentService'];
    
    function patientHistoryController($scope, patientInfo, dischargeAppoitmentService) {
        //code goes here   
        
        var vm = this;
        var registrationId = patientInfo.$id;
        
        var init = function () {
            vm.patientHistoryList = [];
            loadPatientHistory(registrationId)
        }
        
        
        
        var loadPatientHistory = function (patientId) {
            dischargeAppoitmentService.getByKeyVal('registered_id', registrationId)
            .then(function(result) {
                angular.forEach(result, function(admission) {
                    var tempAdmissionInfo = {
                        admission_date : admission.admission_date,
                        admission_no : admission.admission_id,
                        ward_no : admission.beddetails.ward_no,
                        bed_no : admission.beddetails.bed_no,
                        diagnosis: admission.diagnosis?
                            admission.diagnosis.map(function(item) {
                                return item.description;
                            }).toString(): [],
                        procedures: admission.procedures?
                            admission.procedures.map(function(item) {
                                return item.description;
                            }).toString(): [],
                        prescriptions: admission.prescriptions?
                            admission.prescriptions.map(function(item) {
                                return item.description;
                            }).toString(): [],
                        medicalExaminations: admission.medicalExaminations?
                            admission.medicalExaminations.map(function(item) {
                                return {
                                    description: item.description,
                                    reference_id: item.medical_examination_id
                                }
                            }): [],
                    };
                    
                    var tempDischargeInfo = {
                        discharge_date: moment(admission.date_time).format("ddd Do MMM YYYY HH:mm:ss"),
                        discharge_status: admission.discharge_info.discharge_status[0].description,
                        condition: admission.discharge_info.condition,
                        instruction: admission.discharge_info.instruction                        
                    };
                    
                    vm.patientHistoryList.push({
                        admissionInfo: tempAdmissionInfo,
                        dischargeInfo: tempDischargeInfo
                    })
                })
            })
            
            console.log(vm.patientHistoryList)
        }
        
        init();

    };
})();
