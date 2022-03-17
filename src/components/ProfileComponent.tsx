import React, { useEffect, useState } from 'react';
import { Alert, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Avatar } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark, faFaceKissWinkHeart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Text from './Text';
import { UserDto } from '../services/data-contracts';
import { useStore } from '../stores/RootStore';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  userInfo?: UserDto;
  width?: number;
  useFollow?: boolean;
  useFollowCount?: boolean;
}

const ProfileComponent = observer(
  ({ containerStyle, textStyle, userInfo, width, useFollow, useFollowCount }: Props) => {
    const { userStore } = useStore();
    const stackNavigation = useNavigation<StackNavigationProp<any>>();

    /**
     * @Deprecated
     */
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const handleGoProfileScreen = () => {
      if (typeof userInfo !== 'undefined') {
        userStore.setUser(userInfo);
        stackNavigation.navigate('ProfileViewScreen');
      }
    };

    const handleFollow = () => {
      setIsFollowing(!isFollowing);
    };

    return (
      <Container style={containerStyle} width={width}>
        <AvatarContainer onPress={handleGoProfileScreen}>
          <AvatarImage
            size={'tiny'}
            source={
              typeof userInfo?.profileImage === null
                ? require('assets/images/anonymous_user.png')
                : { uri: userInfo?.profileImage }
            }
          />
          <Nickname style={textStyle}>{userInfo?.nickname}</Nickname>
        </AvatarContainer>
        {useFollow && (
          <FollowButton onPress={handleFollow} isFollowing={isFollowing}>
            <FollowText isFollowing={isFollowing}>
              {isFollowing ? 'Following' : 'Follow'}
            </FollowText>
            {useFollowCount && (
              <CustomText color={isFollowing ? 'white' : '#111'}>19.7k</CustomText>
            )}
            {isFollowing && (
              <FontAwesomeIcon
                size={12}
                style={{ marginLeft: 5 }}
                icon={faHeart as IconProp}
                color={'white'}
              />
            )}
          </FollowButton>
        )}
      </Container>
    );
  },
);

const Container = styled.View<{ width?: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${(props) => props?.width && `width : ${props.width}px;`}
`;

const AvatarContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled(Avatar)`
  margin: 0 10px 0 0;
`;

const Nickname = styled(Text)`
  font-size: 16px;
  font-weight: 700;
`;

const CustomText = styled(Text)<{ color?: string }>`
  font-size: 12px;
  color: ${(props) => props?.color || 'black'};
  margin: 0 5px 0 5px;
`;

const FollowButton = styled.TouchableOpacity<{ isFollowing?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  background-color: ${(props) => (props?.isFollowing ? '#666' : '#eee')};
  border-radius: 3px;
  border-width: 1px;
  border-color: ${(props) => (props?.isFollowing ? '#eee' : '#666')};
  margin: 0 10px 0 10px;
`;

const FollowText = styled(Text)<{ isFollowing?: boolean }>`
  color: ${(props) => (props?.isFollowing ? 'white' : 'black')};
  font-size: 12px;
`;

const FollowIcon = styled(FontAwesomeIcon)``;

export default ProfileComponent;
