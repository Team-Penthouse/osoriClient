import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Avatar, Layout, Spinner } from '@ui-kitten/components';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KakaoProfile } from '@react-native-seoul/kakao-login';
import { useNavigation } from '@react-navigation/native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { TemporaryArticleType } from 'types/TemporaryTypes';
import { CustomStyles } from 'layout/CustomStyles';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Text from 'components/Text';
import { observer } from 'mobx-react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useQuery } from 'react-query';
import axios from 'axios';
import { ArticleDto, UserDto } from '../services/data-contracts';
import { useStore } from '../stores/RootStore';

const ProfileViewScreen = observer(() => {
  const { userStore, articleStore, authStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [savedArticles, setSavedArticles] = useState<ArticleDto[]>([]);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserDto>();

  const { isLoading, data: articleData } = useQuery<ArticleDto[]>('getArticles', async () => {
    return await articleStore.api.articlesList();
  });

  const init = async () => {
    const response = await articleStore.api.articlesList({ creatorId: authStore.me?.id });
    setSavedArticles(response.data);
  };

  const handleGoArticleView = (article: ArticleDto) => {
    articleStore.setArticle(article);
    navigation.push('ArticleViewScreen');
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃 하시겠습니까?', '', [
      {
        text: '예',
        onPress: async () => {
          await GoogleSignin.signOut();
          await AsyncStorage.removeItem('userToken');
          userStore.setIsLoggedIn(false);
        },
      },
      {
        text: '아니오',
      },
    ]);
  };

  const getSavedArticles = () => {
    AsyncStorage.getItem('my_articles').then((result) => {
      if (result !== null) {
        const articles = JSON.parse(result);
        setSavedArticles(articles);
      }
    });
  };

  useLayoutEffect(() => {
    init();

    const subscribe = navigation.addListener('focus', () => {
      navigation.setOptions({ headerTitle: '', headerTransparent: true });
    });

    return () => {
      subscribe();
    };
  }, []);

  useEffect(() => {
    setCurrentUser(userStore.user);
    getSavedArticles();
  }, []);

  const renderArticleRow = ({ item, index }: { item: ArticleDto; index: number }) => {
    console.log('render', item);
    return (
      <TouchableOpacity
        key={item.title}
        style={[
          {
            flexDirection: 'row',
            borderBottomWidth: 0.5,
            alignItems: 'center',
            height: 60,
          },
        ]}
        onPress={() => handleGoArticleView(item)}
      >
        <View style={{ flex: 1 }}>
          <Text category="h6" style={{ marginLeft: 10 }}>
            {item.title}
          </Text>
        </View>
        <View style={{ flex: 0.5 }}>
          <Text style={{ alignSelf: 'flex-end', marginRight: 10 }}>
            {moment(item.createDate).format('YYYY.MM.DD')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    // <View style={{ flex: 1, backgroundColor: 'white' }}>
    //     <View style={[CustomStyles.divider, { marginVertical: 20 }]} />
    <Tabs.Container
      renderHeader={() => (
        <View
          style={[
            CustomStyles.center,
            { backgroundColor: 'rgba(223,222,255,0.74)', paddingVertical: 20 },
          ]}
        >
          <TouchableOpacity>
            <Avatar
              style={{ width: 150, height: 150, margin: 20 }}
              source={
                currentUser?.profileImage === null
                  ? require('assets/images/anonymous_user.png')
                  : { uri: currentUser?.profileImage }
              }
              defaultSource={require('assets/images/anonymous_user.png')}
            />
          </TouchableOpacity>

          <Text category="h3">{currentUser?.nickname || ''}</Text>
        </View>
      )}
      lazy
    >
      <Tabs.Tab name="Bio" key={1}>
        <Tabs.ScrollView>
          <View style={{ flex: 1, padding: 10 }}>
            <View style={[CustomStyles.row, styles.infoRow]}>
              <Text style={{ flex: 1 }}>닉네임</Text>
              <Text style={{ alignSelf: 'flex-end', flex: 1 }}>{currentUser?.nickname}</Text>
            </View>
            <View style={[CustomStyles.row, styles.infoRow]}>
              <Text style={{ flex: 1 }}>성별</Text>
              <Text style={{ alignSelf: 'flex-end', flex: 1 }}>
                {currentUser?.gender !== 'null' ? currentUser?.gender : '정보 없음'}
              </Text>
            </View>
            <View style={[CustomStyles.row, styles.infoRow]}>
              <Text style={{ flex: 1 }}>생일</Text>
              <Text style={{ flex: 1 }}>{currentUser?.birthday}</Text>
            </View>
            <View style={[CustomStyles.row, styles.infoRow]}>
              <Text style={{ flex: 1 }}>나이대</Text>
              <Text style={{ flex: 1 }}>{currentUser?.ageRange}</Text>
            </View>
            <TouchableOpacity
              style={{ padding: 10, alignSelf: 'flex-end', borderWidth: 1, borderRadius: 8 }}
              onPress={handleLogout}
            >
              <Text style={{ fontWeight: 'bold' }}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="Articles" key={2}>
        <Tabs.FlatList
          data={savedArticles}
          renderItem={renderArticleRow}
          refreshing={loadingArticles}
          onRefresh={() => {
            setLoadingArticles(true);
            setTimeout(() => {
              setLoadingArticles(false);
            }, 1000);
          }}
        />
      </Tabs.Tab>
    </Tabs.Container>
    // </View>
  );
});

const styles = StyleSheet.create({
  infoRow: {
    paddingVertical: 20,
  },
});
export default ProfileViewScreen;
