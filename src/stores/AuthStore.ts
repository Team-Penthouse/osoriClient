import { makeAutoObservable } from 'mobx';
import { UserDto } from '../services/data-contracts';

export default class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }

  me?: UserDto = {} as UserDto;

  setMe = (user: UserDto) => {
    this.me = user;
  };
}
