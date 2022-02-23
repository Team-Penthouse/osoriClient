import React from 'react';
import {
  Alert, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { Avatar, Layout } from '@ui-kitten/components';
import AsyncStorage from '@react-native-community/async-storage';
import { KakaoProfile } from '@react-native-seoul/kakao-login';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { setCurrentUser } from '../stores/userStore';
import Text from './Text';

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    userInfo: KakaoProfile;
    width?: number;
    showLogout?: boolean;
}

const ProfileComponent = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatcher = useDispatch();

  const handleGoProfileScreen = () => {
    dispatcher(setCurrentUser(props.userInfo));
    navigation.push('ProfileViewScreen');
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
    <View
      style={[
        {
          paddingVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'rgba(204,204,204,0.39)',
          // borderRadius: 12,
          width: props?.width || 200,
        },
        props.containerStyle,
      ]}
    >
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        onPress={handleGoProfileScreen}
      >
        <Avatar
          size="small"
          source={
                        props.userInfo?.profileImageUrl === null
                          ? require('assets/images/anonymous_user.png')
                          : { uri: props.userInfo?.profileImageUrl }
                    }
          style={{
            marginRight: 10,
            borderWidth: props.userInfo?.profileImageUrl === null ? 0.2 : 0,
          }}
        />
        <Text category="h6" style={props.textStyle}>
          {props.userInfo?.nickname}
        </Text>
      </TouchableOpacity>
      {props.showLogout && (
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleLogout}>
          <Text>로그아웃</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileComponent;
