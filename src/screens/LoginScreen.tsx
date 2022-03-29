import React, { useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { KakaoProfile } from '@react-native-seoul/kakao-login';
import LottieView from 'lottie-react-native';
import { useMutation } from 'react-query';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import Text from 'components/Text';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from 'layout/CustomStyles';
import { useStore } from 'stores/RootStore';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import jwtDecode from 'jwt-decode';
import messaging from '@react-native-firebase/messaging';
import { loginByKakao } from '../services/Kakao';
import { loginByGoogle } from '../services/Google';
import { TokenType } from '../types/CommonTypes';
import { UserDto } from '../services/data-contracts';
import Theme from '../styles/Theme';

const LoginScreen = observer(() => {
  const { userStore, authStore } = useStore();

  const introContainerOpacity = useRef(new Animated.Value(1)).current;
  const welcomeContainerOpacity = useRef(new Animated.Value(0)).current;
  const backgroundColorRef = useRef(new Animated.Value(0)).current;

  const backgroundColor = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: [Theme.colors.dark1, Theme.colors.secondary1],
  });

  /**
   * @Variables
   */

  /**
   * @Queries
   */
  const loginUser = useMutation(
    async ({ user, type }: { user: any; type: 'KAKAO' | 'GOOGLE' }) => {
      let body = {} as UserDto;
      if (type === 'KAKAO') {
        body = {
          nickname: user?.nickname,
          loginType: type,
          externalId: user?.id,
          profileImage: user?.profileImageUrl,
        };
      } else if (type === 'GOOGLE') {
        body = {
          nickname: user?.name,
          loginType: type,
          externalId: user?.id,
          profileImage: user?.photo,
        };
      }
      const pushToken = await messaging().getToken();
      return await userStore.api.loginCreate(body, { pushToken });
    },
    {
      onSuccess: async (result) => {
        // @ts-ignore
        const tokens: TokenType = result.data;
        await authStore.saveTokens(tokens);
        const user = (jwtDecode(tokens.accessToken) as any).user as UserDto;
        authStore.setMe(user);
      },
    },
  );

  const loginByExternalId = async (user: any, type: 'KAKAO' | 'GOOGLE') => {
    if (type === 'KAKAO') {
      const kakaoUser: KakaoProfile = user as KakaoProfile;
      await loginUser.mutate({ user: kakaoUser, type: 'KAKAO' });
      moveToMainScreenWithAnimation();
    } else if (type === 'GOOGLE') {
      const googleUser = user.user;
      await loginUser.mutate({ user: googleUser, type: 'GOOGLE' });
      moveToMainScreenWithAnimation();
    }
  };

  const handleLoginByKakao = async () => {
    await loginByKakao({
      onProvided: async (userInfo) => {
        if (typeof userInfo.nickname !== 'undefined') {
          await loginByExternalId(userInfo, 'KAKAO');
        }
      },
      onFailed: () => {
        Alert.alert('잘못된 로그인입니다.');
      },
    });
  };

  const handleLoginByGoogle = async () => {
    const response = await loginByGoogle();
    if (response.idToken !== null) {
      await loginByExternalId(response, 'GOOGLE');
    }
  };

  const moveToMainScreenWithAnimation = () => {
    // 로그인 버튼을 포함한 컨테이너를 안보이게
    Animated.timing(backgroundColorRef, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
    Animated.timing(introContainerOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // 환영 로티를 포함한 컨테이너를 보이게
      Animated.timing(welcomeContainerOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(backgroundColorRef, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start();
          Animated.timing(welcomeContainerOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 500);
        // opacity 타이밍이 끝난 후 바로 이동되는 것은 부자연스러워,
        // setTimeout 1초 후 로그인 (이동)
        setTimeout(() => {
          authStore.isLoggedIn = true;
        }, 900);
      });
    });
  };

  return (
    <Container style={{ backgroundColor }}>
      <IntroContainer style={{ opacity: introContainerOpacity }}>
        <Header>
          <HeaderTitleContainer>
            <HeaderTitleText>Osori</HeaderTitleText>
            <HeaderSubTitleText>
              <HeaderSubTitleHighlightText>오</HeaderSubTitleHighlightText>
              늘의 나를 남기는 <HeaderSubTitleHighlightText>소리</HeaderSubTitleHighlightText>
            </HeaderSubTitleText>
          </HeaderTitleContainer>
        </Header>
        <LoginButtonContainer>
          <KakaoButton onPress={handleLoginByKakao}>
            <KakaoImage
              resizeMode="cover"
              source={require('assets/images/kakao_login/ko/kakao_login_large_narrow.png')}
            />
          </KakaoButton>
          <GoogleButton onPress={handleLoginByGoogle} />
        </LoginButtonContainer>
      </IntroContainer>
      <WelcomeContainer style={{ opacity: welcomeContainerOpacity }}>
        <WelcomeText>환영합니다</WelcomeText>
        <WelcomeImage
          resizeMode="cover"
          source={require('assets/lottie/welcome.json')}
          speed={0.5}
          autoPlay
          loop
        />
      </WelcomeContainer>
    </Container>
  );
});

const Container = styled(Animated.View)`
  flex: 1;
  align-items: center;
`;

const IntroContainer = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  z-index: 1;
`;

const Header = styled.View`
  align-items: center;
  justify-content: center;
`;

const HeaderTitleContainer = styled.View`
  margin: 20px;
  align-items: center;
`;

const HeaderTitleText = styled(Text)`
  font-size: 60px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary3};
`;

const HeaderSubTitleText = styled(Text)`
  color: ${(props) => props.theme.colors.primaryDark1};
`;

const HeaderSubTitleHighlightText = styled(Text)`
  color: ${(props) => props.theme.colors.secondary1};
`;

const WelcomeText = styled(Text)`
  font-size: 26px;
  color: ${(props) => props.theme.colors.dark1};
`;

const LoginButtonContainer = styled.View`
  align-items: center;
`;

const KakaoButton = styled.TouchableOpacity``;

const KakaoImage = styled.Image`
  border-radius: 3px;
  width: ${DEVICE_WIDTH / 2}px;
  height: 40px;
  margin: 10px 0 10px 0;
`;

const GoogleButton = styled(GoogleSigninButton)`
  width: ${DEVICE_WIDTH / 1.9}px;
`;

const WelcomeContainer = styled(Animated.View)`
  position: absolute;
  top: ${DEVICE_HEIGHT / 3}px;
  align-items: center;
`;

const WelcomeImage = styled(LottieView)`
  width: ${DEVICE_WIDTH * 0.8}px;
`;

export default LoginScreen;
