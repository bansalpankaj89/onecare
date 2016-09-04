(function(){
    angular.module('mediDocApp.model')
        .factory('Patient', [patientFactory]);
    
    function patientFactory() {
        var that;
        //Constructor 
        function Patient(patientInfo, admissionInfo ) {
            that = this;    
            that.id = patientInfo.$id;
            that.firstName = patientInfo.first_name;
            that.lastName = patientInfo.last_name;
            that.admissionDate = moment(admissionInfo.admission_date).format('MMMM Do YYYY, h:mm:ss a');
            that.name = patientInfo.name;
            that.gender = patientInfo.gender;
            that.patientStatus = admissionInfo.patientStatus? admissionInfo.patientStatus:[] ;
            that.diagnosis = admissionInfo.diagnosis? admissionInfo.diagnosis: [];
            that.status = admissionInfo.status? admissionInfo.status:{} ;
            that.procedures = admissionInfo.procedures? admissionInfo.procedures:[] ;            
            that.prescriptions = admissionInfo.prescriptions? admissionInfo.prescriptions:[] ;
            that.observations = admissionInfo.observations? admissionInfo.observations: [];
            that.medicalExaminations = admissionInfo.medicalExaminations? admissionInfo.medicalExaminations: [];
            that.admissionId = admissionInfo.$id;
            that.admissionTransactions = [];
            that.newVisit = {};
        }
        
        //private methods
        function updatePatientStatus() {
            if(!that.newVisit.patientStatus){
                //console.log('patient status is not selected for patient ');
                return;
            }
            if(that.patientStatus) {
                that.patientStatus = [];
            }
            
            //always newly added item willbe first in th patient status list
            if(!angular.isArray(that.newVisit.patientStatus[0].item))
                that.patientStatus.push(that.newVisit.patientStatus[0].item);
            else
                that.patientStatus.push(that.newVisit.patientStatus[0].item[0]);

        }
        
        function updatePatientDiagnosis() {
            if(!that.newVisit.diagnosis){
               // console.log('diagnosis is not selected for patient');
                return;
            }
            
            if(!that.diagnosis)
                that .diagnosis = [];
                
            //console.log('before diagnosis added ', that.diagnosis);
            //add newly added diagnosis to current diagnosis collection
            for(var i = 0; i< that.newVisit.diagnosis.length; i++) {
                if(that.newVisit.diagnosis[i].isAdd) {
                    that.diagnosis.push(that.newVisit.diagnosis[i].item);
                }
            }
            //console.log('after diagnosis added ', that.diagnosis);
            //remove from current diagnosis collection which are removed
            var removableDiagnosis = []
            removableDiagnosis = that.newVisit.diagnosis.filter(function(item) {
                return !item.isAdd;
            })
            //console.log('these diagnosis are going to be removed ', removableDiagnosis);
            for(var i = 0; i < removableDiagnosis.length; i++) {
                var removeIndex
                that.diagnosis.filter(function(remItem, index) {
                    if(remItem.description == removableDiagnosis[i].item.description){
                        removeableIndex = index;
                        return true;
                    }
                    return false;
                });
                that.diagnosis.splice(removeIndex, 1);
            }
            //console.log('after diagnosis are removed', that.diagnosis);

        } 
        
        function updatePatientMedicalExamination() {
            if(!that.newVisit.medicalExaminations) {
                return;
            }
            
            if(!that.medicalExaminations)
                that.medicalExaminations = [];
            
            //add newly added medicalExaminations to current medicalExaminations collection
            for(var i = 0; i < that.newVisit.medicalExaminations.length; i++) {
                if(that.newVisit.medicalExaminations[i].isAdd) {
                    that.medicalExaminations.push(that.newVisit.medicalExaminations[i].item);
                }                
            }
            //remove from current medicalExaminations collection which are removed
            var removableMedicalExaminations = []
            removableMedicalExaminations = that.newVisit.medicalExaminations.filter(function(item) {
                return !item.isAdd;
            });
            
            for(var i = 0; i < removableMedicalExaminations.length; i++) {
                var removeIndex
                that.medicalExaminations.filter(function(remItem, index) {
                    if(remItem.description == removableMedicalExaminations[i].item.description){
                        removeableIndex = index;
                        return true;
                    }
                    return false;
                });
                that.medicalExaminations.splice(removeIndex, 1);
            }
        }
        
        function updatePatientProcedure() {
            if(!that.newVisit.procedures){
                //console.log('procedures is not selected for patient');
                return;
            }
            
            if(!that.procedures)
                that .procedures = [];
                
            //console.log('before procedures added ', that.procedures);
            //add newly added procedures to current procedures collection
            for(var i = 0; i< that.newVisit.procedures.length; i++) {
                if(that.newVisit.procedures[i].isAdd) {
                    that.procedures.push(that.newVisit.procedures[i].item);
                }
            }
            //console.log('after procedures added ', that.procedures);
            //remove from current procedures collection which are removed
            var removableProcedures = []
            removableProcedures = that.newVisit.procedures.filter(function(item) {
                return !item.isAdd;
            })
            //console.log('these procedures are going to be removed ', removableProcedures);
            for(var i = 0; i < removableProcedures.length; i++) {
                var removeIndex
                that.procedures.filter(function(remItem, index) {
                    if(remItem.description == removableProcedures[i].item.description){
                        removeableIndex = index;
                        return true;
                    }
                    return false;
                });
                that.procedures.splice(removeIndex, 1);
            }
           // console.log('after procedures are removed', that.procedures);

        }
        
        //Here we should insert record to the 
        function updatePatientPrescriptions() {
             if(!that.newVisit.prescriptions){
                return;
            }
            
            if(!that.prescriptions)
                that.prescriptions = [];
                
            //add newly added prescriptions to current prescriptions collection
            for(var i = 0; i< that.newVisit.prescriptions.length; i++) {
                if(that.newVisit.prescriptions[i].isAdd) {
                    that.prescriptions.push(that.newVisit.prescriptions[i].item);
                }
            }
            
            //at present there prescriptions can not be removed saved
//            //remove from current prescriptions collection which are removed
//            var removablePrescriptions = []
//            removablePrescriptions = that.newVisit.prescriptions.filter(function(item) {
//                return !item.isAdd;
//            })
//            //console.log('these procedures are going to be removed ', removableProcedures);
//            for(var i = 0; i < removablePrescriptions.length; i++) {
//                var removeIndex
//                that.prescriptions.filter(function(remItem, index) {
//                    if(remItem.description == removablePrescriptions[i].item.description){
//                        removeableIndex = index;
//                        return true;
//                    }
//                    return false;
//                });
//                that.prescriptions.splice(removeIndex, 1);
//            }
        }
        
        function updatePatientObservations() {
            if(!that.newVisit.observations){
                return;
            }
            
            if(!that.observations)
                return;
            
            for(var i = 0; i < that.newVisit.observations.length; i++) {
                if(that.newVisit.observations[i].isAdd){
                    that.observations.push(that.newVisit.observations[i].item);
                }
            }
        }
        
        //public Methods
        //There can only one status for patient hence, when a isAdd: true event occurs should 
        //check with existing status and if its the same then should remove exisitng new visits and make it empty
        // if its not the same add the new item 
        //if the idAdd: false event occurs should
        //check with existing status and if its the same then should add false event item
        //if its not the same then should remove exisiting new visits and make it empty
        Patient.prototype.setPatientStatus = function (changedStatus, status) {
            if(status){
                if(that.patientStatus.filter(function(item) {
                    return item.description == changedStatus.description;
                }).length >0){
                    that.newVisit.patientStatus = [];
                    return;
                }
                if(!that.newVisit.patientStatus){
                    that.newVisit.patientStatus= [];                    
                }
                if(!angular.isArray(changedStatus))
                    that.newVisit.patientStatus.push({
                            item: changedStatus, 
                            isAdd: status
                        });
                else
                    that.newVisit.patientStatus.push({
                        item: changedStatus[0],
                        isAdd: status
                    })
                return;
            } else {
                if(that.patientStatus.filter(function(item) {
                    return item.description == changedStatus.description;
                }).length >0){
                    if(!that.newVisit.patientStatus){
                        that.newVisit.patientStatus= [];                    
                    }
                    that.newVisit.patientStatus.push({
                            item: changedStatus, 
                            isAdd: status
                        });                    
                    return;
                }  
                that.newVisit.patientStatus = [];
                return;
            }
        }
        
        Patient.prototype.setDiagnosis = function (changedDiagnosis, status) {
            if(!that.newVisit.diagnosis)
                    that.newVisit.diagnosis = [];  
            
            if(!status) {
                //check if removed item is one of new visit diagnosis them just remove it from array 
                //else need to add to the list with isAdd false
                var removeIndex
                if(that.newVisit.diagnosis.filter(function(item, index) {
                        if(changedDiagnosis == item.item){
                            removedIndex = index;  
                            return true;
                        }
                    return false;
                    }).length > 0 )
                {
                    that.newVisit.diagnosis.splice(removedIndex, 1);
                    return;
                } else if (that.diagnosis.filter(function(item, index) {
                        if(changedDiagnosis == item.item) {
                            romovedIndex = index;
                            return true;
                        }
                        return false;
                    }).length > 0 )
                {
                    status = false;
                }
            }

            that.newVisit.diagnosis.push({
                item: changedDiagnosis, 
                isAdd: status});
        }
        
        Patient.prototype.setMedicalExamination = function(changedMediExamination, status) {
            if(!that.newVisit.medicalExaminations)
                that.newVisit.medicalExaminations = [];
                        
            if(status) {
                if(that.medicalExaminations.filter(function(item) {
                    return item.description == changedMediExamination.medicalExamination.description
                        && item.statusIndex < 2 }).length > 0)
                    {
                        console.log('Same medical examination already prescribed and not started hence will not be able to add')
                        return;
                    }
                    changedMediExamination.status = 'prescribed';
                    changedMediExamination.statusIndex = 0;
                    that.newVisit.medicalExaminations.push({
                       item : changedMediExamination,
                       isAdd: status
                    });
            }
        }
        
        Patient.prototype.setProcedure = function(changedProcedure, status) {
            if(!that.newVisit.procedures)
                    that.newVisit.procedures = [];  
            if(!status) {
            //check if removed item is one of new visit diagnosis them just remove it from array 
                //else need to add to the list with isAdd false
                var removeIndex
                if(that.newVisit.procedures.filter(function(item, index) {
                        if(changedProcedure == item.item){
                            removedIndex = index;  
                            return true;
                        }
                    return false;
                    }).length > 0 )
                {
                    that.newVisit.procedures.splice(removedIndex, 1);
                    return;
                } else if (that.procedures.filter(function(item, index) {
                        if(changedProcedure == item.item) {
                            romovedIndex = index;
                            return true;
                        }
                        return false;
                    }).length > 0 )
                {
                    status = false;
                }; 
            }
            
            that.newVisit.procedures.push({
                item: changedProcedure, 
                isAdd: status});
        }
        
        Patient.prototype.setPatientPrescription = function(changedMedication, status) {
            if(!that.newVisit.prescriptions)
                that.newVisit.prescriptions = [];
            //check if already a test is prescribed to the patient and 
            //if that test is not in prescribed status then add the item to the 
            //medical test list.
            if(that.prescriptions.filter(function(item) {
                return item.medication.selectedDrugs[0].description == changedMedication.medication.selectedDrugs[0].description && 
                    item.medication.status != 'complted';
            }).length > 0 ){
                console.log('test already in prescribed state should not be added to the list', changedMedication);
                return;
            }
            changedMedication.status = 'prescribed';
            that.newVisit.prescriptions.push({
                item: changedMedication,
                isAdd: status
            });
        }
        
        Patient.prototype.setObservation = function(changedObservation, status) {
            if(!that.newVisit.observations)
                that.newVisit.observations = [];
            
            if(status){
                changedObservation.status=  'observed';
                changedObservation.admission_id = that.admissionId;
                changedObservation.patient_id = that.id;
                that.newVisit.observations.push({
                    item: changedObservation,
                    isAdd: status
                })
            }
        }
        
        Patient.prototype.updateNewVisitInfo = function(source) {
            that = source;
            updatePatientStatus();
            updatePatientDiagnosis();
            updatePatientProcedure();
            updatePatientPrescriptions();
            updatePatientObservations();
            updatePatientMedicalExamination();
            return {
                patientId: that.id,
                doctorId: 'doctor Id',
                trans_date: new Date().toString(),
                info: that.newVisit,
                patientStatus: that.patientStatus,
                diagnosis : that.diagnosis,
                procedures: that.procedures,
                prescriptions: that.prescriptions,
                admission_id: that.admissionId,
                observations: that.observations,
                medicalExaminations: that.medicalExaminations
            }
        }
        
        Patient.prototype.getNewVisitSummary = function () {
            var summary = "";
            return "New visit summary should be implemented inorder to get updated";
        };
        
        Patient.prototype.toString = function() {
            return "id : " + that.id + " firstName : " + that.firstName + " lastName : " + that.lastName ;
        }
        return Patient;
//        
//        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//            return v.toString(16);
//        });
    }
})();