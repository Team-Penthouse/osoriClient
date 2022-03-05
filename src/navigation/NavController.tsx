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

const NavController = observer(() => {
  const { userStore } = useStore();

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
          console.log('TOKEN_IS_INVALID');
        }
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
      {userStore.isLoggedIn ? <MainNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
});

export default NavController;
