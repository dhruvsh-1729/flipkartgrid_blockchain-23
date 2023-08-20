import React from 'react'
import { Stack, Text, Button } from '@chakra-ui/react'
import { FcLock } from 'react-icons/fc'

export default function SimpleCookiePreference({item}) {
  return (
    <Stack p="4" boxShadow="lg" m="4" borderRadius="sm">
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold">{title}</Text>
        <FcLock />
      </Stack>

      <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
        <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
          {desc}
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }}>
          <Button variant="outline" colorScheme="green">
            Show More
          </Button>
          <Button colorScheme="red">Delete</Button>
        </Stack>
      </Stack>
    </Stack>
  )
}