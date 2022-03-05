import React from 'react';
import Modal from 'react-native-modal';
import { useStore } from '../stores/RootStore';

const CustomModal = () => {
  const { isModalVisible, modalOptions } = useStore().uiStore;

  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0}
      style={{ padding: 0, margin: 0 }}
      isVisible={isModalVisible}
    >
      <>{modalOptions?.component}</>
    </Modal>
  );
};
export default CustomModal;
