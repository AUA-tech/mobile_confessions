import React from 'react';
import { Keyboard } from 'react-native';
import styled from 'styled-components/native';

import Header from './header';
import colors from '../constants/colors';

const Layout = ({ headerTitle, children }) =>  [
  <Header title={headerTitle} key='title' />,
  <Container key='textInput' onPress={ Keyboard.dismiss } activeOpacity={1} >
    {children}
  </Container>
];

const Container = styled.TouchableOpacity`
  flex: 1;
  height: 90%;
  background-color: ${colors.bgColor};
`

export default Layout;
