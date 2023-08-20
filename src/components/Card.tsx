import React from 'react'
import { Stack, Text, Button } from '@chakra-ui/react'
import {BsGenderFemale, BsGenderMale, BsGenderAmbiguous} from 'react-icons/bs'

interface ICardProps {
    title:string,
    sex:string,
    age:string,
    aesEncryption:string,
    aesDecrypted:string,
    item:any
}

export default function Card({item,title,sex,age,aesEncryption,aesDecrypted,oneDiagnosis}:ICardProps) {

  return (
    <Stack p="4" boxShadow="lg" m="4" borderRadius="sm" maxW={'20vw'} 
    style={{transition:'0.5s all ease', cursor:'pointer'}}
    _hover={{transform:'scale(1.05)'}}>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold" style={{fontSize:"1.5rem",display:"flex", flexDirection:"row"
    ,padding:"0.5rem"}}>{title} &nbsp;
        {sex==='male' ? <BsGenderMale color='blue' fontWeight={600}/> : <BsGenderAmbiguous color='orange' fontWeight={600}/>}
          {sex==='female' ? <BsGenderFemale color='pink' fontWeight={600}/> : ""} {sex}</Text>
      </Stack>

      <Stack direction={{ base: 'column' }} justifyContent="space-between">
        <Text fontSize={{ base: 'lg' }} textAlign={'left'} maxW={'4xl'}>
          Age: <b>{age}</b> years 
        </Text>  
        <Stack direction={{ base: 'column', md: 'row' }}>
          <Button variant="outline" colorScheme="green" onClick={oneDiagnosis} >
            Show More
          </Button>
          <Button colorScheme="red">Delete</Button>
        </Stack>
      </Stack>
    </Stack>
  )
}