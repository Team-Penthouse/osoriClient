import React from 'react';
import { useSelector } from 'react-redux';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from 'types/NavigationTypes';
import { RootState } from 'stores/rootStore';
import { Fonts } from 'layout/CustomStyles';
import ProfileComponent from 'components/ProfileComponent';
import ProfileViewScreen from 'layout/ProfileViewScreen';
import ArticleViewScreen from 'screens/ArticleViewScreen';
import FeedScreen from 'layout/FeedScreen';
import MainScreen from 'screens/MainScreen';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigation = () => {
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const tabBarVisible = useSelector((state: RootState) => state.ui.tabBarVisible);

  const HeaderLeft = () => (
    <ProfileComponent
      userInfo={userInfo}
      width={100}
      containerStyle={{
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        zIndex: 1,
      }}
    />
  );

  return (
    <Stack.Navigator
      // tabBar={() => (tabBarVisible ? <CustomBottomTab /> : null)}
      initialRouteName={'MainScreen'}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: Fonts.NANUM_SQUARE_LIGHT, fontSize: 30 },
        headerMode: 'float',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="MainScreen"
        options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerLeft: HeaderLeft,
        }}
        component={MainScreen}
      />
      <Stack.Screen name="ProfileViewScreen" component={ProfileViewScreen} />
      <Stack.Screen
        name="ArticleViewScreen"
        options={{ headerShown: false }}
        component={ArticleViewScreen}
      />
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
