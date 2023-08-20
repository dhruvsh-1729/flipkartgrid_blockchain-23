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

        function oneDiagnosis(item){
            console.log(item)
            console.log("aadhar = " ,item.Aadhar)
            console.log("aesEncryption = " ,item.aesEncryption)

            console.log("privateKey = " ,docForm.privateKey)

        }
    
    return (
        <div className="h-100">
            <UserInfo form={docForm}/>
            <Input type="text" placeholder="Aadhar" name="aadhar" value={docForm.aadhar} onChange={change}/>
            <Input type="text" placeholder="Secret Key" name="privateKey" value={docForm.privateKey} onChange={change} />
            <Button onClick={getDiagnosis}> Get Patients</Button>
            {UserDiagnosis && UserDiagnosis.length ? (
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
      )}
            
        </div>
    )


}

