import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { QueryClient, QueryClientProvider } from 'react-query';
import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import Entry from './src/layout/Entry';
import rootReducer from './src/stores/rootStore';
import 'moment/locale/ko';
import { API_URL } from '@env';

/** react query 클라이언트를 생성한다. */
const queryClient = new QueryClient();

axios.defaults.baseURL = API_URL;

const App = () => {
  // Hermes
  // @ts-ignore
  const isHermes = () => !!global.HermesInternal;

  useEffect(() => {
    console.log('HERMES_ENABLED :', isHermes());
    try {
      setTimeout(() => {
        SplashScreen.hide(); /** 추가 * */
      }, 2000); /** 스플래시 시간 조절 (2초) * */
    } catch (e) {
      console.warn('에러발생');
      console.warn(e);
    }
  });

  // Redux Store
  const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
  const store = createStore(rootReducer, composeEnhancers);

  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <Provider store={store}>
          <Entry />
        </Provider>
      </ApplicationProvider>
    </QueryClientProvider>
  );
};

export default App;
