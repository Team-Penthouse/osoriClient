import { makeAutoObservable } from 'mobx';

export default class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  isLoggedIn = false;

  something = true;

  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  };
}
