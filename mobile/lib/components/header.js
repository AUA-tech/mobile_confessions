import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import {
  StatusBar,
  Image,
  Text,
  View
} from 'react-native';

const Header = ({ title, navigation }) => (
  <CenteredView style={{backgroundColor: "#3A4F60"}}>
    <StatusBar
      backgroundColor="#3A4F60"
      barStyle="light-content"
    />
    <HeaderText>{title.toUpperCase()}</HeaderText>
  </CenteredView>
);

const CenteredView = styled.View`
  align-items: center;
  justify-content: center;
  height: 65;
`

const HeaderText = styled.Text`
  color: white;
  font-size: 25;
  font-weight: 700;
  padding-top: 15;
`

export default Header;
