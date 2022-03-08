import React from 'react';
import Modal from 'react-native-modal';
import { observer } from 'mobx-react';
import { useStore } from '../stores/RootStore';

const CustomModal = observer(() => {
  const { uiStore } = useStore();

  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0}
      style={{ padding: 0, margin: 0 }}
      isVisible={uiStore.isModalVisible}
      avoidKeyboard
    >
      {typeof uiStore.modalOptions.component !== 'undefined' && uiStore.modalOptions?.component()}
    </Modal>
  );
});
export default CustomModal;
