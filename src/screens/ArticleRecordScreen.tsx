import React, { useEffect, useState } from 'react';
import { Button, Layout, Spinner } from '@ui-kitten/components';
import { Alert, Dimensions, ImageBackground, Platform, TouchableOpacity } from 'react-native';
import AudioRecorderPlayer, {
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import { Fonts } from 'layout/CustomStyles';
import { TemporaryArticleType } from 'types/TemporaryTypes';
import { isIphoneX } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-community/async-storage';
import TextInput from 'components/TextInput';
import RNFetchBlob from 'rn-fetch-blob';
import Text from 'components/Text';
import moment from 'moment';
import { KakaoProfile } from '@react-native-seoul/kakao-login';
import { useStore } from 'stores/RootStore';
import { CLOVA_SPEACH_INVOKE_URL, CLOVA_SPEACH_SECRET_KEY } from '@env';
import axios from 'axios';
import { useMutation } from 'react-query';
import { ArticleDto } from '../services/data-contracts';

const recorder = new AudioRecorderPlayer();

const ArticleRecordScreen = () => {
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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [receivedText, setReceivedText] = useState<string>('');
  const [recordBack, setRecordBack] = useState<RecordBackType>({ currentPosition: 0 });
  const [playBack, setPlayBack] = useState<PlayBackType>({ currentPosition: 0, duration: 0 });
  const [title, setTitle] = useState<string>(`${moment().format('YYYY-MM-DD')}-Untitled`);

  const saveArticle = useMutation(async ({ article }: { article: ArticleDto }) => {
    const response = await articleStore.api.articleCreate(article);
    if (response.status === 200) {
      uiStore.closeModal();
    } else {
      Alert.alert('저장에 실패했습니다.');
    }
  });

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

        // 녹음 50초 경과 시, 자동 녹음 종료 및 레코드백 삭제
        if (e.currentPosition > 50000) {
          setIsRecording(false);
          await recorder.stopRecorder();
          await recorder.removeRecordBackListener();
        }
      });
    }
  };

  const handlePlayRecord = async () => {
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

  const requestToClovaSpeach = async () => {
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
        onPress: () => uiStore.closeModal(),
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
  }, []);

  return (
    <ImageBackground
      source={require('assets/images/record_background.png')}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <TextInput
        maxLength={30}
        defaultValue="Untitled"
        value={title}
        style={{ fontSize: 30, fontFamily: Fonts.NANUM_SQUARE_LIGHT }}
        onChangeText={setTitle}
      />
      <TextInput
        maxLength={500}
        multiline
        value={receivedText}
        style={{
          fontFamily: Fonts.NANUM_SQUARE_LIGHT,
          color: 'black',
          backgroundColor: 'white',
          width: Dimensions.get('window').width * 0.9,
          height: Dimensions.get('window').height / 3,
          borderRadius: 8,
          marginVertical: 20,
          padding: 20,
          marginBottom: 20,
        }}
        onChangeText={(text) => setReceivedText(text)}
      />
      <Layout style={{ flexDirection: 'row', backgroundColor: 'transparent', marginTop: 20 }}>
        {isRecording ? (
          <TouchableOpacity
            style={{
              margin: 5,
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleRecord}
          >
            <Spinner
              status="danger"
              style={{
                position: 'absolute',
                borderRadius: 100,
                height: 80,
                width: 80,
              }}
            />
            <Text style={{ position: 'absolute', color: 'red' }}>
              {millisToSeconds(recordBack?.currentPosition)} / 50
            </Text>
          </TouchableOpacity>
        ) : (
          <Button
            disabled={isPlaying || loading}
            style={{
              borderRadius: 100,
              height: 80,
              width: 80,
              margin: 5,
            }}
            appearance="outline"
            status="primary"
            onPress={handleRecord}
          >
            {isRecording ? '녹음중' : '녹음'}
          </Button>
        )}
        {isPlaying ? (
          <TouchableOpacity
            style={{
              margin: 5,
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handlePlayRecord}
          >
            <Spinner
              status="basic"
              style={{
                position: 'absolute',
                borderRadius: 100,
                height: 80,
                width: 80,
              }}
            />
            {playBack.duration !== 0 && (
              <Text style={{ position: 'absolute', color: '#363636' }}>
                {millisToSeconds(playBack.currentPosition)} /{millisToSeconds(playBack.duration)}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <Button
            disabled={isRecording || loading}
            style={{
              borderRadius: 100,
              height: 80,
              width: 80,
              margin: 5,
            }}
            appearance="outline"
            status="danger"
            onPress={handlePlayRecord}
          >
            {isPlaying ? '정지' : '재생'}
          </Button>
        )}
        {loading ? (
          <Layout
            style={{
              margin: 5,
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner
              status="warning"
              style={{
                position: 'absolute',
                borderRadius: 100,
                height: 80,
                width: 80,
              }}
            />
            <Text style={{ position: 'absolute', fontWeight: 'bold' }}>변환중</Text>
          </Layout>
        ) : (
          <Button
            disabled={isPlaying || isRecording}
            style={{
              borderRadius: 100,
              height: 80,
              width: 80,
              margin: 5,
            }}
            onPress={requestToClovaSpeach}
          >
            변환
          </Button>
        )}
      </Layout>
      <Layout
        style={{
          width: '100%',
          position: 'absolute',
          top: 0,
          paddingTop: isIphoneX() ? 40 : 10,
          paddingBottom: 10,
          backgroundColor: 'rgba(123,123,123,0.23)',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
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
      </Layout>
    </ImageBackground>
  );
};

export default ArticleRecordScreen;
