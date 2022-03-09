import { makeAutoObservable } from 'mobx';
import { UserDto } from '../services/data-contracts';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }

  me?: UserDto = {} as UserDto;
  isLoggedIn = false;

  setMe = (user: UserDto) => {
    this.me = user;
  };

  saveTokens = async (tokens: { accessToken: string; refreshToken: string }) => {
    await AsyncStorage.setItem('user-token', JSON.stringify(tokens));
  };
}
