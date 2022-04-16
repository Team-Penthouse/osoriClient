import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import { ModalInterface } from '../types/UITypes';

export default class UIStore {
  constructor() {
    makeAutoObservable(this);
  }

  tabBarVisible = true;

  isModalVisible = false;

  modalOptions: ModalInterface = {} as ModalInterface;

  setTabBarVisible = (visible: boolean) => {
    this.tabBarVisible = visible;
  };

  showModal = (options: ModalInterface) => {
    this.modalOptions = options;
    this.isModalVisible = true;
  };

  closeModal = () => {
    this.isModalVisible = false;
    setTimeout(() => {
      this.modalOptions = {} as ModalInterface;
    }, 1000);
  };
}
