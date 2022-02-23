import { KakaoProfile } from '@react-native-seoul/kakao-login';

const SET_CURRENT_USER = 'user/SET_CURRENT_USER';

export const setCurrentUser = (user: KakaoProfile) => ({ type: SET_CURRENT_USER, payload: user });

interface UserReducer {
    currentUser: KakaoProfile | undefined;
    users: KakaoProfile[];
}

const initialState: UserReducer = {
  currentUser: undefined,
  users: [],
};

const userReducer = (state = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
