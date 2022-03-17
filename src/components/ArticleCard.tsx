import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import { useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faCirclePlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
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

  /**
   * @Deprecated
   */
  const [isScrapped, setIsScrapped] = useState<boolean>(false);

  const { data: creator } = useQuery<UserDto>('getUser', () =>
    userStore.api.userDetail(article.creatorId).then((result) => result.data),
  );

  const handleGoDetail = () => {
    articleStore.setArticle(article);
    navigation.push('ArticleViewScreen');
  };

  const handleScrap = () => {
    setIsScrapped(!isScrapped);
  };

  return (
    <Container activeOpacity={1} onPress={handleGoDetail}>
      <HeaderContainer>
        <TitleContainer>
          <CalendarIcon icon={faCalendar} size={20} color={'#aaa'} />
          <ArticleTitle>{article.title}</ArticleTitle>
        </TitleContainer>
        <ProfileComponent
          containerStyle={{ alignSelf: 'flex-end' }}
          userInfo={creator}
          useFollow
          useFollowCount
        />
      </HeaderContainer>
      <HeaderContainer>
        <SeriesButton>
          <Text>Series : About Something...</Text>
        </SeriesButton>
      </HeaderContainer>
      <ArticleContainer>
        <ArticleContent>{article.contents}</ArticleContent>
      </ArticleContainer>
      <ScrapContainer>
        <ScrapButton onPress={handleScrap}>
          <ScrapText>{isScrapped ? 'Scrapped ' : 'Scrap '}</ScrapText>
          <ScrapCount>7.3k</ScrapCount>
          <ScrapIcon
            size={20}
            icon={isScrapped ? (faCircleCheck as IconProp) : (faCirclePlus as IconProp)}
            color={isScrapped ? '#629351' : '#aaa'}
          />
        </ScrapButton>
      </ScrapContainer>
    </Container>
  );
});

const Container = styled.ScrollView`
  width: ${DEVICE_WIDTH}px;
  height: ${DEVICE_HEIGHT}px;
  background-color: #eee;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  border-color: #ccc;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 10px 10px;
  border-bottom-width: 0.5px;
  border-color: #bbb;
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

const ScrapContainer = styled.View`
  flex: 1;
  height: 100px;
  align-items: center;
  justify-content: center;
`;

const ScrapButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  padding: 5px 10px 5px 10px;
  border-radius: 3px;
  border-color: #ccc;
`;

const ScrapText = styled(Text)`
  font-size: 18px;
`;

const ScrapIcon = styled(FontAwesomeIcon)``;

const ScrapCount = styled(Text)`
  font-size: 14px;
  color: #666;
  margin: 0 10px 0 0;
`;

const SeriesButton = styled.TouchableOpacity`
  width: 100%;
`;

export default ArticleCard;
