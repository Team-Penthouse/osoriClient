import React, { useCallback } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from 'types/NavigationTypes';
import { Fonts } from 'layout/CustomStyles';
import ProfileComponent from 'components/ProfileComponent';
import ProfileViewScreen from 'screens/ProfileViewScreen';
import ArticleViewScreen from 'screens/ArticleViewScreen';
import FeedScreen from 'screens/FeedScreen';
import MainScreen from 'screens/MainScreen';
import { observer } from 'mobx-react';
import { useStore } from '../stores/RootStore';
import ArticleCreateScreen from '../screens/ArticleCreateScreen';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigation = observer(() => {
  const { authStore } = useStore();
  const HeaderLeft = useCallback(
    () => (
      <ProfileComponent
        userInfo={authStore.me}
        width={100}
        containerStyle={{ marginHorizontal: 10 }}
      />
    ),
    [authStore.me],
  );

  return (
    <Stack.Navigator
      initialRouteName={'MainScreen'}
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: Fonts.NANUM_SQUARE_LIGHT, fontSize: 30 },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="MainScreen"
        options={{
          headerTitle: '',
          headerTransparent: true,
          // headerLeft: HeaderLeft,
        }}
        component={MainScreen}
      />
      <Stack.Screen
        name="ProfileViewScreen"
        options={{ headerTitle: '', headerTransparent: true }}
        component={ProfileViewScreen}
      />
      <Stack.Screen
        name="ArticleViewScreen"
        options={{ headerShown: false }}
        component={ArticleViewScreen}
      />
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
      <Stack.Screen
        name={'ArticleCreateScreen'}
        component={ArticleCreateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
});

export default MainNavigation;
