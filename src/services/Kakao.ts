import { getProfile, KakaoProfile, login } from '@react-native-seoul/kakao-login';
import { isUndefined } from 'lodash';

export const loginByKakao = async (options: {
  onProvided: (userInfo: KakaoProfile) => void;
  onFailed: () => void;
}) => {
  await login()
    .then(async (res) => {
      if (!isUndefined(res.accessToken)) {
        // @ts-ignore
        const userInfo: KakaoProfile = await getProfile();
        options.onProvided(userInfo);
      } else {
        options.onFailed();
      }
    })
    .catch((e) => {
      options.onFailed();
    });
};
