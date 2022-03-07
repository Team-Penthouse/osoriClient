import React, { useEffect } from 'react';
import { Alert, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Avatar } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import Text from './Text';
import { UserDto } from '../services/data-contracts';
import { useStore } from '../stores/RootStore';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  userInfo?: UserDto;
  width?: number;
  showLogout?: boolean;
}

const ProfileComponent = observer(
  ({ containerStyle, textStyle, userInfo, width, showLogout }: Props) => {
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
    useEffect(() => {
      if (typeof userInfo !== 'undefined') {
        console.log('user changed', userInfo);
        console.log('user Image', userInfo?.loginType);
      }
    }, [userInfo]);

    return (
      <View
        style={[
          {
            paddingVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'rgba(204,204,204,0.39)',
            // borderRadius: 12,
            width: width || 200,
          },
          containerStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          onPress={handleGoProfileScreen}
        >
          <Avatar
            size="small"
            source={
              // typeof userInfo?.profileImg === 'undefined'
              //   ? require('assets/images/anonymous_user.png')
              { uri: userInfo?.profileImage }
            }
            style={{
              marginRight: 10,
              borderWidth: typeof userInfo?.profileImage === 'undefined' ? 0.2 : 0,
            }}
          />
          <Text category="h6" style={textStyle}>
            {userInfo?.nickname}
          </Text>
        </TouchableOpacity>
        {showLogout && (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleLogout}>
            <Text>로그아웃</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

export default ProfileComponent;
