import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as Kakao from '@react-native-seoul/kakao-login';
import { KakaoAccessTokenInfo, KakaoOAuthToken } from '@react-native-seoul/kakao-login';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import ArticleRecordScreen from '../screens/ArticleRecordScreen';
import LoginScreen from '../screens/LoginScreen';
import { RootState } from '../stores/rootStore';
import { saveUserInfo, setIsLoggedIn } from '../stores/authStore';
import { Fonts } from './CustomStyles';
import ProfileComponent from '../components/ProfileComponent';
import ProfileViewScreen from './ProfileViewScreen';
import ArticleViewScreen from '../screens/ArticleViewScreen';
import FeedScreen from './FeedScreen';

const MainRoute = () => {
  const navigation = useNavigation();
  const dispatcher = useDispatch();
  const [initialTab, setInitialTab] = useState<string>('로그인');
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userInfo = useSelector((state: RootState) => state.auth.user);

  const tabBarVisible = useSelector((state: RootState) => state.ui.tabBarVisible);

  const HeaderLeft = () => (
    <ProfileComponent
      userInfo={userInfo}
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
          dispatcher(setIsLoggedIn(true));
          await AsyncStorage.getItem('userInfo').then((userInfo) => {
            if (userInfo !== null) {
              dispatcher(saveUserInfo(JSON.parse(userInfo)));
            }
          });
        } else {
          AsyncStorage.removeItem('userToken');
          dispatcher(setIsLoggedIn(false));
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
      {isLoggedIn ? (
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
          <Stack.Screen
            name="ProfileViewScreen"
            component={ProfileViewScreen}
          />
          <Stack.Screen
            name="ArticleViewScreen"
            options={{ headerShown: false }}
            component={ArticleViewScreen}
          />
          <Stack.Screen
            name="FeedScreen"
            component={FeedScreen}
          />
        </>
      ) : (
        <Stack.Screen
          name="LoginScreen"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
      )}
    </Stack.Navigator>
  );
};

export default MainRoute;
