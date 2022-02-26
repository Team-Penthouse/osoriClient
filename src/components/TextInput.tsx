import React from 'react';
import { TextInput as OriginalInput, TextInputProps, View } from 'react-native';
import { Fonts } from 'layout/CustomStyles';
import Text from './Text';

const TextInput = (props: TextInputProps) => (
  <View>
    <OriginalInput
      textAlignVertical="top"
      {...props}
      style={[props.style, { fontFamily: Fonts.NANUM_SQUARE_LIGHT }]}
    />
    {typeof props.maxLength !== 'undefined' && (
    <View style={{ alignSelf: 'flex-end', marginRight: 20 }}>
      <Text>{`${props.value?.length} / ${props.maxLength}`}</Text>
    </View>
    )}
  </View>
);

export default TextInput;
