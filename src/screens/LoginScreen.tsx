import React from 'react';
import { Alert } from 'react-native';
import { getProfile, KakaoProfile, login } from '@react-native-seoul/kakao-login';
import { isUndefined } from 'lodash';
import LottieView from 'lottie-react-native';
import { useMutation } from 'react-query';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import Text from 'components/Text';
import { DEVICE_WIDTH } from 'layout/CustomStyles';
import { User } from 'services/User';
import { useStore } from 'stores/RootStore';

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

  return (
    <Container source={require('assets/images/login_background.png')}>
      <Header>
        <HeaderTitleContainer>
          <HeaderTitleText>OSORI</HeaderTitleText>
          <HeaderSubTitleText>
            <HeaderSubTitleHighlightText>오</HeaderSubTitleHighlightText>
            늘의 나를 남기는 <HeaderSubTitleHighlightText>소리</HeaderSubTitleHighlightText>
          </HeaderSubTitleText>
        </HeaderTitleContainer>
        <WelcomeText>환영합니다</WelcomeText>
      </Header>
      <WelcomeImage
        resizeMode="cover"
        source={require('assets/lottie/welcome.json')}
        speed={0.5}
        autoPlay
        loop
      />
      <LoginButtonContainer>
        <KakaoButton onPress={handleLoginByKakao}>
          <KakaoImage
            resizeMode="contain"
            source={require('assets/images/kakao_login/ko/kakao_login_large_narrow.png')}
          />
        </KakaoButton>
      </LoginButtonContainer>
    </Container>
  );
});

const Container = styled.ImageBackground`
  flex: 1;
  align-items: center;
`;

const Header = styled.View`
  height: 40%;
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
  font-size: 18px;
  color: ${(props) => props.theme.colors.label};
`;

const LoginButtonContainer = styled.View`
  align-items: center;
`;

const KakaoButton = styled.TouchableOpacity``;

const KakaoImage = styled.Image`
  width: ${DEVICE_WIDTH / 2}px;
`;

const WelcomeImage = styled(LottieView)`
  width: ${DEVICE_WIDTH * 0.8}px;
`;

export default LoginScreen;
