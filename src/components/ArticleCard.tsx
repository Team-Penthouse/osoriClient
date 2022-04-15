import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import { useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faCirclePlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import moment from 'moment';
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
        <UserInformationContainer>
          <UserInformationContent>
            <TopInformation>
              <Username>{article.creator?.nickname}</Username>
            </TopInformation>
            <BottomInformation>
              <FollowButton>
                <FollowIcon source={require('assets/images/icons/heart.png')} />
                <FollowText>Follow</FollowText>
                <FollowerCount>{article?.creator?.followerCount}</FollowerCount>
              </FollowButton>
            </BottomInformation>
          </UserInformationContent>
          <UserAvatar source={{ uri: article?.creator?.profileImage }} />
        </UserInformationContainer>
      </HeaderContainer>
      <ArticleHeader>
        <ArticleTitle>{article.title}</ArticleTitle>
        <Label>{moment(article.createDate).format('YYYY-MM-DD')}</Label>
      </ArticleHeader>
      <ContentContainer>
        <ArticleContainer>
          <ArticleText>
            <ArticleFirstLetter>{article.contents && article?.contents[0]}</ArticleFirstLetter>
            {article.contents?.substr(1, article.contents?.length) || ''}
          </ArticleText>
        </ArticleContainer>
        <MediaContainer>
          <MediaButton>
            <MediaThumbnail source={require('assets/images/home_background.png')} />
          </MediaButton>
          <MediaButton>
            <MediaThumbnail source={require('assets/images/record_background.png')} />
          </MediaButton>
          <MediaButton>
            <MediaThumbnail source={require('assets/images/splash.png')} />
          </MediaButton>
        </MediaContainer>
      </ContentContainer>
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
  background-color: white;
`;

const HeaderContainer = styled.View`
  height: 70px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 10px 10px;
  background-color: ${(props) => props.theme.colors.primary1};
`;

const UserInformationContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: -50px;
  right: 30px;
`;

const UserInformationContent = styled.View``;

const TopInformation = styled.View`
  flex: 1;
  justify-content: flex-end;
  margin: 0 0 10px 0;
`;

const Username = styled(Text)`
  color: white;
  align-self: flex-end;
  margin: 0 10px 0 0;
`;

const BottomInformation = styled.View`
  flex: 1;
  justify-content: space-around;
`;

const UserAvatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  border-width: 2px;
  border-color: white;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CalendarIcon = styled(FontAwesomeIcon)`
  margin: 0 8px 0 0;
`;

const ContentContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const ArticleTitle = styled(Text)`
  font-size: 16px;
  margin: 0 0 10px 0;
  color: black;
`;

const ArticleHeader = styled.View`
  padding: 15px 30px 15px 30px;
`;

const ArticleContainer = styled.ScrollView`
  padding: 15px 30px 10px 30px;
`;

const ArticleFirstLetter = styled(Text)`
  font-size: 25px;
`;

const ArticleText = styled(Text)`
  color: #2b2b2b;
  line-height: 25px;
`;

const ScrapContainer = styled.View`
  margin: 50px 0 0 0;
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

const FollowButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px 5px 10px;
  margin: 0 10px 0 0;
  background-color: ${(props) => props.theme.colors.primary1};
`;

const FollowIcon = styled.Image`
  width: 15px;
  height: 15px;
  margin: 0 10px 0 0;
  tint-color: white;
`;

const FollowText = styled(Text)`
  color: white;
`;

const FollowerCount = styled(Text)`
  color: white;
  margin: 0 0 0 10px;
`;

const Label = styled(Text)`
  font-size: 10px;
`;

const MediaContainer = styled.View`
  margin: 0 30px 0 0;
  width: 80px;
`;

const MediaButton = styled.TouchableOpacity`
  align-items: center;
  padding: 5px 0 0 0;
`;

const MediaThumbnail = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 5px;
`;

export default ArticleCard;
