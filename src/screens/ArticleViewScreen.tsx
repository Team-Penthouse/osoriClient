import React from 'react';
import { ImageBackground, View } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/rootStore';
import { TemporaryArticleType } from 'types/TemporaryTypes';
import moment from 'moment';
import ExternalColor from 'layout/ExternalColor';
import Text from 'components/Text';

const ArticleViewScreen = () => {
  const currentArticle: TemporaryArticleType = useSelector(
    (state: RootState) => state.article.currentArticle,
  );

  return (
    <ImageBackground
      source={require('assets/images/login_background.png')}
      style={{ flex: 1, paddingTop: isIphoneX() ? 60 : 30 }}
    >
      <View style={{ paddingLeft: 20 }}>
        <Text style={{ color: ExternalColor.i1 }} category="h3">
          {currentArticle?.title}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          marginHorizontal: 20,
          borderRadius: 8,
          padding: 20,
          marginTop: 20,
        }}
      >
        <Text category="label" style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
          {moment(currentArticle.createDate).format('YYYY.MM.DD HH:mm')}
        </Text>
        <Text>{currentArticle.contents}</Text>
      </View>
    </ImageBackground>
  );
};

export default ArticleViewScreen;
