import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import { ModalInterface } from '../types/UITypes';

export default class UIStore {
  constructor() {
    makeAutoObservable(this);
  }

  isModalVisible = false;

  modalOptions: ModalInterface = {} as ModalInterface;
}
