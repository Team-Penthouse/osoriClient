import React, { useEffect } from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { QueryClient, QueryClientProvider } from 'react-query';
import SplashScreen from 'react-native-splash-screen';
import rootReducer from './src/stores/rootStore';
import Entry from './src/layout/Entry';
import * as eva from '@eva-design/eva';
import 'react-native-gesture-handler';
import 'moment/locale/ko';

/** react query 클라이언트를 생성한다. */
const queryClient = new QueryClient();

const App = () => {
  // Hermes
  const isHermes = () => !!global.HermesInternal;

  useEffect(() => {
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
