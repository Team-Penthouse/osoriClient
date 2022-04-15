import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAlignLeft, faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import ArticleViewScreen from 'screens/ArticleViewScreen';
import FeedScreen from 'screens/FeedScreen';
import MainScreen from 'screens/MainScreen';
import ProfileViewScreen from 'screens/ProfileViewScreen';
import { MainStackParamList } from 'types/NavigationTypes';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigationProps } from '@ui-kitten/components';
import Text from '../components/Text';
import ArticleCreateScreen from '../screens/ArticleCreateScreen';
import { useStore } from '../stores/RootStore';
import Theme from '../styles/Theme';

const Tab = createBottomTabNavigator();

const MainNavigation = observer(() => {
  const navigation = useNavigation<BottomNavigationProps>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerBackgroundContainerStyle: { borderWidth: 0, elevation: 0 },
        tabBarStyle: { borderWidth: 0, elevation: 0, height: 70 },
      }}
    >
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <Image
              style={{ width: 30, height: 30 }}
              source={require('assets/images/icons/tab/check.png')}
            />
          ),
        }}
        name="main"
        component={MainScreen}
      />
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <Image
              style={{ width: 30, height: 30 }}
              source={require('assets/images/icons/tab/write.png')}
            />
          ),
        }}
        name="record"
        component={ArticleCreateScreen}
      />
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <Image
              style={{ width: 30, height: 30 }}
              source={require('assets/images/icons/tab/user.png')}
            />
          ),
        }}
        name="profile"
        component={ProfileViewScreen}
      />
    </Tab.Navigator>
  );
});

export default MainNavigation;
