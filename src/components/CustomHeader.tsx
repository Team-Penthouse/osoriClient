import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import styled from 'styled-components/native';
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
        {leftComponent && leftComponent()}
        <TitleContainer>
          {titleComponent ? titleComponent() : <Title>{title ?? ''}</Title>}
        </TitleContainer>
        {rightComponent && rightComponent()}
      </Container>
    );
  },
);

const Container = styled.View<{ color?: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background-color: ${(props) => props.color ?? props.theme.colors.primary1};
  padding: 0 25px 0 25px;
`;

const TitleContainer = styled.View`
  position: absolute;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: ${DEVICE_WIDTH}px;
`;

const Title = styled(Text)`
  color: white;
  font-size: 20px;
`;

export default CustomHeader;
