import smartpy as sp

@sp.module
def main():
    
    class Contract(sp.Contract):
        def __init__(self):
            self.data.medical_diagnosis_len = 0
            self.data.diagnosis_list = {}
            self.data.patient_diagnosis = {}
            self.data.diagnosis_visibility = {}
            self.data.doc_visibility = {}
            self.data.patient_info = {}
            self.data.doc_info = {}
            self.data.hospital = {}
            self.data.public_keys = {}
        
        @sp.entrypoint
        def addPatient(self, param):
            assert self.data.patient_info.contains(param.userAadhar)==False, "User Already Exists"
            self.data.patient_info[param.userAadhar] = {
                "name": param.name,
                "sex" : param.sex,
                "age" : param.age
            }
            self.data.public_keys[param.userAadhar] = param.publicKey
            

        @sp.entrypoint
        def addRecord(self, param):
            self.data.diagnosis_list[self.data.medical_diagnosis_len] = {
                "patientName" : param.patientName ,
                "doctorName" : param.doctorName,
                "symptoms": param.symptoms,
                "diagnosis": param.diagnosis,
                "document": param.document,
                "docType": param.docType
            }
            currentNum = self.data.medical_diagnosis_len
            self.data.medical_diagnosis_len = currentNum + 1
            if (self.data.patient_diagnosis.contains(param.userAadhar)):   
                self.data.patient_diagnosis[param.userAadhar].push(currentNum)
            else:
                self.data.patient_diagnosis[param.userAadhar] = [currentNum]
            self.data.diagnosis_visibility[currentNum] = {
                param.userAadhar : 1
            }

        @sp.entrypoint
        def addDoctor(self, param):
            assert (self.data.doc_info.contains(param.userAadhar)==False), "Doctor Already exists"
            self.data.doc_info[param.userAadhar] = {
                "name": param.name, 
                "sex" : param.sex,
                "age" : param.age,
                "speciality" : param.speciality,
                "hospital": param.hospital
            }
            if (self.data.hospital.contains(param.hospital)):
                self.data.hospital[param.hospital].push(param.userAadhar)
            else:
                self.data.hospital[param.hospital] = [param.userAadhar]
            self.data.public_keys[param.userAadhar] = param.publicKey

        @sp.entrypoint
        def makeAppointment(self, param):
            assert self.data.patient_info.contains(param.patientAadhar), "No Patient found with the specifications"
            assert self.data.doc_info.contains(param.doctorAadhar), "No doctor found with the provided specifications"
            self.data.diagnosis_list[self.data.medical_diagnosis_len]  = {
                "patientName" : self.data.patient_info[param.patientAadhar]["name"],
                "doctorName" : self.data.doc_info[param.doctorAadhar]["name"],
                "symptoms": param.symptoms,
                "diagnosis": "",
                "document": "",
                "docType": ""
            }
            currentNum = self.data.medical_diagnosis_len
            self.data.medical_diagnosis_len = currentNum + 1
            if (self.data.patient_diagnosis.contains(param.patientAadhar)):   
                self.data.patient_diagnosis[param.patientAadhar].push(currentNum)
            else:
                self.data.patient_diagnosis[param.patientAadhar] = [currentNum]

            self.data.diagnosis_visibility[currentNum]  = {
                param.patientAadhar: 1,
                param.doctorAadhar: 1
            }
            if (self.data.doc_visibility.contains(param.doctorAadhar)):
                self.data.doc_visibility[param.doctorAadhar][currentNum] = ""
            else:
                self.data.doc_visibility[param.doctorAadhar] = {currentNum : ""} 

        @sp.entrypoint
        def shareDiagnosis(self, param):
            assert self.data.medical_diagnosis_len>param.diagnosisIndex, "No diagnosis found in the store"
            assert self.data.diagnosis_visibility.contains(param.diagnosisIndex), "No diagnosis found in the store"
            assert self.data.diagnosis_visibility[param.diagnosisIndex].contains(param.senderAadhar), "You do not have the permission to view this diagnosis"
            assert self.data.diagnosis_visibility[param.diagnosisIndex][param.senderAadhar]==1, "You do not have the permission to view this diagnosis"
            assert self.data.doc_info.contains(param.doctorAadhar), "No doctor found with the provided specifications"
            self.data.diagnosis_visibility[param.diagnosisIndex] = sp.update_map(param.doctorAadhar, sp.Some(1), self.data.diagnosis_visibility[param.diagnosisIndex])

            if (self.data.doc_visibility.contains(param.doctorAadhar)):
                self.data.doc_visibility[param.doctorAadhar][param.diagnosisIndex] = param.doctorDocumentMessage
            else:
                self.data.doc_visibility[param.doctorAadhar] = {param.diagnosisIndex:  param.doctorDocumentMessage}

        @sp.entrypoint
        def controlVisibility(self, param):
            assert self.data.medical_diagnosis_len>param.diagnosisIndex, "No diagnosis found in the store"
            assert self.data.doc_info.contains(param.removalAadhar), "No Doctor found with the specifications"
            if (self.data.diagnosis_visibility[param.diagnosisIndex].contains(param.removalAadhar)):
                if (self.data.diagnosis_visibility[param.diagnosisIndex][param.removalAadhar]==1):
                    assert self.data.diagnosis_visibility[param.diagnosisIndex].contains(param.senderAadhar), "You do not have permission to control access for the diagnosis"
                    assert self.data.diagnosis_visibility[param.diagnosisIndex][param.senderAadhar]==1, "You do not have permission to control access for the diagnosis"
                    self.data.diagnosis_visibility[param.diagnosisIndex] = sp.update_map(param.removalAadhar, sp.Some(0), self.data.diagnosis_visibility[param.diagnosisIndex])
                    self.data.doc_visibility[param.removalAadhar][param.diagnosisIndex] =  ""
            
        @sp.entrypoint
        def updateDiagnosis(self, param):
            assert self.data.patient_info.contains(param.patientAadhar), "No Patient found with the specifications"
            assert self.data.doc_info.contains(param.doctorAadhar), "No doctor found with the provided specifications"
            assert self.data.medical_diagnosis_len>param.diagnosisIndex, "No diagnosis found in the store"
            assert self.data.diagnosis_visibility.contains(param.diagnosisIndex), "No diagnosis found in the store"
            assert self.data.diagnosis_visibility[param.diagnosisIndex].contains(param.doctorAadhar), "You do not have the permission to view this diagnosis"
            assert self.data.diagnosis_visibility[param.diagnosisIndex][param.doctorAadhar]==1, "You do not have the permission to view this diagnosis"

            
            patientName = self.data.patient_info[param.patientAadhar]["name"]
            doctorName = self.data.doc_info[param.doctorAadhar]["name"]
            symptoms = self.data.diagnosis_list[param.diagnosisIndex]["symptoms"]
            
            self.data.diagnosis_list[param.diagnosisIndex]  = {
                "patientName" : patientName,
                "doctorName" : doctorName,
                "symptoms": symptoms,
                "diagnosis": param.diagnosis,
                "document": param.document,
                "docType": param.docType
            }
            if (self.data.doc_visibility.contains(param.doctorAadhar)):
                self.data.doc_visibility[param.doctorAadhar][param.diagnosisIndex] = param.doctorDocumentMessage
            else:
                self.data.doc_visibility[param.doctorAadhar] = {param.diagnosisIndex:  param.doctorDocumentMessage}

            

