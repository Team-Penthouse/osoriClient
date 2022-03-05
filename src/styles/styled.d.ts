import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary1: string;
      primary2: string;
      secondary1: string;
      secondary2: string;
      dark1: string;
      dark2: string;
      white: string;
      label: string;
    };
  }
}
