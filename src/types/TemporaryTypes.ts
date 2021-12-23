import { KakaoProfile } from '@react-native-seoul/kakao-login';

export type TemporaryArticleType = {
    title: string;
    contents: string;
    creator: KakaoProfile;
    createDate: Date;
    updateDate: Date;
    length: number;
};
