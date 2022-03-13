import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArticleDto, UserDto } from '../services/data-contracts';
import { useStore } from '../stores/RootStore';
import ProfileComponent from './ProfileComponent';
import { DEVICE_WIDTH } from '../layout/CustomStyles';
import Text from './Text';
import { MainStackParamList } from '../types/NavigationTypes';

interface ArticleCardProps {
  article: ArticleDto;
}

const ArticleCard = observer(({ article }: ArticleCardProps) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { userStore, articleStore } = useStore();

  const { data: creator } = useQuery<UserDto>('getUser', () =>
    userStore.api.userDetail(article.creatorId).then((result) => result.data),
  );

  const handleGoDetail = () => {
    articleStore.setArticle(article);
    navigation.push('ArticleViewScreen');
  };

  return (
    <Container activeOpacity={1} onPress={handleGoDetail}>
      <HeaderContainer>
        <ArticleTitle>{article.title}</ArticleTitle>
        <ProfileComponent
          containerStyle={{ alignSelf: 'flex-end', width: 120 }}
          userInfo={creator}
        />
      </HeaderContainer>
      <ArticleContainer>
        <ArticleContent>
          {article.contents.substr(0, 200)}
          {article.contents.length > 200 ? '...' : ''}
        </ArticleContent>
      </ArticleContainer>
    </Container>
  );
});

const Container = styled.TouchableOpacity`
  width: 100%;
  border-top-width: 1px;
  border-color: #eee;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 10px 10px;
  border-bottom-width: 1px;
  border-color: #eee;
`;

const ArticleTitle = styled(Text)`
  font-size: 14px;
`;

const ArticleContainer = styled.View`
  padding: 10px 15px 10px 15px;
`;

const ArticleContent = styled(Text)`
  color: #2b2b2b;
  line-height: 20px;
`;

export default ArticleCard;
