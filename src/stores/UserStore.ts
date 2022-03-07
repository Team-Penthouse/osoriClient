import { makeAutoObservable } from 'mobx';
import { User } from '../services/User';
import { UserDto } from '../services/data-contracts';

export default class UserStore {
  api: User;

  constructor() {
    makeAutoObservable(this);
    this.api = new User();
  }

  user?: UserDto;

  isLoggedIn = false;

  something = true;

  setUser = (user: UserDto) => {
    this.user = user;
  };

  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  };
}
