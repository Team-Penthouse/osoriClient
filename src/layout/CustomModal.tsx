import React from 'react';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { ModalInterface } from 'stores/uiStore';
import { RootState } from 'stores/rootStore';

const CustomModal = () => {
  const dispatcher = useDispatch();
  const isVisibleModal = useSelector((state: RootState) => state.ui.modalVisible);
  const modalOptions: ModalInterface = useSelector((state: RootState) => state.ui.modalOptions);

  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0}
      style={{ padding: 0, margin: 0 }}
      isVisible={isVisibleModal}
    >
      <>{modalOptions.component}</>
    </Modal>
  );
};
export default CustomModal;
