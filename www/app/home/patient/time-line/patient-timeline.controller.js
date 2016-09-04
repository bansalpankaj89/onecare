(function() {
    angular.module('mediDocApp.controller').controller(
        'patientTimelineController', patientTimelineController);
    
    patientTimelineController.$injet = ['$scope', '$stateParams' ,'patientTransactionService'];
    
    function patientTimelineController(
        $scope, $stateParams, patientTransactionService) {
        
            //code goes here   
            var vm = this;
            
            vm.changeTimeline =function(){
                  $scope.showPic = !$scope.showPic;
            }
            
            function init() {
                patientTransactionService.getByKeyVal('admission_id', $stateParams.admissionId)
                .then(function(result) {
                    vm.patientTransInfo = result.map(function(item) {
                        return {
                            date : Date.parse(item.trans_date),
                            author: item.doctorId,
                            updates: item.info
                        }
                    })
                    
                    $scope.$broadcast('scroll.refreshComplete');
                    vm.timelineCollection = vm.patientTransInfo.sort(function(a,b){
                      // Turn your strings into dates, and then subtract them
                      // to get a value that is either negative, positive, or zero.
                      return new Date(b.date) - new Date(a.date);
                    });
                })
            }
            
            init();
            
            vm.doRefresh = function() {
                init();
                return true;
            }

    };
})();
