import { makeAutoObservable } from 'mobx';
import { User } from '../services/User';

export default class UserStore {
  api: User;

  constructor() {
    makeAutoObservable(this);
    this.api = new User();
  }

  isLoggedIn = false;

  something = true;

  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  };
}
