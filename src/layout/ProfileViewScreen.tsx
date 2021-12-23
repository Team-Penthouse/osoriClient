import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Avatar, Layout, Spinner } from '@ui-kitten/components';
import Text from '../components/Text';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { KakaoProfile } from '@react-native-seoul/kakao-login';
import { RootState } from '../stores/rootStore';
import { useNavigation } from '@react-navigation/native';
import { CustomStyles } from './CustomStyles';
import { Tabs } from 'react-native-collapsible-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import { TemporaryArticleType } from '../types/TemporaryTypes';
import moment from 'moment';
import { setCurrentArticle } from '../stores/articleReducer';
import { StackNavigationProp } from '@react-navigation/stack';
import { setIsLoggedIn } from '../stores/authStore';

const ProfileViewScreen = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const dispatcher = useDispatch();
    const currentUser: KakaoProfile = useSelector((state: RootState) => state.user.currentUser);

    const [savedArticles, setSavedArticles] = useState<TemporaryArticleType[]>([]);
    const [loadingArticles, setLoadingArticles] = useState<boolean>(false);

    const handleGoArticleView = (article: TemporaryArticleType) => {
        dispatcher(setCurrentArticle(article));
        navigation.push('ArticleViewScreen');
    };

    const handleLogout = async () => {
        Alert.alert('로그아웃 하시겠습니까?', '', [
            {
                text: '예',
                onPress: async () => {
                    await AsyncStorage.removeItem('userToken');
                    dispatcher(setIsLoggedIn(false));
                },
            },
            {
                text: '아니오',
            },
        ]);
    };

    const getSavedArticles = () => {
        AsyncStorage.getItem('my_articles').then((result) => {
            if (result !== null) {
                const articles = JSON.parse(result);
                setSavedArticles(articles);
            }
        });
    };

    useLayoutEffect(() => {
        const subscribe = navigation.addListener('focus', () => {
            navigation.setOptions({ headerTitle: '', headerTransparent: true });
        });

        return () => {
            subscribe();
        };
    }, []);

    useEffect(() => {
        console.log(currentUser);
        getSavedArticles();
    }, []);

    const renderArticleRow = (item: any) => {
        const article = item.item as TemporaryArticleType;
        const index = item.index as number;
        return (
            <TouchableOpacity
                key={index}
                style={[{ flexDirection: 'row', borderBottomWidth: 0.5, alignItems: 'center', height: 60 }]}
                onPress={() => handleGoArticleView(article)}
            >
                <View style={{ flex: 1 }}>
                    <Text category={'h6'} style={{ marginLeft: 10 }}>
                        {article.title}
                    </Text>
                </View>
                <View style={{ flex: 0.5 }}>
                    <Text style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                        {moment(article.createDate).format('YYYY.MM.DD')}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        // <View style={{ flex: 1, backgroundColor: 'white' }}>
        //     <View style={[CustomStyles.divider, { marginVertical: 20 }]} />
        <Tabs.Container
            renderHeader={() => (
                <View style={[CustomStyles.center, { backgroundColor: 'rgba(223,222,255,0.74)', paddingVertical: 20 }]}>
                    <TouchableOpacity>
                        <Avatar
                            style={{ width: 150, height: 150, margin: 20 }}
                            source={
                                currentUser?.profileImageUrl === null
                                    ? require('assets/images/anonymous_user.png')
                                    : { uri: currentUser?.profileImageUrl }
                            }
                            defaultSource={require('assets/images/anonymous_user.png')}
                        />
                    </TouchableOpacity>

                    <Text category={'h3'}>{currentUser?.nickname || ''}</Text>
                </View>
            )}
            // headerContainerStyle={{
            //     backgroundColor: 'rgba(223,222,255,0.74)',
            // }}
            lazy
        >
            <Tabs.Tab name={'Bio'} key={1}>
                <Tabs.ScrollView>
                    <View style={{ flex: 1, padding: 10 }}>
                        <View style={[CustomStyles.row, styles.infoRow]}>
                            <Text style={{ flex: 1 }}>닉네임</Text>
                            <Text style={{ alignSelf: 'flex-end', flex: 1 }}>{currentUser.nickname}</Text>
                        </View>
                        <View style={[CustomStyles.row, styles.infoRow]}>
                            <Text style={{ flex: 1 }}>성별</Text>
                            <Text style={{ alignSelf: 'flex-end', flex: 1 }}>
                                {currentUser.gender !== 'null' ? currentUser.gender : '정보 없음'}
                            </Text>
                        </View>
                        <View style={[CustomStyles.row, styles.infoRow]}>
                            <Text style={{ flex: 1 }}>생일</Text>
                            <Text style={{ flex: 1 }}>{currentUser.birthday}</Text>
                        </View>
                        <View style={[CustomStyles.row, styles.infoRow]}>
                            <Text style={{ flex: 1 }}>나이대</Text>
                            <Text style={{ flex: 1 }}>{currentUser.ageRange}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{ padding: 10 }} onPress={handleLogout}>
                        <Text>로그아웃</Text>
                    </TouchableOpacity>
                </Tabs.ScrollView>
            </Tabs.Tab>
            <Tabs.Tab name={'Articles'} key={2}>
                <Tabs.FlatList
                    data={savedArticles}
                    renderItem={renderArticleRow}
                    refreshing={loadingArticles}
                    onRefresh={() => {
                        setLoadingArticles(true);
                        setTimeout(() => {
                            setLoadingArticles(false);
                        }, 1000);
                    }}
                />
            </Tabs.Tab>
        </Tabs.Container>
        // </View>
    );
};

const styles = StyleSheet.create({
    infoRow: {
        paddingVertical: 20,
    },
});
export default ProfileViewScreen;
