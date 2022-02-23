import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainRoute from './MainRoute';
import CustomModal from './CustomModal';

const Entry = () => (
  <NavigationContainer>
    <MainRoute />
    <CustomModal />
  </NavigationContainer>
);
export default Entry;
