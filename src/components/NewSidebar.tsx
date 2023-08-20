import React from 'react';
import { Box, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import {Link} from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { icon: FaHome, label: 'Home',link:'/patient_home' },
    { icon: FaUser, label: 'Profile', link:'/patient_profile'},
    { icon: FaUser, label: 'Show Diagnosis',link:'/patient_home' },
    { icon: FaUser, label: 'Add Diagnosis',link:'/patient_adddiag' },
    { icon: FaUser, label: 'Make Appointment',link:'/patient_appointment' },
    { icon: FaCog, label: 'Settings',link:'/patient_settings' },
    { icon: FaSignOutAlt, label: 'Logout',link:'/login' },
  ];

  return (
    <Box
      as="nav"
      pos="fixed"
      top={0}
      left={0}
      w="240px"
      h="100vh"
      bg="gray.800"
      color="white"
      p={4}
      boxShadow="lg"
    >
      <Flex align="center" justify="center" h="20">
        <Text fontSize="xl" fontWeight="bold">
          My Dashboard
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch" mt={5}>
        {menuItems.map((item, index) => (
          <Link to={item.link} style={{textDecoration:'none', color:'white'}}>
          <Flex
            key={index}
            align="center"
            p={6}
            borderRadius="md"
            _hover={{ bg: 'gray.600' }}
            style={{cursor:'pointer'}}
          >
            <Icon as={item.icon} mr={4} />
            <Text style={{fontSize:'1.2rem'}}>{item.label}</Text>
          </Flex>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
