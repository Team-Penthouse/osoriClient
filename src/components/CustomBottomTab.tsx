import React, { useState } from 'react';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Layout } from '@ui-kitten/components';
import { Dimensions, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import ArticleRecordScreen from '../screens/ArticleRecordScreen';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../stores/uiStore';
import Text from './Text';
import { KakaoOAuthToken, KakaoProfile, login } from '@react-native-seoul/kakao-login';
import { saveToken } from '../stores/authStore';
import { RootState } from '../stores/rootStore';
import { setCurrentUser } from '../stores/userStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const CustomBottomTab = (): React.ReactElement => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const dispatcher = useDispatch();
    const myInfo: KakaoProfile = useSelector((state: RootState) => state.auth.user);

    const [isVisible, setIsVisible] = useState(false);

    const handlePressAdd = () => {
        // setIsVisible(true);
        dispatcher(showModal({ title: 'test', component: <ArticleRecordScreen /> }));
        // { type: UI_MODAL_SHOW, payload:  }
    };

    const handleGoMyProfile = () => {
        dispatcher(setCurrentUser(myInfo));
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
            <TouchableOpacity
                style={styles.menu}
                onPress={() => navigation.navigate('FeedScreen')}
            >
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
                    source={require('../assets/images/article_add_button.png')}
                >
                    <Text style={{ color: 'white' }} category={'h2'}>
                        +
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu} onPress={handleGoMyProfile}>
                <Text style={styles.menuText}>My</Text>
            </TouchableOpacity>
        </Layout>
    );
};

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(205,205,205,0.2)',
        paddingVertical: 10,
        borderRadius: 8,
    },
    menuText: {
        fontWeight: 'bold',
    },
});

export default CustomBottomTab;
