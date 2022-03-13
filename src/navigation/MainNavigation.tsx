import React, { useCallback } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from 'types/NavigationTypes';
import { Fonts } from 'layout/CustomStyles';
import ProfileComponent from 'components/ProfileComponent';
import ProfileViewScreen from 'screens/ProfileViewScreen';
import ArticleViewScreen from 'screens/ArticleViewScreen';
import FeedScreen from 'screens/FeedScreen';
import MainScreen from 'screens/MainScreen';
import { observer } from 'mobx-react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useStore } from '../stores/RootStore';
import ArticleCreateScreen from '../screens/ArticleCreateScreen';
import Theme from '../styles/Theme';
import Text from '../components/Text';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigation = observer(() => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { authStore } = useStore();
  const HeaderLeft = useCallback(
    () => (
      <TouchableOpacity style={{ padding: 15 }} onPress={navigation.openDrawer}>
        <Text>{`<`}</Text>
      </TouchableOpacity>
    ),
    [authStore.me],
  );

  return (
    <Stack.Navigator
      initialRouteName={'MainScreen'}
      screenOptions={{
        headerShown: true,
        headerTitle: 'Osori',
        headerTitleAlign: 'center',
        headerTitleStyle: { letterSpacing: 2, color: Theme.colors.dark1 },
        headerStyle: { borderWidth: 1, borderColor: '#eee' },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="MainScreen"
        options={{
          headerLeft: HeaderLeft,
        }}
        component={MainScreen}
      />
      <Stack.Screen
        name="ProfileViewScreen"
        options={{ headerTitle: '', headerTransparent: false }}
        component={ProfileViewScreen}
      />
      <Stack.Screen
        name="ArticleViewScreen"
        options={{ headerShown: false }}
        component={ArticleViewScreen}
      />
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
      <Stack.Screen
        name={'ArticleCreateScreen'}
        component={ArticleCreateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
});

export default MainNavigation;
