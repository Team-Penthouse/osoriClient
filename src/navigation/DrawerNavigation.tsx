import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { observer } from 'mobx-react';
import MainNavigation from './MainNavigation';
import Theme from '../styles/Theme';
import DrawerContent from './DrawerContent';
import ProfileViewScreen from '../screens/ProfileViewScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigation = observer(() => {
  return (
    <Drawer.Navigator
      initialRouteName={'Osori'}
      drawerContent={() => <DrawerContent />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name={'Osori'} options={{ drawerType: 'back' }} component={MainNavigation} />
      <Drawer.Screen name={'ProfileViewScreen'} component={ProfileViewScreen} />
    </Drawer.Navigator>
  );
});

export default DrawerNavigation;
