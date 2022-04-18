import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';
import { useStore } from 'stores/RootStore';
import { ArticleDto } from 'services/data-contracts';
import { MainStackParamList } from 'types/NavigationTypes';
import SkeletonMainScreen from 'skeleton/SkeletonMainScreen';
import ArticleCard from 'components/ArticleCard';
import styled from 'styled-components/native';
import CustomHeader from 'components/CustomHeader';
import Text from 'components/Text';
import Theme from 'styles/Theme';

const MainScreen = observer(() => {
  const { articleStore, uiStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const articles = useQuery<ArticleDto[]>('getArticles', () =>
    articleStore.api.articlesList().then((result) => result.data),
  );

  const renderArticles = (item: { item: ArticleDto; index: number }) => {
    return <ArticleCard article={item.item} />;
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

  const renderLeftHeader = () => {
    return (
      <IconButton>
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

    const onFocus = navigation.addListener('focus', () => {
      uiStore.setTabBarVisible(true);
      articles.refetch();
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
        <SkeletonMainScreen />
      ) : (
        <FlatList
          style={{ flex: 1, backgroundColor: Theme.colors.primary1 }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={articles.data || []}
          renderItem={renderArticles}
          refreshing={refreshing}
          onRefresh={articles.refetch}
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
