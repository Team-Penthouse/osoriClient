import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as Kakao from '@react-native-seoul/kakao-login';
import {
  KakaoAccessTokenInfo,
  KakaoOAuthToken,
  KakaoProfile,
} from '@react-native-seoul/kakao-login';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import ProfileComponent from 'components/ProfileComponent';
import { observer } from 'mobx-react';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import { Fonts } from './CustomStyles';
import ProfileViewScreen from './ProfileViewScreen';
import ArticleViewScreen from '../screens/ArticleViewScreen';
import FeedScreen from './FeedScreen';
import { useStore } from '../stores/RootStore';

const MainRoute = observer(() => {
  const { userStore } = useStore();
  const [initialTab, setInitialTab] = useState<string>('로그인');

  const HeaderLeft = () => (
    <ProfileComponent
      userInfo={{} as KakaoProfile}
      width={100}
      containerStyle={{
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        zIndex: 1,
      }}
    />
  );

  const checkInvalidToken = async () => {
    await AsyncStorage.getItem('userToken').then(async (res) => {
      if (res !== null) {
        const userToken: KakaoOAuthToken = JSON.parse(res);
        console.log('USER_ACCESS_TOKEN', userToken.accessToken);
        const remoteToken: KakaoAccessTokenInfo = await Kakao.getAccessToken();
        if (userToken.accessToken === remoteToken.accessToken) {
          await AsyncStorage.getItem('userInfo').then((userInfo) => {
            if (userInfo !== null) {
            }
          });
        } else {
          AsyncStorage.removeItem('userToken');
          console.warn('TOKEN_IS_INVALID');
        }
      } else {
        console.warn('TOKEN_IS_NOT_PROVIDED');
      }
    });
  };

  useEffect(() => {
    checkInvalidToken();
  }, []);

  useEffect(() => {
    console.log('main route', userStore.isLoggedIn);
  }, [userStore.isLoggedIn]);

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={initialTab}
      // tabBar={() => (tabBarVisible ? <CustomBottomTab /> : null)}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: Fonts.NANUM_SQUARE_LIGHT, fontSize: 30 },
        headerMode: 'float',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {userStore.isLoggedIn ? (
        <>
          <Stack.Screen
            name="MainScreen"
            options={{
              headerTitle: '',
              headerShown: true,
              headerTransparent: true,
              headerStyle: { backgroundColor: 'transparent' },
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
        </>
      ) : (
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
});

export default MainRoute;
