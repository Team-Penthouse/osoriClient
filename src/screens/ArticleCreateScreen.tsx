import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BottomNavigationProps, Button, Spinner } from '@ui-kitten/components';
import {
  Alert,
  ImageBackground,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AudioRecorderPlayer, {
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import { DEVICE_HEIGHT, DEVICE_WIDTH, Fonts } from 'layout/CustomStyles';
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
import { ArticleDto } from 'services/data-contracts';
import { MainStackParamList } from 'types/NavigationTypes';
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import Theme from 'styles/Theme';
import { observer } from 'mobx-react';
import CustomHeader from '../components/CustomHeader';

const recorder = new AudioRecorderPlayer();

const ArticleCreateScreen = observer(() => {
  const navigation = useNavigation<
    StackNavigationProp<MainStackParamList> & BottomNavigationProps
  >();
  const { audioStore, uiStore, authStore, articleStore } = useStore();

  const RECORDING_FILE_PATH =
    Platform.select({
      ios: 'article_recording.m4a',
      android: `${RNFetchBlob.fs.dirs.CacheDir}/article_recording_1.mp3`,
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
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const contentInputRef = useRef<TextInput>(null);

  const saveArticle = useMutation(
    async ({ article }: { article: ArticleDto }) => {
      const response = await articleStore.api.articleCreate(article);
      return response;
    },
    {
      onSuccess: () => {
        setReceivedText('');
        setTitle(`${moment().format('YYYY-MM-DD')}`);
        Alert.alert('?????? ?????????????????????.');
        navigation.goBack();
      },
    },
  );

  const handleRecord = async () => {
    if (isRecording) {
      // ?????? ?????? ???

      // ?????? ???????????? ?????????
      setRecordBack({ currentPosition: 0 });
      setIsRecording(false);

      // ?????? ??????
      await recorder.stopRecorder();

      // ?????? ???????????? ?????? ??????
      await recorder.removeRecordBackListener();

      requestToClovaSpeech();
    } else {
      setRecordLength(0);
      // ?????? ?????? ?????? ??? (?????? ???????????? ???)
      setIsRecording(true);

      // ???????????? ??? ????????? ?????????
      // ?????? ????????? ????????? ?????? ??? ?????? ?????? ??? ?????? ??????
      await RNFetchBlob.fs.writeFile(RECORDING_FILE_PATH, '');

      // ?????? ??????
      await recorder.startRecorder(RECORDING_FILE_PATH);

      // ?????? ???????????? ????????????
      recorder.addRecordBackListener(async (e) => {
        setRecordBack(e);
        setRecordLength(e.currentPosition);

        // ?????? 50??? ?????? ???, ?????? ?????? ?????? ??? ???????????? ??????
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
      // ?????? ??? ??? ???

      // ?????? ??????
      await recorder.stopPlayer();

      // ???????????? ??? ????????? ?????????
      setPlayBack({ currentPosition: 0, duration: 0 });
      setIsPlaying(false);
    } else {
      // ???????????? ?????? ???

      // ?????? ?????? ??????
      await recorder.startPlayer(RECORDING_FILE_PATH);
      setIsPlaying(true);
      recorder.addPlayBackListener((e) => {
        // ???????????? ??????
        setPlayBack(e);
        if (e.currentPosition === e.duration) {
          // ?????? ????????? ?????? ??? ???????????? ??? ????????? ?????????
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

        // 500 ?????? ?????? ?????? ??? ??????
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
    Alert.alert('???????????? ?????? ??????????????????????', '???????????? ????????? ??????????????? ?????????.', [
      {
        text: '???',
        style: 'destructive',
        onPress: () => {
          setReceivedText('');
          setTitle(`${moment().format('YYYY-MM-DD')}`);
          navigation.goBack();
        },
      },
      {
        text: '?????????',
      },
    ]);
  };

  const handleSave = () => {
    Alert.alert('?????????????????????????', '', [
      {
        text: '???',
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
        text: '?????????',
      },
    ]);
  };

  // ??????????????? -> ??? ?????? ??????
  const millisToSeconds = (millis: number) => {
    const secondsText = String(millis);
    if (secondsText.indexOf('.') !== -1) {
      const seconds = secondsText.substr(0, secondsText.indexOf('.'));
      return Math.round(Number(seconds) / 1000);
    }
    return Math.round(Number(secondsText) / 1000);
  };

  const renderHeaderLeft = () => {
    return (
      <Button
        size="small"
        style={{ marginRight: 10 }}
        status="danger"
        disabled={isRecording || isPlaying || loading}
        onPress={handleClose}
      >
        ??????
      </Button>
    );
  };

  const renderHeaderRight = () => {
    return (
      <Button
        status="info"
        size="small"
        disabled={isRecording || isPlaying || loading}
        onPress={handleSave}
      >
        ??????
      </Button>
    );
  };

  useEffect(() => {
    audioStore.requestRecordPermission();
    setTimeout(() => {
      contentInputRef.current?.focus();
    }, 200);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          title={'??? ??????'}
          leftComponent={renderHeaderLeft}
          rightComponent={renderHeaderRight}
        />
      ),
    });
  }, [loading, isPlaying, isRecording, receivedText, title]);

  useLayoutEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      console.log('focus');
      uiStore.setTabBarVisible(false);
    });
    const onBlur = navigation.addListener('blur', () => {
      uiStore.setTabBarVisible(true);
    });

    return () => {
      onFocus();
      onBlur();
      setReceivedText('');
      setTitle(`${moment().format('YYYY-MM-DD')}`);
    };
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
      <ContentContainer>
        <TitleInput style={{ borderBottomWidth: 1, borderColor: '#ccc' }} defaultValue={title} />
        <ContentInput
          ref={contentInputRef}
          showSoftInputOnFocus
          editable={!isRecording && !isPlaying && !loading}
          placeholder={'?????? ?????? ???????????????\n?????? ?????? ????????? ????????? ??????????????????'}
          maxLength={500}
          multiline
          // value={receivedText}
          value={receivedText}
          onChangeText={(text) => setReceivedText(text)}
        />
      </ContentContainer>
      {/* <ControllerContainer height={50}> */}
      {/*  <TextWithColor color={Theme.colors.dark1}> */}
      {/*    {' '} */}
      {/*    {millisToSeconds(recordBack?.currentPosition)} / 50 */}
      {/*  </TextWithColor> */}
      {/*  <ControlButton */}
      {/*    onPress={handleRecord} */}
      {/*    color={Theme.colors.primaryDark1} */}
      {/*    disabled={loading || isPlaying} */}
      {/*  > */}
      {/*    {isRecording ? ( */}
      {/*      <ControlSpinner status="danger" /> */}
      {/*    ) : ( */}
      {/*      <TextWithColor color={Theme.colors.primaryDark1}> */}
      {/*        {isRecording ? '?????????' : '??????'} */}
      {/*      </TextWithColor> */}
      {/*    )} */}
      {/*  </ControlButton> */}
      {/*  <ControlButton */}
      {/*    onPress={handlePlay} */}
      {/*    color={Theme.colors.secondary1} */}
      {/*    disabled={recordLength === 0 || loading || isRecording || isPlaying} */}
      {/*  > */}
      {/*    <TextWithColor color={Theme.colors.secondary1}> */}
      {/*      ????????????{' '} */}
      {/*      {playBack.currentPosition !== 0 ? millisToSeconds(playBack.currentPosition) : 0} /{' '} */}
      {/*      {millisToSeconds(recordLength)} */}
      {/*    </TextWithColor> */}
      {/*    {isPlaying && <ControlSpinner status={'info'} />} */}
      {/*  </ControlButton> */}
      {/*  <ControlButton color={Theme.colors.secondary4} onPress={requestToClovaSpeech}> */}
      {/*    {loading ? ( */}
      {/*      <ControlSpinner status="warning" /> */}
      {/*    ) : ( */}
      {/*      <TextWithColor color={Theme.colors.secondary4}>??????</TextWithColor> */}
      {/*    )} */}
      {/*  </ControlButton> */}
      {/* </ControllerContainer> */}
      {!loading && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
          <TouchableWithoutFeedback
            onLongPress={handleRecord}
            onPressOut={() => {
              if (isRecording) {
                handleRecord();
              }
            }}
          >
            <ImageBackground
              style={{ width: 70, height: 70 }}
              imageStyle={{ borderRadius: 100 }}
              source={require('assets/images/article_add_button.png')}
            />
          </TouchableWithoutFeedback>
        </View>
      )}
      {isRecording && (
        <DimmingContainer>
          <Text style={{ color: 'white' }}>?????? ?????????</Text>
          <Text style={{ color: 'white' }}>
            {millisToSeconds(recordBack?.currentPosition)} / 50
          </Text>
        </DimmingContainer>
      )}
      {loading && (
        <DimmingContainer>
          <Text style={{ color: 'white' }}>?????? ???????????????!</Text>
        </DimmingContainer>
      )}
    </ScrollView>
  );
});

const ContentContainer = styled.View`
  flex: 1;
  padding: 0 16px 0 16px;
`;

const HeaderContainer = styled.View`
  align-items: center;
`;

const TitleInput = styled.TextInput`
  width: 100%;
  font-family: ${Fonts.NANUM_SQUARE_LIGHT};
  font-size: 30px;
  border-radius: 8px;
  padding: 5px 10px 5px 10px;
  align-self: flex-start;
  margin: 20px 0 0 0;
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

const DimmingContainer = styled.View`
  position: absolute;
  background-color: rgba(74, 74, 74, 0.85);
  width: ${DEVICE_WIDTH}px;
  height: ${DEVICE_HEIGHT}px;
  z-index: 1;
  align-items: center;
  justify-content: center;
`;

export default ArticleCreateScreen;
