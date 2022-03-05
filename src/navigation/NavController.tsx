import React, { useEffect } from 'react';
import { KakaoAccessTokenInfo, KakaoOAuthToken } from '@react-native-seoul/kakao-login';
import { NavigationContainer } from '@react-navigation/native';
import { saveUserInfo, setIsLoggedIn } from 'stores/authStore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'stores/rootStore';
import * as Kakao from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';
import MainNavigation from 'navigation/MainNavigation';
import AuthNavigation from 'navigation/AuthNavigation';
import CustomModal from 'layout/CustomModal';

const NavController = () => {
  const dispatcher = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

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

  return (
    <NavigationContainer>
      <CustomModal />
      {isLoggedIn ? <MainNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
};

export default NavController;
