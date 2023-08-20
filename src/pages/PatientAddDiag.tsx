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
import { addPatient, addRecord } from '../utils/operation';
import { useSessionStorage } from '../utils/useSessionStorage';

const { toast, ToastContainer } = createStandaloneToast();

export default function PatientAddDiag() {
    const [user, setUser] = useSessionStorage('user', JSON.stringify({}));
    const thisuser = JSON.parse(user);

    const [newDiagnosis, setNewDiagnosis] = useState({
        name: thisuser.name,
        aadhar: thisuser.aadhar,
        privateKey: "",
        diagnosis: "",
        docType: "",
        doctorName: "",
        document: "",
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

        const url = 'http://localhost:4000/api/makeDiagnosis'
        let config = {
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log("Making the call")

        axios.post(url, newDiagnosis, config)
            .then(async (response) => {
                console.log(response.data)
                console.log(JSON.stringify(response.data));
                await addRecord(response.data.symptoms, response.data.diagnosis, response.data.name, response.data.document,
                    response.data.DocName, response.data.DocType, response.data.userAadhar, response.data.RSAencryptedcipherKey).
                    then(
                        (response) => {
                            console.log(response);
                            navigate('/patient_home')
                        }
                    ).catch((error) => {
                        console.log(error);
                    })
            })
            .catch((error) => {
                console.log(error);
                
            });
    }

    const handleDocumentHash = async (e)=>{
        e.preventDefault();
        //call your api and get the document hash from IPFS from the response and add the following line
        const val = "bhrb2iue3uidbi2fbib" //example hash
        setNewDiagnosis(prev=>({...prev, document:val}))
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
                            Add Diagnosis
                        </Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            to let you and your doctor know! ✌️
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
                                <Input type="file" name="document" />
                                    <Button
                                    loadingText="Submitting"
                                    size="md"
                                    bg={'orange.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'red.500',
                                    }}
                                    onClick={(e) => {
                                        handleDocumentHash(e);
                                    }}>
                                    Upload Document
                                </Button>
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
                                    Add Diagnosis
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Make an appointment? <Link color={'blue.400'} href="/patient_appointment">Add Appointment</Link>
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
