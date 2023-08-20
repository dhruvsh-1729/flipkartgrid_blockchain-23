import axios from 'axios';
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
    createStandaloneToast,
    Highlight,
    useDisclosure
} from '@chakra-ui/react'

import { Fade, ScaleFade, Slide, SlideFade, Collapse } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { showToast } from '../utils/showToasts';
import { addPatient, addRecord, makeAppointment } from '../utils/operation';
import { useSessionStorage } from '../utils/useSessionStorage';

const { toast, ToastContainer } = createStandaloneToast();

export default function PatientAppointment() {
    const [user, setUser] = useSessionStorage('user', JSON.stringify({}));
    const thisuser = JSON.parse(user);

    const [newDiagnosis, setNewDiagnosis] = useState({
        name: thisuser.name,
        aadhar: thisuser.aadhar,
        doctorAadhar:"",
        symptoms: "",
    })

    useEffect(()=>{
        console.log(newDiagnosis);  
    },[newDiagnosis])

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const allFieldsFilled = () => {
        const values = Object.values(newDiagnosis);
        return values.every(value => value.trim().length > 0);
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setNewDiagnosis(prevValue => (
            {
                ...prevValue,
                [name]: value
            })
        )
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        await makeAppointment(thisuser.aadhar, newDiagnosis.symptoms,  newDiagnosis.doctorAadhar )
        console.log("added appointment" ,newDiagnosis)
    }
    return (
        <>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} my={20}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Make an Appointment
                        </Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            with any doctor! ✌️
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="privatekey" isRequired>
                                <FormLabel>Enter your private key</FormLabel>
                                <Input type="text" name="privateKey"
                                    value={newDiagnosis.privateKey} onChange={handleChange} />
                            </FormControl>

                            <FormControl id="diagnosis" isRequired>
                                <FormLabel>Diagnosis Subject</FormLabel>
                                <Input type="text" name="diagnosis"
                                    value={newDiagnosis.diagnosis} onChange={handleChange} />
                            </FormControl>

                            <FormControl id="docType" isRequired>
                                <FormLabel>Document Type</FormLabel>
                                <Input type="text" name="docType"
                                    value={newDiagnosis.docType} onChange={handleChange} />
                            </FormControl>

                            <FormControl id="doctorName" isRequired>
                                <FormLabel>Doctor Name</FormLabel>
                                <Input type="text" name="doctorName"
                                    value={newDiagnosis.doctorName} onChange={handleChange} />
                            </FormControl>

                            <FormControl id="document" isRequired>
                                <FormLabel>Medical Document</FormLabel>
                                <Input type="text" name="document"
                                    value={newDiagnosis.document} onChange={handleChange} />
                            </FormControl>

                            <FormControl id="symptoms" isRequired>
                                <FormLabel>Symptoms</FormLabel>
                                <Input type="text" name="symptoms"
                                    value={newDiagnosis.symptoms} onChange={handleChange} />
                            </FormControl>

                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}
                                    onClick={(e) => {
                                        handleSubmit(e);
                                    }}>
                                    Make appointment
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Wanna add your Diagnosis? <Link color={'blue.400'} href="/patient_adddiag">Add Diagnosis</Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>

            <ToastContainer />
        </>
    )
}
