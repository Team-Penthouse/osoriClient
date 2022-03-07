import React, { useCallback } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from 'types/NavigationTypes';
import { Fonts } from 'layout/CustomStyles';
import ProfileComponent from 'components/ProfileComponent';
import ProfileViewScreen from 'screens/ProfileViewScreen';
import ArticleViewScreen from 'screens/ArticleViewScreen';
import FeedScreen from 'screens/FeedScreen';
import MainScreen from 'screens/MainScreen';
import { KakaoProfile } from '@react-native-seoul/kakao-login';
import { observer } from 'mobx-react';
import { useStore } from '../stores/RootStore';
import { UserDto } from '../services/data-contracts';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigation = observer(() => {
  const { authStore } = useStore();
  const HeaderLeft = useCallback(
    () => (
      <ProfileComponent
        userInfo={authStore.me}
        width={100}
        containerStyle={{
          margin: 0,
          padding: 0,
          zIndex: 1,
        }}
      />
    ),
    [authStore.me],
  );

  return (
    <Stack.Navigator
      // tabBar={() => (tabBarVisible ? <CustomBottomTab /> : null)}
      initialRouteName={'MainScreen'}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: Fonts.NANUM_SQUARE_LIGHT, fontSize: 30 },
        headerMode: 'float',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="MainScreen"
        options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true,
          headerLeft: HeaderLeft,
        }}
        component={MainScreen}
      />
      <Stack.Screen name="ProfileViewScreen" component={ProfileViewScreen} />
      <Stack.Screen
        name="ArticleViewScreen"
        options={{ headerShown: false }}
        component={ArticleViewScreen}
      />
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
    </Stack.Navigator>
  );
});

export default MainNavigation;
