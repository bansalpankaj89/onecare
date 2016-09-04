(function() {
    angular.module('mediDocApp.controller').controller('patientObservationController', patientObservationController);
            
    patientObservationController.$inject = ['$scope', '$stateParams',
                                            'patientInfo', 'admissionInfo', //'patientObservationTrans',
                                            'patientObservationService', 'admissionService', 'patientTransactionService', 
                                            'patientMediaService', 'awsService',
                                             'Patient',
                                            'ionicTimePicker'];
    
    function patientObservationController(
        $scope, $stateParams, 
        patientInfo, admissionInfo, //patientObservationTrans,
        patientObservationService, admissionService, patientTransactionService, 
        patientMediaService, awsService,
        Patient,
        ionicTimePicker) {   
            
        $scope.title = patientInfo.last_name + " " + patientInfo.first_name;
        var vm = this;
        var minDate = moment().subtract(7, 'years')
        $scope.isView = true;

        $scope.observationImg = {
        
        };
        $scope.newObservation = {};
             //code goes here   
        $scope.startTime = {
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            cancelLabel: 'Clear',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            minDate: minDate, 
            callback: function (val) {    //Mandatory
                setStartTime(val);
            }
        };

        $scope.endTime = {
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            cancelLabel: 'Clear',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            minDate: minDate, 
            callback: function (val) {    //Mandatory
                setEndTime(val);
            }
        };    
            
        var setStartTime = function(time) {
            $scope.newObservation.startTime = time;
        }
        
        var setEndTime = function(time) {
            $scope.newObservation.endTime = time;
        }
        
        var onSuccess = function(imageURI) {
            var image = $('#myImage');
            image.src = imageURI;
            console.log('captured Image ', imageURI);
            //should save to specific folder for the mediDocApp
        }

        var onFail = function(message) {
            console.log('camera capture failed', message);
        }
        
        $scope.capturePhoto = function() {
            navigator.camera.getPicture(onSuccess, onFail, { 
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI 
            });
        }
        
        $scope.saveSketch = function(file) {
            
            awsService.uploadImage(file, 'observation')
            .then(function(resolve) { 
                $scope.uploading = false;
                if(!$scope.newObservation.mediaCollections)
                    $scope.newObservation.mediaCollections = [];
                $scope.newObservation.mediaCollections.push({
                    src: resolve, 
                    sub: 'sample Image', 
                    tag: 'observation', 
                    admission_id: $stateParams.admissionId, 
                    patient_id: $stateParams.id });
                $scope.file = {};
                //console.log('file URI ',resolve);
            }, function(err) {
                $scope.uploading = false;
                console.log('error',err);
            }, function(notify) {
                $scope.progress = notify;
                $scope.uploading = true;
            })
        }
            
        $scope.savePatientObservation = function() {            
            $scope.newObservation.input_user_id = 'loged_in_user';
            var textObservation = $scope.newObservation.observationDetail + " on " + $scope.newObservation.startTime;
            var newTransaction;
            if($scope.newObservation.mediaCollections){
                patientMediaService.saveMediaCollection($scope.newObservation.mediaCollections)
                .then(function (result) {
                    $scope.newObservation.mediaCollections = result;
                    var changedItem = $scope.newObservation;
                    changedItem.description = textObservation;                
                    vm.patient.setObservation(changedItem, true);
                    newTransaction = vm.patient.updateNewVisitInfo(vm.patient);
                    return patientObservationService.create(newTransaction.info.observations[0].item);
                }).then(function (result) {
                    //get the created id and append to the admissionInfo observations

                    //save the admission object with updated diagnosis / procedure / status
                    admissionInfo.observations = newTransaction.observations;

                    //create a new transaction for the admission with added and removed object
                    console.log('newTransaction ', newTransaction)                
                    return admissionService.update(admissionInfo);
                }).then(function(result){
                    console.log('patient observations admissionService succesfully saved', result);
                    return patientTransactionService.create(newTransaction)
                }).then(function(result){
                    console.log('patient observations patientTransactionService sucessfully added');
                    $scope.newObservation = {};
                    $scope.isView = true;
                });
            } else {
                var changedItem = $scope.newObservation;
                changedItem.description = textObservation;                
                vm.patient.setObservation(changedItem, true);
                newTransaction = vm.patient.updateNewVisitInfo(vm.patient);
                patientObservationService.create(newTransaction.info.observations[0].item)
                .then(function(result) {
                    //get the created id and append to the admissionInfo observations

                    //save the admission object with updated diagnosis / procedure / status
                    admissionInfo.observations = newTransaction.observations;

                    //create a new transaction for the admission with added and removed object
                    console.log('newTransaction ', newTransaction)                
                    return admissionService.update(admissionInfo);
                }).then(function(result){
                    console.log('patient observations admissionService succesfully saved', result);
                    return patientTransactionService.create(newTransaction)
                }).then(function(result){
                    console.log('patient observations patientTransactionService sucessfully added');
                    $scope.newObservation = {};
                    $scope.isView = true;
                });
            }
        }
        
        $scope.clear = function() {
            $scope.newObservation = {};
            $scope.isView = true;
        }
        
        $scope.viewDetail = function (observation) {
            $scope.newObservation = observation;
            $scope.isView = true;
            $scope.selectedItem = observation;
        }
        
        vm.doRefresh = function () {
            init();
        }
        
        var init = function() {    
            patientObservationService.getByKeyVal('admission_id', $stateParams.admissionId)
            .then(function(result) {
                 $scope.observationCollection = result;
                $scope.$broadcast('scroll.refreshComplete');
            }, function() {
                $scope.$broadcast('scroll.refreshComplete');
            })
            vm.patient = new Patient(patientInfo, admissionInfo);
        }
        
        $scope.fileUploaded = function(file) {
            console.log('img file', file);
            $scope.file = file;
        }
        
        $scope.upload = function() {          
          if($scope.file) {
            awsService.uploadImage($scope.file, 'observation')
            .then(function(resolve) { 
                $scope.uploading = false;
                if(!$scope.newObservation.mediaCollections)
                    $scope.newObservation.mediaCollections = [];
                $scope.newObservation.mediaCollections.push({
                    src: resolve, 
                    sub: 'sample Image', 
                    tag: 'observation', 
                    admission_id: $stateParams.admissionId, 
                    patient_id: $stateParams.id });
                $scope.file = {};
                //console.log('file URI ',resolve);
            }, function(err) {
                $scope.uploading = false;
                console.log('error',err);
            }, function(notify) {
                $scope.progress = notify;
                $scope.uploading = true;
            })
          }
          else {
            console.warn('no files selected')
          }
        }
        
        vm.newObservation = function () {
            
            $scope.newObservation = {};
            $scope.isView = false;
        }
        
        
        init();
    };
})();
