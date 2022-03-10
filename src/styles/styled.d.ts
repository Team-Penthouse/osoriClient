import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary1: string;
      primary2: string;
      primary3: string;
      primaryDark1: string;
      primaryDark2: string;
      primaryDark3: string;
      secondary1: string;
      secondary2: string;
      secondary3: string;
      secondary4: string;
      dark1: string;
      dark2: string;
      white1: string;
      white2: string;
      label: string;
    };
  }
}
