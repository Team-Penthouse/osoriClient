import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from 'types/NavigationTypes';
import { Fonts } from 'layout/CustomStyles';
import LoginScreen from 'screens/LoginScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const MainRoute = () => {
  return (
    <Stack.Navigator
      initialRouteName={'LoginScreen'}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: Fonts.NANUM_SQUARE_LIGHT, fontSize: 30 },
        headerMode: 'float',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default MainRoute;