@sp.add_test("current_test")
def test():
    scenario = sp.test_scenario(main)
    scenario.h1("hello")

    c1 = main.Contract()
    scenario += c1

    scenario.show(c1.data)

    c1.addPatient(userAadhar=123, name="myName", sex= "M", age= "3", publicKey = "123445o435u")

    # c1.addRecord(userAadhar=123 ,patientName="Digvijay", doctorName="Naman Oujha",symptoms="", diagnosis="This is the diagnosis", document="", docType="")

    c1.addDoctor(userAadhar=435, name="Ramnath", sex="M", age="32", speciality="ENT", hospital="MultiLevel SuperSpeciality", publicKey="234vcxg")

    c1.addDoctor(userAadhar=483, name="Ramnath", sex="M", age="32", speciality="ENT", hospital="MultiLevel SuperSpeciality", publicKey="2314jkdfg")

    c1.makeAppointment(patientAadhar=123, doctorAadhar=435, symptoms="Body ache and itching")

    c1.updateDiagnosis(patientAadhar=123, doctorAadhar=435, diagnosisIndex=0, diagnosis = "Severe home sickness", document = "qwerhdho12fhjvjk12", docType="pdf", doctorDocumentMessage="dshh123")
    
    c1.shareDiagnosis(diagnosisIndex=0, doctorAadhar=483, senderAadhar=435, doctorDocumentMessage = "ewtffd")

    # c1.controlVisibility(diagnosisIndex = 0 , removalAadhar = 483, senderAadhar=123)
    # c1.controlVisibility(diagnosisIndex = 0 , removalAadhar = 435, senderAadhar=435)
    # c1.controlVisibility(diagnosisIndex = 0 , removalAadhar = 435, senderAadhar=483)
    
    scenario.show(c1.data)

    

    # c1.addPatient(userAadhar=123, name="myName", sex= "M", age= "3").send(valid=False)

    # c1.addDoctor(userAadhar=435, name="Ramnath", sex="M", age="32", speciality="ENT", hospital="MultiLevel SuperSpeciality")
    # c1.makeAppointment(patientAadhar=1237, doctorAadhar=435, symptoms="Body ache and itching")



        