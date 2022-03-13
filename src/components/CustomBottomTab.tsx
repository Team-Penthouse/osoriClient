import React, { useState } from 'react';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Layout } from '@ui-kitten/components';
import { Alert, Dimensions, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import Text from './Text';
import { useStore } from '../stores/RootStore';
import ArticleCreateScreen from '../screens/ArticleCreateScreen';
import { MainStackParamList } from '../types/NavigationTypes';

const CustomBottomTab = observer((): React.ReactElement => {
  const { uiStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const [isVisible, setIsVisible] = useState(false);

  const handlePressAdd = () => {
    // uiStore.showModal({ title: 'ads', component: () => <ArticleCreateScreen /> });
    navigation.push('ArticleCreateScreen');
  };

  const handleGoMyProfile = () => {
    navigation.push('ProfileViewScreen');
  };

  return (
    <Layout
      style={{
        flexDirection: 'row',
        position: 'absolute',
        height: isIphoneX() ? 100 : 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        bottom: 0,
        width: Dimensions.get('window').width,
        borderTopWidth: 1,
        borderColor: '#eee',
        paddingTop: 10,
        paddingBottom: isIphoneX() ? 40 : 10,
      }}
    >
      <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('FeedScreen')}>
        <Text style={styles.menuText}>Feeds</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 0.4,
          // height: 70,
          // width: 70,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 100,
          // backgroundColor: 'orange',
        }}
        onPress={handlePressAdd}
      >
        <ImageBackground
          style={{
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            shadowOpacity: 0.5,
            elevation: 5,
          }}
          borderRadius={100}
          source={require('assets/images/article_add_button.png')}
        >
          <Text style={{ color: 'white' }} category="h2">
            +
          </Text>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menu} onPress={handleGoMyProfile}>
        <Text style={styles.menuText}>My</Text>
      </TouchableOpacity>
    </Layout>
  );
});

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  menuText: {
    fontWeight: 'bold',
  },
});

export default CustomBottomTab;
