import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import CustomModal from 'components/CustomModal';
import jwtDecode from 'jwt-decode';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import AuthNavigation from 'navigation/AuthNavigation';
import React, { useEffect } from 'react';
import { UserDto } from 'services/data-contracts';
import { useStore } from 'stores/RootStore';
import { TokenType } from 'types/CommonTypes';
import MainNavigation from 'navigation/MainNavigation';

const NavController = observer(() => {
  const { authStore } = useStore();

  const checkInvalidToken = async () => {
    await AsyncStorage.getItem('user-token').then(async (tokenString) => {
      if (tokenString !== null) {
        const tokens: TokenType = JSON.parse(tokenString);
        const user = (jwtDecode(tokens.accessToken) as any).user as UserDto;
        authStore.setMe(user);
        runInAction(() => {
          authStore.isLoggedIn = true;
        });
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
