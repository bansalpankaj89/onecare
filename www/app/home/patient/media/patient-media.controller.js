(function() {
    angular.module('mediDocApp.controller').controller('patientMediaController', patientMediaController);
    
    patientMediaController.$inject = ['$scope', '$stateParams', 'patientMediaService', 'awsService'];
    
    function patientMediaController($scope, $stateParams, patientMediaService, awsService) {
        //code goes here   
        
       // awsService.getAllImages();

        var vm = this;
        vm.capturePhoto = function() {
                navigator.camera.getPicture(onSuccess, onFail, { 
                    quality: 50,
                    destinationType: Camera.DestinationType.FILE_URI 
                });
            }
        var onSuccess = function(imageURI) {
            var image = $('#myImage');
            image.src = imageURI;
            //should save to specific folder for the mediDocApp
        }
        var onFail = function(message) {
            alert('Failed because: ' + message);
        }
        //should load all the images for the mediDocApp folder in the local drive
        vm.mediaCollections = [];
        
        var init = function() {
            patientMediaService.getByKeyVal('admission_id', $stateParams.admissionId)
            .then(function(result) {
                vm.mediaCollections = result;
                $scope.$broadcast('scroll.refreshComplete');

            })
        } 
        
        vm.doRefresh = function() {
            init();
        }
        init();
    };
})();
