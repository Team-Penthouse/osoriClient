import React, { useEffect } from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import { QueryClient, QueryClientProvider } from 'react-query';
import SplashScreen from 'react-native-splash-screen';
import * as eva from '@eva-design/eva';
import NavController from 'navigation/NavController';
import 'moment/locale/ko';
import { MobxProvider } from 'stores/RootStore';
import { ThemeProvider } from 'styled-components';
import Theme from './src/styles/Theme';

/** react query 클라이언트를 생성한다. */
const queryClient = new QueryClient();

const App = () => {
  // Hermes
  // @ts-ignore
  const isHermes = () => !!global.HermesInternal;

  useEffect(() => {
    console.log('IS_HERMES_ENABLED :', isHermes());
    try {
      setTimeout(() => {
        SplashScreen.hide(); /** 추가 * */
      }, 2000); /** 스플래시 시간 조절 (2초) * */
    } catch (e) {
      console.warn(e);
    }
  });

  return (
    <MobxProvider>
      <ThemeProvider theme={Theme}>
        <QueryClientProvider client={queryClient}>
          <ApplicationProvider {...eva} theme={eva.light}>
            <NavController />
          </ApplicationProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </MobxProvider>
  );
};

export default App;
