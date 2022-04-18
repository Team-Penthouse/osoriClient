import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from 'layout/CustomStyles';
import { StyleSheet, View } from 'react-native';

const SkeletonMainScreen = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.headerContainer} />
        <View />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
  },
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 10,
  },
});

export default SkeletonMainScreen;
