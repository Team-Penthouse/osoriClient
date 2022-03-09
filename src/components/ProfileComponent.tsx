import React, { useEffect } from 'react';
import { Alert, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Avatar } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import Text from './Text';
import { UserDto } from '../services/data-contracts';
import { useStore } from '../stores/RootStore';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  userInfo?: UserDto;
  width?: number;
}

const ProfileComponent = observer(({ containerStyle, textStyle, userInfo, width }: Props) => {
  const { userStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleGoProfileScreen = () => {
    if (typeof userInfo !== 'undefined') {
      userStore.setUser(userInfo);
      navigation.push('ProfileViewScreen');
    }
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃 하시겠습니까?', '', [
      {
        text: '예',
        onPress: handleLogout,
      },
      {
        text: '아니오',
      },
    ]);
  };

  return (
    <Container style={containerStyle} width={width}>
      <AvatarContainer onPress={handleGoProfileScreen}>
        <AvatarImage
          size="small"
          source={
            typeof userInfo?.profileImage === null
              ? require('assets/images/anonymous_user.png')
              : { uri: userInfo?.profileImage }
          }
        />
        <Text category="h6" style={textStyle}>
          {userInfo?.nickname}
        </Text>
      </AvatarContainer>
    </Container>
  );
});

const Container = styled.View<{ width?: number }>`
  flex-direction: row;
  align-items: center;
  width: ${(props) => (typeof props.width !== 'undefined' ? props.width : 200)}px;
`;

const AvatarContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled(Avatar)`
  margin: 0 10px 0 0;
`;

export default ProfileComponent;
