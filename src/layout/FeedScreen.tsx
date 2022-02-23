import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';

const FeedScreen = () => {
    const navigation = useNavigation<any>();
    const { isLoading, error, data, isFetching } = useQuery("repoData", () =>
        fetch(
            "https://api.github.com/repos/tannerlinsley/react-query"
        ).then((res) => res.json())
    );

    useLayoutEffect(() => {
        const subscribe = navigation.addListener('focus', () => {
            navigation.setOptions({ headerTitle: '', headerTransparent: true });
        });

        return () => {
            subscribe();
        };
    }, []);

    useEffect(() => {
        console.log('isFetching:', isFetching)
    }, [isFetching]);

    return (
        <SafeAreaView>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <View>
                    <Text>{data?.subscribers_count}</Text>
                    <Text>{data?.forks_count}</Text>
                </View>
            )}
        </SafeAreaView>
    )
};

export default FeedScreen;