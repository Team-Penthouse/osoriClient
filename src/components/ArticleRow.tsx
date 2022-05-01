import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useStore } from '../stores/RootStore';
import { ArticleDto } from '../services/data-contracts';
import Text from './Text';
import ProfileComponent from './ProfileComponent';
import Theme from '../styles/Theme';

interface ArticleRowProps {
  article: ArticleDto;
}

const ArticleRow = observer(({ article }: ArticleRowProps) => {
  const randomColors = [Theme.colors.primary1, '#dc8661', '#e85454'];

  return (
    <Container activeOpacity={1} color={randomColors[Math.round(Math.random() * 10) % 3]}>
      <Title>{article.title}</Title>
      <ProfileComponent userInfo={article.creator} textStyle={{ color: 'white' }} />
    </Container>
  );
});

const Container = styled.TouchableOpacity<{ color: string }>`
  flex-direction: row;
  justify-content: space-between;
  height: 70px;
  background-color: ${(props) => props.color};
  border-radius: 5px;
  align-items: center;
  padding: 0 16px 0 16px;
`;

const Title = styled(Text)`
  font-size: 18px;
  color: white;
`;

const ProfileContainer = styled.View`
  align-self: flex-end;
`;

export default ArticleRow;
