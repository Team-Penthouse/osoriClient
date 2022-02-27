import React, { useEffect, useState } from 'react';
import { Button, Layout, Spinner } from '@ui-kitten/components';
import {
  Alert,
  Dimensions,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AudioRecorderPlayer, {
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import { Fonts } from 'layout/CustomStyles';
import { closeModal } from 'stores/uiStore';
import { RootState } from 'stores/rootStore';
import { TemporaryArticleType } from 'types/TemporaryTypes';
import { useDispatch, useSelector } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-community/async-storage';
import TextInput from 'components/TextInput';
import RNFetchBlob from 'rn-fetch-blob';
import Text from 'components/Text';
import moment from 'moment';

const recorder = new AudioRecorderPlayer();

const ArticleRecordScreen = () => {
  const dispatcher = useDispatch();
  const myInfo = useSelector((state: RootState) => state.auth.user);

  const { dirs } = RNFetchBlob.fs;
  const path = Platform.select({
    ios: 'record.m4a',
    android: `${RNFetchBlob.fs.dirs.CacheDir}/test2.mp3`,
  });

  const getRecordGrant = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          // permission 허용일때, 처리
        } else {
          return;
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioBinary, setAudioBinary] = useState<string>('');
  const [receivedText, setReceivedText] = useState<string>('');
  const [recordBack, setRecordBack] = useState<RecordBackType>({ currentPosition: 0 });
  const [playBack, setPlayBack] = useState<PlayBackType>({ currentPosition: 0, duration: 0 });
  const [title, setTitle] = useState<string>(`${moment().format('YYYY-MM-DD')}-Untitled`);

  const handleRecord = async () => {
    if (isRecording) {
      setRecordBack({ currentPosition: 0 });
      setIsRecording(false);
      console.log('record stopped');
      let real = '';
      const result = await recorder.stopRecorder().then((res) => {
        console.log('Record Done');
        real = res;
      });
      console.log('Record Result', result);
      await recorder.removeRecordBackListener();
    } else {
      setIsRecording(true);
      await RNFetchBlob.fs.unlink(path!);
      await recorder.startRecorder(path);
      recorder.addRecordBackListener(async (e) => {
        setRecordBack(e);
        if (e.currentPosition > 50000) {
          setIsRecording(false);
          console.log('record stopped');
          let real = '';
          const result = await recorder.stopRecorder().then((res) => {
            console.log('Record Done');
            real = res;
          });
          console.log('Record Result', result);
          await recorder.removeRecordBackListener();
        }
      });
    }
  };

  const handlePlayRecord = async () => {
    if (isPlaying) {
      setPlayBack({ currentPosition: 0, duration: 0 });
      await recorder.stopPlayer();
      setIsPlaying(false);
    } else {
      await recorder.startPlayer(`${RNFetchBlob.fs.dirs.CacheDir}/test2.mp3`);
      setIsPlaying(true);
      recorder.addPlayBackListener((e) => {
        setPlayBack(e);
        console.log(e);
        if (e.currentPosition === e.duration) {
          setPlayBack({ currentPosition: 0, duration: 0 });
          setIsPlaying(false);
        }
      });
      // setFilePath(msg);
    }
  };

  const requestAudioToClova = async () => {
    setLoading(true);
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/test2.mp3`;
    // const realFile = await RNFetchBlob.wrap(filePath);
    await RNFetchBlob.fetch(
      'POST',
      'https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor',
      {
        'Content-Type': 'application/octet-stream',
        'X-NCP-APIGW-API-KEY-ID': '1iy66ip4vc',
        'X-NCP-APIGW-API-KEY': 'ByilfOrnaFPZtWZhwkF4VD1AizmciyDPtsUgnGIK',
      },
      RNFetchBlob.wrap(filePath),
    )
      .then((result) => {
        const { text } = JSON.parse(result.data);
        let wholeText = receivedText + text;
        if (wholeText.length > 500) {
          wholeText = wholeText.substr(0, 500);
        }
        setReceivedText(wholeText);
        console.log(text);
      })
      .catch((e) => {
        console.log('err', e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    Alert.alert('저장하지 않고 나가시겠습니까?', '진행중인 내용을 잃어버리게 됩니다.', [
      {
        text: '예',
        style: 'destructive',
        onPress: () => {
          dispatcher(closeModal());
        },
      },
      {
        text: '아니오',
      },
    ]);
    console.log('called');
  };

  const handleSave = () => {
    Alert.alert('저장하시겠습니까?', '', [
      {
        text: '예',
        style: 'destructive',
        onPress: async () => {
          const article: TemporaryArticleType = {
            title,
            contents: receivedText,
            length: receivedText.length,
            creator: myInfo,
            createDate: new Date(),
            updateDate: new Date(),
          };

          await AsyncStorage.getItem('my_articles').then((result) => {
            if (result !== null) {
              const articles = JSON.parse(result) as TemporaryArticleType[];
              articles.push(article);
              AsyncStorage.setItem('my_articles', JSON.stringify(articles));
            } else {
              const articles = [article];
              AsyncStorage.setItem('my_articles', JSON.stringify(articles));
            }
          });

          dispatcher(closeModal());
        },
      },
      {
        text: '아니오',
      },
    ]);
    console.log('called');
  };

  const millisToSeconds = (millis: number) => {
    const secondsText = String(millis);
    console.log(secondsText.indexOf('.'));
    if (secondsText.indexOf('.') !== -1) {
      const seconds = secondsText.substr(0, secondsText.indexOf('.'));
      return Math.round(Number(seconds) / 1000);
    }
    return Math.round(Number(secondsText) / 1000);
  };

  useEffect(() => {
    getRecordGrant();
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
        style={{ fontSize: 30, fontFamily: 'NanumSquareL' }}
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
      {/* <Layout */}
      {/*    style={{ */}
      {/*        backgroundColor: 'rgba(163,163,163,0.51)', */}
      {/*        paddingHorizontal: 50, */}
      {/*        paddingVertical: 10, */}
      {/*        borderRadius: 8, */}
      {/*    }} */}
      {/* > */}
      {/*    <Text style={{ color: 'white' }}></Text> */}
      {/* </Layout> */}
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
            onPress={requestAudioToClova}
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
