import React from 'react';

export interface ModalInterface {
  title: string;
  component: () => React.ReactElement;
}
