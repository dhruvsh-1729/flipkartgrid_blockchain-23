import React, { useState, useEffect } from 'react'
import { useSessionStorage } from './../utils/useSessionStorage'
import UserDiagnosis from './../components/UserDiagnosis'
import {
  Box, FormControl, FormLabel, Icon, Input, Button, SimpleGrid, Flex, Stack, Heading
  , useColorModeValue
} from '@chakra-ui/react'
import axios from 'axios'
import DiagnosisCard from '../components/DiagnosisCard'

const PatientHome = () => {

  const [history, setHistory] = useState([]);
  const [user, setUser] = useSessionStorage('user', JSON.stringify({}));

  const thisuser = JSON.parse(user);

  const [key, setKey] = useState({
    aadhar: thisuser.aadhar,
    privateKey: ''
  })

  useEffect(() => {
    console.log(key);
  }, [key])


  const handleSubmit = async () => {
    try {
      const config = {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json'
        }
      }
      setKey(prev => (
        {
          ...prev,
          privateKey: key.privateKey.replace(/\\n/g, '\n')
        }
      ))
      const response = await axios.post("http://localhost:4000/api/get_diagnosis", key, config);

      const { message, data, doctorAccess } = response.data;
      console.log("doctorAccess: ", doctorAccess)
      // console.log(data)

      const newDiagnosisElements = data.map((item: any) => (
        <DiagnosisCard
          key={item._id}
          symptoms={item.data.symptoms}
          doctorName={item.data.doctorName}
          diagnosis={item.data.diagnosis}
          document={item.data.document}
          patientName={item.data.patientName}
          docType={item.data.docType}
          upload={false}
        />
      ));
      setHistory(newDiagnosisElements);

    } catch (error) {
      console.log(error);

    }
  }

  return (
    <>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              All Diagnosis
            </Heading>
            <FormControl id="key" isRequired>
              <FormLabel>Enter your private key</FormLabel>
              <Input type="text" onChange={(e) => {
                setKey(prev => ({ ...prev, privateKey: e.target.value }))
              }} />
            </FormControl>
            <Button
              loadingText="Submitting"
              size="lg"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              onClick={(e) => {
                handleSubmit();
              }}>
              Show Diagnosis
            </Button>

            {history}

          </Stack>
        </Stack>
      </Flex>
    </>
  )
}

export default PatientHome