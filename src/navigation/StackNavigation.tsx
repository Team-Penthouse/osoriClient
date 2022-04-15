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
import { TouchableOpacity, View } from 'react-native';
import ArticleViewScreen from 'screens/ArticleViewScreen';
import FeedScreen from 'screens/FeedScreen';
import MainScreen from 'screens/MainScreen';
import ProfileViewScreen from 'screens/ProfileViewScreen';
import { MainStackParamList } from 'types/NavigationTypes';
import Text from '../components/Text';
import ArticleCreateScreen from '../screens/ArticleCreateScreen';
import { useStore } from '../stores/RootStore';
import Theme from '../styles/Theme';

const Stack = createStackNavigator<MainStackParamList>();

const StackNavigation = observer(() => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { authStore } = useStore();

  const HeaderLeft = useCallback(
    () => (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => {}}>
        <FontAwesomeIcon icon={faAlignLeft as IconProp} color={'#aaa'} />
      </TouchableOpacity>
    ),
    [authStore.me],
  );

  return (
    <Stack.Navigator
      initialRouteName={'MainScreen'}
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ letterSpacing: 2, color: Theme.colors.dark1, marginRight: 10 }}>
              Osori
            </Text>
            <FontAwesomeIcon icon={faFeatherPointed as IconProp} color={'#aaa'} />
          </View>
        ),
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

export default StackNavigation;
