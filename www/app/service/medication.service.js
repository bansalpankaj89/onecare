(function() {
    angular.module('mediDocApp.service')
    .factory('medicationService', ['$q', medicationService]);
    
    function medicationService($q) {
        //http://www.drugs.com/dextromethorphan.html
        var drugList = [
            {   pharmacological: 'Paracetamol', id: '001', brands: [] },
            {   pharmacological: 'Pradaxa', id: '002', brands: ['Pradaxa'] },
            {   pharmacological: 'Acetaminophen', id: '003', brands: ['Actamin', 'Apra', 'Mapap', 'Q-Pap', 'Tactinal', 'Tempra', 'Tycolene', 'Tylenol', 'Vitapap'] },
            {   pharmacological: 'Amoxicillin', id: '004', brands: ['Amoxil', 'Moxatag', 'Trimox', 'Wymox', 'Amoxil Pediatric Drops', 'Biomox', 'Amoxicot', 'Moxilin', 'Dispermox'] },
            {   pharmacological: 'Bactroban', id: '005', brands: ['Bactroban', 'Centany', 'Centany AT Kit']},
            {   pharmacological: 'Dextromethorphan', id: '006', brands: ['Babee Cof', 'Benylin DM Pediatric', 'Buckleys Mixture', 'Creomulsion', 'Creo-Terpin', 
                                                                         'DayQuil Cough', 'Delsym', 'Delsym 12 Hour Cough Relief', 'Elixsure Cough', 
                                                                         'Robafen Cough Liquidgels', 'Robitussin CoughGels', 'Scot-Tussin Diabetic', 
                                                                         'Silphen DM', 'St. Joseph Cough Suppressant', 'Sucrets DM Cough', 
                                                                         'Theraflu Thin Strips Cough', 'Triaminic Long Acting Cough']}
        ]; 
        
        var dosageList = [
            {
                description: '',
                id: ''
            }
        ];
        
        var routeAdministration = [
            'Oral', 'Ophthalmic', 'Inhalational', 'Parenteral', 'Topical'
        ];
        
        //http://www.cwladis.com/math104/lecture5.php
        var frequency = [
            {   description: 'every day', tag : 'q.d.'  },
            {   description: 'every other day', tag : 'q.o.d.'  },
            {   description: 'every hour', tag : 'q.h.'  },
            {   description: 'every 2 hours', tag : 'q.2.h.'  },
            {   description: 'every 3 hours', tag : 'q.3.h.'  },
            {   description: 'every 4 hours', tag : 'q.4.h.'  },
            {   description: 'every 6 hours', tag : 'q.6.h.'  },
            {   description: 'every 8 hours', tag : 'q.8.h.'  },
            {   description: 'twice a day', tag : 'b.i.d'  },
            {   description: 'three times a day', tag : 't.i.d'  },
            {   description: 'four times a day', tag : 'q.i.d'  },
            {   description: 'every morning', tag : 'q.a.m.'  },
            {   description: 'at bedtime', tag : 'h.s.'  },
            {   description: 'every bedtime', tag : 'q.h.s.'  },
            {   description: 'before meals', tag : 'a.c.'  },
            {   description: 'after meals', tag : 'p.c.'  },
            {   description: 'as desired', tag : 'ad lib'  },
            {   description: 'as necessary', tag : 's.o.s.'  },
            {   description: 'when necessary/required', tag : 'p.r.n.'  },
            {   description: 'as much as required', tag : 'q.s.'  },
        ];
        
        return {
            drugCollection: drugList,
            dosageCollection: dosageList,
            routeCollection: routeAdministration,
            frequencyCollection: frequency
        };
    }
})();