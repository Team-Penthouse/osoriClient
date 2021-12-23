import React from 'react';

export const UI_MODAL_SHOW = 'ui/MODAL_SHOW';
export const UI_MODAL_CLOSE = 'ui/MODAL_CLOSE';
export const UI_TAB_BAR_SET_VISIBLE = 'ui/TAB_BAR_SET_VISIBLE';

export interface ModalInterface {
    title: string;
    component: React.ReactElement;
}

const initialStates = {
    tabBarVisible: true,
    modalVisible: false,
    modalOptions: {} as ModalInterface,
};

export const showModal = (options: ModalInterface) => ({ type: UI_MODAL_SHOW, payload: options });
export const closeModal = () => ({ type: UI_MODAL_CLOSE, payload: null });
export const showTabBar = (visible: boolean) => ({ type: UI_TAB_BAR_SET_VISIBLE, payload: visible });

export const uiReducer = (state = initialStates, action: { payload: any; type: string }) => {
    switch (action.type) {
        case UI_MODAL_SHOW:
            return {
                ...state,
                modalVisible: true,
                modalOptions: action.payload,
            };
        case UI_MODAL_CLOSE:
            return {
                ...state,
                modalVisible: false,
            };
        case UI_TAB_BAR_SET_VISIBLE:
            return {
                ...state,
                tabBarVisible: action.payload,
            };
        default:
            return state;
    }
};
