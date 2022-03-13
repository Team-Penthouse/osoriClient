import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import { Divider } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../stores/RootStore';
import ProfileComponent from '../components/ProfileComponent';

const DrawerContent = observer(() => {
  const navigation = useNavigation();
  const { authStore } = useStore();

  return (
    <Container>
      <ProfileComponent containerStyle={{ marginBottom: 15 }} userInfo={authStore.me} />
      <Divider />
    </Container>
  );
});

const Container = styled.View`
  padding: 15px;
`;
export default DrawerContent;
