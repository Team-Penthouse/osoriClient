import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import { useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ArticleDto, UserDto } from '../services/data-contracts';
import { useStore } from '../stores/RootStore';
import ProfileComponent from './ProfileComponent';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '../layout/CustomStyles';
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
        <TitleContainer>
          <CalendarIcon icon={faCalendar} size={20} />
          <ArticleTitle>{article.title}</ArticleTitle>
        </TitleContainer>
        <ProfileComponent
          containerStyle={{ alignSelf: 'flex-end', width: 120 }}
          userInfo={creator}
        />
      </HeaderContainer>
      <ArticleContainer>
        <ArticleContent>{article.contents}</ArticleContent>
      </ArticleContainer>
    </Container>
  );
});

const Container = styled.TouchableOpacity`
  width: ${DEVICE_WIDTH}px;
  height: ${DEVICE_HEIGHT}px;
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

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CalendarIcon = styled(FontAwesomeIcon)`
  margin: 0 8px 0 0;
`;

const ArticleTitle = styled(Text)`
  font-size: 14px;
`;

const ArticleContainer = styled.ScrollView`
  padding: 10px 15px 10px 15px;
`;

const ArticleContent = styled(Text)`
  color: #2b2b2b;
  line-height: 25px;
`;

export default ArticleCard;
