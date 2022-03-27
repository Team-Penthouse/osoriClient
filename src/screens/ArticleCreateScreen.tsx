import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Spinner } from '@ui-kitten/components';
import { Alert, Platform, TextInput } from 'react-native';
import AudioRecorderPlayer, {
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import { DEVICE_WIDTH, Fonts } from 'layout/CustomStyles';
import RNFetchBlob from 'rn-fetch-blob';
import Text from 'components/Text';
import moment from 'moment';
import { useStore } from 'stores/RootStore';
import { CLOVA_SPEACH_INVOKE_URL, CLOVA_SPEACH_SECRET_KEY } from '@env';
import axios from 'axios';
import { useMutation } from 'react-query';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ArticleDto } from 'services/data-contracts';
import { MainStackParamList } from 'types/NavigationTypes';
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import Theme from 'styles/Theme';

const recorder = new AudioRecorderPlayer();

const ArticleCreateScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const drawer = useNavigation<DrawerNavigationProp<any>>();
  const { audioStore, uiStore, authStore, articleStore } = useStore();

  const RECORDING_FILE_PATH =
    Platform.select({
      ios: 'article_recording.m4a',
      android: `${RNFetchBlob.fs.dirs.CacheDir}/article_recording.mp3`,
    }) || '';
  const RECORDING_FILE_NAME =
    Platform.select({
      ios: 'article_recording.m4a',
      android: 'article_recording.mp3',
    }) || '';

  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordLength, setRecordLength] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [receivedText, setReceivedText] = useState<string>('');
  const [recordBack, setRecordBack] = useState<RecordBackType>({ currentPosition: 0 });
  const [playBack, setPlayBack] = useState<PlayBackType>({ currentPosition: 0, duration: 0 });
  const [title, setTitle] = useState<string>(`${moment().format('YYYY-MM-DD')}`);

  const contentInputRef = useRef<TextInput>(null);

  const saveArticle = useMutation(
    async ({ article }: { article: ArticleDto }) => {
      const response = await articleStore.api.articleCreate(article);
      return response;
    },
    {
      onSuccess: () => {
        Alert.alert('글을 저장하였습니다.');
        navigation.goBack();
      },
    },
  );

  const handleRecord = async () => {
    if (isRecording) {
      // 녹음 중일 시

      // 내부 레코드백 초기화
      setRecordBack({ currentPosition: 0 });
      setIsRecording(false);

      // 녹음 중지
      await recorder.stopRecorder();

      // 녹음 레코드백 기록 삭제
      await recorder.removeRecordBackListener();
    } else {
      setRecordLength(0);
      // 녹음 중이 아닐 시 (녹음 대기중일 시)
      setIsRecording(true);

      // 녹음파일 빈 파일로 초기화
      // 해당 이름의 파일이 없을 때 녹음 시도 시 예외 발생
      await RNFetchBlob.fs.writeFile(RECORDING_FILE_PATH, '');

      // 녹음 시작
      await recorder.startRecorder(RECORDING_FILE_PATH);

      // 녹음 레코드백 모니터링
      recorder.addRecordBackListener(async (e) => {
        setRecordBack(e);
        setRecordLength(e.currentPosition);

        // 녹음 50초 경과 시, 자동 녹음 종료 및 레코드백 삭제
        if (e.currentPosition > 50000) {
          setIsRecording(false);
          await recorder.stopRecorder();
          await recorder.removeRecordBackListener();
        }
      });
    }
  };

  const handlePlay = async () => {
    if (isPlaying) {
      // 재생 중 일 시

      // 재생 종료
      await recorder.stopPlayer();

      // 플레이백 및 플래그 초기화
      setPlayBack({ currentPosition: 0, duration: 0 });
      setIsPlaying(false);
    } else {
      // 재생중이 아닐 시

      // 녹음 파일 재생
      await recorder.startPlayer(RECORDING_FILE_PATH);
      setIsPlaying(true);
      recorder.addPlayBackListener((e) => {
        // 플레이백 저장
        setPlayBack(e);
        if (e.currentPosition === e.duration) {
          // 파일 재생이 끝날 시 플레이백 및 플래그 초기화
          setPlayBack({ currentPosition: 0, duration: 0 });
          setIsPlaying(false);
        }
      });
    }
  };

  const requestToClovaSpeech = async () => {
    const URL = `${CLOVA_SPEACH_INVOKE_URL}/recognizer/upload`;
    const data = new FormData();
    const media = {
      name: RECORDING_FILE_NAME,
      type: 'multipart/form-data',
      uri: `${Platform.OS === 'android' && 'file://'}${RECORDING_FILE_PATH}`,
    };
    data.append('media', media);
    data.append(
      'params',
      JSON.stringify({
        language: 'ko-KR',
        completion: 'sync',
      }),
    );

    setLoading(true);
    await axios
      .post(URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CLOVASPEECH-API-KEY': CLOVA_SPEACH_SECRET_KEY,
        },
      })
      .then((result) => {
        const { text } = result.data;
        let wholeText = receivedText + text;

        // 500 글자 이상 절삭 후 저장
        if (wholeText.length > 500) {
          wholeText = wholeText.substr(0, 500);
        }
        setReceivedText(wholeText);
        return result;
      })
      .catch((e) => {
        console.log('err', e);
      });

    setLoading(false);
  };

  const handleClose = () => {
    Alert.alert('저장하지 않고 나가시겠습니까?', '진행중인 내용을 잃어버리게 됩니다.', [
      {
        text: '예',
        style: 'destructive',
        onPress: () => navigation.goBack(),
      },
      {
        text: '아니오',
      },
    ]);
  };

  const handleSave = () => {
    Alert.alert('저장하시겠습니까?', '', [
      {
        text: '예',
        style: 'destructive',
        onPress: async () => {
          if (typeof authStore.me?.id !== 'undefined') {
            const article: ArticleDto = {
              title,
              contents: receivedText,
              creatorId: authStore.me?.id,
            };

            saveArticle.mutate({ article });
          }
        },
      },
      {
        text: '아니오',
      },
    ]);
  };

  // 밀리세컨드 -> 초 단위 변환
  const millisToSeconds = (millis: number) => {
    const secondsText = String(millis);
    if (secondsText.indexOf('.') !== -1) {
      const seconds = secondsText.substr(0, secondsText.indexOf('.'));
      return Math.round(Number(seconds) / 1000);
    }
    return Math.round(Number(secondsText) / 1000);
  };

  useEffect(() => {
    audioStore.requestRecordPermission();
    setTimeout(() => {
      contentInputRef.current?.focus();
    }, 200);
  }, []);

  useLayoutEffect(() => {
    drawer.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: isIphoneX() ? getBottomSpace() : 0,
      }}
      keyboardDismissMode={'on-drag'}
      keyboardShouldPersistTaps={'always'}
    >
      <Background>
        <HeaderContainer>
          <ButtonContainer>
            <Button
              size="small"
              style={{ marginRight: 10 }}
              status="danger"
              disabled={isRecording || isPlaying || loading}
              onPress={handleClose}
            >
              닫기
            </Button>
            <Button
              style={{ marginRight: 10 }}
              status="info"
              size="small"
              disabled={isRecording || isPlaying || loading}
              onPress={handleSave}
            >
              저장
            </Button>
          </ButtonContainer>
          <TitleInput
            maxLength={30}
            defaultValue="Untitled"
            value={title}
            onChangeText={setTitle}
          />
        </HeaderContainer>
        <ContentInput
          ref={contentInputRef}
          showSoftInputOnFocus
          editable={!isRecording && !isPlaying && !loading}
          placeholder={'글을 직접 입력하거나\n아래 녹음 버튼을 이용해 작성해보세요'}
          maxLength={500}
          multiline
          value={receivedText}
          onChangeText={(text) => setReceivedText(text)}
        />
      </Background>
      <ControllerContainer height={50}>
        <TextWithColor color={Theme.colors.dark1}>
          {' '}
          {millisToSeconds(recordBack?.currentPosition)} / 50
        </TextWithColor>
        <ControlButton
          onPress={handleRecord}
          color={Theme.colors.primaryDark1}
          disabled={loading || isPlaying}
        >
          {isRecording ? (
            <ControlSpinner status="danger" />
          ) : (
            <TextWithColor color={Theme.colors.primaryDark1}>
              {isRecording ? '녹음중' : '녹음'}
            </TextWithColor>
          )}
        </ControlButton>
        <ControlButton
          onPress={handlePlay}
          color={Theme.colors.secondary1}
          disabled={recordLength === 0 || loading || isRecording || isPlaying}
        >
          <TextWithColor color={Theme.colors.secondary1}>
            들어보기{' '}
            {playBack.currentPosition !== 0 ? millisToSeconds(playBack.currentPosition) : 0} /{' '}
            {millisToSeconds(recordLength)}
          </TextWithColor>
          {isPlaying && <ControlSpinner status={'info'} />}
        </ControlButton>
        <ControlButton color={Theme.colors.secondary4} onPress={requestToClovaSpeech}>
          {loading ? (
            <ControlSpinner status="warning" />
          ) : (
            <TextWithColor color={Theme.colors.secondary4}>변환</TextWithColor>
          )}
        </ControlButton>
      </ControllerContainer>
    </ScrollView>
  );
};

