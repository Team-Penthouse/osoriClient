import React, { useLayoutEffect } from 'react';
import { Divider } from '@ui-kitten/components';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Carousel from 'react-native-snap-carousel';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import ExternalColor from 'layout/ExternalColor';
import Text from 'components/Text';
import ProfileComponent from 'components/ProfileComponent';
import CustomBottomTab from 'components/CustomBottomTab';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';
import { useStore } from '../stores/RootStore';
import { ArticleDto, UserDto } from '../services/data-contracts';
import Theme from '../styles/Theme';
import { MainStackParamList } from '../types/NavigationTypes';
import ArticleCard from '../components/ArticleCard';

const SCREEN_SIZE = Dimensions.get('window');

const MainScreen = observer(() => {
  const { articleStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const articles = useQuery<ArticleDto[]>('getArticles', () =>
    articleStore.api.articlesList().then((result) => result.data),
  );

  const handlePressArticle = (article: ArticleDto) => {
    articleStore.setArticle(article);
    navigation.push('ArticleViewScreen');
  };

  const renderCarousel = (item: { item: ArticleDto; index: number }) => {
    const article = item.item;
    return (
      <TouchableWithoutFeedback onPress={() => handlePressArticle(article)}>
        <View
          style={{
            height: SCREEN_SIZE.height / 4,
            width: SCREEN_SIZE.width / 1.4,
            borderRadius: 8,
            shadowOpacity: 0.3,
            margin: 10,
          }}
        >
          <View
            style={{
              padding: 20,
              height: '70%',
              backgroundColor: 'rgba(222,222,222,0.76)',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomWidth: 0.2,
            }}
          >
            <Text category="h5">{article?.title || '제목'}</Text>
            <Divider style={{ backgroundColor: 'grey', marginVertical: 5 }} />
            {article?.contents ? (
              <Text category="p2">
                {article.contents.length > 75
                  ? `${article.contents.substr(0, 75)}...`
                  : article.contents}
              </Text>
            ) : (
              <Text category="p2" style={{ fontFamily: 'Oe' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'rgba(0,0,0,0.68)',
              height: '30%',
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ marginLeft: 20, color: 'white' }}>
                {moment(article.createDate).fromNow()}
              </Text>
            </View>
            <ProfileComponent
              containerStyle={{ flex: 1, width: 100 }}
              textStyle={{ color: 'white' }}
              userInfo={{} as UserDto}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderArticles = (item: { item: ArticleDto; index: number }) => {
    return <ArticleCard article={item.item} />;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: 'Osori',
      headerTitleStyle: { letterSpacing: 2, color: Theme.colors.dark1 },
      headerStyle: { borderWidth: 1, borderColor: '#eee' },
    });
    const focus = navigation.addListener('focus', () => {
      articles.refetch();
    });

    return () => {
      focus();
    };
  });

  return (
    <View
      style={{
        flex: 1,
        paddingTop: isIphoneX() ? 40 : 0,
        paddingBottom: 70,
        backgroundColor: Theme.colors.white2,
      }}
    >
      {articles.isFetching ? (
        <ActivityIndicator style={{ flexGrow: 1 }} />
      ) : (
        <FlatList data={articles.data || []} renderItem={renderArticles} />
      )}
      <CustomBottomTab />
    </View>
  );
});

export default MainScreen;
