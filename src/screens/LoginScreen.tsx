import React, { useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { getProfile, KakaoProfile, login } from '@react-native-seoul/kakao-login';
import { isUndefined } from 'lodash';
import LottieView from 'lottie-react-native';
import { useMutation } from 'react-query';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import Text from 'components/Text';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from 'layout/CustomStyles';
import { useStore } from 'stores/RootStore';
import { loginByKakao } from '../services/Kakao';

const LoginScreen = observer(() => {
  const { userStore } = useStore();

  const introContainerOpacity = useRef(new Animated.Value(1)).current;
  const welcomeContainerOpacity = useRef(new Animated.Value(0)).current;

  /**
   * @Variables
   */

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
      return await userStore.api.userCreate(body);
    },
    {
      onSuccess: (result: any) => {
        console.log('save result', result.data);
      },
    },
  );

  const getUserByExternalId = async (user: KakaoProfile) => {
    await userStore.api
      .userDetail(Number(user.id), { loginType: 'KAKAO' } as any)
      .then(async (result: any) => {
        if (result?.data === 'USER_NOT_FOUND') {
          await saveUser.mutate(user);
        }
        moveToMainScreenWithAnimation();
      });
  };

  const handleLoginByKakao = async () => {
    await loginByKakao({
      onProvided: async (userInfo) => {
        if (typeof userInfo.nickname !== 'undefined') {
          await getUserByExternalId(userInfo);
        }
      },
      onFailed: () => {
        Alert.alert('잘못된 로그인입니다.');
      },
    });
  };

  const moveToMainScreenWithAnimation = () => {
    // 로그인 버튼을 포함한 컨테이너를 안보이게
    Animated.timing(introContainerOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // 환영 로티를 포함한 컨테이너를 보이게
      Animated.timing(welcomeContainerOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        // opacity 타이밍이 끝난 후 바로 이동되는 것은 부자연스러워,
        // setTimeout 1초 후 로그인 (이동)
        setTimeout(() => {
          userStore.setIsLoggedIn(true);
        }, 1000);
      });
    });
  };

  return (
    <Container source={require('assets/images/login_background.png')}>
      <IntroContainer style={{ opacity: introContainerOpacity }}>
        <Header>
          <HeaderTitleContainer>
            <HeaderTitleText>OSORI</HeaderTitleText>
            <HeaderSubTitleText>
              <HeaderSubTitleHighlightText>오</HeaderSubTitleHighlightText>
              늘의 나를 남기는 <HeaderSubTitleHighlightText>소리</HeaderSubTitleHighlightText>
            </HeaderSubTitleText>
          </HeaderTitleContainer>
        </Header>
        <LoginButtonContainer>
          <KakaoButton onPress={handleLoginByKakao}>
            <KakaoImage
              resizeMode="contain"
              source={require('assets/images/kakao_login/ko/kakao_login_large_narrow.png')}
            />
          </KakaoButton>
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

const Container = styled.ImageBackground`
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
  color: ${(props) => props.theme.colors.primary1};
`;

const HeaderSubTitleText = styled(Text)`
  color: ${(props) => props.theme.colors.secondary1};
`;

const HeaderSubTitleHighlightText = styled(Text)`
  color: ${(props) => props.theme.colors.secondary2};
`;

const WelcomeText = styled(Text)`
  font-size: 26px;
  color: ${(props) => props.theme.colors.primary1};
`;

const LoginButtonContainer = styled.View`
  align-items: center;
`;

const KakaoButton = styled.TouchableOpacity``;

const KakaoImage = styled.Image`
  width: ${DEVICE_WIDTH / 2}px;
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
