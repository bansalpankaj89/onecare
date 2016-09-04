(function () {
    'use strict';
    angular
        .module('mediDocApp.controller')
        .controller('directoryController',
                    ['$scope','$ionicScrollDelegate', 'filterFilter', directoryController]);

    function directoryController ($scope,$ionicScrollDelegate, filterFilter) {
      function init() {

  var letters = $scope.letters = [];
  var contacts = $scope.contacts = [];
  var currentCharCode = 'A'.charCodeAt(0) - 1;

  window.CONTACTS
    .sort(function(a, b) {
      return a.last_name > b.last_name ? 1 : -1;
    })
    .forEach(function(person) {
      //Get the first letter of the last name, and if the last name changes
      //put the letter in the array
      var personCharCode = person.last_name.toUpperCase().charCodeAt(0);
      //We may jump two letters, be sure to put both in
      //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
      var difference = personCharCode - currentCharCode;
      for (var i = 1; i <= difference; i++) {
        addLetter(currentCharCode + i);
      }
      currentCharCode = personCharCode;
      contacts.push(person);
    });

  //If names ended before Z, add everything up to Z
  for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
    addLetter(i);
  }

  function addLetter(code) {
    var letter = String.fromCharCode(code);
    contacts.push({
      isLetter: true,
      letter: letter
    });
    letters.push(letter);
  }

  //Letters are shorter, everything else is 52 pixels
  $scope.getItemHeight = function(item) {
    return item.isLetter ? 30 : 60;
  };
  $scope.getItemWidth = function(item) {
    return '100%';
  };

  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom(true);
  };

  var letterHasMatch = {};
  $scope.getContacts = function() {
    letterHasMatch = {};
    //Filter contacts by $scope.search.
    //Additionally, filter letters so that they only show if there
    //is one or more matching contact
    return contacts.filter(function(item) {
      var itemDoesMatch = !$scope.search || item.isLetter ||
        item.first_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
        item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

      //Mark this person's last name letter as 'has a match'
      if (!item.isLetter && itemDoesMatch) {
        var letter = item.last_name.charAt(0).toUpperCase();
        letterHasMatch[letter] = true;
      }

      return itemDoesMatch;
    }).filter(function(item) {
      //Finally, re-filter all of the letters and take out ones that don't
      //have a match
      if (item.isLetter && !letterHasMatch[item.letter]) {
        return false;
      }
      return true;
    });
  };

  $scope.clearSearch = function() {
    $scope.search = '';
  };

   }


    init(); 
    };
}());
window.CONTACTS = [{"id":1,"first_name":"Patrick","last_name":"Rogers","country":"Cyprus","favourite":"false","email":"progers@yata.net",title: 'Dr.', speciality: 'Otolaryngologist',image :'person0.jpg'},
{"id":2,"first_name":"Janet","last_name":"Gordon","country":"Croatia","favourite":"false","email":"jgordon@skivee.biz",title: '', speciality: 'Nurse Practitioner',image :'person1.jpg'},
{"id":3,"first_name":"Kathy","last_name":"Hamilton","country":"Armenia","favourite":"false","email":"khamilton@rhynyx.biz",title: '', speciality: 'Nurse Practitioner',image :'person2.jpg'},
{"id":4,"first_name":"Stephanie","last_name":"Johnson","country":"Mauritius","favourite":"false","email":"sjohnson@jabbertype.mil",title: 'Dr.', speciality: 'Neurologist',image :'person4.jpg'},
{"id":5,"first_name":"Jerry","last_name":"Palmer","country":"Thailand","favourite":"false","email":"jpalmer@avamm.org",title: 'Dr.', speciality: 'Dermatologist',image :'person6.jpg'},
{"id":6,"first_name":"Lillian","last_name":"Franklin","country":"Germany","favourite":"false","email":"lfranklin@eare.mil",title: 'Dr.', speciality: 'Endocrinologist',image :'person9.jpg'},
{"id":7,"first_name":"Melissa","last_name":"Gordon","country":"Serbia","favourite":"false","email":"mgordon@flashset.org",title: 'Dr.', speciality: 'Family medicine physician',image :'person8.jpg'},
{"id":8,"first_name":"Sarah","last_name":"Burns","country":"Grenada","favourite":"false","email":"sburns@eimbee.info",title: '', speciality: 'Nurse Practitioner',image :'person0.jpg'},
{"id":9,"first_name":"Willie","last_name":"Burton","country":"Croatia","favourite":"false","email":"wburton@dynazzy.info",title: 'Dr.', speciality: 'Gastroenterologist',image :'person2.jpg'},
{"id":10,"first_name":"Tina","last_name":"Simmons","country":"United States Virgin Islands","favourite":"false","email":"tsimmons@devpulse.mil",title: 'Dr.', speciality: 'Hematologist',image :'person5.jpg'},
{"id":11,"first_name":"Kenneth","last_name":"Larson","country":"Mexico","favourite":"true","email":"klarson@browseblab.info",title: '', speciality: 'Nurse Practitioner',image :'person6.jpg'},
{"id":12,"first_name":"Philip","last_name":"Welch","country":"Cuba","favourite":"true","email":"pwelch@skippad.edu",title: 'Dr.', speciality: 'Infectious disease specialist',image :'person7.jpg'},
{"id":13,"first_name":"Nicholas","last_name":"Parker","country":"British Indian Ocean Territory","favourite":"true","email":"nparker@twitternation.net",title: 'Dr.', speciality: 'Medical examiner',image :'person8.jpg'},
{"id":14,"first_name":"Nicole","last_name":"Webb","country":"Moldova","favourite":"true","email":"nwebb@midel.biz",title: 'Dr.', speciality: 'Oncologist',image :'person9.jpg'}];



   






