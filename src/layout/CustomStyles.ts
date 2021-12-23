import { Dimensions, StyleProp, TextStyle, ViewStyle } from 'react-native';

const OE_FONT = 'Oe';
const NANUM_SQUARE_LIGHT = 'NanumSquareL';

export const Fonts = {
    OE_FONT,
    NANUM_SQUARE_LIGHT,
};

export const DEVICE_SIZE = Dimensions.get('window');

export const CustomStyles: { [key: string]: StyleProp<ViewStyle> | StyleProp<TextStyle> } = {
    row: {
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        borderWidth: 0.2,
    },
};
