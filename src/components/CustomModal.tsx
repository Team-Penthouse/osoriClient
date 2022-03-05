import React from 'react';
import Modal from 'react-native-modal';
import { observer } from 'mobx-react';
import { useStore } from '../stores/RootStore';

const CustomModal = observer(() => {
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
});
export default CustomModal;
