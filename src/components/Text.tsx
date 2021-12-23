import React from 'react';
import { Text as KittenText } from '@ui-kitten/components';
import { TextProps as RNTextProps } from 'react-native';
import { EvaStatus, LiteralUnion, Overwrite } from '@ui-kitten/components/devsupport';
import { StyledComponentProps } from '@ui-kitten/components/theme';
import { TextElement } from '@ui-kitten/components/ui/text/text.component';
import { Fonts } from '../layout/CustomStyles';

type ChildElement = React.ReactText | TextElement;

type TextStyledProps = Overwrite<
    StyledComponentProps,
    {
        appearance?: LiteralUnion<'default' | 'alternative' | 'hint'>;
    }
>;

interface CustomProps extends RNTextProps, TextStyledProps {
    children?: ChildElement | ChildElement[];
    category?: LiteralUnion<
        'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 's1' | 's2' | 'p1' | 'p2' | 'c1' | 'c2' | 'label'
    >;
    status?: EvaStatus;
}

const Text = (props: CustomProps): React.ReactElement => {
    return (
        <KittenText {...props} style={[props.style, { fontFamily: Fonts.NANUM_SQUARE_LIGHT }]}>
            {props.children}
        </KittenText>
    );
};

export default Text;
