import { KakaoOAuthToken, KakaoProfile } from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';

const AUTH_SAVE_TOKEN = 'auth/SAVE_TOKEN';
const AUTH_SAVE_USER_INFO = 'auth/SAVE_USER_INFO';
const SET_IS_LOGGED_IN = 'auth/SET_IS_LOGGED_IN';

export const saveToken = (token: KakaoOAuthToken) => {
    AsyncStorage.setItem('userToken', JSON.stringify(token));
    return { type: AUTH_SAVE_TOKEN, payload: token };
};

export const saveUserInfo = (user: KakaoProfile) => {
    AsyncStorage.setItem('userInfo', JSON.stringify(user));
    return { type: AUTH_SAVE_USER_INFO, payload: user };
};

export const setIsLoggedIn = (isLoggedIn: boolean) => {
    return { type: SET_IS_LOGGED_IN, payload: isLoggedIn };
};

interface AuthReducer {
    token: KakaoOAuthToken | undefined;
    user: KakaoProfile | undefined;
    isLoggedIn: boolean;
}

const initialState: AuthReducer = {
    user: undefined,
    token: undefined,
    isLoggedIn: false,
};

const authReducer = (state = initialState, action: { type: string; payload: any }) => {
    switch (action.type) {
        case AUTH_SAVE_TOKEN:
            return { ...state, token: action.payload };
        case AUTH_SAVE_USER_INFO:
            return { ...state, user: action.payload };
        case SET_IS_LOGGED_IN:
            return { ...state, isLoggedIn: action.payload };
        default:
            return state;
    }
};

export default authReducer;
