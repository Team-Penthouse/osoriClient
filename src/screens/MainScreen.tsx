import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useStore } from 'stores/RootStore';
import { ArticleDto } from 'services/data-contracts';
import { MainStackParamList } from 'types/NavigationTypes';
import ArticleCard from 'components/ArticleCard';
import styled from 'styled-components/native';
import CustomHeader from '../components/CustomHeader';
import Text from '../components/Text';
import Theme from '../styles/Theme';
import ArticleRow from '../components/ArticleRow';
import { RequestParams } from '../services/http-client';

const MainScreen = observer(() => {
  const { articleStore, uiStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'horizontal' | 'row'>('horizontal');
  const [currentPagination, setCurrentPagination] = useState<any>({});

  const articles = useQuery(
    'getArticles',
    ({ pageParam = 0 }) => {
      const parameter = { page: pageParam } as any;
      return articleStore.api.articlesList(parameter).then((result) => {
        const pagination = result.headers['x-pagination'];
        setCurrentPagination(pagination);
        return result.data;
      });
    },
    {
      // getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
    },
  );

  const renderArticles = (item: { item: ArticleDto; index: number }) => {
    return <ArticleCard article={item.item} />;
  };

  const renderArticleRows = (item: { item: ArticleDto; index: number }) => {
    return <ArticleRow article={item.item} />;
  };

  const renderTitle = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Icon
          style={{ marginRight: 10 }}
          source={require('assets/images/icons/temporary_osori_icon.png')}
        />
        <Text style={{ color: 'white', fontSize: 20 }}>Osori</Text>
      </View>
    );
  };

  const handleChangeViewMode = () => {
    if (viewMode === 'horizontal') {
      setViewMode('row');
    } else {
      setViewMode('horizontal');
    }
  };

  const renderLeftHeader = () => {
    return (
      <IconButton onPress={handleChangeViewMode}>
        <Icon source={require('assets/images/icons/menu.png')} />
      </IconButton>
    );
  };

  const renderRightHeader = () => {
    return (
      <HeaderButtonContainer>
        <IconButton style={{ marginLeft: 3 }}>
          <Icon source={require('assets/images/icons/message.png')} />
        </IconButton>
        <IconButton style={{ marginLeft: 3 }}>
          <Icon source={require('assets/images/icons/notification.png')} />
        </IconButton>
        <IconButton style={{ marginLeft: 3 }}>
          <Icon source={require('assets/images/icons/search.png')} />
        </IconButton>
      </HeaderButtonContainer>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          titleComponent={renderTitle}
          leftComponent={renderLeftHeader}
          rightComponent={renderRightHeader}
        />
      ),
    });
  }, [viewMode]);

  useLayoutEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      uiStore.setTabBarVisible(true);
    });
    const onBlur = navigation.addListener('blur', () => {
      uiStore.setTabBarVisible(false);
    });

    return () => {
      onFocus();
      onBlur();
    };
  }, []);

  return (
    <Container>
      {articles.isFetching ? (
        <ActivityIndicator style={{ flexGrow: 1 }} />
      ) : viewMode === 'horizontal' ? (
        <FlatList
          style={{ flex: 1, backgroundColor: Theme.colors.primary1 }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={articles.data}
          renderItem={renderArticles}
          refreshing={refreshing}
          onRefresh={articles.refetch}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
          data={articles.data || []}
          renderItem={renderArticleRows}
          ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }} />}
          refreshing={refreshing}
          onRefresh={articles.refetch}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </Container>
  );
});

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.white2};
`;

const IconButton = styled.TouchableOpacity`
  padding: 10px;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

const HeaderButtonContainer = styled.View`
  flex-direction: row;
`;

export default MainScreen;
