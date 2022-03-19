import React, { useLayoutEffect, useState } from 'react';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { ActivityIndicator, Button, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomBottomTab from 'components/CustomBottomTab';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useStore } from '../stores/RootStore';
import { ArticleDto } from '../services/data-contracts';
import Theme from '../styles/Theme';
import { MainStackParamList } from '../types/NavigationTypes';
import ArticleCard from '../components/ArticleCard';

const MainScreen = observer(() => {
  const { articleStore } = useStore();
  const navigation = useNavigation<DrawerNavigationProp<MainStackParamList>>();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const articles = useQuery<ArticleDto[]>('getArticles', () =>
    articleStore.api.articlesList().then((result) => result.data),
  );

  const renderArticles = (item: { item: ArticleDto; index: number }) => {
    return <ArticleCard article={item.item} />;
  };

  useLayoutEffect(() => {
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
        paddingBottom: 70,
        backgroundColor: Theme.colors.white2,
      }}
    >
      {articles.isFetching ? (
        <ActivityIndicator style={{ flexGrow: 1 }} />
      ) : (
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={articles.data || []}
          renderItem={renderArticles}
          refreshing={refreshing}
          onRefresh={articles.refetch}
        />
      )}
      <CustomBottomTab />
    </View>
  );
});

export default MainScreen;
