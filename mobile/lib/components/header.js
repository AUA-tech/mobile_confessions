import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import {
  StatusBar,
  Image,
  Text,
  View
} from 'react-native';

import colors from '../constants/colors';

const Header = ({ title }) => (
  <CenteredView>
    <StatusBar
      backgroundColor={colors.primaryColor}
      barStyle="light-content"
    />
    <HeaderText>{title.toUpperCase()}</HeaderText>
  </CenteredView>
);

const CenteredView = styled.View`
  align-items: center;
  justify-content: center;
  background-color: ${colors.primaryColor}
  height: 65;
`

const HeaderText = styled.Text`
  color: white;
  font-size: 25;
  font-weight: 700;
  padding-top: 15;
`

export default Header;
