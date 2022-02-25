import React, { useLayoutEffect } from 'react';
import { Layout } from '@ui-kitten/components';
import { Alert, Image, ImageBackground, TouchableOpacity, View } from 'react-native';
import { getProfile, KakaoOAuthToken, KakaoProfile, login } from '@react-native-seoul/kakao-login';
import { useDispatch, useSelector } from 'react-redux';
import { isUndefined } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Text from '../components/Text';
import ExternalColor from '../layout/ExternalColor';
import { DEVICE_SIZE } from '../layout/CustomStyles';
import { RootState } from '../stores/rootStore';
import { saveToken, saveUserInfo, setIsLoggedIn } from '../stores/authStore';
import { showTabBar } from '../stores/uiStore';

const LoginScreen = () => {
    const navigation = useNavigation();
    const dispatcher = useDispatch();

    const userToken: KakaoOAuthToken = useSelector((state: RootState) => state.auth.token);

    const handleLogin = async () => {
        await login()
            .then(async (res) => {
                if (!isUndefined(res.accessToken)) {
                    dispatcher(saveToken(res));
                    const userInfo = await getProfile();
                    dispatcher(saveUserInfo(userInfo as KakaoProfile));
                    dispatcher(setIsLoggedIn(true));
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
        const subscribe = navigation.addListener('focus', () => {
            // navigation.setOptions({ tabBarShown: false });
            dispatcher(showTabBar(false));
        });
        const unsubscribe = navigation.addListener('blur', () => {
            dispatcher(showTabBar(true));
        });

        return () => {
            subscribe();
            unsubscribe();
        };
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
                style={{ width: '80%' }}
                resizeMode="cover"
                source={require('assets/lottie/welcome.json')}
                speed={0.5}
                autoPlay
                loop
            />

            <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
                <TouchableOpacity onPress={handleLogin}>
                    <Image
                        resizeMode="contain"
                        style={{ width: DEVICE_SIZE.width / 2 }}
                        source={require('assets/images/kakao_login/ko/kakao_login_large_narrow.png')}
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default LoginScreen;
