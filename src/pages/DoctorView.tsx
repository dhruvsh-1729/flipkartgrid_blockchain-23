import React, { useState } from "react";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    RadioGroup,
    Radio,
    createStandaloneToast
} from '@chakra-ui/react'
import UserInfo from "../components/UserInfo";

import axios from 'axios';

export default function DoctorView() {
    const [docForm , setDocForm] = useState({
        name: 'Amae',
        age: "dsg", 
        aadhar: "asdgasd",
        sex: "sdafds", 
        privateKey: ""
    })
    const [onePatient, setOnePatient] = useState(false)
    const [onePatientDiagnosis, setOnePatientDiagnosis] = useState([])

    const [UserDiagnosis, setUserDiagnosis] = useState([])

    async function getDiagnosis(){
        
        const response = await axios.post("http://localhost:4000/api/getDoctorViewList", {
            aadhar: docForm.aadhar,
            privateKey: docForm.privateKey.replace(/\\n/g, '\n')
            });
      
            console.log(response.data)
            const {message, data} = response.data;

            let temp = [];
            for (let field in data) {
            temp.push({...data[field], "Aadhar": field});
            }
            setUserDiagnosis(temp);
            setOnePatient(false)
        }
        


        function change(event){
            const {name, value} = event.target;
            setDocForm(prev => (
                {
                    ...prev,
                    [name] : value
                }
            ))
        }

        async function oneDiagnosis(item){
            const response = await axios.post("http://localhost:4000/api/doctorViewDiagnosis", {
              aadhar: item.Aadhar,
              privateKey: docForm.privateKey.replace(/\\n/g, '\n'),
              encryptedAESKEY : item.aesEncryption
              });
        
              console.log(response.data)
              const { message, diagnosis_list } = response.data;

          const formattedDiagnosisList = diagnosis_list.map((diagnosis) => {
            const {
              data: { docType, document, symptoms, diagnosis: diag, doctorName, patientName },
              loc,
            } = diagnosis;
            const isDiagnosisClickable = (diag === undefined || diag === null || diag==="") ;
      
          return (
            <Box
              key={loc} // Use loc as the key
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              boxShadow="md"
              cursor={isDiagnosisClickable ? "pointer" : "default"} // Set cursor style based on condition
              onClick={isDiagnosisClickable ? () => handleDiagnosisClick(loc) : undefined} // Set onClick handler based on condition
            >
                <Text>
                  Patient Name: {patientName}, Doctor: {doctorName}, Symptoms:{" "}
                  {symptoms}, Diagnosis: {diag}
                </Text>
                <Text>Document: {document}, DocType: {docType}</Text>
              </Box>
            );
          });

    setOnePatientDiagnosis(formattedDiagnosisList);
    setOnePatient(true)
  }


  function handleDiagnosisClick(loc) {
    console.log("Clicked on diagnosis with loc:", loc);
    // Add your logic here to perform actions when a diagnosis element is clicked
  }
    
    return (
        <div className="h-100">
            <UserInfo form={docForm}/>
            <Input type="text" placeholder="Aadhar" name="aadhar" value={docForm.aadhar} onChange={change}/>
            <Input type="text" placeholder="Secret Key" name="privateKey" value={docForm.privateKey} onChange={change} />
            <Button onClick={getDiagnosis}> Get Patients</Button>
            {onePatient ? (
        // Rendering onePatientDiagnosis
        <div>
          {onePatientDiagnosis}
        </div>
      ) : (
        // Rendering UserDiagnosis
        UserDiagnosis && UserDiagnosis.length ? (
          <Stack mt={4} spacing={4}>
            {UserDiagnosis.map((item, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                boxShadow="md"
                onClick={() => oneDiagnosis(item)}
              >
                <Text>
                  Patient Name: {item.name}, Sex: {item.sex}, DOB: {item.dob}
                </Text>
                <Text>AES Encryption: {item.aesEncryption}</Text>
                <Text>AES Decrypted: {item.aesDecrypted}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          ""
        )
      )}
            
        </div>
    )


}