const Background = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark1};
  padding: 0 15px 0 15px;
`;

const HeaderContainer = styled.View`
  align-items: center;
`;

const TitleInput = styled.TextInput`
  width: ${DEVICE_WIDTH - 30}px;
  font-family: ${Fonts.NANUM_SQUARE_LIGHT};
  font-size: 30px;
  background-color: rgba(238, 238, 238, 0.42);
  border-radius: 8px;
  padding: 5px 10px 5px 10px;
  align-self: flex-start;
`;

const ButtonContainer = styled.View`
  width: ${DEVICE_WIDTH}px;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 15px 10px 15px;
  margin: 0 0 15px 0;
  background-color: rgba(108, 108, 108, 0.27);
`;

const ContentInput = styled.TextInput`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  margin: 10px 0 10px 0;
  text-align-vertical: top;
  padding: 10px;
  letter-spacing: 1px;
  line-height: 20px;
`;

const ControllerContainer = styled.View<{ height: number }>`
  width: ${DEVICE_WIDTH}px;
  height: ${(props) => props.height || 100}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-top-width: 1px;
  border-color: #eee;
  padding: 0 15px 0 15px;
`;

const ControlButton = styled.TouchableOpacity<{ color?: string }>`
  flex-direction: row;
  border-width: 1px;
  border-color: ${(props) => props?.color || 'transparent'};
  border-radius: 8px;
  padding: 10px 10px 10px 10px;
  margin: 5px;
  align-items: center;
  justify-content: center;
`;

const ControlSpinner = styled(Spinner)`
  width: 15px;
  height: 15px;
  border-width: 1px;
`;

const TextWithColor = styled(Text)<{ color?: string }>`
  color: ${(props) => props?.color || 'black'};
  margin: 0 10px 0 10px;
`;

export default ArticleCreateScreen;
