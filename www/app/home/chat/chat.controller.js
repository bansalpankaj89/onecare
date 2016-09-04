(function () {
    'use strict';
    angular
        .module('mediDocApp.controller')
        .controller('chatController',
                    ['$scope', chatController]);

    function chatController ($scope) {

        function init() {
            var messageOptions = [
              { content: '<p>Good Morning Dr Sam</p>' },
              { content: '<p>Hi, How are you</p>' },
              { content: '<p>I am good,I need help with on patient.If you are free can I send consultaion request</p>' },
              { content: '<p>sure, I will be free today around 11 am.</p>' },
              { content: '<p>Thanks alot,will get back to you</p>' },
              { content: '<p>no problem</p>' }
                ];

            var messageIter = 0;
            $scope.messages = messageOptions.slice(0, messageOptions.length);

            $scope.add = function() {
              var nextMessage = messageOptions[messageIter++ % messageOptions.length];
              $scope.messages.push(angular.extend({}, nextMessage));
            }
        }
   init(); 
    };
}());


   






