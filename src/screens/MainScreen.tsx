import React, { useEffect, useState } from 'react';
import { Divider } from '@ui-kitten/components';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Carousel from 'react-native-snap-carousel';
import {
  Dimensions,
  ImageBackground,
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
import { useStore } from '../stores/RootStore';
import { ArticleDto, UserDto } from '../services/data-contracts';

const SCREEN_SIZE = Dimensions.get('window');

const MainScreen = observer(() => {
  const { authStore, articleStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [articles, setArticles] = useState<ArticleDto[]>([]);

  const init = async () => {
    const response = await articleStore.api.articlesList();
    setArticles(response.data);
  };

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

  useEffect(() => {
    // navigation.reset({
    //     index: 0,
    //     routes: [{ name: '홈' }],
    // });
    init();
  }, []);

  return (
    <ImageBackground
      source={require('assets/images/home_background.png')}
      style={{ flex: 1, paddingTop: isIphoneX() ? 40 : 0 }}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', backgroundColor: 'transparent', paddingTop: 20 }}>
          <Text
            category="h2"
            style={[
              styles.sectionHeader,
              {
                marginRight: 70,
                alignSelf: 'flex-end',
                color: ExternalColor.b1,
              },
            ]}
          >
            BEST
          </Text>
          <Carousel
            slideStyle={{ alignItems: 'center' }}
            sliderWidth={SCREEN_SIZE.width}
            itemWidth={300}
            data={articles}
            renderItem={renderCarousel}
            autoplay
            autoplayDelay={6000}
            autoplayInterval={6000}
            loop
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={false}
          />
        </View>
        <View style={{ alignItems: 'center', marginTop: 20, backgroundColor: 'transparent' }}>
          <Text
            category="h2"
            style={[
              styles.sectionHeader,
              {
                marginLeft: 70,
                alignSelf: 'flex-start',
                color: ExternalColor.e2,
              },
            ]}
          >
            NEW
          </Text>
          <Carousel
            slideStyle={{ alignItems: 'center' }}
            sliderWidth={SCREEN_SIZE.width}
            itemWidth={300}
            data={articles}
            renderItem={renderCarousel}
            autoplay
            autoplayDelay={6000}
            autoplayInterval={6000}
            loop
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={false}
          />
        </View>
      </ScrollView>
      <CustomBottomTab />
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 10,
    shadowOpacity: 0.3,
    fontWeight: 'bold',
  },
});

export default MainScreen;
