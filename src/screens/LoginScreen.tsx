import React, { useLayoutEffect } from 'react';
import { Alert, Image, ImageBackground, TouchableOpacity, View } from 'react-native';
import { getProfile, KakaoProfile, login } from '@react-native-seoul/kakao-login';
import { isUndefined } from 'lodash';
import LottieView from 'lottie-react-native';
import { useMutation } from 'react-query';
import { observer } from 'mobx-react';
import Text from '../components/Text';
import ExternalColor from '../layout/ExternalColor';
import { DEVICE_SIZE, DEVICE_WIDTH } from '../layout/CustomStyles';
import { User } from '../services/User';
import { useStore } from '../stores/RootStore';

const LoginScreen = observer(() => {
  const { userStore } = useStore();
  // const navigation = useNavigation<StackNavigationProp<any>>();
  /**
   * @deprecated
   */

  /**
   * @States
   */

  /**
   * @Variables
   */
  const api = new User();

  /**
   * @Queries
   */
  const saveUser = useMutation(
    async (user: KakaoProfile) => {
      const body = {
        nickname: user?.nickname,
        loginType: 'KAKAO',
        externalId: user?.id,
        profileImg: user?.profileImageUrl,
      };
      return await api.userCreate(body);
    },
    {
      onSuccess: (result: any) => {
        console.log('save result', result.data);
      },
    },
  );

  const getUserByExternalId = async (user: KakaoProfile): Promise<any> => {
    await api
      .userDetail(Number(user.id), { loginType: 'KAKAO' } as any)
      .then(async (result: any) => {
        if (result?.data === 'USER_NOT_FOUND') {
          await saveUser.mutate(user);
        }
        userStore.setIsLoggedIn(true);
        console.log('login', userStore.isLoggedIn);
      });
  };

  const handleLoginByKakao = async () => {
    await login()
      .then(async (res) => {
        if (!isUndefined(res.accessToken)) {
          // @ts-ignore
          const userInfo: KakaoProfile = await getProfile();
          if (typeof userInfo.nickname !== 'undefined') {
            await getUserByExternalId(userInfo);
          }
        } else {
          Alert.alert('잘못된 로그인입니다.');
        }
      })
      .catch((e) => {
        console.log(e);
        Alert.alert('잘못된 로그인입니다.');
      });
  };

  useLayoutEffect(() => {
    // const subscribe = navigation.addListener('focus', () => {});
    // const unsubscribe = navigation.addListener('blur', () => {});
    // return () => {
    //   subscribe();
    //   unsubscribe();
    // };
  }, []);

  return (
    <ImageBackground
      source={require('assets/images/login_background.png')}
      style={{ flex: 1, alignItems: 'center' }}
    >
      <View
        style={{
          height: '40%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <View style={{ backgroundColor: 'transparent', margin: 20 }}>
          <Text style={{ fontSize: 60, color: ExternalColor.p1 }}>OSORI</Text>
          <Text style={{ alignSelf: 'center', color: ExternalColor.i1 }}>
            <Text style={{ color: ExternalColor.s2 }}>오</Text>
            늘의 나를 남기는 <Text style={{ color: ExternalColor.s2 }}>소리</Text>
          </Text>
        </View>
        <Text category="h6" style={{ color: 'white' }}>
          환영합니다
        </Text>
      </View>
      <LottieView
        style={{ width: DEVICE_WIDTH * 0.8 }}
        resizeMode="cover"
        source={require('assets/lottie/welcome.json')}
        speed={0.5}
        autoPlay
        loop
      />
      <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
        <TouchableOpacity onPress={handleLoginByKakao}>
          <Image
            resizeMode="contain"
            style={{ width: DEVICE_SIZE.width / 2 }}
            source={require('assets/images/kakao_login/ko/kakao_login_large_narrow.png')}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
});

export default LoginScreen;
