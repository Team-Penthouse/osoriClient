import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Text from './Text';
import { DEVICE_WIDTH } from '../layout/CustomStyles';

interface CustomHeaderProps {
  color?: string;
  title?: string;
  leftComponent?: () => React.ReactElement;
  rightComponent?: () => React.ReactElement;
  titleComponent?: () => React.ReactElement;
}

const CustomHeader = observer(
  ({ color, title, leftComponent, rightComponent, titleComponent }: CustomHeaderProps) => {
    return (
      <Container color={color}>
        <HeaderContainer>
          {leftComponent && leftComponent()}
          <TitleContainer>
            {titleComponent ? titleComponent() : <Title>{title ?? ''}</Title>}
          </TitleContainer>
          {rightComponent && rightComponent()}
        </HeaderContainer>
      </Container>
    );
  },
);

const Container = styled.View<{ color?: string }>`
  flex-direction: row;
  height: ${isIphoneX() ? 86 : 56}px;
  background-color: ${(props) => props.color ?? props.theme.colors.primary1};
`;
const HeaderContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  align-self: flex-end;
  padding: 0 25px 0 25px;
`;

const TitleContainer = styled.View`
  position: absolute;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: ${DEVICE_WIDTH}px;
  z-index: -1;
`;

const Title = styled(Text)`
  color: white;
  font-size: 20px;
`;

export default CustomHeader;
