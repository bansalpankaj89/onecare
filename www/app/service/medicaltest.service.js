(function() {
    angular.module('mediDocApp.service')
    .factory('medicalTestService', ['$q', medicalTestService]);
    
    function medicalTestService($q) {
        //http://www.medicinenet.com/procedures_and_tests
        var testCollection = [
            { name: 'Ultrasound', id: '001' },
            { name: 'Liver Biopsy', id: '002' },
            { name: 'Barium Swallow (Upper GI Series)', id: '003' },
            { name: 'Ferritin Blood Test', id: '004' },
            { name: 'Breast Biopsy', id: '005' },
            { name: 'HDL Cholesterol Test (Cholesterol Test)', id: '006' },
            { name: 'Hemoglobin A1c Test', id: '007' },
            { name: 'Kidney Function (Creatinine Blood Test)', id: '008' },
            { name: 'Mean Cell Volume (Complete Blood Count)', id: '009' },
            { name: 'MPV (Complete Blood Count)', id: '010' },
            { name: 'OGTT (Glucose Tolerance Test)', id: '011' },
        ];
        return {
            testCollection : testCollection
        };
    }
})();