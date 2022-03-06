import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const loginByGoogle = async () => {
  return await GoogleSignin.signIn();
};
