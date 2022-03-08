import React, { useState } from 'react';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Layout } from '@ui-kitten/components';
import { Alert, Dimensions, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import Text from './Text';
import { useStore } from '../stores/RootStore';
import ArticleRecordScreen from '../screens/ArticleRecordScreen';

const CustomBottomTab = observer((): React.ReactElement => {
  const { uiStore } = useStore();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [isVisible, setIsVisible] = useState(false);

  const handlePressAdd = () => {
    console.log('called');
    uiStore.showModal({ title: 'ads', component: () => <ArticleRecordScreen /> });
  };

  const handleGoMyProfile = () => {
    navigation.push('ProfileViewScreen');
  };

  return (
    <Layout
      style={{
        flexDirection: 'row',
        position: 'absolute',
        height: isIphoneX() ? 130 : 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        bottom: isIphoneX() ? 0 : 20,
        width: Dimensions.get('window').width,
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
            width: 70,
            height: 70,
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
