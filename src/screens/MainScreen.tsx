import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomBottomTab from 'components/CustomBottomTab';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';
import { useStore } from 'stores/RootStore';
import { ArticleDto } from 'services/data-contracts';
import { MainStackParamList } from 'types/NavigationTypes';
import ArticleCard from 'components/ArticleCard';
import styled from 'styled-components/native';

const MainScreen = observer(() => {
  const { articleStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
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
    <Container>
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
    </Container>
  );
});

const Container = styled.View`
  flex: 1;
  padding: 0 0 70px 0;
  background-color: ${(props) => props.theme.colors.white2};
`;

export default MainScreen;
