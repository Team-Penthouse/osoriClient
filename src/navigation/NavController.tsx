import React, { useEffect } from 'react';
import { KakaoAccessTokenInfo, KakaoOAuthToken } from '@react-native-seoul/kakao-login';
import { NavigationContainer } from '@react-navigation/native';
import * as Kakao from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';
import MainNavigation from 'navigation/MainNavigation';
import AuthNavigation from 'navigation/AuthNavigation';
import { useStore } from 'stores/RootStore';
import CustomModal from 'components/CustomModal';
import { observer } from 'mobx-react';
import { TokenType } from '../types/CommonTypes';
import jwtDecode from 'jwt-decode';
import { UserDto } from '../services/data-contracts';

const NavController = observer(() => {
  const { userStore, authStore } = useStore();

  const checkInvalidToken = async () => {
    await AsyncStorage.getItem('user-token').then(async (tokenString) => {
      if (tokenString !== null) {
        const tokens: TokenType = JSON.parse(tokenString);
        const user = (jwtDecode(tokens.accessToken) as any).user as UserDto;
        authStore.setMe(user);
        authStore.isLoggedIn = true;
      } else {
        console.log('TOKEN_IS_NOT_PROVIDED');
      }
    });
  };

  useEffect(() => {
    checkInvalidToken();
  }, []);

  return (
    <NavigationContainer>
      <CustomModal />
      {authStore.isLoggedIn ? <MainNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
});

export default NavController;
