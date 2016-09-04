(function() {
    angular.module('mediDocApp.directive')
    .directive('mediDrawPad', mediDrawPad);
    
    mediDrawPad.$inject = ['$ionicPopup','$timeout'];
    
    function mediDrawPad($ionicPopup, $timeout) {
        
        var mediDrawPadLink = function (scope, element, attr) {
            
            scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Draw Pad';
            scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Save';
            scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
            scope.cancelLabel = scope.inputObj.cancelLabel ? scope.inputObj.cancelLabel : 'Clear';
            scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
            scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';            
            scope.cancelButtonType = scope.inputObj.cancelButtonType ? scope.inputObj.cancelButtonType : 'button-energized';
            console.log('sketch propup media collection', scope.mediaCollection);
           
            element.on('click', function() {       
                if(!scope.mode){
                    $ionicPopup.show({
                      templateUrl: 'app/directive/draw-pad/medi-draw-pad.directive.html',
                      title: scope.titleLabel,
                      subTitle: '',
                      scope: scope,
                      cssClass: 'medi-draw-pad',
                      buttons: [
                        {
                          text: scope.setLabel,
                          type: scope.setButtonType,
                          onTap: function (e) {
                              $('#draw-pad').data('jqScribble').save(
                                  function(result) {
                                        var png = result.split(',')[1];
                                        var blob = b64toBlob(png, 'image/png');
                                        blob.type = 'image/png';
                                        blob.name = 'testing_sketch.png';                            
                                      scope.onSave({file: blob});
                                  })
                          }
                        },
    //                    {
    //                      text: scope.cancelLabel,
    //                      type: scope.cancelButtonType,
    //                      onTap: function (e) {
    //                        scope.inputObj.callback(undefined);
    //                      }
    //                    },
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
            })
            
            function b64toBlob(b64Data, contentType, sliceSize) {
              contentType = contentType || '';
              sliceSize = sliceSize || 512;

              var byteCharacters = atob(b64Data);
              var byteArrays = [];

              for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
              }

              var blob = new Blob(byteArrays, {type: contentType});
              return blob;
            }
        };
        return {
            restrict: 'AE',
            scope: {
                inputObj: '=',
                mediaCollection: '=',
                onSave: '&',
                mode: '='
            },
            //templateUrl: 'app/directive/medi.directive.html',
            link: mediDrawPadLink
        };
    };
})();