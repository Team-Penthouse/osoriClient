import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './src/stores/rootStore';
import Entry from './src/layout/Entry';
import * as Kakao from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';
import { KakaoOAuthToken } from '@react-native-seoul/kakao-login';
import SplashScreen from 'react-native-splash-screen';
import 'moment/locale/ko';

const App = () => {
    // Hermes
    const isHermes = () => !!global.HermesInternal;

    useEffect(() => {
        try {
            setTimeout(() => {
                SplashScreen.hide(); /** 추가 **/
            }, 2000); /** 스플래시 시간 조절 (2초) **/
        } catch (e) {
            console.warn('에러발생');
            console.warn(e);
        }
    });

    // Redux Store
    const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
    const store = createStore(rootReducer, composeEnhancers);

    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <Provider store={store}>
                <Entry />
            </Provider>
        </ApplicationProvider>
    );
};

export default App;
